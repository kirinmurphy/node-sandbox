const { 
  makeQuery,
  getMatchingFields, 
  getCleanedQuery 
} = require('./helpers');

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
      res.json({ id, ...cleanedQuery }); 
    } else { 
      res.status(404).send(`${tableName} Id: ${id} not found`); 
    }
  } else {
    res.status(400).send(`No params to update`);
  }  
}

module.exports = {
  updateOne,
};
