const path = require('path');
const fs = require('fs');

const address = path.join(__dirname, 'text.txt');

const stream = fs.createReadStream(address, 'utf-8');

let text = '';

stream.on('data', chunk => text += chunk);
stream.on('end', () => console.log(text));
stream.on('error', error => console.log('Error', error.message));