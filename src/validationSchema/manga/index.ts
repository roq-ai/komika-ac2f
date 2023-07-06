import * as yup from 'yup';

export const mangaValidationSchema = yup.object().shape({
  title: yup.string().required(),
  organization_id: yup.string().nullable(),
});
