module.exports = (sequelize, DataTypes) => {
  const NewsletterSubscription = sequelize.define('NewsletterSubscription', {
    email: { type: DataTypes.STRING, allowNull: false, unique: true },
  });

  return NewsletterSubscription;
};
