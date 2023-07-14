import { useParams, useNavigate } from 'react-router-dom';
import { pb } from '../../lib/pocketbase';
import { useState, useEffect, FC } from 'react';
import { Box, Heading, Image, Text } from '@chakra-ui/react';
import { BlogType } from '../../types/Blog';
import { ErrorResponse } from '../../types/Auth';
import TimeAgo from 'timeago-react';
import BlogActions from '../../components/BlogActions/BlogActions';
const SingleBlog: FC = () => {
  const [blog, setBlog] = useState<BlogType>({} as BlogType);
  const { id } = useParams();

  const navigate = useNavigate();

  const handleStateUpdate = (updatedBlog: BlogType) => {
    setBlog(updatedBlog);
  };
  useEffect(() => {
    const getSingleBlog = async () => {
      try {
        const blog: BlogType = await pb.collection('blogs').getOne(id as string, {
          expand: 'user',
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
  }, [id, navigate]);

  useEffect(() => {
    pb.collection('blogs').subscribe(id as string, async function () {
      const blog: BlogType = await pb.collection('blogs').getOne(id as string, {
        expand: 'user',
      });
      setBlog(blog);
    });
    return () => {
      pb.collection('blogs').unsubscribe(id);
    };
  }, [id]);

  const parts = blog?.content?.split(/(\*.*?\*|#.*?#)/);

  const splittedContent = parts?.map((part: string, index: number) => {
    if (part.startsWith('*') && part.endsWith('*')) {
      const content = part.substring(1, part.length - 1);
      return (
        <Heading as='h2' fontSize='xl' color='white' key={index}>
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
        py='10px'
        display='flex'
        gap='20px'
        flexDirection='column'
        alignItems='start'
        justifyContent='start'
      >
        <Image
          decoding='async'
          fetchpriority='high'
          src={blog.image}
          fit='cover'
          objectFit='cover'
          objectPosition='center'
          width='100%'
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
            {blog?.expand?.user?.avatar && (
              <Image src={blog?.expand?.user?.avatar} rounded='full' width='40px' height='40px' alt='avatar' />
            )}
            <Box color='gray.300' display='flex' alignItems='start' flexDirection='column' flexWrap='wrap'>
              <Text color='white' fontSize='lg'>
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

        <Box width='100%' display='flex' flexDirection='row' alignItems='center' gap='20px' justifyContent='start'>
          <Heading color='white' fontSize='45px'>
            {blog.title}
          </Heading>
        </Box>
        {splittedContent}
      </Box>
    )
  );
};
export default SingleBlog;
