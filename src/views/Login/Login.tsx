import { Box, Button, Flex, FormControl, FormLabel, Heading, Input, Text } from '@chakra-ui/react';
import { useState, useEffect, ChangeEvent, FormEvent, FC, startTransition } from 'react';
import { pb } from '../../lib/pocketbase';
import { useNavigate } from 'react-router-dom';
import { AppState, useStore } from '../../lib/store';
import { ErrorResponse, ExtendedUser, LoginFormValues } from '../../types/Auth';
const Login: FC = () => {
  const navigate = useNavigate();
  const user = useStore((state: AppState) => state.user);
  const setUser = useStore((state: AppState) => state.setUser);
  const [formInputValues, setFormInputValues] = useState<LoginFormValues>({
    email: '',
    password: '',
  });

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    setFormInputValues({
      ...formInputValues,
      [e.target.name]: e.target.value,
    });
  };

  const [error, setError] = useState<string>('');
  const handleAuthLogin = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      if (formInputValues.email !== '' || formInputValues.password !== '') {
        await pb
          .collection('users')
          .authWithPassword(formInputValues.email, formInputValues.password);
        if (pb.authStore.isValid) {
          startTransition(() => {
            setUser(pb.authStore.model as ExtendedUser);
            navigate('/');
          });
        }
      }
    } catch (err: unknown) {
      const errorResponse = err as ErrorResponse;
      if (errorResponse.status === 400) {
        setError('Invalid E-mail or Password');
      } else {
        setError('Something went wrong, please try again later');
      }
    }
  };

  useEffect(() => {
    if (user !== null) {
      navigate('/');
    }
  }, [user, navigate]);

  return (
    <Flex
      width='100%'
      minH='80vh'
      alignItems='center'
      justifyContent='center'
      flexWrap='wrap'
      flexDirection='row'
    >
      <Box
        onSubmit={handleAuthLogin}
        as='form'
        width='400px'
        px='20px'
        display='flex'
        bgColor='black'
        boxShadow='lg'
        alignItems='start'
        justifyContent='center'
        py='10px'
        gap='20px'
        minH='400px'
        flexDirection='column'
      >
        <Heading
          fontWeight='bold'
          alignSelf='center'
          fontSize='2xl'
          bgColor='transparent'
          color='white'
          py='5px'
        >
          Login
        </Heading>
        <FormControl bgColor='transparent'>
          <FormLabel bgColor='transparent' color='white'>
            E-mail
          </FormLabel>
          <Input
            name='email'
            onChange={handleChange}
            type='email'
            color='white'
            bgColor='#1b1b1d'
            py='25px'
            _placeholder={{ opacity: 1, color: 'gray.300' }}
            border='transparent'
            placeholder='Enter your E-mail Address'
            required
          />
        </FormControl>
        <FormControl bgColor='transparent'>
          <FormLabel bgColor='transparent' color='white'>
            Password
          </FormLabel>
          <Input
            name='password'
            onChange={handleChange}
            color='white'
            bgColor='#1b1b1d'
            py='25px'
            _placeholder={{ opacity: 1, color: 'gray.300' }}
            border='transparent'
            type='password'
            autoComplete='on'
            placeholder='Enter your Password'
            required
          />
        </FormControl>
        <Text fontSize='xs' color='gray.300' bgColor='transparent'>
          Forgot password?
        </Text>
        {error !== '' && (
          <Text
            borderBottomColor='red.500'
            borderBottomWidth='2px'
            bgColor='transparent'
            color='white'
          >
            {error}
          </Text>
        )}
        <Button type='submit' width='100%' fontWeight='normal' colorScheme='red'>
          Submit
        </Button>
      </Box>
    </Flex>
  );
};

export default Login;
