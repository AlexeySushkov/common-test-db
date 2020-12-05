

module.exports = (sequelize, DataTypes) => {
  const Data = sequelize.define('Data', {
    uuid: DataTypes.UUID,
    ownerUuid: DataTypes.UUID,
    data: DataTypes.JSON
  })

  Data.associate = function (models) {
  }

  return Data
}
