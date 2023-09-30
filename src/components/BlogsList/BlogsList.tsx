import {
  useEffect,
  FC,
  use,
  unstable_useCacheRefresh as useCacheRefresh,
  startTransition,
  Suspense,
  lazy,
} from 'react';
import { Box, Heading } from '@chakra-ui/react';
import { pb } from '../../lib/pocketbase';
import { getBlogs } from '../../services/blogAPI';
import { BlogType } from '../../types/Blog';
import Skeleton from '../../components/UI/Skeleton/Skeleton';
const Blog = lazy(() => import('../../components/Blog/Blog'));

type BlogsListProps = {
  sortField: string;
};

const BlogsList: FC<BlogsListProps> = ({ sortField }) => {
  const blogs = use(getBlogs(sortField)) as BlogType[];
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
      gap='20px'
    >
      <Suspense
        fallback={Array.from({ length: 3 }, (_, index) => (
          <Skeleton key={index} />
        ))}
      >
        {blogs?.length <= 0 ? (
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
              shouldLazyLoad={blogs[0].id === blog.id ? 'eager' : 'lazy'}
              shouldPreload={blogs[0].id === blog.id ? 'high' : 'low'}
              shouldDecode={blogs[0].id === blog.id ? 'sync' : 'async'}
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
