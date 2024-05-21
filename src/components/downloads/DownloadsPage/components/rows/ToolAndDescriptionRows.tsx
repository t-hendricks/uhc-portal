import React from 'react';

import { Td } from '@patternfly/react-table';

import AlignRight from '~/components/common/AlignRight';

import { downloadChoice } from '../../../downloadChoice';
import ExpandableRowPair from '../ExpandableRowPair';

import { DownloadsPageRowsType } from './DownloadsPageRowsType';

type ToolAndDescriptionRowsProps = DownloadsPageRowsType & {
  tool: string;
  channel: string;
  name: React.ReactElement | string;
  description: React.ReactElement;
};
/** Row pair for a tool. */
const ToolAndDescriptionRows = ({
  expanded,
  setExpanded,
  selections,
  setSelections,
  toolRefs,
  urls,
  tool,
  channel,
  name,
  description,
}: ToolAndDescriptionRowsProps) => {
  const chooser = downloadChoice(selections, setSelections, urls, tool, channel, {
    text: 'Download',
  });

  return (
    <ExpandableRowPair
      expanded={expanded}
      setExpanded={setExpanded}
      toolRefs={toolRefs}
      expandKey={tool}
      cells={[
        <Td dataLabel="Name" key={`${tool}-name`}>
          <span>{name}</span>
        </Td>,
        <Td dataLabel="OS" key={`${tool}-os`}>
          {chooser.osDropdown}
        </Td>,
        <Td dataLabel="Architecture" key={`${tool}-arch`}>
          {chooser.archDropdown}
        </Td>,
        <Td dataLabel="" key={`${tool}-download`}>
          <AlignRight>{chooser.downloadButton} </AlignRight>
        </Td>,
      ]}
      description={description}
    />
  );
};

export default ToolAndDescriptionRows;
