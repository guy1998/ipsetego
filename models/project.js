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

  Project.addHook('beforeDestroy', async (project, options) => {
    try {
      //TODO: Add logic to delete files
    } catch(error) {
      console.log(`Error deleting the files of this project: ${error.message}`);
    }
  });

  return Project;
};
