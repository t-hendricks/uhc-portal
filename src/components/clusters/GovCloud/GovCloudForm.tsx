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
import * as React from 'react';
import { AxiosError } from 'axios';
import { humanizeValueWithUnit } from '~/common/units';
import fedrampService from '~/services/fedrampService';
import config from '~/config';
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
  const [isUSCitizen, setIsUSCitizen] = React.useState(false);
  const [backgroundCheck, setBackgroundCheck] = React.useState(false);
  const [securityTraining, setSecurityTraining] = React.useState(false);
  const [fileUpload, setFileUpload] = React.useState<File>();
  const [uploadError, setUploadError] = React.useState<string>();
  const [fileReadError, setFileReadError] = React.useState<string>();
  const [isUploading, setUploading] = React.useState(false);
  const [isReadingFile, setIsReadingFile] = React.useState(false);
  const [contractID, setContractID] = React.useState<string>();

  const formReady = isUSCitizen && backgroundCheck && securityTraining;
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
                Federal and other government agencies, commercial organizations, and FISMA R&D
                Universities wishing to utilize the FedRAMP High (agency) approved Red Hat OpenShift
                Service on AWS (ROSA) environment should utilize the following form in order to
                request access to use the ROSA offering. Federal and government agencies can be
                granted access to the ROSA environment without further verification. However,
                commercial organizations and FISMA R&D Universities will need to provide
                documentation to show that they are supporting a government contract or in the
                process of bidding on a government contract (RFP, RFI, pre-bid stage) as well as
                being subject to a background check, confirmation of US Person and agreement to
                Rules of Behavior. Upon submission, this form will be processed by Red Hat. If
                further information is required you will receive a follow up email, or you will
                receive instructions on how to access the service.
              </Text>
            </TextContent>
          </StackItem>
          <StackItem>
            <Checkbox
              label="I am a U.S. citizen."
              isChecked={isUSCitizen}
              onChange={setIsUSCitizen}
              id="citizen-checkbox"
            />
            <Checkbox
              label="I have undergone a successful background check sponsored by my government agency or government contract sponsoring agency."
              isChecked={backgroundCheck}
              onChange={setBackgroundCheck}
              id="check-checkbox"
            />
            <Checkbox
              label="I will be subject to initial and annual refresher security training."
              isChecked={securityTraining}
              onChange={setSecurityTraining}
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
                      US Spending government
                    </a>{' '}
                    website.
                  </>
                }
              >
                <TextInput value={contractID} onChange={setContractID} isRequired />
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
                  accept: '.pdf',
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
                onReadFailed={(error) => {
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
                          isUSCitizen,
                          backgroundCheck,
                          securityTraining,
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
