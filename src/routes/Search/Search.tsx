import { useNavigate, useSearchParams } from 'react-router-dom';
import { searchBlogs, searchUsers } from '../../services/blogAPI';
import { Suspense, experimental_useEffectEvent, lazy, startTransition, use, useEffect, useState } from 'react';
import { Box, Heading, Tab } from '@chakra-ui/react';
import { BlogType } from '../../types/Blog';
import Skeleton from '../../components/UI/Skeleton/Skeleton';
import UserCard from '../../components/UserCard/UserCard';
import { ExtendedUser } from '../../types/Auth';
import TabsList from '../../components/UI/TabsList/TabsList';
const Blog = lazy(() => import('../../components/Blog/Blog'));

const Search = () => {
  const [searchParams] = useSearchParams();
  const searchQuery = searchParams.get('q') as string;
  const [selectedTab, setSelectedTab] = useState('blogs');

  const searchData =
    searchQuery !== '' ? use<any>(selectedTab === 'blogs' ? searchBlogs(searchQuery) : searchUsers(searchQuery)) : [];
  const navigate = useNavigate();
  useEffect(() => {
    if (!searchQuery || searchQuery === '') {
      navigate('/');
    }
  }, [searchQuery, navigate]);

  const handleSelectTab = experimental_useEffectEvent((selectedTab: string) => {
    startTransition(() => {
      setSelectedTab(selectedTab);
    });
  });

  return searchQuery.length > 0 ? (
    <Box
      width='100%'
      as='section'
      py='10px'
      display='flex'
      minHeight='80vh'
      alignItems='start'
      justifyContent='start'
      flexDirection='column'
      maxWidth='100%'
      gap='20px'
      flexWrap='wrap'
    >
      <Heading py='5px' fontWeight='normal' color='white' size='sm'>
        Showing {searchData.length} results for{' '}
        <strong
          style={{
            fontWeight: 'bold',
          }}
        >
          "{searchQuery}"
        </strong>
      </Heading>
      <TabsList>
        <Tab onClick={() => selectedTab !== 'blogs' && handleSelectTab('blogs')}>Blogs</Tab>
        <Tab
          _active={{
            bgColor: 'transparent',
          }}
          onClick={() => selectedTab !== 'users' && handleSelectTab('users')}
        >
          Users
        </Tab>
      </TabsList>
      <Box
        width='100%'
        display='flex'
        alignItems='start'
        gap='20px'
        justifyContent='start'
        flexDirection='column'
        flexWrap='wrap'
      >
        <Suspense
          fallback={Array.from({ length: 3 }, (_, index) => (
            <Skeleton key={index} />
          ))}
        >
          {searchData?.length > 0 ? (
            selectedTab === 'blogs' ? (
              searchData?.map((blog: BlogType) => (
                <Blog
                  key={blog.id}
                  id={blog.id}
                  width='600px'
                  title={blog.title}
                  image={blog.image}
                  shouldPreload={searchData[0].id === blog.id ? 'high' : 'low'}
                  shouldLazyLoad={searchData[0].id === blog.id ? 'eager' : 'lazy'}
                  shouldDecode={searchData[0].id === blog.id ? 'sync' : 'async'}
                  content={blog.content}
                  avatar={blog?.expand?.user?.avatar}
                  username={blog?.expand?.user?.username}
                  user={blog.user}
                  likes={blog.likes}
                />
              ))
            ) : (
              searchData.map((user: ExtendedUser) => <UserCard key={user.id} user={user} />)
            )
          ) : (
            <Heading alignSelf='start' fontSize='lg' color='white'>
              No {selectedTab} found
            </Heading>
          )}
        </Suspense>
      </Box>
    </Box>
  ) : null;
};

export default Search;
