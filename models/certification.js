module.exports = (sequelize, DataTypes) => {
  const Certification = sequelize.define('Certification', {
    title: { type: DataTypes.STRING, allowNull: false },
    year: { type: DataTypes.STRING, allowNull: false },
  });

  Certification.associate = (models) => {
    Certification.belongsTo(models.User, { foreignKey: 'userId' });
  };

  return Certification;
};
