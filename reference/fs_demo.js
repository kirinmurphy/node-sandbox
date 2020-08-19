const fs = require('fs');
const path = require('path');

// fs.mkdir(path.join(__dirname, '/test'), {}, error => {
//   if (error) throw error;
//   console.log('Folder created!');
// });

// Create and write to file
// fs.writeFile(path.join(__dirname, '/test/', 'hello.txt'),
//   'Hello World!',
//    error => {
//      if (error) throw error;
//      console.log('file writen to');

//      fs.appendFile(path.join(__dirname, '/test/', 'hello.txt'),
//      ' I love node.js',
//       error => {
//         if (error) throw error;
//         console.log('file writen to');
//       }
//    );     
//    }
// );

fs.readFile(path.join(__dirname, '/test', 'hello.txt'), 'utf8', (err, data) => {
  console.log('data', data);
});

fs.rename(path.join(__dirname, '/test', 'hello.txt'), path.join(__dirname, 'test', 'helloworld.txt'), error => {
  if (error) { console.log('error'); }
});

