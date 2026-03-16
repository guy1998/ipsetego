const crypto = require('crypto');

const ALGORITHM = 'aes-256-cbc';
const IV_LENGTH = 16;
const PREFIX = 'enc:';

const getKey = () => {
  const hex = process.env.ENCRYPTION_KEY;
  if (!hex || hex.length !== 64) {
    throw new Error('ENCRYPTION_KEY must be a 64-character hex string (32 bytes) in .env');
  }
  return Buffer.from(hex, 'hex');
};

/**
 * Encrypt with a random IV — use for all fields except those used in WHERE clauses.
 */
const encrypt = (text) => {
  if (text == null) return text;
  const iv = crypto.randomBytes(IV_LENGTH);
  const cipher = crypto.createCipheriv(ALGORITHM, getKey(), iv);
  const encrypted = Buffer.concat([cipher.update(String(text)), cipher.final()]);
  return PREFIX + iv.toString('hex') + ':' + encrypted.toString('hex');
};

/**
 * Encrypt with a deterministic IV derived from the value — use for fields
 * queried via WHERE (e.g. email), so the same plaintext always produces
 * the same ciphertext and index lookups still work.
 */
const encryptDeterministic = (text) => {
  if (text == null) return text;
  const key = getKey();
  const iv = crypto.createHmac('sha256', key).update(String(text)).digest().slice(0, IV_LENGTH);
  const cipher = crypto.createCipheriv(ALGORITHM, key, iv);
  const encrypted = Buffer.concat([cipher.update(String(text)), cipher.final()]);
  return PREFIX + iv.toString('hex') + ':' + encrypted.toString('hex');
};

/**
 * Decrypt a value produced by either encrypt() or encryptDeterministic().
 * If the value is not prefixed with 'enc:' it is returned as-is (handles
 * legacy plaintext data already in the database).
 */
const decrypt = (text) => {
  if (text == null || typeof text !== 'string') return text;
  if (!text.startsWith(PREFIX)) return text; // not encrypted — legacy value
  const parts = text.slice(PREFIX.length).split(':');
  if (parts.length < 2) return text;
  const iv = Buffer.from(parts[0], 'hex');
  const encryptedBuf = Buffer.from(parts.slice(1).join(':'), 'hex');
  const decipher = crypto.createDecipheriv(ALGORITHM, getKey(), iv);
  return Buffer.concat([decipher.update(encryptedBuf), decipher.final()]).toString();
};

module.exports = { encrypt, encryptDeterministic, decrypt };
