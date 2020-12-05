

module.exports = (sequelize, DataTypes) => {
  const User = sequelize.define('Users', {
    uuid: DataTypes.UUID,
    email: DataTypes.STRING,
    password: DataTypes.STRING,
    lastLogin: DataTypes.DATE,
    loginState: DataTypes.STRING,
    sessionId: DataTypes.STRING(1024),
    commonToken: DataTypes.STRING(1024),
    googleToken: DataTypes.STRING(1024),
    googleAccessToken: DataTypes.STRING(1024),
    googleRefreshToken: DataTypes.STRING(1024),
  })

  User.associate = function (models) {
  }

  return User
}
