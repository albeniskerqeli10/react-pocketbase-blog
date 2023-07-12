import { useParams, useNavigate } from 'react-router-dom';
import { pb } from '../../lib/pocketbase';
import { useState, useEffect, ChangeEvent, FormEvent, FC, startTransition } from 'react';
import { Box, Button, Heading, Image, Text, Wrap } from '@chakra-ui/react';
import { AppState, useStore } from '../../lib/store';
import EditBlogModal from '../../components/EditBlogModal';
import { BlogFormValues, BlogType } from '../../types/Blog';
import { ErrorResponse } from '../../types/Auth';
import TimeAgo from 'timeago-react';
const SingleBlog: FC = () => {
  const [blog, setBlog] = useState<BlogType>({} as BlogType);
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const navigate = useNavigate();
  const onClose = () => {
    setIsOpen(false);
  };
  const user = useStore((state: AppState) => state.user);
  const { id } = useParams();
  const [inputFormValues, setInputFormValues] = useState<BlogFormValues>({
    title: '',
    content: '',
    image: '',
  });

  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setInputFormValues({
      ...inputFormValues,
      [e.target.name]: e.target.value,
    });
  };
  const handleEditBlogPost = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      const updatedBlog: BlogType = await pb.collection('blogs').update(
        id as string,
        {
          title: inputFormValues.title !== '' ? inputFormValues.title : blog.title,
          content: inputFormValues.content !== '' ? inputFormValues.content : blog.content,
          image: inputFormValues.image !== '' ? inputFormValues.image : blog.image,
        },
        {
          expand: 'user',
        },
      );
      startTransition(() => {
        setBlog(updatedBlog);
        onClose();
      });
    } catch (err) {
      alert('Something went wrong, try again');
    }
  };
  useEffect(() => {
    const getSingleBlog = async () => {
      try {
        const blog: BlogType = await pb.collection('blogs').getOne(id as string, {
          expand: 'user',
        });

        if (blog) {
          setBlog(blog);
        }
      } catch (err: unknown) {
        const errorResponse = err as ErrorResponse;
        if (errorResponse.status === 404) {
          navigate('/');
        }
      }
    };

    getSingleBlog();
  }, [id, navigate]);
  const parts = blog?.content?.split(/(\*.*?\*|#.*?#)/);

  const contentElements = parts?.map((part: string, index: number) => {
    if (part.startsWith('*') && part.endsWith('*')) {
      const content = part.substring(1, part.length - 1);
      return (
        <Heading as='h2' fontSize='xl' color='white' key={index}>
          {content}
        </Heading>
      );
    } else {
      return (
        <Text key={index} fontSize='sm' py='10px' lineHeight='30px' color='gray.100'>
          {part}
        </Text>
      );
    }
  });
  const handleDeleteBlog = async () => {
    await pb.collection('blogs').delete(id as string);

    startTransition(() => {
      alert('You successfully deleted this blog post');

      navigate('/');
    });
  };
  if (!blog) {
    return null;
  }

  return (
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
        fetchpriority='high'
        decoding='async'
        src={blog.image}
        objectFit='cover'
        objectPosition='center'
        width='100%'
        height='400px'
        alt='blog image'
      />

      <Box
        width='100%'
        gap='20px'
        display='flex'
        alignItems='center'
        justifyContent='space-between'
        flexDirection='row'
        flexWrap='wrap'
      >
        <Heading color='white'>{blog.title}</Heading>

        {blog.user === user?.id && (
          <Wrap>
            <Button onClick={() => setIsOpen(true)} colorScheme='blue'>
              Edit
            </Button>
            <Button onClick={handleDeleteBlog} colorScheme='red'>
              Delete
            </Button>
          </Wrap>
        )}

        <EditBlogModal
          handleSubmit={handleEditBlogPost}
          handleChange={handleChange}
          isOpen={isOpen}
          onClose={onClose}
        />
      </Box>
      <Box
        width='100%'
        display='flex'
        flexDirection='row'
        alignItems='center'
        gap='20px'
        justifyContent='start'
      >
        {' '}
        {blog?.expand?.user?.avatar !== null && (
          <Image
            src={blog?.expand?.user?.avatar}
            rounded='sm'
            width='50px'
            loading='lazy'
            decoding='async'
            height='50px'
            alt='avatar'
          />
        )}
        <Text color='white'>@{blog?.expand?.user?.username}</Text>
        <Box color='gray.300'>
          <TimeAgo live={false} datetime={blog.created as string} />
        </Box>
      </Box>
      {contentElements}
    </Box>
  );
};
export default SingleBlog;
