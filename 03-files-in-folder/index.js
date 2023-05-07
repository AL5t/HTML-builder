const path = require('path');
const fs = require('fs');

fs.readdir(path.join(__dirname, 'secret-folder'), { withFileTypes: true }, (error, files) => {
  if (error) console.log(error);
  for (const file of files) {
    if (file.isFile()) {
      fs.stat(path.join(__dirname, 'secret-folder', `${file.name}`), (error, stats) => {
        if (error) console.log(error);
        const nameFile = file.name.slice(0, file.name.indexOf('.'));
        const extFile = path.extname(file.name).slice(1);
        console.log(`${nameFile} - ${extFile} - ${stats.size}b`);
      });
    }
  }
});