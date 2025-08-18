const bcrypt = require("bcrypt");
const sanitizeHtml = require('sanitize-html');

const passwordHasher = password => {
  const hashedPassword = bcrypt.hashSync(password, 10);
  return hashedPassword;
};

const passwordVerifier = (incomingPassword, databasePassword) => {
  return bcrypt.compareSync(incomingPassword, databasePassword);
};

function sanitizeInput(input) {
  if (typeof input !== 'string') return '';
  return sanitizeHtml(input, {
    allowedTags: [],
    allowedAttributes: {}
  }).trim();
}

module.exports = {
  passwordHasher,
  passwordVerifier,
  sanitizeInput
};