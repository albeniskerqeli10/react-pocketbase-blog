import { ExtendedUser } from '../../types/Auth';
import { Box, Heading, Image, Text } from '@chakra-ui/react';
import { FC } from 'react';
import { Link } from 'react-router-dom';
import TimeAgo from 'timeago-react';
import { AppState, useStore } from '../../lib/store';
type UserProps = {
  user: ExtendedUser;
};

const UserCard: FC<UserProps> = ({ user }) => {
  const currentUser = useStore((state: AppState) => state.user);
  return (
    <Box
      width='100%'
      bgColor='#060608'
      maxWidth='400px'
      display='flex'
      flexDirection='row'
      alignItems='center'
      justifyContent='start'
      px='10px'
      rounded='sm'
      boxShadow='lg'
      py='20px'
      gap='14px'
    >
      <Image cursor='pointer' rounded='full' width='40px' height='40px' src={user.avatar} alt={user.username} />
      <Box bgColor='transparent' display='flex' flexDirection='column' gap='5px'>
        <Heading
          as={Link}
          to={`${currentUser?.id === user.id ? '/profile' : `../../user/${user.id}`}`}
          fontSize='md'
          _hover={{
            textDecoration: 'underline',
          }}
          bgColor='#060608'
          color='white'
        >
          {user.username}
        </Heading>
        <Text fontSize='12px' color='gray.300' bgColor='transparent'>
          Joined{' '}
          <TimeAgo
            live={false}
            style={{
              backgroundColor: 'transparent',
              color: 'inherit',
            }}
            datetime={user.created as Date}
          />
        </Text>
      </Box>
    </Box>
  );
};

export default UserCard;
