import React from 'react';

import { Chip, Grid, GridItem } from '@patternfly/react-core';

import { isMac } from '~/common/navigator';

const shortcuts: { PC: string[]; Mac: string[]; description: string }[] = [
  {
    PC: ['Alt', 'F1'],
    Mac: ['⌥ Opt', 'F1'],
    description: 'Accessibility helps',
  },
  {
    PC: ['F1'],
    Mac: ['F1'],
    description: 'View all editor shortcuts',
  },
  {
    PC: ['Ctrl', 'Space'],
    Mac: ['⌥ Opt', 'Esc'],
    description: 'Activate auto complete',
  },
  {
    PC: ['Ctrl', 'Shift', 'M'],
    Mac: ['⌥ Opt', 'Shift', 'M'],
    description: 'Toggle Tab action between insert Tab character and move focus of editor',
  },
  {
    PC: ['Ctrl', 'Shift', '0'],
    Mac: ['Shift', '⌘ Cmd', '0'],
    description: 'View document outline',
  },
  {
    PC: ['🖱 Hover'],
    Mac: ['🖱 Hover'],
    description: 'View property descriptions',
  },
  {
    PC: ['Ctrl', 'S'],
    Mac: ['⌘ Cmd', 'S'],
    description: 'Save',
  },
];

const SyncEditorShortcutsProps = {
  bodyContent: (
    <Grid span={6} hasGutter key="grid">
      {shortcuts.map((shortcut, index) => (
        // eslint-disable-next-line react/no-array-index-key
        <React.Fragment key={`shortcut-${index}`}>
          <GridItem style={{ textAlign: 'right', marginRight: '1em' }}>
            {shortcut[isMac ? 'Mac' : 'PC']
              .map((key) => (
                <Chip key={key} isReadOnly>
                  {key}
                </Chip>
              ))
              .reduce((prev, curr) => (
                // eslint-disable-next-line react/jsx-no-useless-fragment
                <>{[prev, ' + ', curr]}</>
              ))}
          </GridItem>
          <GridItem>{shortcut.description}</GridItem>
        </React.Fragment>
      ))}
    </Grid>
  ),
  'aria-label': 'Shortcuts',
};

export { SyncEditorShortcutsProps };
