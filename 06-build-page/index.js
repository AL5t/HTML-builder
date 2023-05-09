const path = require('path');
const fs = require('fs');

const template = fs.createReadStream(path.join(__dirname, 'template.html'), 'utf-8');
let newTemplate = '';

fs.mkdir(path.join(__dirname, 'project-dist'), { recursive: true }, error => {
  if (error) console.log(error);
  const commonFileHtml = fs.createWriteStream(path.join(__dirname, 'project-dist', 'index.html'));

  template.on('data', chunk => {
    newTemplate += chunk;
    fs.readdir(path.join(__dirname, 'components'), { withFileTypes: true }, (error, files) => {
      if (error) console.log(error);
      for (let i = 0; i < files.length; i++) {
        if (files[i].isFile()) {
          if (path.extname(files[i].name) === '.html') {
            if (newTemplate.includes(`{{${files[i].name.slice(0, files[i].name.indexOf('.'))}}}`)) {

              const componentsFile = fs.createReadStream(path.join(__dirname, 'components', `${files[i].name}`), 'utf-8');
              componentsFile.on('data', chunk => {
                newTemplate = newTemplate.replace(`{{${files[i].name.slice(0, files[i].name.indexOf('.'))}}}`, `${chunk}`);
                if (i === files.length - 1) {
                  commonFileHtml.write(newTemplate);
                }
              });
            }
          }
        }
      }
    });
  });

  const commonFileCss = fs.createWriteStream(path.join(__dirname, 'project-dist', 'style.css'));

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

  fs.mkdir(path.join(__dirname, 'project-dist', 'assets'), { recursive: true }, error => {
    if (error) console.log(error);
    fs.readdir(path.join(__dirname, 'assets'), { withFileTypes: true }, (error, files) => {
      if (error) console.log(error);
      for (const file of files) {
        if (file.isFile()) {
          fs.copyFile(path.join(__dirname, 'assets', `${file.name}`), path.join(__dirname, 'project-dist', 'assets', `${file.name}`), (error) => {
            if (error) console.log(error);
          });
        } else {
          fs.mkdir(path.join(__dirname, 'project-dist', 'assets', `${file.name}`), { recursive: true }, error => {
            if (error) console.log(error);
            fs.readdir(path.join(__dirname, 'assets', `${file.name}`), { withFileTypes: true }, (error, subfiles) => {
              if (error) console.log(error);
              for (const subfile of subfiles) {
                if (subfile.isFile()) {
                  fs.copyFile(path.join(__dirname, 'assets', `${file.name}`, `${subfile.name}`), path.join(__dirname, 'project-dist', 'assets', `${file.name}`, `${subfile.name}`), (error) => {
                    if (error) console.log(error);
                  });
                }
              }
            });
          });
        }
      }
    });
  });
});