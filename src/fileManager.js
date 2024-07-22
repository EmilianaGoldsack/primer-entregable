import fs from 'fs';

const readJSONFile = (filename) => {
  try {
    const data = fs.readFileSync(filename, 'utf8');
    return JSON.parse(data);
  } catch (error) {
    console.error(`Error reading ${filename}: ${error.message}`);
    return [];
  }
};

const writeJSONFile = (filename, data) => {
  try {
    fs.writeFileSync(filename, JSON.stringify(data, null, 2));
    console.log(`Data written to ${filename} successfully.`);
  } catch (error) {
    console.error(`Error writing ${filename}: ${error.message}`);
  }
};

export { readJSONFile, writeJSONFile };