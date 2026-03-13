const Sequelize = require("sequelize");

/**
 * Actions summary:
 *
 * createTable() => "Users", deps: []
 * createTable() => "Experiences", deps: [Users]
 * createTable() => "Projects", deps: [Users]
 *
 */

const info = {
  revision: 1,
  name: "auto",
  created: "2026-03-12T22:16:39.058Z",
  comment: "",
};

const migrationCommands = (transaction) => [
  {
    fn: "createTable",
    params: [
      "Users",
      {
        id: {
          type: Sequelize.INTEGER,
          field: "id",
          autoIncrement: true,
          primaryKey: true,
          allowNull: false,
        },
        name: { type: Sequelize.STRING, field: "name", allowNull: false },
        lastname: {
          type: Sequelize.STRING,
          field: "lastname",
          defaultValue: "admin",
          allowNull: false,
        },
        phoneNumber: {
          type: Sequelize.STRING,
          field: "phoneNumber",
          defaultValue: "admin",
          allowNull: false,
        },
        address: {
          type: Sequelize.STRING,
          field: "address",
          defaultValue: "admin",
          allowNull: false,
        },
        role: {
          type: Sequelize.ENUM("admin", "user"),
          field: "role",
          defaultValue: "admin",
          allowNull: false,
        },
        birthday: { type: Sequelize.DATE, field: "birthday", allowNull: false },
        linkedin: {
          type: Sequelize.STRING,
          field: "linkedin",
          allowNull: true,
        },
        github: { type: Sequelize.STRING, field: "github", allowNull: true },
        xing: { type: Sequelize.STRING, field: "xing", allowNull: true },
        email: { type: Sequelize.STRING, field: "email", unique: true },
        password: {
          type: Sequelize.STRING,
          field: "password",
          allowNull: false,
        },
        personalSlug: {
          type: Sequelize.STRING,
          field: "personalSlug",
          default: "admin",
          allowNull: false,
        },
        pictureId: {
          type: Sequelize.STRING,
          field: "pictureId",
          allowNull: true,
        },
        resumeId: {
          type: Sequelize.STRING,
          field: "resumeId",
          allowNull: true,
        },
        hobbies: {
          type: Sequelize.ARRAY(Sequelize.STRING),
          field: "hobbies",
          allowNull: true,
        },
        languages: {
          type: Sequelize.JSON,
          field: "languages",
          comment: "Array of language objects with name and level (1-5)",
          defaultValue: Sequelize.Array,
          allowNull: true,
        },
        skills: {
          type: Sequelize.JSON,
          field: "skills",
          comment: "Array of skills with name, category, and proficiency level",
          defaultValue: Sequelize.Array,
          allowNull: true,
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
      "Experiences",
      {
        id: {
          type: Sequelize.INTEGER,
          field: "id",
          autoIncrement: true,
          primaryKey: true,
          allowNull: false,
        },
        title: { type: Sequelize.STRING, field: "title", allowNull: false },
        company: { type: Sequelize.STRING, field: "company", allowNull: true },
        description: {
          type: Sequelize.STRING,
          field: "description",
          allowNull: true,
        },
        relatedLink: {
          type: Sequelize.STRING,
          field: "relatedLink",
          allowNull: true,
        },
        startDate: {
          type: Sequelize.DATE,
          field: "startDate",
          allowNull: false,
        },
        endDate: { type: Sequelize.DATE, field: "endDate", allowNull: true },
        isRemote: {
          type: Sequelize.BOOLEAN,
          field: "isRemote",
          defaultValue: false,
        },
        location: {
          type: Sequelize.STRING,
          field: "location",
          allowNull: true,
        },
        isCurrentlyWorking: {
          type: Sequelize.BOOLEAN,
          field: "isCurrentlyWorking",
          defaultValue: false,
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
      "Projects",
      {
        id: {
          type: Sequelize.INTEGER,
          field: "id",
          autoIncrement: true,
          primaryKey: true,
          allowNull: false,
        },
        title: { type: Sequelize.STRING, field: "title", allowNull: false },
        description: {
          type: Sequelize.STRING,
          field: "description",
          allowNull: true,
        },
        category: {
          type: Sequelize.STRING,
          field: "category",
          allowNull: true,
        },
        technologies: {
          type: Sequelize.JSON,
          field: "technologies",
          allowNull: true,
        },
        relatedLink: {
          type: Sequelize.STRING,
          field: "relatedLink",
          allowNull: true,
        },
        imageId: { type: Sequelize.STRING, field: "imageId", allowNull: true },
        year: { type: Sequelize.STRING, field: "year", allowNull: true },
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
];

const rollbackCommands = (transaction) => [
  {
    fn: "dropTable",
    params: ["Experiences", { transaction }],
  },
  {
    fn: "dropTable",
    params: ["Projects", { transaction }],
  },
  {
    fn: "dropTable",
    params: ["Users", { transaction }],
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
