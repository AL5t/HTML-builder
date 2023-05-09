const path = require('path');
const fs = require('fs');

const template = fs.createReadStream(path.join(__dirname, 'template.html'), 'utf-8');
let newTemplate = '';

// function replaceContent(source, destination) {
//   const componentsFile = fs.createReadStream(path.join(__dirname, 'components', `${source.name}`), 'utf-8');
//   let contentComponentsFile = '';
//   console.log(8);

//   componentsFile.on('data', chunk => {
//     console.log(9);
//     contentComponentsFile += chunk;
//     destination = destination.replace(`{{${source.name.slice(0, source.name.indexOf('.'))}}}`, `${contentComponentsFile}`);
//   });
// }

fs.mkdir(path.join(__dirname, 'project-dist'), { recursive: true }, error => {
  if (error) console.log(error);
  // console.log(1);
  const commonFileHtml = fs.createWriteStream(path.join(__dirname, 'project-dist', 'index.html'));

  template.on('data', chunk => {
    // console.log(2);
    newTemplate += chunk;
    // console.log(3);
    // console.log(4);
    fs.readdir(path.join(__dirname, 'components'), { withFileTypes: true }, (error, files) => {
      if (error) console.log(error);
      // console.log(5);
      files.forEach(file => {
        if (file.isFile()) {
          if (path.extname(file.name) === '.html') {
            // console.log(6);
            // console.log(newTemplate);
            if (newTemplate.includes(`{{${file.name.slice(0, file.name.indexOf('.'))}}}`)) {
              // console.log(7);
              // console.log(newTemplate);
              // fs.readFile(path.join(__dirname, 'components', `${file.name}`), 'utf-8', (error, contentComponentsFile) => {
              //   if (error) console.log(error);
              //   console.log(8);
              //   newTemplate = newTemplate.replace(`{{${file.name.slice(0, file.name.indexOf('.'))}}}`, `${contentComponentsFile}`);
              //   console.log(9);
              // });

              const componentsFile = fs.createReadStream(path.join(__dirname, 'components', `${file.name}`), 'utf-8');
              let contentComponentsFile = '';
              // console.log(8);

              componentsFile.on('data', chunk => {
                // console.log(9);
                contentComponentsFile += chunk;
                newTemplate = newTemplate.replace(`{{${file.name.slice(0, file.name.indexOf('.'))}}}`, `${contentComponentsFile}`);
              });
              // console.log(10);
            }
          }
        }
      });
      commonFileHtml.write(newTemplate);
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