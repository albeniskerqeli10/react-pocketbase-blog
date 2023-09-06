import { experimental_useFormStatus as useFormStatus } from 'react-dom';
import { Button, Spinner } from '@chakra-ui/react';

type SubmitButtonProps = {
  size?: 'sm' | 'md' | 'lg';
  fullWidth?: boolean;
};

const SubmitButton = ({ size, fullWidth }: SubmitButtonProps) => {
  const { pending } = useFormStatus();
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
