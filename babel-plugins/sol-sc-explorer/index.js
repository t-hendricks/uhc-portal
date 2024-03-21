const { declare } = require('@babel/helper-plugin-utils');
const babelTypes = require('@babel/types');
const path = require('path');

module.exports = declare((api) => {
  api.assertVersion(7);

  return {
    visitor: {
      JSXElement(pathNode) {
        let fullSourceFilePath = pathNode.hub.file.opts.filename || 'unknown';
        let lineNumber = pathNode.node.loc ? pathNode.node.loc.start.line : 'unknown';

        // Assuming your project's source files are in the 'src' directory
        // Adjust if your source files are located elsewhere
        const projectSrcPath = '/src/';
        const srcIndex = fullSourceFilePath.indexOf(projectSrcPath);

        let sourceFile = 'unknown';
        if (srcIndex !== -1) {
          // Include '/src/' in the extracted path
          sourceFile = fullSourceFilePath.substring(srcIndex);
        }

        const sourceFileAttribute = babelTypes.jsxAttribute(
          babelTypes.jsxIdentifier('data-source-file'),
          babelTypes.stringLiteral(sourceFile),
        );
        const lineNumberAttribute = babelTypes.jsxAttribute(
          babelTypes.jsxIdentifier('data-source-line'),
          babelTypes.stringLiteral(String(lineNumber)),
        );

        pathNode.node.openingElement.attributes.push(sourceFileAttribute, lineNumberAttribute);
      },
    },
  };
});
