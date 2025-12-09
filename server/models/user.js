const { DataTypes } = require('sequelize');
const bcrypt = require('bcrypt');

module.exports = (sequelize) => {
  const User = sequelize.define('User', {
    id: {
      type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true
    },
    email: {
      type: DataTypes.STRING, unique: true, allowNull: false
    },
    passwordHash: {
      type: DataTypes.STRING, allowNull: false
    },
    name: {
      type: DataTypes.STRING, allowNull: true
    }
  }, {
    tableName: 'users',
    timestamps: true
  });

  // instance method to check password
  User.prototype.validatePassword = async function(password) {
    return bcrypt.compare(password, this.passwordHash);
  };

  return User;
};
