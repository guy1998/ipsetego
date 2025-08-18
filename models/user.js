module.exports = (sequelize, DataTypes) => {
  const User = sequelize.define('User', {
    name: { type: DataTypes.STRING, allowNull: false },
    lastname: { type: DataTypes.STRING, allowNull: false, defaultValue: 'admin' },
    phoneNumber: { type: DataTypes.STRING, allowNull: false, defaultValue: 'admin' },
    address: { type: DataTypes.STRING, allowNull: false, defaultValue: 'admin' },
    role: { type: DataTypes.ENUM('admin', 'user'), allowNull: false, defaultValue: 'admin' },
    birthday: { type: DataTypes.DATE, allowNull: false },
    linkedin: { type: DataTypes.STRING },
    github: { type: DataTypes.STRING },
    xing: { type: DataTypes.STRING },
    email: { type: DataTypes.STRING, unique: true },
    password: { type: DataTypes.STRING, allowNull: false },
    personalLink: { type: DataTypes.STRING, allowNull: false },
    pictureId: { type: DataTypes.STRING, allowNull: false },
    hobbies: { type: DataTypes.ARRAY(DataTypes.STRING), allowNull: true },
    languages: { type: DataTypes.ARRAY(DataTypes.STRING), allowNull: true }
  });

  User.associate = (models) => {
    User.hasMany(models.Project, { foreignKey: 'userId' });
    User.hasMany(models.Experience, { foreignKey: 'userId' });
  };

  return User;
};
