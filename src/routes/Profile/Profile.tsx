import { Box, Heading, IconButton, Image, Text, Spinner } from '@chakra-ui/react';
import { pb } from '../../lib/pocketbase';
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
/* @ts-ignore*/
import { cache, Suspense, lazy, useState, use, FormEvent, startTransition, FC } from 'react';
import { BlogType } from '../../types/Blog';
import TimeAgo from 'timeago-react';
import { useStore, AppState } from '../../lib/store';
import { ExtendedUser } from '../../types/Auth';
import { Pencil } from '@phosphor-icons/react';
import EditUserProfileModal from '../../components/modals/EditUserProfileModal/EditUserProfileModal';
import useForm from '../../hooks/useForm';
import { Helmet } from 'react-helmet';
const Blog = lazy(() => import('../../components/Blog/Blog'));
const getUser = cache(async (id: string) => {
  const userProfile = await pb.collection('users').getOne(id as string, {
    expand: 'user, blogs(user)',
  });
  return userProfile;
});
getUser();
const Profile: FC = () => {
  const currentUser = useStore((state: AppState) => state.user);

  const userPromise = use(getUser(currentUser?.id));
  const [user, setUser] = useState<ExtendedUser>(userPromise as ExtendedUser);
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const { values, handleChange, resetForm } = useForm({
    username: '',
    email: '',
    avatar: '',
  });

  const handleEditProfile = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      const updatedProfile = await pb.collection('users').update(
        user.id as string,
        {
          email: values.email !== '' ? values.email : user.email,
          username: values.username !== '' ? values.username : user.username,
          avatar: values.avatar !== '' ? values.avatar : user.avatar,
        },
        {
          expand: 'blogs(user)',
        },
      );
      setUser(updatedProfile);
      setIsOpen(false);
      startTransition(() => {
        resetForm();
      });
    } catch (err) {
      alert('Something went wrong, try again');
    }
  };

  return (
    Object.keys(user).length > 0 && (
      <Box
        width='600px'
        as='section'
        maxWidth='calc(100% - 10%)'
        py='10px'
        display='flex'
        alignItems='center'
        justifyContent='center'
        flexDirection='column'
        flexWrap='wrap'
      >
        <Helmet>
          <title> Profile | MicroBlog</title>
        </Helmet>
        <Box
          width='100%'
          boxShadow='lg'
          px='20px'
          display='flex'
          gap='20px'
          py='30px'
          my='20px'
          alignItems='center'
          justifyContent='space-between'
          flexWrap='wrap'
          bgColor='black'
          flexDirection='row'
        >
          <Box
            flexDirection='row'
            display='flex'
            alignItems='center'
            bgColor='transparent'
            justifyContent='center'
            gap='20px'
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
          <IconButton
            onClick={() => setIsOpen(true)}
            bgColor='transparent'
            aria-label='edit profile'
            _hover={{
              border: '0',
              bgColor: 'blue.500',
            }}
            _active={{
              bgColor: 'transparent',
            }}
            icon={
              <Pencil
                style={{
                  backgroundColor: 'transparent',
                }}
                fontSize='30'
                color='white'
              />
            }
          />
        </Box>
        {isOpen && (
          <EditUserProfileModal
            isOpen={isOpen}
            onClose={() => setIsOpen(false)}
            handleChange={handleChange}
            handleSubmit={handleEditProfile}
          />
        )}
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
                    image={blog.image}
                    content={blog.content}
                    user={blog.user}
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
