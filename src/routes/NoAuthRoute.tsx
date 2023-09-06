import {
  useEffect,
  useState,
  Suspense,
  lazy,
  FC,
  use,
  unstable_useCacheRefresh as useCacheRefresh,
  startTransition,
} from 'react';

import { Box, Tab, TabList, Tabs } from '@chakra-ui/react';
import Spinner from '../components/UI/Spinner/Spinner';

import { pb } from '../lib/pocketbase';
import { BlogType } from '../types/Blog';
import { getBlogs } from '../services/blog';
const Blog = lazy(() => import('../components/Blog/Blog'));
const NoAuthRoute: FC = () => {
  const [sortField, setSortField] = useState('-created');
  getBlogs('-created');

  const blogs = use(getBlogs(sortField));
  const refresh = useCacheRefresh();

  useEffect(() => {
    pb.collection('blogs').subscribe('*', async function () {
      startTransition(() => {
        refresh();
      });
    });
  }, [refresh]);

  const handleSortBlogs = async (sortName: string) => {
    startTransition(() => {
      setSortField(sortName);
    });
  };

  return (
    <Box
      width='100%'
      as='section'
      py='10px'
      display='flex'
      alignItems='center'
      justifyContent='start'
      flexDirection='row'
      gap='20px'
      flexWrap='wrap'
    >
      <Box width='100%' border='0' display='flex' alignItems='center' flexDirection='row' justifyContent='start'>
        <Tabs colorScheme='red' color='white'>
          <TabList display='flex' justifyContent='stretch' border='0'>
            <Tab
              _active={{
                bgColor: 'transparent',
              }}
              onClick={() => sortField !== '-created' && handleSortBlogs('-created')}
            >
              Latest
            </Tab>
            <Tab
              _active={{
                bgColor: 'transparent',
              }}
              onClick={() => sortField !== 'likes' && handleSortBlogs('likes')}
            >
              Popular
            </Tab>
          </TabList>
        </Tabs>
      </Box>
      <Suspense fallback={<Spinner />}>
        {blogs.map((blog: BlogType) => (
          <Blog
            key={blog.id}
            id={blog.id}
            width='600px'
            title={blog.title}
            image={blog.image}
            shouldLazyLoad={blogs[0].id === blog.id ? 'eager' : 'lazy'}
            shouldPreload={blogs[0].id === blog.id ? 'high' : 'low'}
            shouldDecode={blogs[0].id === blog.id ? 'sync' : 'async'}
            content={blog.content}
            avatar={blog?.expand?.user?.avatar}
            username={blog?.expand?.user?.username}
            user={blog.user}
            likes={blog.likes}
          />
        ))}
      </Suspense>
    </Box>
  );
};
export default NoAuthRoute;
