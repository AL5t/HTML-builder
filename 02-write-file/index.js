const path = require('path');
const fs = require('fs');
const process = require('node:process');
const readline = require('node:readline');

const input = process.stdin;
const output = process.stdout;
const rl = readline.createInterface({ input, output });
const file = fs.createWriteStream(path.join(__dirname, 'text.txt'));

console.log('Введите текст или выйдите из режима редактирования нажав ctrl + c или введя exit');

rl.on('line', data => {
  if (data.toString().trim() === 'exit') {
    console.log('Ваш файл готов! До свидания!');
    process.exit();
  } else {
    file.write(data);
  }
});

rl.on('SIGINT', () => {
  console.log('Ваш файл готов! До свидания!');
  process.exit();
});