const { Sequelize } = require('sequelize');
const path = require('path');

const dbFile = process.env.DATABASE_FILE || path.join(__dirname, 'dev.sqlite');
const sequelize = new Sequelize({
  dialect: 'sqlite',
  storage: dbFile,
  logging: false
});

// import models
const User = require('./user')(sequelize);
const Task = require('./task')(sequelize);

// associations
User.hasMany(Task, { as: 'tasks', foreignKey: 'userId' });
Task.belongsTo(User, { foreignKey: 'userId' });

module.exports = {
  sequelize,
  User,
  Task
};

// optional initializer: run `node models/index.js` to create DB
if (require.main === module) {
  (async () => {
    await sequelize.sync({ force: false });
    console.log('DB initialized at', dbFile);
    process.exit(0);
  })();
}
