import {
  DescriptionList,
  DescriptionListDescription,
  DescriptionListTerm,
  Text,
  TextContent,
} from '@patternfly/react-core';
import React from 'react';
import PopoverHint from '~/components/common/PopoverHint';

export const NamespaceOwnerPolicyPopover = () => (
  <PopoverHint
    title="Namespace ownership policy"
    maxWidth="30rem"
    hint={
      <TextContent>
        <Text>
          With <b>inter-namespace ownership allowed</b>, a single hostname can be used in routes of
          different namespaces. With <b>strict</b> option selected, a hostname can be used in routes
          of a single namespace only.
        </Text>
        <Text>
          <b>Mind following example:</b>
          <br />
          hostname.dev/foo in namespace A<br />
          hostname.dev/bar in namespace B<br />
        </Text>

        <DescriptionList>
          <DescriptionListTerm>Inter-namespace ownership allowed</DescriptionListTerm>
          <DescriptionListDescription>possible</DescriptionListDescription>

          <DescriptionListTerm>Strict</DescriptionListTerm>
          <DescriptionListDescription>forbidden</DescriptionListDescription>
        </DescriptionList>
      </TextContent>
    }
  />
);
