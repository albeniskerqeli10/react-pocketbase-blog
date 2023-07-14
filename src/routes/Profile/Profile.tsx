import { Box, Heading, Image, Text } from '@chakra-ui/react';
import { pb } from '../../lib/pocketbase';
import { useEffect, Suspense, lazy, useState } from 'react';
import { BlogType } from '../../types/Blog';
import TimeAgo from 'timeago-react';
import Spinner from '../../components/Spinner/Spinner';
import { useStore, AppState } from '../../lib/store';
import { ExtendedUser } from '../../types/Auth';
const Blog = lazy(() => import('../../components/Blog/Blog'));
const Profile = () => {
  const currentUser = useStore((state: AppState) => state.user);
  const [user, setUser] = useState<ExtendedUser>({} as ExtendedUser);
  useEffect(() => {
    const getUser = async () => {
      const userProfile = await pb.collection('users').getOne(currentUser?.id as string, {
        expand: 'blogs(user)',
      });
      if (userProfile) {
        setUser(userProfile);
      }
    };
    getUser();
  }, [currentUser]);

  useEffect;
  return (
    Object.keys(user).length > 0 && (
      <Box
        width='600px'
        maxWidth='calc(100% - 10%)'
        py='10px'
        display='flex'
        alignItems='center'
        justifyContent='center'
        flexDirection='column'
        flexWrap='wrap'
      >
        <Box
          width='100%'
          boxShadow='lg'
          px='20px'
          display='flex'
          gap='20px'
          py='30px'
          my='20px'
          alignItems='center'
          justifyContent='start'
          flexWrap='wrap'
          bgColor='black'
          flexDirection='row'
        >
          <Image src={user.avatar} alt='user avatar' rounded='sm' width='70px' height='70px' />

          <Box
            bgColor='transparent'
            display='flex'
            alignItems='start'
            justifyContent='center'
            gap='10px'
            flexDirection='column'
            flexWrap='wrap'
          >
            <Heading bgColor='transparent' color='white'>
              {user.username}
            </Heading>
            <Text fontSize='14px' color='gray.300' bgColor='transparent'>
              You joined{' '}
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
        {user?.expand?.['blogs(user)']?.length > 0 ? (
          <>
            <Heading as='h2' my='20px' py='10px' color='white' bgColor='transparent'>
              Blogs
            </Heading>
            <Box
              width='100%'
              display='flex'
              alignItems='center'
              justifyContent='center'
              flexDirection='column'
              gap='20px'
              flexWrap='wrap'
            >
              <Suspense fallback={<Spinner />}>
                {user?.expand?.['blogs(user)']?.map((blog: BlogType) => (
                  <Blog
                    key={blog.id}
                    id={blog.id}
                    width='100%'
                    title={blog.title}
                    image={blog.image}
                    content={blog.content}
                    avatar={user.avatar}
                    username={user.username}
                    likes={blog.likes}
                  />
                ))}
              </Suspense>
            </Box>
          </>
        ) : (
          <Heading py='30px' color='white' bgColor='transparent'>
            No Blogs Yet
          </Heading>
        )}
      </Box>
    )
  );
};

export default Profile;