const { encryptDeterministic, decrypt } = require("../utils/encryption");

module.exports = (sequelize, DataTypes) => {
  const NewsletterSubscription = sequelize.define('NewsletterSubscription', {
    // Deterministic encryption so findOrCreate({ where: { email } }) still works
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
      get() {
        const raw = this.getDataValue('email');
        return raw != null ? decrypt(raw) : raw;
      },
      set(value) {
        this.setDataValue('email', value != null ? encryptDeterministic(String(value)) : value);
      },
    },
  });

  return NewsletterSubscription;
};
