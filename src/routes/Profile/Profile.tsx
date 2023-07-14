import { Box, Image, Text } from '@chakra-ui/react';
import { useStore, AppState } from '../../lib/store';

const Profile = () => {
  const user = useStore((state: AppState) => state.user);

  return (
    user && (
      <Box
        bgColor='black'
        width='100%'
        display='flex'
        alignItems='center'
        justifyContent='start'
        flexWrap='wrap'
        gap='20px'
        flexDirection='column'
        marginY='100px'
        height='300px'
      >
        <Image
          borderRadius='full'
          src={user.avatar}
          zIndex='1000'
          marginTop='-50px'
          alt='user avatar'
          width='100px'
          height='100px'
        />
        <Box
          display='flex'
          alignItems='center'
          justifyContent='center'
          flexWrap='wrap'
          flexDirection='column'
          marginTop='40px'
          bgColor='transparent'
        >
          <Text bgColor='transparent' color='white' fontSize='xl'>
            {user.username}
          </Text>
          <Text bgColor='transparent' color='white' fontSize='xl'>
            {user.email}
          </Text>
        </Box>
      </Box>
    )
  );
};

export default Profile;
