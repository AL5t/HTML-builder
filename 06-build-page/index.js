const path = require('path');
const fs = require('fs');

const template = fs.createReadStream(path.join(__dirname, 'template.html'), 'utf-8');
let newTemplate = '';

fs.mkdir(path.join(__dirname, 'project-dist'), { recursive: true }, error => {
  if (error) console.log(error);
  console.log(1);
  const commonFileHtml = fs.createWriteStream(path.join(__dirname, 'project-dist', 'index.html'));

  template.on('data', chunk => {
    console.log(2);
    newTemplate += chunk;
    console.log(3);
    console.log(4);
    fs.readdir(path.join(__dirname, 'components'), { withFileTypes: true }, (error, files) => {
      if (error) console.log(error);
      console.log(5);
      for (const file of files) {
        if (file.isFile()) {
          if (path.extname(file.name) === '.html') {
            console.log(6);
            // console.log(newTemplate);
            if (newTemplate.includes(`{{${file.name.slice(0, file.name.indexOf('.'))}}}`)) {
              console.log(7);
              // console.log(newTemplate);
              const componentsFile = fs.createReadStream(path.join(__dirname, 'components', `${file.name}`), 'utf-8', error => {
                if (error) console.log(error);
                let contentComponentsFile = '';

                componentsFile.on('data', chunk => {
                  console.log(8);
                  contentComponentsFile += chunk;
                  newTemplate = newTemplate.replace(`{{${file.name.slice(0, file.name.indexOf('.'))}}}`, `${contentComponentsFile}`);

                });
              });

              // console.log(newTemplate);
            }
          }
        }
      }
      commonFileHtml.write(newTemplate);
    });
  });



});