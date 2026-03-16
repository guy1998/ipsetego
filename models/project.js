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
  const Project = sequelize.define('Project', {
    // ── GDPR-sensitive fields (encrypted at rest) ────────────────────
    title:       { type: DataTypes.STRING, allowNull: false, ...encField('title') },
    description: { type: DataTypes.STRING, allowNull: true,  ...encField('description') },
    relatedLink: { type: DataTypes.STRING, allowNull: true,  ...encField('relatedLink') },

    // ── Not sensitive: stored plain ──────────────────────────────────
    category:     { type: DataTypes.STRING, allowNull: true },
    technologies: { type: DataTypes.JSON,   allowNull: true },
    imageId:      { type: DataTypes.STRING, allowNull: true },
    year:         { type: DataTypes.STRING, allowNull: true },
    isFeatured:   { type: DataTypes.BOOLEAN, defaultValue: false },
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
