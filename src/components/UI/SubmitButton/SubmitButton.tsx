import { experimental_useFormStatus as useFormStatus } from 'react-dom';
import { Button, Spinner } from '@chakra-ui/react';
import { useEffect } from 'react';
type SubmitButtonProps = {
  size?: 'sm' | 'md' | 'lg';
  fullWidth?: boolean;
};

const SubmitButton = ({ size, fullWidth }: SubmitButtonProps) => {
  const { pending } = useFormStatus();
  console.log(pending, 'Pending');

  useEffect(() => {
    if (!pending) {
      if (document) {
        const form = document.querySelector('form');
        form?.reset();
      }
    }
  }, [pending]);
  return (
    <Button
      type='submit'
      outline='0'
      width={`${fullWidth ? '100%' : 'auto'}`}
      _focus={{
        outline: '0px',
        border: '0',
      }}
      fontWeight='normal'
      size={`${size || 'md'}`}
      px='20px'
      isDisabled={pending}
      disabled={pending}
      colorScheme='red'
    >
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
