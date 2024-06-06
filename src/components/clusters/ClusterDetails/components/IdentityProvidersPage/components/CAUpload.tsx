import React from 'react';
import { WrappedFieldInputProps } from 'redux-form';

import {
  Button,
  FormGroup,
  InputGroup,
  InputGroupItem,
  TextArea,
  TextInput,
} from '@patternfly/react-core';

import { humanizeValueWithoutUnit } from '~/common/units';
import { FormGroupHelperText } from '~/components/common/FormGroupHelperText';

import './CAUpload.scss';

export const MAX_FILE_SIZE = 4000000; // 4MB
export const ACCEPT =
  '.pem,.crt,.ca,.cert,application/x-pem-file,application/x-x509-ca-cert,text/plain';

export type CAUploadProps = {
  label: string;
  helpText?: string;
  isDisabled?: boolean;
  input: WrappedFieldInputProps;
  isRequired?: boolean;
  certValue?: string;
  maxFileSize?: number;
};

const CAUpload = ({
  label,
  helpText = '',
  isDisabled,
  input,
  isRequired = false,
  certValue,
  maxFileSize = MAX_FILE_SIZE,
}: CAUploadProps) => {
  const baseButtonClass = 'pf-v5-c-button pf-m-tertiary co-btn-file';

  const [fileName, setFileName] = React.useState('');
  const [errorMessage, setErrorMessage] = React.useState('');
  const [certValueState, setCertValueState] = React.useState<string | ArrayBuffer | null>('');
  const [showCAText, setShowCAText] = React.useState(false);
  const [buttonClass, setButtonClass] = React.useState(baseButtonClass);
  const [shouldShowCAText, setShouldShowCAText] = React.useState(false);

  React.useEffect(() => {
    if (certValue && certValue !== '') {
      setCertValueState(certValue);
      setShowCAText(true);
    }
  }, [certValue]);

  React.useEffect(() => {
    setButtonClass(isDisabled ? `${baseButtonClass} pf-m-disabled` : baseButtonClass);
  }, [isDisabled]);

  React.useEffect(() => {
    setShouldShowCAText(!isDisabled && certValueState !== '' && showCAText);
  }, [isDisabled, certValueState, showCAText]);

  const fileUpload = (event: React.FormEvent<HTMLInputElement>) => {
    const file = (event.target as HTMLInputElement).files?.[0];
    if (file) {
      if (file.size > maxFileSize) {
        setErrorMessage(
          `Maximum file size exceeded. File size limit is ${humanizeValueWithoutUnit(maxFileSize)}`,
        );
      } else {
        const reader = new FileReader();
        reader.onload = () => {
          setFileName(file.name);
          setErrorMessage('');
          setCertValueState(reader.result);
          setShowCAText(true);
          input.onChange(reader.result);
        };
        reader.readAsText(file, 'UTF-8');
      }
    }
  };

  // This method updates the value to space if the user removes the CA value
  // When the user clears the CA value redux form removes the field from value
  // state and in order to differentiate whether the user did not have the value or
  // whether they cleared it in the edit screen we store ' '(space) in the value and
  // trim it when sending it to backend
  const updateCertificateValue = (value: string | ArrayBuffer | null) => {
    input.onChange(value || ' ');
    setFileName('');
    setCertValueState(value);
  };

  const revealValue = (status: boolean) => setShowCAText(status);

  return (
    <FormGroup
      className="ca-upload"
      fieldId={input.name}
      label={label}
      isRequired={isRequired}
      data-testid="ca-upload-form"
    >
      <InputGroup>
        <InputGroupItem isFill>
          <TextInput
            value={fileName}
            isRequired={isRequired}
            id={input.name}
            name={input.name}
            readOnlyVariant="default"
          />
        </InputGroupItem>
        <InputGroupItem>
          <span className={buttonClass}>
            <input
              type="file"
              name="file_input"
              onChange={fileUpload}
              disabled={isDisabled}
              accept={ACCEPT}
              data-testid="ca-upload-input-file"
            />
            Browse&hellip;
          </span>
        </InputGroupItem>
      </InputGroup>

      {shouldShowCAText ? (
        <>
          <Button variant="link" onClick={() => revealValue(false)}>
            Hide
          </Button>

          <TextArea
            value={certValueState as any}
            id={`${input.name}_text`}
            name={`${input.name}_text`}
            onChange={(_event, value) => updateCertificateValue(value)}
            className="ca-textarea"
          />
        </>
      ) : (
        <Button
          variant="link"
          onClick={() => revealValue(true)}
          isDisabled={certValueState === '' || isDisabled}
        >
          Reveal
        </Button>
      )}

      <FormGroupHelperText touched error={errorMessage}>
        {helpText}
      </FormGroupHelperText>
    </FormGroup>
  );
};

export default CAUpload;
