const fs = require('fs');
// const os = require('os');
const path = require('path');
const { createFileProcessor } = require('./createFileProcessor');

// define and make files if they don't exist 
const watchDir = path.join(__dirname, 'watch');
const processedDir = path.join(__dirname, 'processed');

fs.mkdirSync(watchDir, { recursive: true });
fs.mkdirSync(processedDir, { recursive: true });

// create processor 
const fileProcessor = createFileProcessor(watchDir, processedDir, ({ content, filename }) => {
  return content.toUpperCase();  
});


// observe 
fileProcessor.on('fileProcessed', (filename) => {
  // console.log('Event: File processed - ' + filename);
  // console.log(`System Info: ${JSON.stringify(os.cpus()[0], null, 2)}`);
});

// init
fileProcessor.start(); 

