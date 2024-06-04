import React from 'react';
import { editor } from 'monaco-editor/esm/vs/editor/editor.api';

import { CodeEditor, Language } from '@patternfly/react-code-editor';

export const ValuesCodeEditor = ({ code }: { code: string }) => {
  const onEditorDidMount = (editor: editor.IStandaloneCodeEditor) => {
    editor.layout();
    editor.focus();
  };

  return (
    <CodeEditor
      isLineNumbersVisible={false}
      isReadOnly
      code={code}
      language={Language.json}
      onEditorDidMount={onEditorDidMount}
      height="400px"
    />
  );
};
