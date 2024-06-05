const chatRoomResourceProps = {
  tableName: 'chat_rooms',
  tableColumns: `(
    id int AUTO_INCREMENT,
    name VARCHAR(255), 
    description VARCHAR(255), 
    PRIMARY KEY (id)
  )`,
  requiredFields: ['name'],
  optionalFields: ['description']
};

module.exports = {
  chatRoomResourceProps
}
