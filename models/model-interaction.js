const { encrypt, decrypt } = require('../utils/encryption');

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
  const ModelInteraction = sequelize.define('ModelInteraction', {
    // The visitor's question — encrypted at rest
    question: {
      type: DataTypes.TEXT,
      allowNull: false,
      ...encField('question'),
    },
    // The model's response — encrypted at rest
    response: {
      type: DataTypes.TEXT,
      allowNull: true,
      ...encField('response'),
    },
    // IP address of the requester — encrypted at rest
    ip: {
      type: DataTypes.STRING,
      allowNull: true,
      ...encField('ip'),
    },
    // When the question was received
    questionAt: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    // When the response was fully generated
    responseAt: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    // FK to the portfolio owner
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
  });

  ModelInteraction.associate = (models) => {
    ModelInteraction.belongsTo(models.User, { foreignKey: 'userId' });
  };

  return ModelInteraction;
};
