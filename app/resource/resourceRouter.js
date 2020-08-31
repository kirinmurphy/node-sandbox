const app = require('express');
const router = app.Router();

const dbConfig = require('../config/db.config');

const {
  addOne,
  getCollection,
  getOne,
  updateOne,
  deleteOne,
  deleteAll
} = require('./crudder');

const makeQuery = require('./makeQuery');
const getSql = require('./getSql');

module.exports = function (props) {
  const sql = getSql({ ...props, databaseName: dbConfig.database });

  makeQuery(sql.createDatabase);
  makeQuery(sql.useDatabase);
  makeQuery(sql.creatTable);

  router.use((req, res, next) => {
    req.resourceProps = props;
    req.sql = sql;
    next();
  });
  
  router.post('/', addOne);

  router.get('/', getCollection);
  
  router.get('/:id', getOne);
  
  router.put('/:id', updateOne);
  
  router.delete('/:id', deleteOne);
  
  router.delete('/', deleteAll);

  return router;
};
