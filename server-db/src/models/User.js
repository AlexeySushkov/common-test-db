module.exports = (sequelize, DataTypes) => {
  const User = sequelize.define('Users', {
    uuid: {
      type: DataTypes.UUID,
      allowNull: false,
      unique: true
    },    
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
      isEmail: true
    },    
    password: {
    // $2b$10$2L6gUGnpLqTNE/iZNC5bi.vR/9kr82g1piBoO8.Bzr1vcFDO/fFU.
    type: DataTypes.STRING(64),
      is: /^[0-9a-f]$/i
    },
    ddosFirstRequest: DataTypes.DATE,
    ddosLastRequest: DataTypes.DATE,
    ddosRequestsNumber: DataTypes.DECIMAL,
    lastLogin: DataTypes.DATE,
    loginState: {
      type: DataTypes.STRING,
      allowNull: false,
      isIn: [['idle', 'active+password', 'active+google', 'active+google+password' ]]
    },    
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
