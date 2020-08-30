const fs = require('fs');
const path = require('path');

const distFolderName = '/writeFileTest';
const distFolder = path.join(__dirname, distFolderName);
const newFileName = 'hello.txt';
const newFile = path.join(__dirname, distFolderName, newFileName);
const updatedFileName = 'helloworld.txt';
const updatedFile = path.join(__dirname, distFolderName, updatedFileName);

const fileContents = 'Hello world yo!';
const appendedContent = '\nI love node.js';

const options = (process.argv.slice(2));

const deleting = options.filter(option => option === '--delete').length === 1;

try {
  if ( deleting ) {
    fs.unlinkSync(updatedFile);
    fs.rmdirSync(path.join(__dirname, distFolderName));
  } else { 
    fs.mkdirSync(distFolder);
    fs.writeFileSync(newFile, fileContents);
    fs.appendFileSync(newFile, appendedContent);
    fs.renameSync(newFile, updatedFile);
    const data = fs.readFileSync(updatedFile, 'utf8');
    console.log('data: ', data);
  }
} catch (error) {
  console.log('error: ', error);
}
