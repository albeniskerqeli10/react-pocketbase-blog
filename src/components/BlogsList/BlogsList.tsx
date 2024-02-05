import { useEffect, FC, unstable_useCacheRefresh as useCacheRefresh, startTransition, Suspense, lazy } from 'react';
import { Box, Heading } from '@chakra-ui/react';
import { pb } from '../../lib/pocketbase';
import { BlogType, BlogsType } from '../../types/Blog';
import Skeleton from '../../components/UI/Skeleton/Skeleton';
const Blog = lazy(() => import('../../components/Blog/Blog'));

type BlogsListProps = {
  blogs: BlogsType['items'];
};

const BlogsList: FC<BlogsListProps> = ({ blogs }) => {
  // const blogs = use(getBlogs(blo)) as BlogType[];
  const refreshCache = useCacheRefresh();

  useEffect(() => {
    pb.collection('blogs').subscribe('*', async function () {
      startTransition(() => {
        refreshCache();
      });
    });
    return () => {
      pb.collection('blogs').unsubscribe('*');
    };
  }, [refreshCache]);

  return (
    <Box
      width='100%'
      display='flex'
      alignItems='center'
      justifyContent='start'
      flexDirection='row'
      flexWrap='wrap'
      gap='30px'
      py='5px'
      pb='10px'
    >
      <Suspense
        fallback={Array.from({ length: 3 }, (_, index) => (
          <Skeleton key={index} />
        ))}
      >
        {blogs && blogs.length < 0 ? (
          <Heading color='white' bgColor='white'>
            No Blogs yet
          </Heading>
        ) : (
          blogs.map((blog: BlogType) => (
            <Blog
              key={blog.id}
              id={blog.id}
              width='600px'
              title={blog.title}
              image={blog.image}
              content={blog.content}
              avatar={blog?.expand?.user?.avatar}
              username={blog?.expand?.user?.username}
              user={blog.user}
              likes={blog.likes}
            />
          ))
        )}
      </Suspense>
    </Box>
  );
};

export default BlogsList;
