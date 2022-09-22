#!/usr/bin/env node

import { realpathSync } from 'fs';
import { fileURLToPath } from 'url';

export const compressGitLog = text => {
  // Move "See merge request ..." text onto end of previous text line.
  // Repeat this to "climb" across multiple lines
  // (which may be original in git log, or inserted by git --graph for drawing diagonals).
  let moved;
  do {
    moved = false;
    // git --graph --color uses ANSI color escape sequences from e.g. ESC[1;31m or just ESC[m.
    text = text.replace(/\n((?:[|\\/ ]|\x1B\[[0-9;]*m)*)(?: — )?See merge request ([^\n]*)\n/mg,
                        (match, graph, mr) => {
                          moved = true;
                          return ` — See merge request ${mr}\n${graph}\n`;
                        });
  } while(moved);

  // Condense the wording.
  text = text.replace(/See merge request /g, 'See MR ');

  // Elide empty log lines (both original and left after moving) in git --graph safe way.
  // Must keep lines that contain graph diagonals `/` or `\`;
  // safe to remove if it contains only [colored] verticals `|` and/or spaces.
  text = text.replace(/\n(?:[| ]|\x1B\[[0-9;]*m)*$/mg, '');

  return text;
}

if (realpathSync(process.argv[1]) === fileURLToPath(import.meta.url)) {
  // Running as script, process stdin -> stdout.
  // Line-by-line is weirdly painful in NodeJS, so slurp whole input.
  const chunks = [];
  for await (const chunk of process.stdin) {
    chunks.push(chunk);
  }
  const text = chunks.join('');

  process.stdout.write(compressGitLog(text));
}
