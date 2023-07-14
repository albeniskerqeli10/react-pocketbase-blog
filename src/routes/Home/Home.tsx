import { Box, Text } from '@chakra-ui/react';
import { useEffect, useState, Suspense, lazy, FC } from 'react';
import { pb } from '../../lib/pocketbase';
import { BlogType } from '../../types/Blog';
import Spinner from '../../components/Spinner/Spinner';
import { ErrorResponse } from '../../types/Auth';
const Blog = lazy(() => import('../../components/Blog/Blog'));
const Home: FC = () => {
  const [blogs, setBlogs] = useState<BlogType[]>([]);
  const [error, setError] = useState<string>();
  useEffect(() => {
    const getBlogs = async () => {
      try {
        const blogs: BlogType[] = await pb.collection('blogs').getFullList({
          sort: '-created',
          expand: 'user',
        });

        if (blogs) {
          const link = document.createElement('link');
          link.rel = 'preload';
          link.as = 'image';
          link.href = blogs[0].image;
          document.head.appendChild(link);
          setBlogs(blogs);
        }
      } catch (err) {
        const errorResponse = err as ErrorResponse;
        setError(errorResponse.message);
      }
    };

    getBlogs();
    pb.collection('blogs').subscribe('*', function (e) {
      const newBlog = e.record;
      setBlogs((prevBlogs: BlogType[]) => [newBlog, ...prevBlogs] as BlogType[]);
    });

    return () => {
      pb.collection('blogs').unsubscribe();
    };
  }, []);

  return (
    <Box
      width='100%'
      py='10px'
      display='flex'
      alignItems='center'
      justifyContent='start'
      flexDirection='row'
      gap='20px'
      flexWrap='wrap'
    >
      <Suspense fallback={<Spinner />}>
        {blogs.map((blog: BlogType) => (
          <Blog
            key={blog.id}
            id={blog.id}
            title={blog.title}
            image={blog.image}
            shouldLazyLoad={blogs[0].id === blog.id ? 'eager' : 'lazy'}
            content={blog.content}
            avatar={blog?.expand?.user?.avatar}
            username={blog?.expand?.user?.username}
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
