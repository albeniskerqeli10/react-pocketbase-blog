import { useEffect, FC, startTransition, Suspense, lazy } from 'react';
import { Box, Heading } from '@chakra-ui/react';
import { pb } from '../../lib/pocketbase';
import { getBlogs } from '../../services/blogAPI';
import { BlogType } from '../../types/Blog';
import Skeleton from '../../components/UI/Skeleton/Skeleton';
import { useQueryClient, useSuspenseQuery } from '@tanstack/react-query';
import { queryClient as mainQueryClient } from '../../main';
const Blog = lazy(() => import('../../components/Blog/Blog'));

type BlogsListProps = {
  sortField: string;
};

type BlogsQueryType = {
  data: BlogType[];
};

const blogsQuery = { queryKey: ['blogs', '-created'], queryFn: () => getBlogs('-created') };

// ⬇️ initiate a fetch before the component renders
mainQueryClient.prefetchQuery(blogsQuery);

const BlogsList: FC<BlogsListProps> = ({ sortField }) => {
  const queryClient = useQueryClient();
  const { data: blogs }: BlogsQueryType = useSuspenseQuery({
    queryKey: ['blogs', sortField],
    queryFn: () => getBlogs(sortField),
  });

  useEffect(() => {
    console.log('Rerendered');
    pb.collection('blogs').subscribe('*', async function () {
      queryClient.invalidateQueries({
        queryKey: ['blogs'],
      });
    });
    return () => {
      pb.collection('blogs').unsubscribe('*');
    };
  }, [queryClient]);

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
        {blogs && blogs?.length <= 0 ? (
          <Heading color='white' bgColor='white'>
            No Blogs yet
          </Heading>
        ) : (
          blogs?.map((blog: BlogType) => (
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
