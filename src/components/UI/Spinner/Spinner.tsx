import { Flex, Spinner as ChakraSpinner } from '@chakra-ui/react';
import { FC } from 'react';
const Spinner: FC = () => {
  return (
    <Flex
      width='100%'
      height='80vh'
      alignItems='center'
      justifyContent='center'
      flexDirection='column'
    >
      <ChakraSpinner color='white' />
    </Flex>
  );
};

export default Spinner;
