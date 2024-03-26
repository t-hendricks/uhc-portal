import React from 'react';
import { FormGroup, Grid, GridItem, Split, SplitItem } from '@patternfly/react-core';

import { isRestrictedEnv } from '~/restrictedEnv';
import links from '~/common/installLinks.mjs';
import ExternalLink from '~/components/common/ExternalLink';
import PopoverHint from '~/components/common/PopoverHint';

import { constants } from '~/components/clusters/common/CreateOSDFormConstants';
import { FieldId } from '~/components/clusters/wizards/rosa_v2/constants';
import { useFormState } from '~/components/clusters/wizards/hooks';
import { CheckboxField } from '~/components/clusters/wizards/form/CheckboxField';

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
          <div className="ocm-c--reduxcheckbox-description">
            Add more encryption for OpenShift and Kubernetes API resources.
          </div>
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
            <div className="ocm-c--reduxcheckbox-description">
              Install a cluster that uses FIPS Validated / Modules in Process cryptographic
              libraries on the x86_64 architecture.
            </div>
          </FormGroup>
        </GridItem>
      )}
    </Grid>
  );
}
