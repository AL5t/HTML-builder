const path = require('path');
const fs = require('fs');

const commonFileCss = fs.createWriteStream(path.join(__dirname, 'project-dist', 'bundle.css'));

fs.readdir(path.join(__dirname, 'styles'), { withFileTypes: true }, (error, files) => {
  if (error) console.log(error);
  for (const file of files) {
    if (file.isFile()) {
      if (path.extname(file.name) === '.css') {
        const text = fs.createReadStream(path.join(__dirname, 'styles', `${file.name}`), 'utf-8');
        text.on('data', chunk => {
          commonFileCss.write(chunk);
        });
      }
    }
  }
});