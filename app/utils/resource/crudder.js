const makeQuery = require('./makeQuery');

function addOne (req, res) {
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
    makeQuery(sql.insertEntry, cleanedQuery).then(({ insertId }) => {
      res.json({ id: insertId, ...cleanedQuery }); 
    }); 
  } else {
    const missingFields = requiredFields.filter(column => !query[column]);
    const msg = `the following fields are missing: ${missingFields.join(', ')}`;
    res.status(400).send(msg); 
  }
}

function getCollection (req, res) {
  const { sql } = req;
  makeQuery(sql.getCollection).then((results) => {
    res.json({ collection: results });
  });
}

function getOne (req, res) {
  const { 
    params: { id }, 
    sql 
  } = req;

  makeQuery(sql.getEntry(id)).then((result) => {
    if ( result.length ) { res.json(result[0]); }
    else { res.status(404).send(`Id ${id} doesn't exist`); }
  });
}

function updateOne (req, res) {
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
    
    makeQuery(sql.updateEntry(id, cleanedQuery)).then(({ affectedRows }) => { 
      if ( affectedRows ) {       
        res.json({ id, ...cleanedQuery });
      } else {
        res.status(404).send(`${tableName} Id: ${id} not found`);
      }
    });
  } else {
    res.status(400).send(`No params to update`);
  }  
}

function deleteOne (req, res) {
  const { 
    params: { id }, 
    sql 
  } = req;

  if ( id === 'drop' ) {
    makeQuery(sql.dropDatabase).then(() => {
      res.send('DB Dropped');
    });
  } else {
    makeQuery(sql.deleteEntry(id)).then(({ affectedRows }) => {
      if ( affectedRows > 0 ) { 
        res.json({ message: `Row ${id} deleted` }); 
      } else {
        res.status(404).send(`Id ${id} doesn't exist`)
      } 
    });  
  }  
}

function deleteAll ({ sql }, res) {
  makeQuery(sql.deleteAll).then(({ affectedRows }) => {
    if ( affectedRows > 0 ) {
      res.json({ message: 'All items deleted' });
    } else {
      res.status(404).send('No items found');
    } 
  });
}

module.exports = {
  addOne,
  getCollection,
  getOne,
  updateOne,
  deleteOne,
  deleteAll
};

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

