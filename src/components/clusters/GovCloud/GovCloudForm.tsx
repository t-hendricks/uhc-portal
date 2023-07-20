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
  Stack,
  StackItem,
  Text,
  TextContent,
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
}: {
  title: string;
  onSubmitSuccess: () => void;
}) => {
  const [isUSCitizen, setIsUSCitizen] = React.useState(false);
  const [backgroundCheck, setBackgroundCheck] = React.useState(false);
  const [securityTraining, setSecurityTraining] = React.useState(false);
  const [fileUpload, setFileUpload] = React.useState<File>();
  const [uploadError, setUploadError] = React.useState<string>();
  const [fileReadError, setFileReadError] = React.useState<string>();
  const [isUploading, setUploading] = React.useState(false);
  const [isReadingFile, setIsReadingFile] = React.useState(false);

  const accepted = isUSCitizen && backgroundCheck && securityTraining;
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
                By checking the following boxes, you are agreeing to the requirements for accessing
                the FedRAMP Red Hat OpenShift on AWS (ROSA) GovCloud instance.
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
          <StackItem>
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
                Read the document and attest to the requirements by signing and uploading it to the
                designated area below.
              </Text>
            </TextContent>
          </StackItem>
          <StackItem>
            <FileUpload
              id="doc-upload"
              value={fileUpload}
              filename={fileUpload?.name}
              filenamePlaceholder="Drag and drop a file or upload one"
              dropzoneProps={{
                accept: '.pdf',
                maxSize: maxFileSize,
                onDropRejected: () => {
                  setFileReadError(`File must be pdf and has ${maxFileSizeHumanized} Mb or less.`);
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
                isDisabled={!accepted || isUploading || !!fileReadError || !fileUpload}
                onClick={async () => {
                  if (fileUpload) {
                    setUploading(true);
                    setUploadError(undefined);
                    try {
                      await fedrampService.createIncident(fileUpload, {
                        isUSCitizen,
                        backgroundCheck,
                        securityTraining,
                      });
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
