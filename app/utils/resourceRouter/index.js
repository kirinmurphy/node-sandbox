const express = require('express');

const { getSql, makeQuery } = require('./helpers');

const { addOne } = require('./crudder-create');
const { getCollection, getOne } = require('./crudder-read');
const { updateOne } = require('./crudder-update');
const { deleteOne, deleteAll } = require('./crudder-delete');

async function initializeTable(props) {
  const sql = getSql(props);
  try {
    await makeQuery([sql.createTable]);
  } catch (err) {
    console.log('create table??', err);
  }
}

function createResourceRouter (props, customRoutes = []) {
  const router = express.Router();
  const sql = getSql(props);

  router.use((req, res, next) => {
    const { requiredFields, optionalFields = [], tableName } = props;
    req.requiredFields = requiredFields;
    req.editableFields = [...requiredFields, ...optionalFields]; 
    req.tableName = tableName;
    req.sql = sql;
    next();
  });
  
  router.post('/', addOne);

  // console.log('props', props);

  router.get('/', getCollection);
  
  router.get('/:id', getOne);
  
  router.put('/:id', updateOne);
  
  router.delete('/:id', deleteOne);
  
  router.delete('/', deleteAll);

  customRoutes.forEach(route => {
    router[route.method](route.path, route.handler);
  });

  return router;
};

module.exports = { initializeTable, createResourceRouter };
 