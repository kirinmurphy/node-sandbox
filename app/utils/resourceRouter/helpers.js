const connection = require('./connection'); 

function getSql ({ tableName, tableColumns }) {
  return {
    createTable: `CREATE TABLE IF NOT EXISTS ${tableName}${tableColumns}`,
    insertEntry: `INSERT INTO ${tableName} SET ?`,
    getCollection: `SELECT * from ${tableName}`,
    getEntry: id => `SELECT * from ${tableName} WHERE id = ${id}`,
    deleteEntry: id => `DELETE FROM ${tableName} WHERE id = ${id}`,
    deleteAll: `DELETE FROM ${tableName}`,
    updateEntry: (id, query) => { 
      const querySetters = Object.keys(query).map((field) => `${field} = '${query[field]}'`);
      return `UPDATE ${tableName} SET ${querySetters} WHERE id = ${id}`
    }
  };
}

function getMatchingFields (query, editableFields) {
  return Object.keys(query)
    .filter(column => editableFields.includes(column));
}

function getCleanedQuery (matchingFields, query) {
  return matchingFields.reduce((cleanedFields, currentValue) => {
    cleanedFields[currentValue] = query[currentValue];
    return cleanedFields;
  }, {});
};

module.exports = {
  getSql,
  getMatchingFields,
  getCleanedQuery
};
