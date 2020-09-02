const resourceRouter = require('../utils/resource/resourceRouter.js');

const requiredFields = ['title', 'body'];

const props = {
  tableName: 'posts',
  tableColumns: `(
    id int AUTO_INCREMENT, 
    title VARCHAR(255), 
    body VARCHAR(255), 
    PRIMARY KEY (id)
  )`,
  requiredFields: requiredFields,
  editableFields: [...requiredFields]
};

module.exports = resourceRouter(props);
