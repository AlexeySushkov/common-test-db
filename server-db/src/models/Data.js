module.exports = (sequelize, DataTypes) => {
  const Data = sequelize.define('Data', {
    uuid: {
      type: DataTypes.UUID,
      allowNull: false,
      unique: true
    },    
    ownerUuid: {
      type: DataTypes.UUID,
      allowNull: false
    },    
    data: {
      type: DataTypes.JSON,
      allowNull: false
    },
  })

  Data.associate = function (models) {
  }

  return Data
}
