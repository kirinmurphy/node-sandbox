const { 
  makeQuery,
  getMatchingFields, 
  getCleanedQuery 
} = require('./helpers');

async function addOne (req, res) {
  const { 
    query, 
    sql, 
    requiredFields, 
    editableFields
  } = req;

  const matchingFields = getMatchingFields(query, editableFields);

  const hasAllRequiredFields = matchingFields
    .filter(field => requiredFields.includes(field))
    .length === requiredFields.length;

  if ( hasAllRequiredFields ) {
    const cleanedQuery = getCleanedQuery(matchingFields, query);
    const { insertId } = await makeQuery([sql.insertEntry, cleanedQuery], res);

    res.json({ id: insertId, ...cleanedQuery });   

  } else {
    const missingFields = requiredFields.filter(column => !query[column]);
    const msg = `the following fields are missing: ${missingFields.join(', ')}`;

    res.status(400).send(msg); 
  }
}

module.exports = {
  addOne
}