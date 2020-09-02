const resourceRouter = require('../utils/resource/resourceRouter.js');

const requiredFields = ['name'];

const props = {
  tableName: 'chat_rooms',
  tableColumns: `(
    id int AUTO_INCREMENT,
    name VARCHAR(255), 
    description VARCHAR(255), 
    PRIMARY KEY (id)
  )`,
  requiredFields: requiredFields,
  editableFields: [...requiredFields, 'description']
};

module.exports = resourceRouter(props);
