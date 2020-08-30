const express = require('express');
const mysql = require('mysql');

const app = express();

const db = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  // password: 'root',
  password: 'serenity_now',
  database: 'best_bites'
});

// app.get('/createdb', (req, res) => {
//   let sql = `CREATE DATABASE ${dbName}`;
//   db.query(sql, (err, result) => {
//     if ( err ) throw err;
//     res.send(`${dbName} created`);
//   });
// });

app.get('/createpoststable', (req, res) => {
  let sql = `CREATE TABLE posts(id int AUTO_INCREMENT, title VARCHAR(255), body VARCHAR(255), PRIMARY KEY (id))`;
  db.query(sql, (err, result) => {
    if (err) throw err;
    console.log('result', result);
    res.send('Posts table created...');
  });
});

app.get('/addpost1', (req, res) => {
  let post = { title: 'Post 1', body: 'This is post 1 boyeee' };
  let sql = `INSERT INTO posts SET ?`;
  let query = db.query(sql, post, (err, result) => {
    if ( err ) throw err;
    console.log('result', result);
    res.send('Post 1 added');
  });
});


app.get('/addpost2', (req, res) => {
  let post = { title: 'Post 2', body: 'This is post 2 boyeee' };
  let sql = `INSERT INTO posts SET ?`;
  let query = db.query(sql, post, (err, result) => {
    if ( err ) throw err;
    console.log('result', result);
    res.send('Post 2 added');
  });
});

app.get('/getposts', (req, res) => {
  let sql = 'SELECT * from posts';
  let query = db.query(sql, (err, results) => {
    if (err) throw err;
    console.log('results:', results);
    res.send('Posts fetched');  
  });
});

app.get('/getpost/:id', (req, res) => {
  let sql = `SELECT * from posts WHERE id = ${req.params.id}`;
  let query = db.query(sql, (err, result) => {
    if (err) throw err;
    res.send(`Post ${req.params.id} fetched`);  
  });
});

app.get('/updatepost/:id', (req, res) => {
  let newTitle = 'shmawww';
  let sql = `UPDATE posts SET title = '${newTitle}' WHERE id = ${req.params.id}`;
  let query = db.query(sql, (err, result) => {
    if (err) throw err;
    console.log('update post', result);
    res.send(`Post updated with ${newTitle}...`);
  });  
});

app.get('/deletepost/:id', (req, res) => {
  let newTitle = 'shmawww';
  let sql = `DELETE FROM posts WHERE id = ${req.params.id}`;
  let query = db.query(sql, (err, result) => {
    if (err) throw err;
    console.log('deleted post');
    res.send(`Post deleted`);
  });  
});

db.connect((err) => {
  if(err) { throw err; }
  console.log('Mysql connected...');
})

const PORT = '5001';
app.listen(PORT, () => {
  console.log(`Server started on port ${PORT}`);
});
