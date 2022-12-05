import React from 'react';

import { FileUpload, FileUploadProps, FormGroup, FormGroupProps } from '@patternfly/react-core';
import { Field, FieldProps, FieldConfig, FieldValidator } from 'formik';

import PopoverHint from '~/components/common/PopoverHint';
import { useFormState } from '../../hooks';

interface FileUploadFieldProps {
  name: string;
  label?: string;
  validate?: FieldValidator;
  isDisabled?: boolean;
  isPassword?: boolean;
  helperText?: React.ReactNode;
  tooltip?: React.ReactNode;
  field?: FieldConfig;
  formGroup?: FormGroupProps;
  input?: Partial<FileUploadProps>;
}

export const FileUploadField = ({
  name,
  label,
  validate,
  isDisabled,
  helperText,
  tooltip,
  field,
  formGroup,
  input,
}: FileUploadFieldProps) => {
  const { setFieldValue } = useFormState();
  const [filename, setFilename] = React.useState('');

  const onChange = (value: string | File, _: string, event: React.ChangeEvent<any>) => {
    if (isHtmlInputElement(event.target) && event.target.files) {
      const [file] = event.target.files;
      const reader = new FileReader();

      reader.onload = () => {
        setFilename(file.name);
        setFieldValue(name, reader.result);
      };
      reader.readAsText(file, 'UTF-8');
    } else {
      setFieldValue(name, value);
    }
  };

  const onClearClick = () => {
    setFilename('');
    setFieldValue(name, '');
  };

  return (
    <Field name={name} validate={validate} {...field}>
      {({ field, meta }: FieldProps) => (
        <FormGroup
          fieldId={field.name}
          helperText={helperText}
          helperTextInvalid={meta.touched && meta.error}
          validated={meta.touched && meta.error ? 'error' : 'default'}
          label={label}
          {...(tooltip && { labelIcon: <PopoverHint hint={tooltip} /> })}
          {...(validate && { isRequired: true })}
          {...formGroup}
        >
          <FileUpload
            allowEditingUploadedText
            isDisabled={isDisabled}
            id={field.name}
            name={field.name}
            type="text"
            value={field.value}
            filename={filename}
            onChange={onChange}
            onClearClick={onClearClick}
            onTextAreaBlur={(event) => field.onBlur(event)}
            onFileInputChange={(_, file) => setFilename(file.name)}
            validated={meta.touched && meta.error ? 'error' : 'default'}
            {...input}
          />
        </FormGroup>
      )}
    </Field>
  );
};

function isHtmlInputElement(element: EventTarget): element is HTMLInputElement {
  return (element as HTMLInputElement).files !== undefined;
}
