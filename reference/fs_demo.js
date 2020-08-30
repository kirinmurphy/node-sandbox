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

if ( deleting ) {
  try {
    fs.unlinkSync(updatedFile);
    fs.rmdirSync(path.join(__dirname, distFolderName));
  } catch (error) {
    console.log('error: ', error);
  }
} else { 
  try {
    fs.mkdirSync(distFolder);
    fs.writeFileSync(newFile, fileContents);
    fs.appendFileSync(newFile, appendedContent);
    fs.renameSync(newFile, updatedFile);
    const data = fs.readFileSync(updatedFile, 'utf8');
    console.log('data: ', data);
  } catch (error) {
    console.log('error: ', error);
  }

  // fs.mkdir(distFolder, {}, error => {
  //   if (error) throw error;
  
  //   fs.writeFile(newFile, fileContents, (error) => {
  //     if (error) throw error;
  
  //     fs.appendFile(newFile, appendedContent, (error) => {
  //       if (error) throw error;
  
  //       fs.rename(newFile, updatedFile, error => {
  //         if (error) { console.log('error'); }
  
  //         fs.readFile(updatedFile, 'utf8', (error, data) => {
  //           if (error) throw error;
  //         });
  //       });  
  //     });  
  //   });  
  // });
}
