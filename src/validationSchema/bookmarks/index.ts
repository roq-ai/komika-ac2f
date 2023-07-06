import * as yup from 'yup';

export const bookmarkValidationSchema = yup.object().shape({
  page_number: yup.number().integer().required(),
  manga_id: yup.string().nullable(),
  user_id: yup.string().nullable(),
});
