const { encrypt, decrypt } = require("../utils/encryption");

const encField = (field) => ({
  get() {
    const raw = this.getDataValue(field);
    return raw != null ? decrypt(raw) : raw;
  },
  set(value) {
    this.setDataValue(field, value != null ? encrypt(String(value)) : value);
  },
});

// DATE fields stored as TEXT to hold encrypted ISO-date strings
const encDateField = (field) => ({
  get() {
    const raw = this.getDataValue(field);
    if (raw == null) return raw;
    const text = decrypt(raw);
    const d = new Date(text);
    return isNaN(d.getTime()) ? text : d;
  },
  set(value) {
    if (value == null) { this.setDataValue(field, value); return; }
    const str = value instanceof Date ? value.toISOString() : String(value);
    this.setDataValue(field, encrypt(str));
  },
});

module.exports = (sequelize, DataTypes) => {
  const Experience = sequelize.define('Experience', {
    // ── GDPR-sensitive fields (encrypted at rest) ────────────────────
    title:       { type: DataTypes.STRING, allowNull: false, ...encField('title') },
    company:     { type: DataTypes.STRING, allowNull: true,  ...encField('company') },
    description: { type: DataTypes.STRING, allowNull: true,  ...encField('description') },
    relatedLink: { type: DataTypes.STRING, allowNull: true,  ...encField('relatedLink') },
    location:    { type: DataTypes.STRING, allowNull: true,  ...encField('location') },

    // startDate / endDate stored as TEXT (encrypted ISO-date) — were DATE
    startDate: { type: DataTypes.TEXT, allowNull: false, ...encDateField('startDate') },
    endDate:   { type: DataTypes.TEXT, allowNull: true,  ...encDateField('endDate') },

    // ── Not sensitive: stored plain ──────────────────────────────────
    isRemote:           { type: DataTypes.BOOLEAN, defaultValue: false },
    isCurrentlyWorking: { type: DataTypes.BOOLEAN, defaultValue: false },
    isFeatured:         { type: DataTypes.BOOLEAN, defaultValue: false },
  });

  Experience.associate = (models) => {
    Experience.belongsTo(models.User, { foreignKey: 'userId' });
  };

  return Experience;
};
