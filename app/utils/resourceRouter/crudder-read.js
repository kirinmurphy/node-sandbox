const { makeQuery } = require('./utils/makeQuery.js');

async function getCollectionForApi ({ sql }, res) {
  const results = await getCollection({ sql, res });
  
  return res?.json({ collection: results }) 
    || res.status(404).send('No results found');
}

async function getCollection ({ sql, res = null }) {
  const results = await makeQuery([sql.getCollection], res);
  return results.length ? results : null;
}

async function getOneForApi (req, res) {
  const { params: { id }, sql } = req;
  const result = await getOne({ id, sql, res });

  return res?.json(result) 
    || res.status(404).send(`Id ${id} doesn't exist`);
}

async function getOne ({ id, sql, res = null }) {
  const result = await makeQuery([sql.getEntry(id)], res);
  return result.length ? result[0] : null;
}

module.exports = {
  getOne,
  getCollection,
  getCollectionForApi,
  getOneForApi
};
