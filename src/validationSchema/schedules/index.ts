import * as yup from 'yup';

export const scheduleValidationSchema = yup.object().shape({
  reading_time: yup.date().required(),
  manga_id: yup.string().nullable(),
  user_id: yup.string().nullable(),
});
