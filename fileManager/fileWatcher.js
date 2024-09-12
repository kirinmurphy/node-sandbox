const fs = require('fs');
const path = require('path');
const { createFileProcessor } = require('./createFileProcessor');
const { convertWavToMp3 } = require('./convertWavToMp3');

// define and make files if they don't exist 
const watchDir = path.join(__dirname, 'watch');
const processedDir = path.join(__dirname, 'processed');

fs.mkdirSync(watchDir, { recursive: true });
fs.mkdirSync(processedDir, { recursive: true });

// create processor 
const fileProcessor = createFileProcessor({ 
  watchDir, 
  processedDir, 
  processAction: async ({ filename }) => {
    await convertWavToMp3({ filename, watchDir, processedDir });
  }
});

fileProcessor.on('fileProcessed', (filename) => {
  console.log(`\nFile processed: ${filename}`);
});

// observe 
fileProcessor.on('error', (error) => {
  console.error('\nFile processor error:', error);
});

// init
fileProcessor.start(); 

// Handle process termination
process.on('SIGINT', () => {
  console.log('\nShutting down file processor...');
  // Perform any necessary cleanup here
  process.exit(0);
});
