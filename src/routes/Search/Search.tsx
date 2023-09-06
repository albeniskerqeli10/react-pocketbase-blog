import { useLocation } from 'react-router-dom';
import { getBlogs } from '../../services/blog';
import { use } from 'react';
import Blog from '../../components/Blog/Blog';
import { Box, Heading } from '@chakra-ui/react';
import { BlogType } from '../../types/Blog';
const Search = () => {
  const blogs = use(getBlogs('-created'));

  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const query = searchParams.get('q');

  const filteredBlogs = blogs.filter((blog) => blog.title.toLowerCase().includes(query?.toLowerCase() as string));
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
    </Box>
  );
};

export default Search;
