// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import { useEffect, useState, Suspense, lazy, FC, use, cache, startTransition } from 'react';

import { Box, Tab, TabList, Tabs, Text } from '@chakra-ui/react';
import Spinner from '../components/Spinner/Spinner';

import { pb } from '../lib/pocketbase';
import { BlogType } from '../types/Blog';
import { ErrorResponse } from '../types/Auth';
const Blog = lazy(() => import('../components/Blog/Blog'));
const getBlogs = cache(async (sortField: string) => {
  try {
    const blogs: BlogType[] = await pb.collection('blogs').getFullList({
      sort: sortField,
      expand: 'user',
    });
    return blogs;
  } catch (err) {
    const errorResponse = err as ErrorResponse;
    return errorResponse;
  }
});
const NoAuthRoute: FC = () => {
  const [sortField, setSortField] = useState('-created');
  const blogsPromise = use(getBlogs(sortField));
  const [blogs, setBlogs] = useState<BlogType[]>(blogsPromise);
  if (blogsPromise[0].title !== blogs[0].title) {
    setBlogs(blogsPromise);
  }
  const [error] = useState<string>();
  useEffect(() => {
    // startTransition(() => {
    //   setBlogs(blogsPromise);
    // });

    pb.collection('blogs').subscribe('*', async function () {
      const blogs = await getBlogs('-created');
      startTransition(() => {
        setBlogs(blogs);
      });
    });

    return () => {
      pb.collection('blogs').unsubscribe('*');
    };
  }, []);

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
            shouldLazyLoad={blogs[0].id === blog.id || blogs[1].id === blog.id ? 'eager' : 'lazy'}
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
      {error !== '' && (
        <Text color='white' bgColor='transparent'>
          {error}
        </Text>
      )}
    </Box>
  );
};
export default NoAuthRoute;
