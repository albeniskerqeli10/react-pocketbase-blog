import { Button, Flex, Heading } from '@chakra-ui/react';

const ErrorPage = () => {
  return (
    <Flex
      width='100%'
      minHeight='90vh'
      display='flex'
      alignItems='center'
      justifyContent='center'
      flexDirection='column'
      margin='0 auto'
      flexWrap='wrap'
      gap='20px'
    >
      <Heading bgColor='transparent' color='white'>
        404 Not Found
      </Heading>
      <Button onClick={() => history.back()} colorScheme='red' size='lg'>
        Go Back
      </Button>
    </Flex>
  );
};

export default ErrorPage;
