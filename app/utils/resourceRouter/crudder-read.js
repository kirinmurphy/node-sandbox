const { makeQuery } = require('./utils/makeQuery.js');

async function getCollection (req, res) {
  const { sql } = req;
  const results = await makeQuery([sql.getCollection], res);
  return res.json({ collection: results });
}

async function getOneForApi (req, res) {
  const { params: { id }, sql } = req;

  const result = await makeQuery([sql.getEntry(id)], res);

  return res && res.json(result) 
    || res.status(404).send(`Id ${id} doesn't exist`);
}

async function getOne ({ params: { id }, sql, res = null }) {
  const result = await makeQuery([sql.getEntry(id)], res);
  return result.length ? result[0] : null;
}

module.exports = {
  getCollection,
  getOne,
  getOneForApi
};
