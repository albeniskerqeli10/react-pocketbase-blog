import { useFormStatus } from 'react-dom';
import { Button, Spinner } from '@chakra-ui/react';
import { useEffect } from 'react';
type SubmitButtonProps = {
  size?: 'sm' | 'md' | 'lg';
  fullWidth?: boolean;
};

const SubmitButton = ({ size, fullWidth }: SubmitButtonProps) => {
  const { pending } = useFormStatus();
  useEffect(() => {
    if (!pending) {
      const form = document.querySelector('form');
      form?.reset();
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
      colorScheme='secondaryRed'
      py='22px'
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
