const express = require('express');

const { getSql } = require('./helpers');
const { makeQuery } = require('./utils/makeQuery');

const { addOne } = require('./crudder-create');
const { getCollection, getOneForApi } = require('./crudder-read');
const { updateOne } = require('./crudder-update');
const { deleteOne, deleteAll } = require('./crudder-delete');

module.exports = function (props) {
  const router = express.Router();

  const sql = getSql(props);
  
  makeQuery([sql.createTable])
    .catch((err) => { console.log('create table??', err); });

  router.use((req, res, next) => {
    const { requiredFields, optionalFields = [], tableName } = props;
    req.requiredFields = requiredFields;
    req.editableFields = [...requiredFields, ...optionalFields]; 
    req.tableName = tableName;
    req.sql = sql;
    next();
  });
  
  router.post('/', addOne);

  router.get('/', getCollection);
  
  router.get('/:id', getOneForApi);
  
  router.put('/:id', updateOne);
  
  router.delete('/:id', deleteOne);
  
  router.delete('/', deleteAll);

  return { router };
};
