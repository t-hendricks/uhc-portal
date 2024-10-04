import React from 'react';

import { CodeEditor, Language } from '@patternfly/react-code-editor';

import { SyncEditorShortcutsProps } from './SyncEditorShortcuts';

type SyncEditorProps = {
  content: string;
  downloadFileName: string;
  onChange: (content: string) => void;
  isReadOnly?: boolean;
};
const SyncEditor = ({ content, downloadFileName, onChange, isReadOnly }: SyncEditorProps) => (
  <CodeEditor
    isDarkTheme
    isLineNumbersVisible
    isMinimapVisible
    isCopyEnabled
    isDownloadEnabled
    isLanguageLabelVisible={false}
    onChange={onChange}
    language={Language.yaml}
    code={content}
    downloadFileName={downloadFileName}
    shortcutsPopoverProps={SyncEditorShortcutsProps}
    isReadOnly={isReadOnly}
    height="100vh"
  />
);

export { SyncEditor };
