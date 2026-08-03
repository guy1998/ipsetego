const Sequelize = require("sequelize");

/**
 * Actions summary:
 *
 * createTable() => "NewsletterSubscriptions", deps: []
 * createTable() => "Certifications", deps: [Users]
 * createTable() => "ModelInteractions", deps: [Users]
 * addColumn(isFeatured) => "Experiences"
 * addColumn(isFeatured) => "Projects"
 * addColumn(publicId) => "Users"
 * addColumn(isActive) => "Users"
 * addColumn(tiktok) => "Users"
 * addColumn(youtube) => "Users"
 * addColumn(instagram) => "Users"
 * addColumn(twitter) => "Users"
 * changeColumn(endDate) => "Experiences"
 * changeColumn(startDate) => "Experiences"
 * changeColumn(skills) => "Users"
 * changeColumn(languages) => "Users"
 * changeColumn(hobbies) => "Users"
 * changeColumn(birthday) => "Users"
 * changeColumn(role) => "Users"
 *
 */

const info = {
  revision: 2,
  name: "auto",
  created: "2026-08-03T19:01:44.736Z",
  comment: "",
};

const migrationCommands = (transaction) => [
  {
    fn: "createTable",
    params: [
      "NewsletterSubscriptions",
      {
        id: {
          type: Sequelize.INTEGER,
          field: "id",
          autoIncrement: true,
          primaryKey: true,
          allowNull: false,
        },
        email: {
          type: Sequelize.STRING,
          field: "email",
          unique: true,
          allowNull: false,
        },
        createdAt: {
          type: Sequelize.DATE,
          field: "createdAt",
          allowNull: false,
        },
        updatedAt: {
          type: Sequelize.DATE,
          field: "updatedAt",
          allowNull: false,
        },
      },
      { transaction },
    ],
  },
  {
    fn: "createTable",
    params: [
      "Certifications",
      {
        id: {
          type: Sequelize.INTEGER,
          field: "id",
          autoIncrement: true,
          primaryKey: true,
          allowNull: false,
        },
        title: { type: Sequelize.STRING, field: "title", allowNull: false },
        year: { type: Sequelize.STRING, field: "year", allowNull: false },
        createdAt: {
          type: Sequelize.DATE,
          field: "createdAt",
          allowNull: false,
        },
        updatedAt: {
          type: Sequelize.DATE,
          field: "updatedAt",
          allowNull: false,
        },
        userId: {
          type: Sequelize.INTEGER,
          field: "userId",
          onUpdate: "CASCADE",
          onDelete: "SET NULL",
          references: { model: "Users", key: "id" },
          allowNull: true,
        },
      },
      { transaction },
    ],
  },
  {
    fn: "createTable",
    params: [
      "ModelInteractions",
      {
        id: {
          type: Sequelize.INTEGER,
          field: "id",
          autoIncrement: true,
          primaryKey: true,
          allowNull: false,
        },
        question: { type: Sequelize.TEXT, field: "question", allowNull: false },
        response: { type: Sequelize.TEXT, field: "response", allowNull: true },
        ip: { type: Sequelize.STRING, field: "ip", allowNull: true },
        questionAt: {
          type: Sequelize.DATE,
          field: "questionAt",
          allowNull: false,
        },
        responseAt: {
          type: Sequelize.DATE,
          field: "responseAt",
          allowNull: true,
        },
        userId: {
          type: Sequelize.INTEGER,
          onUpdate: "CASCADE",
          onDelete: "NO ACTION",
          references: { model: "Users", key: "id" },
          field: "userId",
          allowNull: false,
        },
        createdAt: {
          type: Sequelize.DATE,
          field: "createdAt",
          allowNull: false,
        },
        updatedAt: {
          type: Sequelize.DATE,
          field: "updatedAt",
          allowNull: false,
        },
      },
      { transaction },
    ],
  },
  {
    fn: "addColumn",
    params: [
      "Experiences",
      "isFeatured",
      { type: Sequelize.BOOLEAN, field: "isFeatured", defaultValue: false },
      { transaction },
    ],
  },
  {
    fn: "addColumn",
    params: [
      "Projects",
      "isFeatured",
      { type: Sequelize.BOOLEAN, field: "isFeatured", defaultValue: false },
      { transaction },
    ],
  },
  {
    fn: "addColumn",
    params: [
      "Users",
      "publicId",
      {
        type: Sequelize.STRING,
        field: "publicId",
        unique: true,
        allowNull: true,
      },
      { transaction },
    ],
  },
  {
    fn: "addColumn",
    params: [
      "Users",
      "isActive",
      {
        type: Sequelize.BOOLEAN,
        field: "isActive",
        defaultValue: true,
        allowNull: false,
      },
      { transaction },
    ],
  },
  {
    fn: "addColumn",
    params: [
      "Users",
      "tiktok",
      { type: Sequelize.STRING, field: "tiktok", allowNull: true },
      { transaction },
    ],
  },
  {
    fn: "addColumn",
    params: [
      "Users",
      "youtube",
      { type: Sequelize.STRING, field: "youtube", allowNull: true },
      { transaction },
    ],
  },
  {
    fn: "addColumn",
    params: [
      "Users",
      "instagram",
      { type: Sequelize.STRING, field: "instagram", allowNull: true },
      { transaction },
    ],
  },
  {
    fn: "addColumn",
    params: [
      "Users",
      "twitter",
      { type: Sequelize.STRING, field: "twitter", allowNull: true },
      { transaction },
    ],
  },
  {
    fn: "changeColumn",
    params: [
      "Experiences",
      "endDate",
      { type: Sequelize.TEXT, field: "endDate", allowNull: true },
      { transaction },
    ],
  },
  {
    fn: "changeColumn",
    params: [
      "Experiences",
      "startDate",
      { type: Sequelize.TEXT, field: "startDate", allowNull: false },
      { transaction },
    ],
  },
  {
    fn: "changeColumn",
    params: [
      "Users",
      "skills",
      {
        type: Sequelize.TEXT,
        field: "skills",
        comment: "Array of skills with name, category, and proficiency level",
        allowNull: true,
      },
      { transaction },
    ],
  },
  {
    fn: "changeColumn",
    params: [
      "Users",
      "languages",
      {
        type: Sequelize.TEXT,
        field: "languages",
        comment: "Array of language objects with name and level (1-5)",
        allowNull: true,
      },
      { transaction },
    ],
  },
  {
    fn: "changeColumn",
    params: [
      "Users",
      "hobbies",
      { type: Sequelize.TEXT, field: "hobbies", allowNull: true },
      { transaction },
    ],
  },
  {
    fn: "changeColumn",
    params: [
      "Users",
      "birthday",
      { type: Sequelize.TEXT, field: "birthday", allowNull: false },
      { transaction },
    ],
  },
  {
    fn: "changeColumn",
    params: [
      "Users",
      "role",
      {
        type: Sequelize.ENUM("admin", "user"),
        field: "role",
        defaultValue: "user",
        allowNull: false,
      },
      { transaction },
    ],
  },
];

