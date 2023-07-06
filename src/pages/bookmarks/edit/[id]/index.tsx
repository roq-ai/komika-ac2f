import AppLayout from 'layout/app-layout';
import React, { useState } from 'react';
import {
  FormControl,
  FormLabel,
  Input,
  Button,
  Text,
  Box,
  Spinner,
  FormErrorMessage,
  Switch,
  NumberInputStepper,
  NumberDecrementStepper,
  NumberInputField,
  NumberIncrementStepper,
  NumberInput,
  Center,
} from '@chakra-ui/react';
import * as yup from 'yup';
import DatePicker from 'react-datepicker';
import { FiEdit3 } from 'react-icons/fi';
import { useFormik, FormikHelpers } from 'formik';
import { getBookmarkById, updateBookmarkById } from 'apiSdk/bookmarks';
import { Error } from 'components/error';
import { bookmarkValidationSchema } from 'validationSchema/bookmarks';
import { BookmarkInterface } from 'interfaces/bookmark';
import useSWR from 'swr';
import { useRouter } from 'next/router';
import { AsyncSelect } from 'components/async-select';
import { ArrayFormField } from 'components/array-form-field';
import { AccessOperationEnum, AccessServiceEnum, requireNextAuth, withAuthorization } from '@roq/nextjs';
import { compose } from 'lib/compose';
import { MangaInterface } from 'interfaces/manga';
import { UserInterface } from 'interfaces/user';
import { getManga } from 'apiSdk/manga';
import { getUsers } from 'apiSdk/users';

function BookmarkEditPage() {
  const router = useRouter();
  const id = router.query.id as string;
  const { data, error, isLoading, mutate } = useSWR<BookmarkInterface>(
    () => (id ? `/bookmarks/${id}` : null),
    () => getBookmarkById(id),
  );
  const [formError, setFormError] = useState(null);

  const handleSubmit = async (values: BookmarkInterface, { resetForm }: FormikHelpers<any>) => {
    setFormError(null);
    try {
      const updated = await updateBookmarkById(id, values);
      mutate(updated);
      resetForm();
      router.push('/bookmarks');
    } catch (error) {
      setFormError(error);
    }
  };

  const formik = useFormik<BookmarkInterface>({
    initialValues: data,
    validationSchema: bookmarkValidationSchema,
    onSubmit: handleSubmit,
    enableReinitialize: true,
    validateOnChange: false,
    validateOnBlur: false,
  });

  return (
    <AppLayout>
      <Box bg="white" p={4} rounded="md" shadow="md">
        <Box mb={4}>
          <Text as="h1" fontSize="2xl" fontWeight="bold">
            Edit Bookmark
          </Text>
        </Box>
        {error && (
          <Box mb={4}>
            <Error error={error} />
          </Box>
        )}
        {formError && (
          <Box mb={4}>
            <Error error={formError} />
          </Box>
        )}
        {isLoading || (!formik.values && !error) ? (
          <Center>
            <Spinner />
          </Center>
        ) : (
          <form onSubmit={formik.handleSubmit}>
            <FormControl id="page_number" mb="4" isInvalid={!!formik.errors?.page_number}>
              <FormLabel>Page Number</FormLabel>
              <NumberInput
                name="page_number"
                value={formik.values?.page_number}
                onChange={(valueString, valueNumber) =>
                  formik.setFieldValue('page_number', Number.isNaN(valueNumber) ? 0 : valueNumber)
                }
              >
                <NumberInputField />
                <NumberInputStepper>
                  <NumberIncrementStepper />
                  <NumberDecrementStepper />
                </NumberInputStepper>
              </NumberInput>
              {formik.errors.page_number && <FormErrorMessage>{formik.errors?.page_number}</FormErrorMessage>}
            </FormControl>
            <AsyncSelect<MangaInterface>
              formik={formik}
              name={'manga_id'}
              label={'Select Manga'}
              placeholder={'Select Manga'}
              fetcher={getManga}
              renderOption={(record) => (
                <option key={record.id} value={record.id}>
                  {record?.title}
                </option>
              )}
            />
            <AsyncSelect<UserInterface>
              formik={formik}
              name={'user_id'}
              label={'Select User'}
              placeholder={'Select User'}
              fetcher={getUsers}
              renderOption={(record) => (
                <option key={record.id} value={record.id}>
                  {record?.email}
                </option>
              )}
            />
            <Button isDisabled={formik?.isSubmitting} colorScheme="blue" type="submit" mr="4">
              Submit
            </Button>
          </form>
        )}
      </Box>
    </AppLayout>
  );
}

export default compose(
  requireNextAuth({
    redirectTo: '/',
  }),
  withAuthorization({
    service: AccessServiceEnum.PROJECT,
    entity: 'bookmark',
    operation: AccessOperationEnum.UPDATE,
  }),
)(BookmarkEditPage);
