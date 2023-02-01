import { FormikErrors, FormikValues } from 'formik';

export const getScrollErrorIds = (errors: FormikErrors<FormikValues>) =>
  Object.entries(errors).reduce((acc: string[], [fieldName, value]) => {
    // If the error value is an array, accumulate IDs based on Formik's
    // FieldArray format, which is an array of objects with key/value pairs.
    if (Array.isArray(value)) {
      value.forEach((field, index) => {
        Object.keys(field || {}).forEach((fieldKey) => {
          acc.push(`${fieldName}.${index}.${fieldKey}`);
        });
      });
    } else {
      acc.push(fieldName);
    }

    return acc;
  }, []);
