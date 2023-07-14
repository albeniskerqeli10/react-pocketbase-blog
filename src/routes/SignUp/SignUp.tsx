import { Box, Button, Flex, FormControl, FormLabel, Heading, Text, Input } from '@chakra-ui/react';
import { useState, useEffect, FC, FormEvent, startTransition } from 'react';
import { pb } from '../../lib/pocketbase';
import { useNavigate } from 'react-router-dom';
import { AppState, useStore } from '../../lib/store';
import { ErrorResponse, ExtendedUser, SignUpFormValues } from '../../types/Auth';
import useForm from '../../hooks/useForm';
const SignUp: FC = () => {
  const navigate = useNavigate();
  const user = useStore((state: AppState) => state.user);
  const setUser = useStore((state: AppState) => state.setUser);
  const { values, handleChange, resetForm } = useForm<SignUpFormValues>({
    email: '',
    username: '',
    password: '',
  });

  const [error, setError] = useState('');
  const { email, username, password } = values;

  const handleAuth = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      if (email !== '' || username !== '' || password !== '') {
        await pb.collection('users').create({
          username: username,
          email: email,
          password: password,
          passwordConfirm: password,
          avatar: `${`https://avatar.oxro.io/avatar.svg?name=${username.toUpperCase()}`}`,
          emailVisibility: true,
        });
        await pb.collection('users').authWithPassword(email, password);
        const authSignIn = await pb.collection('user').authWithPassword(email, password);
        if (authSignIn) {
          startTransition(() => {
            setUser(pb.authStore.model as ExtendedUser);
            navigate('/');
          });
          setError('');
          resetForm();
        }
      }
    } catch (err: unknown) {
      const errorResponse = err as ErrorResponse;

      if (errorResponse.status === 400) {
        setError('Email or username already exists');
      } else {
        setError('Something went wrong, please try again');
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
        onSubmit={handleAuth}
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
        minH='450px'
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
          Sign Up
        </Heading>

        <FormControl bgColor='transparent'>
          <FormLabel bgColor='transparent' color='white'>
            E-mail
          </FormLabel>
          <Input
            name='email'
            onChange={handleChange}
            type='email'
            value={values.email || ''}
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
            Username
          </FormLabel>
          <Input
            name='username'
            onChange={handleChange}
            type='text'
            value={values.username || ''}
            color='white'
            bgColor='#1b1b1d'
            py='25px'
            _placeholder={{ opacity: 1, color: 'gray.300' }}
            border='transparent'
            placeholder='Enter your Username'
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
            value={values.password || ''}
            color='white'
            minLength={8}
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
        {error && (
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

export default SignUp;
