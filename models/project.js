module.exports = (sequelize, DataTypes) => {
  const Project = sequelize.define('Project', {
    title: { type: DataTypes.STRING, allowNull: false },
    description: { type: DataTypes.STRING, allowNull: true },
    relatedLink: { type: DataTypes.STRING, allowNull: true },
    imageId: { type: DataTypes.STRING, allowNull: true }
});

  Project.associate = (models) => {
    Project.belongsTo(models.User, { foreignKey: 'userId' });
  };

  return Project;
};
