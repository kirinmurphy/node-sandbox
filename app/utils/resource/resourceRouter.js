const app = require('express');

const dbConfig = require('../../config/db.config');

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
  const router = app.Router();

  const databaseName = dbConfig.database; 
  const sql = getSql({ ...props, databaseName });

  makeQuery(sql.createTable);

  router.use((req, res, next) => {
    req.editableFields = props.editableFields; 
    req.requiredFields = props.requiredFields;
    req.tableName = props.tableName; 
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
