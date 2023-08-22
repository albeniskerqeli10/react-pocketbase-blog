import { useParams, useNavigate, Link } from 'react-router-dom';
import { pb } from '../../lib/pocketbase';
import { useState, useEffect, FC, startTransition } from 'react';
import { Box, Heading, Image, Text } from '@chakra-ui/react';
import { BlogType } from '../../types/Blog';
import { ErrorResponse } from '../../types/Auth';
import TimeAgo from 'timeago-react';
import BlogActions from '../../components/BlogActions/BlogActions';
import BlogComments from '../../components/BlogComments/BlogComments';
import { AppState, useStore } from '../../lib/store';
import { Helmet } from 'react-helmet';

const SingleBlog: FC = () => {
  const [blog, setBlog] = useState<BlogType>({} as BlogType);
  const { id } = useParams();
  const currentUser = useStore((state: AppState) => state.user);
  const navigate = useNavigate();

  const handleStateUpdate = (updatedBlog: BlogType) => {
    startTransition(() => {
      setBlog(updatedBlog);
    });
  };

  useEffect(() => {
    const getSingleBlog = async () => {
      try {
        const blog: BlogType = await pb.collection('blogs').getOne(id as string, {
          expand: 'user, comments(blog).user',
        });
        setBlog(blog);
      } catch (err: unknown) {
        const errorResponse = err as ErrorResponse;
        if (errorResponse.status === 404) {
          navigate('/');
        }
      }
    };

    getSingleBlog();
    pb.collection('blogs').subscribe('*', async function () {
      const blog: BlogType = await pb.collection('blogs').getOne(id as string, {
        expand: 'user, comments(blog).user',
      });
      startTransition(() => {
        setBlog(blog);
      });
    });

    return () => {
      pb.collection('blogs').unsubscribe('');
    };
  }, [id, navigate]);

  useEffect(() => {
    pb.collection('comments').subscribe('*', async function (e) {
      if (e.record.blog === id) {
        const blog: BlogType = await pb.collection('blogs').getOne(id as string, {
          expand: 'user, comments(blog).user',
        });
        startTransition(() => {
          setBlog(blog);
        });
      }
    });
    return () => {
      pb.collection('comments').unsubscribe('');
    };
  }, [id]);

  const parts = blog?.content?.split(/(\*.*?\*|#.*?#)/);

  const splittedContent = parts?.map((part: string, index: number) => {
    if (part.startsWith('*') && part.endsWith('*')) {
      const content = part.substring(1, part.length - 1);
      return (
        <Heading as='h2' fontSize={['md', 'md', 'xl']} color='white' key={index}>
          {content}
        </Heading>
      );
    } else {
      return (
        <Text width='100%' key={index} fontSize='sm' paddingBottom='30px' lineHeight='30px' color='gray.100'>
          {part}
        </Text>
      );
    }
  });

  return (
    Object.keys(blog).length > 0 && (
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
        <Helmet>
          <title> {blog.title} | PocketBlog</title>
        </Helmet>
        <Image
          decoding='sync'
          fetchpriority='high'
          src={blog.image}
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
            <Image
              src={blog?.expand?.user?.avatar}
              rounded='full'
              width='40px'
              height='40px'
              decoding='async'
              alt='avatar'
            />

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
          <BlogActions blog={blog} onUpdate={handleStateUpdate} />
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
          <Heading color='white' fontSize={['lg', 'lg', '45px']}>
            {blog.title}
          </Heading>
        </Box>
        {splittedContent}
        <BlogComments blog={blog} />
      </Box>
    )
  );
};
export default SingleBlog;
