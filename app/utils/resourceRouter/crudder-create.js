const { getMatchingFields, getCleanedQuery } = require('./helpers');
const { makeQuery } = require('./utils/makeQuery.js');

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

    return res.json({ id: insertId, ...cleanedQuery });   

  } else {
    const missingFields = requiredFields.filter(column => !query[column]);
    const msg = `the following fields are missing: ${missingFields.join(', ')}`;

    return res.status(400).send(msg); 
  }
}

module.exports = {
  addOne
}