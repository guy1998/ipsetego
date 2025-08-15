module.exports = (sequelize, DataTypes) => {
  const User = sequelize.define('User', {
    name: { type: DataTypes.STRING, allowNull: false },
    lastname: { type: DataTypes.STRING, allowNull: false, defaultValue: 'admin' },
    phoneNumber: { type: DataTypes.STRING, allowNull: false, defaultValue: 'admin' },
    address: { type: DataTypes.STRING, allowNull: false, defaultValue: 'admin' },
    linkedin: { type: DataTypes.STRING },
    github: { type: DataTypes.STRING },
    xing: { type: DataTypes.STRING },
    email: { type: DataTypes.STRING, unique: true },
    password: { type: DataTypes.STRING, allowNull: false },
    personalLink: { type: DataTypes.STRING, allowNull: false },
    pictureId: { type: DataTypes, allowNull: false }
  });

  User.associate = (models) => {
    User.hasMany(models.Project, { foreignKey: 'userId' });
    User.hasMany(models.Experience, { foreignKey: 'userId' });
  };

  return User;
};
