module.exports = (sequelize, DataTypes) => {
  const Experience = sequelize.define('Experience', {
    title: { type: DataTypes.STRING, allowNull: false },
    company: { type: DataTypes.STRING, allowNull: true },
    description: { type: DataTypes.STRING, allowNull: true },
    relatedLink: { type: DataTypes.STRING, allowNull: true },
    startDate: { type: DataTypes.DATE, allowNull: false },
    endDate: { type: DataTypes.DATE, allowNull: true },
    isRemote: { type: DataTypes.BOOLEAN, defaultValue: false }, // true for remote, false for on-premise
    location: { type: DataTypes.STRING, allowNull: true },
    isCurrentlyWorking: { type: DataTypes.BOOLEAN, defaultValue: false } // true if still working there
  });

  Experience.associate = (models) => {
    Experience.belongsTo(models.User, { foreignKey: 'userId' });
  };

  return Experience;
};
