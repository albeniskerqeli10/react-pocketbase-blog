import { useEffect, FC, unstable_useCacheRefresh as useCacheRefresh, Suspense, lazy } from 'react';
import { Box, Heading } from '@chakra-ui/react';
import { pb } from '../../lib/pocketbase';
import { BlogType, BlogsType } from '../../types/Blog';
import Skeleton from '../../components/UI/Skeleton/Skeleton';
// import { appCache, getBlogs, refreshCache } from '../../services/blogAPI';
const blogPromise = import('../../components/Blog/Blog');
const Blog = lazy(() => blogPromise);

type BlogsListProps = {
  blogs: BlogsType['items'];
};

// const blogsQuery = fetchData(
//   'https://react-pocketbase-microblog.pockethost.io/api/collections/blogs/records?page=0&perPage=30&sort=-created&expand=user',
// );

const BlogsList: FC<BlogsListProps> = ({ blogs }) => {
  // const blogs: [] | any = [];
  const refreshCache = useCacheRefresh();

  useEffect(() => {
    pb.collection('blogs').subscribe('*', async function () {
      await pb.collection('blogs').getList(0, 30, {
        sort: '-created',
        expand: 'user',
        fields: 'id,title,image,expand.user.avatar, expand.user.username, user ',
      });
      refreshCache();
    });
    return () => {
      pb.collection('blogs').unsubscribe('*');
    };
  }, []);

  return (
    <Box
      width='100%'
      // flexBasis='500px'
      // border='2px solid white'
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
          blogs?.map((blog: BlogType) => (
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
