import { Box, Heading } from '@chakra-ui/react';
import { lazy, Suspense, FC } from 'react';
import Skeleton from '../../components/UI/Skeleton/Skeleton';
import { BlogType } from '../../types/Blog';
const Blog = lazy(() => import('../../components/Blog/Blog'));

type BlogsListProps = {
  blogs: BlogType[];
};

const BlogsList: FC<BlogsListProps> = ({ blogs }) => {
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
        {blogs.length <= 0 ? (
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
