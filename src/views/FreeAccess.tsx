import { Box } from '@chakra-ui/react';
import { useEffect, useState, Suspense, lazy, FC } from 'react';
import { pb } from '../lib/pocketbase';
import { BlogType } from '../types/Blog';
import Spinner from '../components/shared/Spinner';
const Blog = lazy(() => import('../components/Blog/Blog'));
const FreeAccess: FC = () => {
  const [blogs, setBlogs] = useState<BlogType[]>([]);

  useEffect(() => {
    console.log('rerendered');
    const getBlogs = async () => {
      const blogs: BlogType[] = await pb.collection('blogs').getFullList({
        sort: '-created',
        expand: 'user',
      });
      if (blogs) {
        setBlogs(blogs);
      }
    };
    void getBlogs();
    void pb.collection('blogs').subscribe('*', function (e) {
      const newBlog = e.record;
      setBlogs((prevBlogs: BlogType[]) => [newBlog, ...prevBlogs] as BlogType[]);
    });

    return () => {
      void pb.collection('blogs').unsubscribe();
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
            content={blog.content}
          />
        ))}
      </Suspense>
    </Box>
  );
};
export default FreeAccess;
