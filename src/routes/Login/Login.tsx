import { Box, Button, FormControl, FormLabel, Heading, Link, Input, Text } from '@chakra-ui/react';
import { useEffect, FC } from 'react';

import { useFormState as useActionState } from 'react-dom';
import { pb } from '../../lib/pocketbase';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
import { AppState, useStore } from '../../lib/store';
import { ErrorResponse, ExtendedUser } from '../../types/Auth';
import SubmitButton from '../../components/UI/SubmitButton/SubmitButton';
type PrevState = {
  message: string | null;
};
const Login: FC = () => {
  const navigate = useNavigate();
  const user = useStore((state: AppState) => state.user);

  const setUser = useStore((state: AppState) => state.setUser);
  const loginAction = async (_prevState: PrevState, formData: FormData) => {
    try {
      const email = formData.get('email');
      const password = formData.get('password');
      await pb.collection('users').authWithPassword(email as string, password as string);
      if (pb.authStore.isValid) {
        setUser(pb.authStore.model as ExtendedUser);
        navigate('/');
      }
    } catch (err: unknown) {
      const errorResponse = err as ErrorResponse;
      if (errorResponse.status === 400) {
        return { message: 'Invalid Credentials' };
      } else {
        return { message: 'Something went wrong, please try again' };
      }
    }
  };

  useEffect(() => {
    if (user !== null) {
      navigate('/');
    }
  }, [user, navigate]);

  /* Temporary use of any for loginAction - subject to change */
  const [state, formAction] = useActionState(loginAction as any, {
    message: null,
  });
  const signInWithGithub = async () => {
    const user = await pb.collection('users').authWithOAuth2({ provider: 'github' });
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
      flexDirection='row'
    >
      <Box
        action={formAction}
        as='form'
        width='400px'
        px='20px'
        display='flex'
        bgColor='#060608'
        // border='2px solid #191b1c'
        boxShadow='md'
        alignItems='start'
        justifyContent='center'
        py='10px'
        gap='20px'
        minH='400px'
        rounded='sm'
        flexDirection='column'
      >
        <Heading fontWeight='bold' alignSelf='center' fontSize='2xl' bgColor='transparent' color='white' py='15px'>
          Login
        </Heading>
        <FormControl bgColor='transparent'>
          <FormLabel bgColor='transparent' color='white'>
            E-mail
          </FormLabel>
          <Input
            name='email'
            type='email'
            color='white'
            bgColor='#1b1b1d'
            fontSize='sm'
            py='23px'
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
            color='white'
            bgColor='#1b1b1d'
            py='23px'
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

        {state.message !== null && (
          <Text borderBottomColor='red.500' borderBottomWidth='2px' bgColor='transparent' color='white'>
            {state.message}
          </Text>
        )}
        <Box
          width='100%'
          display='flex'
          alignItems='center'
          justifyContent='center'
          flexDirection='column'
          flexWrap='wrap'
          bgColor='transparent'
          gap='15px'
        >
          <SubmitButton fullWidth />
          {/* <p style={{ color: 'white', fontSize: '12px' }}>OR</p> */}

          <Button
            type='button'
            onClick={signInWithGithub}
            width='100%'
            fontWeight='normal'
            bgColor='#141415'
            color='white'
            py='22px'
            flexGrow='1'
            _hover={{
              bgColor: 'white',
              color: 'black',
            }}
          >
            Continue with Github
          </Button>
        </Box>

        <Box
          width='100%'
          display='flex'
          alignItems='center'
          py='5px'
          justifyContent='center'
          flexDirection='row'
          backgroundColor='transparent'
          color='white'
          flexWrap='wrap'
        >
          <Text textAlign='center' backgroundColor='transparent' fontSize='sm' py='5px'>
            Don&apos;t have an account?{' '}
            <Link colorScheme='secondaryRed' color='red.500' as={RouterLink} to='/signup'>
              Register
            </Link>
          </Text>
        </Box>
      </Box>
    </Box>
  );
};

export default Login;
