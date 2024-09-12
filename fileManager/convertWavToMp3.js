const fs = require('fs');
const path = require('path');
const { spawn } = require('child_process');

function convertWavToMp3 ({ filename, watchDir, processedDir }) {
  return new Promise((resolve, reject) => {
    const fileExtension = path.extname(filename).toLowerCase();
    const isWav = fileExtension === '.wav';
    if ( !isWav ) {
        reject(new Error('Not a wav file'));
        return;
    }

    const inputPath = path.join(watchDir, filename);
    const outputPath = path.join(processedDir, `${path.parse(filename).name}.mp3`);

    const totalSize = fs.statSync(inputPath).size;
    let processedSize = 0;

    const ffmpeg = spawn('ffmpeg', [
      '-i', inputPath,
      '-acodec', 'libmp3lame',
      '-f', 'mp3',
      '-progress', 'pipe:1',
      outputPath
    ]);

    const croppedFilename = filename.length < 50 
      ? filename : `${filename.slice(0, 20)}...${filename.slice(-20)}`;

    const startProcessingTime = Date.now();
    
    ffmpeg.stdout.on('data', data => {
      const elapsedTime = (Date.now() - startProcessingTime) / 1000;
      process.stdout.write(`\nProcessing ${croppedFilename}: ${elapsedTime.toFixed(2)} seconds elapsed`);
    });

    ffmpeg.stderr.on('data', data => {
      const progress = data.toString();
      const match = progress.match(/size=\s*(\d+)kB/);
      // console.log('\n<<<<<<<< eeeererer', progress)
      if (match) {
        processedSize = parseInt(match[1]) * 1024;
        const percent = ((processedSize / totalSize) * 100).toFixed(2);
        console.log(`\nProcessing ${croppedFilename}: ${percent}% complete`);
      }
    });

    ffmpeg.on('close', code => {
      if (code === 0) {
        resolve('');
      } else {
        reject(new Error(`<<<<<<<< FFmpeg process exited with code ${code} >>>>>>>>`));
      }
    });

    ffmpeg.on('error', err => {
      reject(new Error(`<<<<<<< FFmpeg process error: ${err.message} >>>>>>>`));
    });
  });
}

module.exports = {
  convertWavToMp3
}