import { useNavigate, useSearchParams } from 'react-router-dom';
import { searchBlogs } from '../../services/blogAPI';
import { Suspense, lazy, use, useEffect } from 'react';
import { Box, Heading } from '@chakra-ui/react';
import { BlogType } from '../../types/Blog';
import Skeleton from '../../components/UI/Skeleton/Skeleton';
const Blog = lazy(() => import('../../components/Blog/Blog'));
const Search = () => {
  const [searchParams] = useSearchParams();

  const searchQuery = searchParams.get('q') as string;
  const blogs = searchQuery !== '' ? (use(searchBlogs(searchQuery)) as BlogType[]) : [];
  const navigate = useNavigate();
  useEffect(() => {
    if (!searchQuery || searchQuery === '') {
      navigate('/');
    }
  }, [searchQuery, navigate]);
  return searchQuery.length > 0 ? (
    <Box
      width='100%'
      as='section'
      py='10px'
      display='flex'
      minHeight='80vh'
      alignItems='start'
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
        {' '}
        <Heading width='100%' fontWeight='normal' fontSize='20px' color='white'>
          Displaying results for <b>{searchQuery}</b>
        </Heading>
        {blogs?.length > 0 ? (
          blogs?.map((blog: BlogType) => (
            <Blog
              key={blog.id}
              id={blog.id}
              width='600px'
              title={blog.title}
              image={blog.image}
              shouldPreload={blogs[0].id === blog.id ? 'high' : 'low'}
              shouldLazyLoad={blogs[0].id === blog.id ? 'eager' : 'lazy'}
              shouldDecode={blogs[0].id === blog.id ? 'sync' : 'async'}
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
  ) : null;
};

export default Search;
