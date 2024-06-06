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


const makeQuery = async (queries, params) => {
  console.log('QUERIES!!!!', queries);
  if (!Array.isArray(queries)) throw new Error('<<<<< Queries should be an array >>>>>>');
  const results = [];
  for (const query of queries) {
    // console.log('query', query);
    if (!query) throw new Error('SQL query is undefined');
    try {
      const [result] = await connection.query(query);
      results.push(result);
    } catch (err) {
      throw err;
    }
  }
  return results;
};


// async function makeQuery(queries) {
//   // console.log('queries', queries);
//   try {
//     const [results] = await connection.query(queries[0]);
//     console.log('<<<<<======== results', results);
//     return results;
//   } catch (err) {
//     throw err;
//   }
// }

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
  makeQuery,
  getMatchingFields,
  getCleanedQuery
};
