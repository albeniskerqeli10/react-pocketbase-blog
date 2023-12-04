import { Flex, Heading, Text, Link } from '@chakra-ui/react';
import { Link as RouterLink } from 'react-router-dom';

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
      <Text color='white'>Sorry, the page you are looking for does not exist.</Text>
      <Link
        as={RouterLink}
        rounded='sm'
        replace={true}
        to='/'
        bgColor='secondaryRed.500'
        color='white'
        py='12px'
        px='14px'
        boxShadow='lg'
        _hover={{
          textDecoration: 'none',
          bgColor: '#0c0c0e',
          transition: '0.3s linear all',
        }}
      >
        GO TO HOMEPAGE
      </Link>
    </Flex>
  );
};

export default ErrorPage;
