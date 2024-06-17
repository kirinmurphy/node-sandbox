const { getMatchingFields, getCleanedQuery } = require('./helpers');
const { makeQuery } = require('./utils/makeQuery.js');

async function updateOne (req, res) {
  const { 
    query, 
    params: { id },
    sql,
    editableFields, 
    tableName 
  } = req;
  
  const matchingFields = getMatchingFields(query, editableFields);
  
  if ( matchingFields.length ) {    
    const cleanedQuery = getCleanedQuery(matchingFields, query);
    const { affectedRows } = await makeQuery([sql.updateEntry(id, cleanedQuery)], res);

    if ( affectedRows ) { 
      return res.json({ id, ...cleanedQuery }); 
    } else { 
      return res.status(404).send(`${tableName} Id: ${id} not found`); 
    }
  } else {
    return res.status(400).send(`No params to update`);
  }  
}

module.exports = {
  updateOne,
};
