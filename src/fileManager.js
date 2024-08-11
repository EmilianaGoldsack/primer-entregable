import fs from 'fs/promises';

// Función para leer el archivo JSON
export async function readJSONFile(filePath) {
  try {
    const data = await fs.readFile(filePath, 'utf-8');
    return JSON.parse(data);
  } catch (error) {
    console.error('Error al leer el archivo JSON:', error);
    return [];
  }
}

// Función para escribir en el archivo JSON
export async function writeJSONFile(filePath, data) {
  try {
    await fs.writeFile(filePath, JSON.stringify(data, null, 2), 'utf-8');
  } catch (error) {
    console.error('Error al escribir en el archivo JSON:', error);
  }
}