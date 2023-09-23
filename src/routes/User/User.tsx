import { Box, Heading, Image, Text, Spinner } from '@chakra-ui/react';
import { pb } from '../../lib/pocketbase';

import { useEffect, Suspense, lazy, FC, use, cache } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ExtendedUser } from '../../types/Auth';
import { BlogType } from '../../types/Blog';
import TimeAgo from 'timeago-react';
const Blog = lazy(() => import('../../components/Blog/Blog'));

const getUser = cache(async (id: string) => {
  const user = await pb.collection('users').getOne(id as string, {
    expand: 'blogs(user)',
  });
  return user;
});

const User: FC = () => {
  const { id } = useParams();
  getUser(id as string);
  const user: ExtendedUser = use(getUser(id as string));
  const navigate = useNavigate();
  useEffect(() => {
    if (!user?.id) {
      navigate('/');
    }
  }, [user, navigate]);
  return (
    user.id && (
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
        <title> {user.username} | PocketBlog</title>
        <Box
          width='100%'
          as='section'
          boxShadow='md'
          px='20px'
          display='flex'
          gap='20px'
          py='30px'
          my='20px'
          alignItems='center'
          justifyContent='start'
          bgColor='#0c0c0e'
          flexDirection='row'
          flexWrap='wrap'
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
              Joined{' '}
              <TimeAgo
                style={{
                  backgroundColor: 'transparent',
                  color: 'inherit',
                }}
                datetime={user.created}
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
              <Suspense fallback={<Spinner colorScheme='white' color='white' />}>
                {user?.expand?.['blogs(user)']?.map((blog: BlogType) => (
                  <Blog
                    key={blog.id}
                    id={blog.id}
                    width='100%'
                    title={blog.title}
                    user={blog.user}
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
            No blogs yet
          </Heading>
        )}
      </Box>
    )
  );
};

export default User;
