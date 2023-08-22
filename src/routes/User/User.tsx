import { Box, Heading, Image, Text, Spinner } from '@chakra-ui/react';
import { pb } from '../../lib/pocketbase';
import { useEffect, useState, Suspense, lazy, FC } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ErrorResponse, ExtendedUser } from '../../types/Auth';
import { BlogType } from '../../types/Blog';
import TimeAgo from 'timeago-react';
import { Helmet } from 'react-helmet';
const Blog = lazy(() => import('../../components/Blog/Blog'));
const User: FC = () => {
  const { id } = useParams();
  const [user, setUser] = useState<ExtendedUser>({} as ExtendedUser);
  const navigate = useNavigate();
  useEffect(() => {
    const getUser = async () => {
      try {
        const user = await pb.collection('users').getOne(id as string, {
          expand: 'blogs(user)',
        });
        if (user) {
          setUser(user);
        }
      } catch (err: unknown) {
        const errorResponse = err as ErrorResponse;
        if (errorResponse.status === 404) {
          navigate('/');
        }
      }
    };
    getUser();
  }, [id, navigate]);

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
        <Helmet>
          <title> {user.username} | PocketBlog</title>
        </Helmet>
        <Box
          width='100%'
          as="section"
          boxShadow='lg'
          px='20px'
          display='flex'
          gap='20px'
          py='30px'
          my='20px'
          alignItems='center'
          justifyContent='start'
          bgColor='black'
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
            No Blogs Yet
          </Heading>
        )}
      </Box>
    )
  );
};

export default User;
