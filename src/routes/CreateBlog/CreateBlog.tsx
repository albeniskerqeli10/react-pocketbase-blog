import { Box, Button, Heading, Input, Textarea } from '@chakra-ui/react';
import { startTransition, unstable_useCacheRefresh as useCacheRefresh } from 'react';
import { useNavigate } from 'react-router-dom';
import { useStore } from '../../lib/store';
import { pb } from '../../lib/pocketbase';

type ActionForm = {
  // eslint-disable-next-line no-unused-vars
  get(name: string): string;
};
const CreateBlog = () => {
  const refresh = useCacheRefresh();
  const navigate = useNavigate();
  const user = useStore((state) => state.user);

  const createBlogPostAction = async (formData: ActionForm | FormData) => {
    const title = formData.get('title');
    const content = formData.get('content');
    const image = formData.get('image');
    if (title !== '' || content !== '' || image !== '') {
      const createdBlog = await pb.collection('blogs').create(
        {
          title: title,
          content: content,
          image: image,
          user: user?.id, // grab user id which is stored in browser storage,
          likes: [], // generate an empty array for every created blog,
        },
        {
          expand: 'user',
        },
      );
      startTransition(() => {
        navigate(`/blog/${createdBlog.id}`);
      });
      if (location.pathname !== '/') {
        startTransition(() => {
          refresh();
        });
      }
    }
  };
  return (
    <Box
      width='100%'
      color='white'
      bgColor='transparent'
      display='flex'
      alignItems='center'
      minHeight='80vh'
      justifyContent='start'
      flexDirection='column'
      flexWrap='wrap'
    >
      <Heading alignSelf='start' py='10px' pb='30px' fontSize='xl' fontFamily='inherit'>
        Create a blog
      </Heading>
      <Box
        as='form'
        action={createBlogPostAction}
        width='100%'
        display='flex'
        alignItems='center'
        justifyContent='center'
        flexDirection='column'
        flexWrap='wrap'
        gap='30px'
      >
        <Input
          name='title'
          boxShadow='lg'
          rounded='sm'
          bgColor='black'
          borderWidth='1px'
          borderColor='#232222'
          my='5px'
          py='25px'
          type='text'
          placeholder='Title'
          _placeholder={{
            color: 'white',
          }}
          required
        />

        <Textarea
          name='content'
          border='1px'
          borderColor='#232222'
          resize='none'
          boxShadow='lg'
          rounded='sm'
          bgColor='black'
          _placeholder={{
            color: 'white',
          }}
          minH='200px'
          my='5px'
          placeholder='Content'
          required
        />
        <Input
          name='image'
          border='1px'
          borderColor='#232222'
          color='white'
          boxShadow='lg'
          py='25px'
          rounded='sm'
          bgColor='black'
          my='5px'
          type='url'
          placeholder='Image'
          _placeholder={{
            color: 'white',
          }}
          required
        />
        <Button type='submit' boxShadow='lg' border='0' rounded='sm' my='5px' width='100%' colorScheme='red'>
          Submit
        </Button>
      </Box>
    </Box>
  );
};

export default CreateBlog;
