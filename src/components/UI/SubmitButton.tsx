import { experimental_useFormStatus as useFormStatus } from 'react-dom';
import { Button, Spinner } from '@chakra-ui/react';
const SubmitButton = () => {
  const { pending } = useFormStatus();
  return (
    <Button type='submit' px='20px' isDisabled={pending} fontWeight='normal' colorScheme='red'>
      {pending ? (
        <>
          <Spinner size='sm' color='white' mr={4} bgColor='transparent' /> Submitting
        </>
      ) : (
        'Submit'
      )}
    </Button>
  );
};

export default SubmitButton;
