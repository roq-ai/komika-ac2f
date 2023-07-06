import * as yup from 'yup';

export const noteValidationSchema = yup.object().shape({
  content: yup.string().required(),
  manga_id: yup.string().nullable(),
  user_id: yup.string().nullable(),
});
