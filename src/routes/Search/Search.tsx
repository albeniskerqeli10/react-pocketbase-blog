import { useSearchParams } from 'react-router-dom';
import { getAllBlogs } from '../../services/blog';
import { Suspense, lazy, use, useMemo } from 'react';
import { Box, Heading } from '@chakra-ui/react';
import { BlogType } from '../../types/Blog';
import Spinner from '../../components/UI/Spinner/Spinner';
const Blog = lazy(() => import('../../components/Blog/Blog'));
const Search = () => {
  const blogs = use(getAllBlogs('-created'));
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
      <Suspense fallback={<Spinner />}>
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
