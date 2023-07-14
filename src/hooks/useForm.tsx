import { useState, ChangeEvent } from 'react';

//  type FormValues = {
// //   [key: string]: string;
// // };

// type useFormProps = {
//   formValues?: FormValues;
// };

const useForm = <T extends Record<string, string>>(formValues: T) => {
  const [values, setValues] = useState(formValues);

  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setValues((prevValues) => ({
      ...prevValues,
      [name]: value,
    }));
  };

  const resetForm = () => {
    setValues(formValues);
  };
  return { values, handleChange, resetForm };
};

export default useForm;
