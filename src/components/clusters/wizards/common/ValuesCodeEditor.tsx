import React from 'react';
import { CodeEditor, Language } from '@patternfly/react-code-editor';
import { editor } from 'monaco-editor/esm/vs/editor/editor.api';

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
