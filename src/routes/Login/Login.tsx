import { Box, Button, FormControl, FormLabel, Heading, Input, Spinner, Text } from '@chakra-ui/react';
import { useState, useEffect, FormEvent, FC, startTransition } from 'react';
import { pb } from '../../lib/pocketbase';
import { useNavigate } from 'react-router-dom';
import { AppState, useStore } from '../../lib/store';
import { ErrorResponse, ExtendedUser } from '../../types/Auth';
import useForm from '../../hooks/useForm';

const Login: FC = () => {
  const navigate = useNavigate();
  const user = useStore((state: AppState) => state.user);
  const setUser = useStore((state: AppState) => state.setUser);
  const { values, handleChange } = useForm({
    email: '',
    password: '',
    age: '',
  });
  const [error, setError] = useState<string>('');
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const handleAuthLogin = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      setIsSubmitting(true);

      if (values.email !== '' || values.password !== '') {
        await pb.collection('users').authWithPassword(values.email, values.password);
        if (pb.authStore.isValid) {
          setUser(pb.authStore.model as ExtendedUser);
          navigate('/');
          startTransition(() => {
            setError('');
            setIsSubmitting(false);
          });
        }
      }
    } catch (err: unknown) {
      setIsSubmitting(false);
      const errorResponse = err as ErrorResponse;
      if (errorResponse.status === 400) {
        setError('Invalid Credentials');
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

  const signInWithGithub = async () => {
    const user = await pb.collection('users').authWithOAuth2({ provider: 'github' });
    console.log(user, 'USER');
    await pb.collection('users').update(pb?.authStore?.model?.id as string, {
      avatar: user?.meta?.avatarUrl,
    });

    setUser(pb.authStore.model as ExtendedUser);
  };

  return (
    <Box
      width='100%'
      as='section'
      minH='80vh'
      display='flex'
      alignItems='center'
      justifyContent='center'
      flexWrap='wrap'
      flexDirection='column'
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
        <Heading fontWeight='bold' alignSelf='center' fontSize='2xl' bgColor='transparent' color='white' py='10px'>
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
            fontSize='sm'
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
            fontSize='sm'
            _placeholder={{ opacity: 1, color: 'gray.300' }}
            border='transparent'
            type='password'
            autoComplete='on'
            minLength={8}
            placeholder='Enter your Password'
            required
          />
        </FormControl>
        <Text fontSize='xs' color='gray.300' bgColor='transparent'>
          Forgot password?
        </Text>

        {error !== '' && (
          <Text borderBottomColor='red.500' borderBottomWidth='2px' bgColor='transparent' color='white'>
            {error}
          </Text>
        )}
        {isSubmitting ? (
          <Button type='button' disabled={true} width='100%' fontWeight='normal' colorScheme='red'>
            <Spinner size='sm' mr={4} color='white' bgColor='transparent' /> Submitting
          </Button>
        ) : (
          <Button type='submit' width='100%' fontWeight='normal' colorScheme='red'>
            Submit
          </Button>
        )}

        <Box
          width='100%'
          display='flex'
          alignItems='center'
          justifyContent='space-between'
          flexDirection='row'
          flexWrap='wrap'
          bgColor='transparent'
          gap='10px'
        >
          <Button
            type='button'
            onClick={signInWithGithub}
            mb='5'
            width='auto'
            fontWeight='normal'
            bgColor='#171717'
            color='white'
            flexGrow='1'
            border='1px'
            borderStyle='solid'
            borderColor='#333'
            _hover={{
              bgColor: 'white',
              color: 'black',
            }}
          >
            Continue with Github
          </Button>
        </Box>
      </Box>
    </Box>
  );
};

export default Login;
