const resourceRouter = require('../utils/resourceRouter');

const props = {
  tableName: 'posts',
  tableColumns: `(
    id int AUTO_INCREMENT, 
    title VARCHAR(255), 
    body VARCHAR(255), 
    PRIMARY KEY (id)
  )`,
  requiredFields: ['title', 'body']
};

module.exports = resourceRouter(props);
