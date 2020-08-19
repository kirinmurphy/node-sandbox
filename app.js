const http = require('http');
const path = require('path');
const fs =require('fs');

const contentTypes = {
  html: 'text/html',
  js: 'text/javascript',
  css: 'text/css',
  json: 'application/json',
  png: 'image/png',
  jpg: 'image/jpg'
};

const server = http.createServer((req, res) => {
  // console.log(req.url);
  // if ( req.url === '/' ) {
  //   fs.readFile(path.join(__dirname, 'public', 'index.html'), (err, content) => {
  //     if (err) throw err;
  //     res.writeHead(200, { 'Content-Type': 'text/html' });
  //     res.end(content);  
  //   });
  // }

  // if ( req.url === '/about' ) {
  //   fs.readFile(path.join(__dirname, 'public', 'about.html'), (err, content) => {
  //     if (err) throw err;
  //     res.writeHead(200, { 'Content-Type': 'text/html' });
  //     res.end(content);  
  //   });
  // }

  if ( req.url === '/api/users' ) {
    const users = [
      { name: 'sally famtopf', age: 274 },
      { name: 'jomel brofnauer', age: 233 }
    ];
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify(users));
  }

  const returnPath = req.url === '/' ? 'index.html' : req.url;
  let filePath = path.join(__dirname, 'public', returnPath);
  
  let extName = path.extname(filePath).replace('.', '');

  fs.readFile(filePath, (err, content) => {
    if (err) {
      if (err.code == 'ENOENT') {
        // Page not found
        fs.readFile(path.join(__dirname, 'public', '404.html'), (err, content) => {
          res.writeHead(200, {'Content-Type': 'text/html'});
          res.end(content, 'utf8');
        });
      } else {
        // some sever error
        res.writeHead(500);
        res.end(`Server busted: ${err.code}`);
      }
    } else {
      // Success
      console.log('adf', contentTypes[extName]);
      res.writeHead(200, {'Content-Type': contentTypes[extName]});
      res.end(content, 'utf8');}
  });
});

const PORT = process.env.PORT || 5001;

server.listen(PORT, () => console.log(`Servr running on port ${PORT}`));