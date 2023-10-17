import { Box, Heading, IconButton, Image, Text, Spinner } from '@chakra-ui/react';
import { pb } from '../../lib/pocketbase';

import {
  Suspense,
  lazy,
  useState,
  use,
  FormEvent,
  startTransition,
  FC,
  unstable_useCacheRefresh as useCacheRefresh,
} from 'react';
import { BlogType } from '../../types/Blog';
import TimeAgo from 'timeago-react';
import { useStore, AppState } from '../../lib/store';
import { ExtendedUser } from '../../types/Auth';
import { Pencil } from '@phosphor-icons/react';
import EditUserProfileModal from '../../components/modals/EditUserProfileModal/EditUserProfileModal';
import useForm from '../../hooks/useForm';
import { getUserProfile } from '../../services/authAPI';
const Blog = lazy(() => import('../../components/Blog/Blog'));
const Profile: FC = () => {
  const currentUser = useStore((state: AppState) => state.user);
  getUserProfile(currentUser?.id as string);
  const user = use(getUserProfile(currentUser?.id as string)) as ExtendedUser;
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const { values, handleChange, resetForm } = useForm({
    username: '',
    email: '',
    avatar: '',
  });
  const refreshCache = useCacheRefresh();

  const handleEditProfile = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      await pb.collection('users').update(
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

      startTransition(() => {
        refreshCache();
        setIsOpen(false);
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
        <title> Profile | PocketBlog</title>
        <Box
          width='100%'
          boxShadow='md'
          px='20px'
          display='flex'
          gap='20px'
          py='30px'
          my='20px'
          alignItems='center'
          justifyContent='space-between'
          flexWrap='wrap'
          bgColor='#0c0c0e'
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
            aria-label='edit profile'
            bgColor='#0766eb'
            _hover={{
              bgColor: 'blue.600',
            }}
            _active={{
              bgColor: 'transparent',
              transition: '1s ease-in all ',
            }}
            color='white'
            icon={
              <Pencil
                size={40}
                style={{
                  backgroundColor: 'transparent',
                  padding: '5px',
                  borderRadius: '5px',
                }}
              />
            }
          />
        </Box>
        {isOpen && (
          <EditUserProfileModal
            user={user}
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
            No blogs yet
          </Heading>
        )}
      </Box>
    )
  );
};

export default Profile;
