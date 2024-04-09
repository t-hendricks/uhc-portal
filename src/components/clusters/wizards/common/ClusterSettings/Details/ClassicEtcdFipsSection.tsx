import React from 'react';

import { FormGroup, Grid, GridItem, Split, SplitItem } from '@patternfly/react-core';

import links from '~/common/installLinks.mjs';
import { constants } from '~/components/clusters/common/CreateOSDFormConstants';
import { CheckboxField } from '~/components/clusters/wizards/form/CheckboxField';
import { useFormState } from '~/components/clusters/wizards/hooks';
import { FieldId } from '~/components/clusters/wizards/rosa_v2/constants';
import { CheckboxDescription } from '~/components/common/CheckboxDescription';
import ExternalLink from '~/components/common/ExternalLink';
import PopoverHint from '~/components/common/PopoverHint';
import { isRestrictedEnv } from '~/restrictedEnv';

type Props = {
  isRosa: boolean;
};

// OSD and ROSA Classic
export function ClassicEtcdFipsSection({ isRosa }: Props) {
  const {
    values: {
      [FieldId.EtcdEncryption]: etcdEncryption,
      [FieldId.FipsCryptography]: fipsCryptography,
    },
  } = useFormState();

  return (
    <Grid hasGutter>
      <GridItem>
        <FormGroup label="etcd encryption">
          <Split hasGutter>
            <SplitItem>
              <CheckboxField
                name={FieldId.EtcdEncryption}
                label="Enable additional etcd encryption"
                isDisabled={fipsCryptography}
              />
            </SplitItem>
            <SplitItem>
              <PopoverHint
                hint={
                  <>
                    {constants.enableAdditionalEtcdHint}{' '}
                    <ExternalLink
                      href={isRosa ? links.ROSA_SERVICE_ETCD_ENCRYPTION : links.OSD_ETCD_ENCRYPTION}
                    >
                      Learn more about etcd encryption
                    </ExternalLink>
                  </>
                }
              />
            </SplitItem>
          </Split>
          <CheckboxDescription>
            Add more encryption for OpenShift and Kubernetes API resources.
          </CheckboxDescription>
        </FormGroup>
      </GridItem>

      {etcdEncryption && (
        <GridItem>
          <FormGroup label="FIPS cryptography">
            <CheckboxField
              name={FieldId.FipsCryptography}
              label="Enable FIPS cryptography"
              isDisabled={isRestrictedEnv() /* TODO: what about OSD? TODO: tooltip? */}
            />
            <CheckboxDescription>
              Install a cluster that uses FIPS Validated / Modules in Process cryptographic
              libraries on the x86_64 architecture.
            </CheckboxDescription>
          </FormGroup>
        </GridItem>
      )}
    </Grid>
  );
}
