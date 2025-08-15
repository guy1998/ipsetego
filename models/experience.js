module.exports = (sequelize, DataTypes) => {
  const Experience = sequelize.define('Experience', {
    title: { type: DataTypes.STRING, allowNull: false },
    description: { type: DataTypes.STRING, allowNull: true },
    relatedLink: { type: DataTypes.STRING, allowNull: true },
    startDate: { type: DataTypes.DATE, allowNull: false },
    endDate: { type: DataTypes.DATE, allowNull: true }
});

  Experience.associate = (models) => {
    Experience.belongsTo(models.User, { foreignKey: 'userId' });
  };

  return Experience;
};
