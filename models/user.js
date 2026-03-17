const { passwordHasher } = require("../utils/security");
const { encrypt, encryptDeterministic, decrypt } = require("../utils/encryption");

// Reusable getter/setter factory for plain string fields
const encField = (field) => ({
  get() {
    const raw = this.getDataValue(field);
    return raw != null ? decrypt(raw) : raw;
  },
  set(value) {
    this.setDataValue(field, value != null ? encrypt(String(value)) : value);
  },
});

// Reusable getter/setter factory for JSON/array fields (stored as TEXT)
const encJsonField = (field) => ({
  get() {
    const raw = this.getDataValue(field);
    if (raw == null) return raw;
    const text = decrypt(raw);
    try { return JSON.parse(text); } catch { return text; }
  },
  set(value) {
    if (value == null) { this.setDataValue(field, value); return; }
    this.setDataValue(field, encrypt(JSON.stringify(value)));
  },
});

module.exports = (sequelize, DataTypes) => {
  const User = sequelize.define('User', {
    // ── GDPR-sensitive fields (encrypted at rest) ────────────────────
    name:        { type: DataTypes.STRING, allowNull: false, ...encField('name') },
    lastname:    { type: DataTypes.STRING, allowNull: false, defaultValue: 'admin', ...encField('lastname') },
    phoneNumber: { type: DataTypes.STRING, allowNull: false, defaultValue: 'admin', ...encField('phoneNumber') },
    address:     { type: DataTypes.STRING, allowNull: false, defaultValue: 'admin', ...encField('address') },

    // email uses deterministic encryption so WHERE { email } lookups still match
    email: {
      type: DataTypes.STRING,
      unique: true,
      get() {
        const raw = this.getDataValue('email');
        return raw != null ? decrypt(raw) : raw;
      },
      set(value) {
        this.setDataValue('email', value != null ? encryptDeterministic(String(value)) : value);
      },
    },

    // birthday stored as TEXT to hold the encrypted ISO-date string (was DATE)
    birthday: {
      type: DataTypes.TEXT,
      allowNull: false,
      get() {
        const raw = this.getDataValue('birthday');
        if (raw == null) return raw;
        const text = decrypt(raw);
        const d = new Date(text);
        return isNaN(d.getTime()) ? text : d;
      },
      set(value) {
        if (value == null) { this.setDataValue('birthday', value); return; }
        const str = value instanceof Date ? value.toISOString() : String(value);
        this.setDataValue('birthday', encrypt(str));
      },
    },

    linkedin:  { type: DataTypes.STRING, allowNull: true, ...encField('linkedin') },
    github:    { type: DataTypes.STRING, allowNull: true, ...encField('github') },
    xing:      { type: DataTypes.STRING, allowNull: true, ...encField('xing') },
    twitter:   { type: DataTypes.STRING, allowNull: true, ...encField('twitter') },
    instagram: { type: DataTypes.STRING, allowNull: true, ...encField('instagram') },
    youtube:   { type: DataTypes.STRING, allowNull: true, ...encField('youtube') },
    tiktok:    { type: DataTypes.STRING, allowNull: true, ...encField('tiktok') },

    // hobbies stored as TEXT (encrypted JSON array) — was ARRAY(STRING)
    hobbies: {
      type: DataTypes.TEXT,
      allowNull: true,
      ...encJsonField('hobbies'),
    },

    // languages stored as TEXT (encrypted JSON) — was JSON
    languages: {
      type: DataTypes.TEXT,
      allowNull: true,
      comment: 'Array of language objects with name and level (1-5)',
      ...encJsonField('languages'),
    },

    // skills stored as TEXT (encrypted JSON) — was JSON
    skills: {
      type: DataTypes.TEXT,
      allowNull: true,
      comment: 'Array of skills with name, category, and proficiency level',
      ...encJsonField('skills'),
    },

    // ── Not sensitive: stored plain ──────────────────────────────────
    role:         { type: DataTypes.ENUM('admin', 'user'), allowNull: false, defaultValue: 'user' },
    isActive:     { type: DataTypes.BOOLEAN, allowNull: false, defaultValue: true },
    personalSlug: { type: DataTypes.STRING, allowNull: false, default: 'admin' },
    publicId:     { type: DataTypes.STRING, allowNull: true, unique: true },
    pictureId:    { type: DataTypes.STRING, allowNull: true },
    resumeId:     { type: DataTypes.STRING, allowNull: true },
    password:     { type: DataTypes.STRING, allowNull: false },
  });

  User.addHook('beforeCreate', async (user, options) => {
    if (user.password) {
      user.password = passwordHasher(user.password);
    }
  });

  User.associate = (models) => {
    User.hasMany(models.Project, { foreignKey: 'userId', onDelete: 'CASCADE', hooks: true });
    User.hasMany(models.Experience, { foreignKey: 'userId', onDelete: 'CASCADE', hooks: true });
    User.hasMany(models.Certification, { foreignKey: 'userId', onDelete: 'CASCADE', hooks: true });
  };

  User.addHook('beforeDestroy', async (user, options) => {
    try {
      //TODO: Add logic to delete files
    } catch (error) {
      console.log(`Error deleting the files of this user: ${error.message}`);
    }
  });

  return User;
};
