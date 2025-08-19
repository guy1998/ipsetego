const { passwordHasher } = require("../utils/security");

module.exports = (sequelize, DataTypes) => {
  const User = sequelize.define('User', {
    name: { type: DataTypes.STRING, allowNull: false }, // Create 1st time
    lastname: { type: DataTypes.STRING, allowNull: false, defaultValue: 'admin' }, // Create 1st time
    phoneNumber: { type: DataTypes.STRING, allowNull: false, defaultValue: 'admin' }, // Create 1st time
    address: { type: DataTypes.STRING, allowNull: false, defaultValue: 'admin' }, // Create 1st time
    role: { type: DataTypes.ENUM('admin', 'user'), allowNull: false, defaultValue: 'admin' }, // Create 1st time
    birthday: { type: DataTypes.DATE, allowNull: false }, // Create 1st time
    linkedin: { type: DataTypes.STRING, allowNull: true },
    github: { type: DataTypes.STRING, allowNull: true },
    xing: { type: DataTypes.STRING, allowNull: true },
    email: { type: DataTypes.STRING, unique: true },
    password: { type: DataTypes.STRING, allowNull: false }, // Create 1st time
    personalLink: { type: DataTypes.STRING, allowNull: false, default: 'admin' }, // Create 1st time
    pictureId: { type: DataTypes.STRING, allowNull: true },
    hobbies: { type: DataTypes.ARRAY(DataTypes.STRING), allowNull: true },
    languages: { type: DataTypes.ARRAY(DataTypes.STRING), allowNull: true }
  });

  User.addHook('beforeCreate', async (user, options) => {
    if (user.password) {
      user.password = passwordHasher(user.password);
    }
  });

  User.addHook('beforeUpdate', async (user, options) => {
    if (user.changed('password')) {
      user.password = passwordHasher(user.password);
    }
  });


  User.associate = (models) => {
    User.hasMany(models.Project, {
      foreignKey: 'userId',
      onDelete: 'CASCADE',
      hooks: true
    });
    User.hasMany(models.Experience, {
      foreignKey: 'userId',
      onDelete: 'CASCADE',
      hooks: true
    });
  };

  User.addHook('beforeDestroy', async (user, options) => {
    try {
      //TODO: Add logic to delete files
    } catch (error) {
      console.log(`Error deleting the files of this user: ${error.message}`);
    }
  });

  return User;
};
