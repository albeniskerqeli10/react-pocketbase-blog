import { useParams, Link, useNavigate } from 'react-router-dom';
import { pb } from '../../lib/pocketbase';
import { useEffect, FC, use, startTransition, unstable_useCacheRefresh as useCacheRefresh } from 'react';
import { Box, Heading, Image, Text, Tag } from '@chakra-ui/react';
import { AppState, useStore } from '../../lib/store';
import { getSingleBlog } from '../../services/blogAPI';
import { BlogType, Tag as TagType } from '../../types/Blog';
import TimeAgo from 'timeago-react';
import BlogActions from '../../components/BlogActions/BlogActions';
import BlogComments from '../../components/BlogComments/BlogComments';
import DOMPurify from 'dompurify';

const SingleBlog: FC = () => {
  const { id } = useParams();
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
      <Box
        key={blog.id}
        width='100%'
        as='section'
        py='10px'
        display='flex'
        gap='20px'
        flexDirection='column'
        alignItems='start'
        justifyContent='flex-start'
      >
        <title>{`${blog.title} | PocketBlog`}</title>
        <Image
          decoding='sync'
          fetchpriority='high'
          src={blog.image}
          onError={(e) => {
            const img = e.target as HTMLImageElement;

            img.src = 'https://placehold.co/600x400/000/FFF/webp?text=Image&font=roboto';
          }}
          rounded='sm'
          fit='cover'
          objectFit='cover'
          objectPosition='center'
          width='100%'
          htmlWidth='600px'
          htmlHeight='400px'
          height='auto'
          maxHeight='400px'
          alt='blog image'
        />

        <Box
          display='flex'
          alignItems='center'
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

        <Box width='100%' display='flex' flexDirection='row' alignItems='center' justifyContent='start' flexWrap='wrap'>
          <Heading width='100%' color='white' fontSize={['lg', 'lg', '40px']}>
            {blog.title}
          </Heading>
        </Box>

        {blog?.expand?.tags && blog.expand.tags.length > 0 && (
          <Box
            width='auto'
            display='flex'
            alignItems='center'
            justifyContent='flex-start'
            flexDirection='row'
            flexWrap='wrap'
            gap='10px'
          >
            {blog.expand.tags.map((tag: TagType) => (
              <>
                <Tag color='white' bgColor='#060608' size='lg'>
                  {tag.name.toUpperCase()}
                </Tag>
              </>
            ))}
          </Box>
        )}
        <Box color='white' width='100%' className='content' dangerouslySetInnerHTML={{ __html: sanitizedContent }} />
        <BlogComments blog={blog} />
      </Box>
    )
  );
};
export default SingleBlog;
