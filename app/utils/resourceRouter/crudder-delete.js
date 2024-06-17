const { makeQuery } = require('./utils/makeQuery.js');

async function deleteOne (req, res) {
  const { 
    params: { id }, 
    sql 
  } = req;

  const { affectedRows } = await makeQuery([sql.deleteEntry(id)], res);
  
  if ( affectedRows > 0 ) { 
    return res.json({ message: `Row ${id} deleted` }); 
  } else {
    return res.status(404).send(`Id ${id} doesn't exist`);
  }
}

async function deleteAll ({ sql }, res) {
  const { affectedRows } = await makeQuery([sql.deleteAll], res);
  
  if ( affectedRows > 0 ) {
    return res.json({ message: 'All items deleted' });
  } else {
    return res.status(404).send('No items found');
  } 
}

module.exports = {
  deleteOne,
  deleteAll
};
