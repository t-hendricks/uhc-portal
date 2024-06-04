import * as React from 'react';
import { AxiosError } from 'axios';

import {
  Alert,
  Brand,
  Bullseye,
  Button,
  Card,
  CardBody,
  CardFooter,
  CardTitle,
  Checkbox,
  FileUpload,
  Flex,
  FlexItem,
  FormGroup,
  Stack,
  StackItem,
  Text,
  TextContent,
  TextInput,
  TextVariants,
} from '@patternfly/react-core';

import { humanizeValueWithUnit } from '~/common/units';
import config from '~/config';
import fedrampService from '~/services/fedrampService';

import redhatLogoImg from '../../../styles/images/Logo-RedHat-Hat-Color-RGB.png';

const maxFileSize = 10 * 1024 * 1024; // 10 MB
const maxFileSizeHumanized = humanizeValueWithUnit(maxFileSize, 'B').value;

const GovCloudForm = ({
  title,
  onSubmitSuccess,
  hasGovEmail,
}: {
  title: string;
  onSubmitSuccess: () => void;
  hasGovEmail: boolean;
}) => {
  const [isUSPerson, setIsUSPerson] = React.useState(false);
  const [govContract, setGovContract] = React.useState(false);
  const [authPerson, setAuthPerson] = React.useState(false);
  const [fileUpload, setFileUpload] = React.useState<File>();
  const [uploadError, setUploadError] = React.useState<string>();
  const [fileReadError, setFileReadError] = React.useState<string>();
  const [isUploading, setUploading] = React.useState(false);
  const [isReadingFile, setIsReadingFile] = React.useState(false);
  const [contractID, setContractID] = React.useState<string>();

  const formReady = isUSPerson && govContract && authPerson;
  return (
    <Card style={{ maxWidth: '80rem', borderTopColor: '#e00', borderTopStyle: 'solid' }}>
      <CardTitle>
        <Flex
          alignContent={{ default: 'alignContentCenter' }}
          direction={{ default: 'column' }}
          justifyContent={{ default: 'justifyContentCenter' }}
          alignItems={{ default: 'alignItemsCenter' }}
        >
          <FlexItem style={{ width: '5rem' }}>
            <Brand src={redhatLogoImg} alt="Red Hat Logo" />
          </FlexItem>
          <FlexItem>
            <TextContent>
              <Text component={TextVariants.h1}>{title}</Text>
            </TextContent>
          </FlexItem>
        </Flex>
      </CardTitle>
      <CardBody>
        <Stack hasGutter>
          <StackItem>
            <TextContent>
              <Text component={TextVariants.p}>
                Red Hat OpenShift Service on AWS (ROSA) and Red Hat Insights in the GovCloud Region
                have been authorized (agency) under the Federal Risk Assessment and Management
                Program (FedRAMP) High and DoD Cloud Computing Security Requirements Guide (SRG).
              </Text>
              <Text component={TextVariants.p}>
                Federal and government agencies can be granted access to the FedRAMP environment
                without further verification. However, commercial organizations and FISMA R&D
                universities will need to provide documentation to show that they are supporting a
                government contract/grant or in the process of bidding on a government
                contract/grant (RFP, RFI, pre-bid stage), confirmation of U.S. Person only access at
                the root level and agreement to the FedRAMP Rules of Behavior.
              </Text>
              <Text component={TextVariants.p}>
                Upon submission, this form will be processed by Red Hat. If further information is
                required you will receive a follow up email, or you will receive instructions on how
                to access the service. By checking the boxes below you confirm that:
              </Text>
            </TextContent>
          </StackItem>
          <StackItem>
            <Checkbox
              label="Requestor is U.S. Person as defined by the International Traffic in Arms Regulations, 22 CFR 120.62."
              isChecked={isUSPerson}
              onChange={(_event, value) => setIsUSPerson(value)}
              id="citizen-checkbox"
            />
            <Checkbox
              label="Requestor will use the service to support a U.S. government contract and/or grant."
              isChecked={govContract}
              onChange={(_event, value) => setGovContract(value)}
              id="check-checkbox"
            />
            <Checkbox
              label="Requestor will only authorize U.S. Persons to manage and access root account keys to the service."
              isChecked={authPerson}
              onChange={(_event, value) => setAuthPerson(value)}
              id="training-checkbox"
            />
          </StackItem>
          {!hasGovEmail && (
            <StackItem>
              <FormGroup
                label={
                  <>
                    Contract ID, Award ID or RFP Number from the{' '}
                    <a
                      href="https://www.usaspending.gov/search"
                      target="_blank"
                      rel="noreferrer noopener"
                    >
                      U.S. Spending government
                    </a>{' '}
                    website.
                  </>
                }
              >
                <TextInput
                  value={contractID}
                  onChange={(_, value) => setContractID(value)}
                  isRequired
                />
              </FormGroup>
            </StackItem>
          )}
          <StackItem>
            <FormGroup
              label={
                <TextContent>
                  <Text component={TextVariants.p}>
                    Please download the{' '}
                    <Button variant="link" isInline>
                      <a
                        href={`${config.configData.fedrampS3}/fedramp-rules-of-behavior.pdf`}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        FedRAMP Rules of Behavior document.
                      </a>
                    </Button>{' '}
                    Read the document and attest to the requirements by signing and uploading it to
                    the designated area below.
                  </Text>
                </TextContent>
              }
            >
              <FileUpload
                id="doc-upload"
                value={fileUpload}
                filename={fileUpload?.name}
                filenamePlaceholder="Drag and drop a file or upload one"
                dropzoneProps={{
                  accept: { pdf: ['.pdf'] },
                  maxSize: maxFileSize,
                  onDropRejected: () => {
                    setFileReadError(
                      `File must be pdf and has ${maxFileSizeHumanized} Mb or less.`,
                    );
                  },
                }}
                onFileInputChange={(_, file) => {
                  if (file.size > maxFileSize) {
                    setFileReadError(
                      `File size is too big. Upload a new file ${maxFileSizeHumanized} Mb or less`,
                    );
                    setFileUpload(undefined);
                  } else {
                    setFileReadError(undefined);
                    setFileUpload(file);
                  }
                }}
                onClearClick={() => {
                  setFileReadError(undefined);
                  setFileUpload(undefined);
                }}
                onReadFailed={(_event, error) => {
                  setFileReadError(error.message);
                  setIsReadingFile(false);
                }}
                onReadStarted={() => {
                  setFileReadError(undefined);
                  setIsReadingFile(true);
                }}
                onReadFinished={() => {
                  setIsReadingFile(false);
                }}
                isDisabled={isReadingFile}
                isLoading={isReadingFile}
                browseButtonText="Upload"
              />
            </FormGroup>
          </StackItem>
        </Stack>
      </CardBody>
      <CardFooter>
        <Stack hasGutter>
          {(!!uploadError || !!fileReadError) && (
            <StackItem>
              <Alert isInline variant="danger" title="An error occured.">
                {uploadError || fileReadError}
              </Alert>
            </StackItem>
          )}
          <StackItem>
            <Bullseye>
              <Button
                variant="primary"
                isDisabled={!formReady || isUploading || !!fileReadError || !fileUpload}
                onClick={async () => {
                  if (fileUpload) {
                    setUploading(true);
                    setUploadError(undefined);
                    try {
                      await fedrampService.createIncident(
                        fileUpload,
                        {
                          isUSPerson,
                          authPerson,
                          govContract,
                        },
                        contractID,
                      );
                      onSubmitSuccess();
                    } catch (err) {
                      const axiosErr = err as any as AxiosError;
                      setUploadError(`${axiosErr.code}: ${axiosErr.message}`);
                    } finally {
                      setUploading(false);
                    }
                  }
                }}
                isLoading={isUploading}
              >
                {isUploading ? 'Submitting' : 'Submit'}
              </Button>
            </Bullseye>
          </StackItem>
        </Stack>
      </CardFooter>
    </Card>
  );
};

export default GovCloudForm;
