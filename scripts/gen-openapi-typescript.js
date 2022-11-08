/* eslint-disable no-console */
const path = require('path');
const fs = require('fs');
const OpenAPI = require('openapi-typescript-codegen');

const sourceDir = path.resolve(__dirname, '../openapi');
const targetDir = path.resolve(__dirname, '../src/types');

// Ensures that all component schemas have a defined type,
// otherwise the library will generate an empty model type definition.
const processJsonAPI = (jsonString) => {
  const json = JSON.parse(jsonString);
  if (json.components) {
    Object.keys(json.components.schemas).forEach((key) => {
      const schema = json.components.schemas[key];
      if (schema && typeof schema.type === 'undefined') {
        schema.type = 'object';
      }
    });
  }
  return json;
};

fs.readdir(sourceDir, (err, files) => {
  files.forEach((file) => {
    const filepath = path.resolve(sourceDir, file);
    const ext = path.extname(file);
    if (ext === '.json' && !fs.statSync(filepath).isDirectory()) {
      const output = path.resolve(targetDir, path.basename(file, ext));
      console.log('Reading', filepath, '-> Generating', output);
      // fs.rmSync(output, { recursive: true, force: true });
      OpenAPI.generate({
        input: processJsonAPI(fs.readFileSync(filepath).toString()),
        output,
        exportCore: false,
        exportServices: false,
        exportModels: true,
        exportSchemas: false,
        indent: '2',
      });
    }
  });
});
