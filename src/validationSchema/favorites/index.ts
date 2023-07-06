import * as yup from 'yup';

export const favoriteValidationSchema = yup.object().shape({
  manga_id: yup.string().nullable(),
  user_id: yup.string().nullable(),
});
