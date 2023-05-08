const path = require('path');
const fs = require('fs');

fs.rm(path.join(__dirname, 'files-copy'), { recursive: true }, error => {
  if (error) console.log(error);
  fs.mkdir(path.join(__dirname, 'files-copy'), { recursive: true }, error => {
    if (error) console.log(error);
    fs.readdir(path.join(__dirname, 'files'), { withFileTypes: true }, (error, files) => {
      if (error) console.log(error);
      for (const file of files) {
        if (file.isFile()) {
          fs.copyFile(path.join(__dirname, 'files', `${file.name}`), path.join(__dirname, 'files-copy', `${file.name}`), (error) => {
            if (error) console.log(error);
          });
        }
      }
    });
  });
});
