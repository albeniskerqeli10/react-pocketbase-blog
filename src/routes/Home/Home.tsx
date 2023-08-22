import { useEffect, useState, Suspense, lazy, FC, startTransition, useCallback } from 'react';

import { Box, Tab, TabList, Tabs, Text } from '@chakra-ui/react';
import Spinner from '../../components/Spinner/Spinner';

import { pb } from '../../lib/pocketbase';
import { BlogType } from '../../types/Blog';
import { ErrorResponse } from '../../types/Auth';
const Blog = lazy(() => import('../../components/Blog/Blog'));
const Home: FC = () => {
  const [blogs, setBlogs] = useState<BlogType[]>([]);
  const [error, setError] = useState<string>();
  const [sortField, setSortField] = useState('-created');
  useEffect(() => {
    const getBlogs = async () => {
      try {
        const blogs: BlogType[] = await pb.collection('blogs').getFullList({
          sort: sortField,
          expand: 'user',
        });

        setBlogs(blogs);
      } catch (err) {
        const errorResponse = err as ErrorResponse;
        setError(errorResponse.message);
      }
    };

    getBlogs();
    pb.collection('blogs').subscribe('*', async function (e) {
      const latestBlog = await pb.collection('blogs').getOne(e.record.id, { expand: 'user' });
      setBlogs((prevBlogs: BlogType[]) => [latestBlog, ...prevBlogs] as BlogType[]);
    });

    return () => {
      pb.collection('blogs').unsubscribe();
    };
  }, [sortField]);

  const handleSortBlogs = useCallback((sortField: string) => {
    console.log(sortField, 'sortname of <Home/>');
    startTransition(() => {
      setSortField(sortField);
    });
  }, []);

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
      <Suspense fallback={<Spinner />}>
        <Box width='100%' border='0' display='flex' alignItems='center' flexDirection='row' justifyContent='start'>
          <Tabs colorScheme='red' color='white'>
            <TabList display='flex' justifyContent='stretch' border='0'>
              <Tab
                _active={{
                  bgColor: 'transparent',
                }}
                display='flex'
                justifyContent='stretch'
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
export default Home;
