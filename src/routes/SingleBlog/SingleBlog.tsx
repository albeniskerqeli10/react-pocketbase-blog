import { useParams, Link, useNavigate } from 'react-router-dom';
import { pb } from '../../lib/pocketbase';

import { useEffect, FC, use, startTransition, unstable_useCacheRefresh as useCacheRefresh } from 'react';
import { Box, Heading, Image, Text } from '@chakra-ui/react';
import TimeAgo from 'timeago-react';
import BlogActions from '../../components/BlogActions/BlogActions';
import BlogComments from '../../components/BlogComments/BlogComments';
import { AppState, useStore } from '../../lib/store';
import { getSingleBlog } from '../../services/blogAPI';
import { BlogType } from '../../types/Blog';
import DOMPurify from 'dompurify';

const SingleBlog: FC = () => {
  const { id } = useParams();
  getSingleBlog(id as string);
  const blog = use(getSingleBlog(id as string)) as BlogType;
  const currentUser = useStore((state: AppState) => state.user);
  const navigate = useNavigate();
  const refreshCache = useCacheRefresh();
  const sanitizedContent = DOMPurify.sanitize(blog.content);

  useEffect(() => {
    if (!blog?.id) {
      navigate('/');
    } else {
      pb.collection('blogs').subscribe(blog?.id as string, async function () {
        startTransition(() => {
          refreshCache();
        });
      });
    }
    return () => {
      pb.collection('blogs').unsubscribe(id as string);
    };
  }, [id, blog?.id, refreshCache, navigate]);

  return (
    blog?.id && (
      <>
        <Box
          key={blog.id}
          width='100%'
          as='section'
          py='10px'
          display='flex'
          gap='20px'
          flexDirection='column'
          alignItems='start'
          justifyContent='start'
        >
          <title>{`${blog.title} | PocketBlog`}</title>
          <Image
            decoding='sync'
            fetchpriority='high'
            src={blog.image}
            rounded='sm'
            fit='cover'
            objectFit='cover'
            objectPosition='center'
            loading='eager'
            width='100%'
            htmlWidth='600px'
            htmlHeight='400px'
            height='400px'
            alt='blog image'
          />

          <Box
            display='flex'
            alignItems='start'
            justifyContent='space-between'
            width='100%'
            flexDirection='row'
            flexWrap='wrap'
          >
            <Box color='gray.300' display='flex' alignItems='start' flexDirection='row' flexWrap='wrap' gap='10px'>
              <Image src={blog?.expand?.user?.avatar} rounded='full' width='40px' height='40px' alt='avatar' />

              <Box color='gray.300' display='flex' alignItems='start' flexDirection='column' flexWrap='wrap'>
                <Text
                  as={Link}
                  to={currentUser?.id === blog?.user ? '/profile' : `../../user/${blog?.user}`}
                  color='white'
                  _hover={{
                    textDecoration: 'underline',
                  }}
                  fontSize='lg'
                >
                  {blog?.expand?.user?.username}
                </Text>

                <TimeAgo
                  style={{
                    fontSize: '12px',
                  }}
                  live={false}
                  datetime={blog.created as string}
                />
              </Box>
            </Box>
            <BlogActions blog={blog} />
          </Box>
          <Box
            width='100%'
            display='flex'
            flexDirection='row'
            alignItems='center'
            gap='20px'
            justifyContent='start'
            flexWrap='wrap'
          >
            <Heading width='100%' color='white' fontSize={['lg', 'lg', '45px']}>
              {blog.title}
            </Heading>
          </Box>
          <Box
            bgColor='transparent'
            color='white'
            width='100%'
            className='content'
            dangerouslySetInnerHTML={{ __html: sanitizedContent }}
          />
          <BlogComments blog={blog} />
        </Box>
      </>
    )
  );
};
export default SingleBlog;
