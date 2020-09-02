
module.exports = ({ databaseName, tableName, tableColumns }) => {
  return {
    createDatabase: `CREATE DATABASE IF NOT EXISTS ${databaseName}`,
    dropDatabase: `DROP database ${databaseName};`,
    useDatabase: `USE ${databaseName}`,
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
