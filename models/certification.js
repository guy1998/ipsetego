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

module.exports = (sequelize, DataTypes) => {
  const Certification = sequelize.define('Certification', {
    // ── GDPR-sensitive: encrypted at rest ────────────────────────────
    title: { type: DataTypes.STRING, allowNull: false, ...encField('title') },

    // ── Not sensitive: stored plain ──────────────────────────────────
    year: { type: DataTypes.STRING, allowNull: false },
  });

  Certification.associate = (models) => {
    Certification.belongsTo(models.User, { foreignKey: 'userId' });
  };

  return Certification;
};
