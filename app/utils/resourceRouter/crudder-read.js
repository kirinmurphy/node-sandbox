const { makeQuery } = require('./helpers');

async function getCollection (req, res) {
  const { sql } = req;
  const [results] = await makeQuery([sql.getCollection], res);
  return res.json({ collection: results });
}

async function getOne (req, res) {
  const { 
    params: { id }, 
    sql 
  } = req;

  const result = await makeQuery([sql.getEntry(id)], res);

  if ( result.length ) { 
    return res.json(result[0]); 
  } else { 
    return res.status(404).send(`Id ${id} doesn't exist`); 
  } 
}

module.exports = {
  getCollection,
  getOne
};
