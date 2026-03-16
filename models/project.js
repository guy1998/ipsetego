module.exports = (sequelize, DataTypes) => {
  const Project = sequelize.define('Project', {
    title: { type: DataTypes.STRING, allowNull: false },
    description: { type: DataTypes.STRING, allowNull: true },
    category: { type: DataTypes.STRING, allowNull: true }, // web, mobile, design, writing, etc.
    technologies: { type: DataTypes.JSON, allowNull: true }, // Optional array of technologies
    relatedLink: { type: DataTypes.STRING, allowNull: true },
    imageId: { type: DataTypes.STRING, allowNull: true },
    year: { type: DataTypes.STRING, allowNull: true },
    isFeatured: { type: DataTypes.BOOLEAN, defaultValue: false }
  });

  Project.associate = (models) => {
    Project.belongsTo(models.User, { foreignKey: 'userId' });
  };

  Project.addHook('beforeDestroy', async (project, options) => {
    try {
      if (project.imageId) {
        const { deleteFile } = require('../utils/supabase');
        await deleteFile(process.env.SUPABASE_BUCKET_NAME, project.imageId);
      }
    } catch(error) {
      console.log(`Error deleting the files of this project: ${error.message}`);
    }
  });

  return Project;
};
