import { useSearchParams } from 'react-router-dom';
import { getAllBlogs } from '../../services/blogAPI';
import { Suspense, lazy, use, useMemo } from 'react';
import { Box, Heading } from '@chakra-ui/react';
import { BlogType } from '../../types/Blog';
import Skeleton from '../../components/UI/Skeleton/Skeleton';
const Blog = lazy(() => import('../../components/Blog/Blog'));
const Search = () => {
  getAllBlogs('-created');
  const blogs = use(getAllBlogs('-created')) as BlogType[];
  const [searchParams] = useSearchParams();
  const query = searchParams.get('q');
  const filteredBlogs = useMemo(
    () => blogs.filter((blog) => blog.title.toLowerCase().includes(query?.toLowerCase() as string)),
    [blogs, query],
  );
  return (
    <Box
      width='100%'
      as='section'
      py='10px'
      display='flex'
      minHeight='80vh'
      alignItems='center'
      justifyContent='start'
      flexDirection='row'
      gap='20px'
      flexWrap='wrap'
    >
      <Suspense
        fallback={Array.from({ length: 3 }, (_, index) => (
          <Skeleton key={index} />
        ))}
      >
        {filteredBlogs.length > 0 ? (
          filteredBlogs.map((blog: BlogType) => (
            <Blog
              key={blog.id}
              id={blog.id}
              width='600px'
              title={blog.title}
              image={blog.image}
              shouldPreload={filteredBlogs[0].id === blog.id ? 'high' : 'low'}
              shouldLazyLoad={filteredBlogs[0].id === blog.id ? 'eager' : 'lazy'}
              shouldDecode={filteredBlogs[0].id === blog.id ? 'sync' : 'async'}
              content={blog.content}
              avatar={blog?.expand?.user?.avatar}
              username={blog?.expand?.user?.username}
              user={blog.user}
              likes={blog.likes}
            />
          ))
        ) : (
          <Heading alignSelf='center' fontSize='2xl' color='white'>
            No blogs found
          </Heading>
        )}
      </Suspense>
    </Box>
  );
};

export default Search;
