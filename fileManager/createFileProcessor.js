const fs = require('fs');
const path = require('path');
const EventEmitter = require('events');

function createFileProcessor (watchDir, processedDir, processContent) {
  const emitter = new EventEmitter();

  function start () {
    fs.watch(watchDir, (eventType, filename) => {
      // console.log('event type', eventType);

      if (eventType === 'rename' && filename) {
        const filePath = path.join(watchDir, filename);
        handleFileIfExists(filePath, () => {
          processFile(filePath, filename);
        });
      }
    });
    console.log("Watching files in:" + watchDir)
  }

  function processFile (filePath, filename) {
    console.time(`processing file: ${filename}`);
    fs.readFile(filePath, 'utf8', (err, content) => {
      if (err) {
        console.error(`Error reading file: ${filePath}` + err);
        return;
      }

      const processedContent = processContent({ content, filename })

      // console.log('content', content);
      // console.log('filename', filename);

      const processedFilePath = path.join(processedDir, filename);

      fs.writeFile(processedFilePath, processedContent, (err) => {
        if (err) {
          console.error("Error wiriting processed file: " + err);
          return;
        }

        fs.unlink(filePath, (err) => {
          if (err) {
            console.error("Error deleting original file: " + err);
            return;
          }

          // console.log(`Processed and moved: ${filename}`);
          emitter.emit('fileProcessed', filename);
          console.timeEnd(`processing file: ${filename}`);
        });
      })
    });
  }

  return {
    start, 
    on: (event, callback) => emitter.on(event, callback),
    emit: (event, data) => emitter.emit(event, data)
  }
}


function handleFileIfExists (filePath, triggerActionifExists) {
  fs.access(filePath, fs.constants.F_OK, (err) => {
    if (!err) {
      triggerActionifExists()
    }
  });
}

module.exports = {
  createFileProcessor
}