const rollbackCommands = (transaction) => [
  {
    fn: "removeColumn",
    params: ["Experiences", "isFeatured", { transaction }],
  },
  {
    fn: "removeColumn",
    params: ["Projects", "isFeatured", { transaction }],
  },
  {
    fn: "removeColumn",
    params: ["Users", "publicId", { transaction }],
  },
  {
    fn: "removeColumn",
    params: ["Users", "isActive", { transaction }],
  },
  {
    fn: "removeColumn",
    params: ["Users", "tiktok", { transaction }],
  },
  {
    fn: "removeColumn",
    params: ["Users", "youtube", { transaction }],
  },
  {
    fn: "removeColumn",
    params: ["Users", "instagram", { transaction }],
  },
  {
    fn: "removeColumn",
    params: ["Users", "twitter", { transaction }],
  },
  {
    fn: "dropTable",
    params: ["Certifications", { transaction }],
  },
  {
    fn: "dropTable",
    params: ["ModelInteractions", { transaction }],
  },
  {
    fn: "dropTable",
    params: ["NewsletterSubscriptions", { transaction }],
  },
  {
    fn: "changeColumn",
    params: [
      "Experiences",
      "endDate",
      { type: Sequelize.DATE, field: "endDate", allowNull: true },
      { transaction },
    ],
  },
  {
    fn: "changeColumn",
    params: [
      "Experiences",
      "startDate",
      { type: Sequelize.DATE, field: "startDate", allowNull: false },
      { transaction },
    ],
  },
  {
    fn: "changeColumn",
    params: [
      "Users",
      "role",
      {
        type: Sequelize.ENUM("admin", "user"),
        field: "role",
        defaultValue: "admin",
        allowNull: false,
      },
      { transaction },
    ],
  },
  {
    fn: "changeColumn",
    params: [
      "Users",
      "skills",
      {
        type: Sequelize.JSON,
        field: "skills",
        comment: "Array of skills with name, category, and proficiency level",
        defaultValue: Sequelize.Array,
        allowNull: true,
      },
      { transaction },
    ],
  },
  {
    fn: "changeColumn",
    params: [
      "Users",
      "languages",
      {
        type: Sequelize.JSON,
        field: "languages",
        comment: "Array of language objects with name and level (1-5)",
        defaultValue: Sequelize.Array,
        allowNull: true,
      },
      { transaction },
    ],
  },
  {
    fn: "changeColumn",
    params: [
      "Users",
      "hobbies",
      {
        type: Sequelize.ARRAY(Sequelize.STRING),
        field: "hobbies",
        allowNull: true,
      },
      { transaction },
    ],
  },
  {
    fn: "changeColumn",
    params: [
      "Users",
      "birthday",
      { type: Sequelize.DATE, field: "birthday", allowNull: false },
      { transaction },
    ],
  },
];

const pos = 0;
const useTransaction = true;

const execute = (queryInterface, sequelize, _commands) => {
  let index = pos;
  const run = (transaction) => {
    const commands = _commands(transaction);
    return new Promise((resolve, reject) => {
      const next = () => {
        if (index < commands.length) {
          const command = commands[index];
          console.log(`[#${index}] execute: ${command.fn}`);
          index++;
          queryInterface[command.fn](...command.params).then(next, reject);
        } else resolve();
      };
      next();
    });
  };
  if (useTransaction) return queryInterface.sequelize.transaction(run);
  return run(null);
};

module.exports = {
  pos,
  useTransaction,
  up: (queryInterface, sequelize) =>
    execute(queryInterface, sequelize, migrationCommands),
  down: (queryInterface, sequelize) =>
    execute(queryInterface, sequelize, rollbackCommands),
  info,
};
