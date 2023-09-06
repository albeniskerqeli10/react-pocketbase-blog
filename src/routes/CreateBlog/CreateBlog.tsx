import { Box, Button, Heading, Input, Textarea } from '@chakra-ui/react';
import { startTransition, unstable_useCacheRefresh as useCacheRefresh, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useStore } from '../../lib/store';
import { pb } from '../../lib/pocketbase';
import SubmitButton from '../../components/UI/SubmitButton/SubmitButton';
import { client } from '../../lib/upload';

type ActionForm = {
  // eslint-disable-next-line no-unused-vars
  get(name: string): string;
};
const CreateBlog = () => {
  const refresh = useCacheRefresh();
  const navigate = useNavigate();
  const user = useStore((state) => state.user);
  const [inputType, setInputType] = useState('file');

  const createBlogPostAction = async (formData: ActionForm | FormData) => {
    const title = formData.get('title');
    const content = formData.get('content');
    const image = formData.get('image');
    if (inputType === 'file') {
      const filey = await client.uploadFile(image);

      const createdBlog = await pb.collection('blogs').create(
        {
          title: title,
          content: content,
          image: filey
            ? `${filey.cdnUrl}-/format/auto/-/quality/smart/`
            : 'https://placehold.co/600x400/000000/FFFFFF/webp?text=Image',
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
    } else {
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
      <Heading alignSelf='center' py='20px' pb='25px' fontSize='lg' fontFamily='inherit' fontWeight='normal'>
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
          boxShadow='sm'
          rounded='sm'
          bgColor='black'
          borderWidth='1px'
          borderColor='#333'
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
          borderColor='#333'
          resize='none'
          boxShadow='sm'
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
        <Box
          width='100%'
          display='flex'
          alignItems='center'
          justifyContent='center'
          flexDirection='row'
          flexWrap='wrap'
          border='1px'
          borderColor='#333'
          bgColor='black'
          gap='5px'
          px='5px'
        >
          {inputType === 'file' ? (
            <Input
              name='image'
              color='white'
              width='auto'
              border='0'
              boxShadow='sm'
              py='5px'
              rounded='sm'
              flex='1'
              accept='image/*'
              my='5px'
              type='file'
              placeholder='File'
              _placeholder={{
                color: 'white',
              }}
              required
            />
          ) : (
            <Input
              name='image'
              color='white'
              width='auto'
              border='0'
              boxShadow='sm'
              py='25px'
              rounded='sm'
              flex='1'
              my='5px'
              type='url'
              placeholder='Image'
              _placeholder={{
                color: 'white',
              }}
              required
            />
          )}
          <Button
            tabIndex={-1}
            type='button'
            onClick={() => (inputType === 'file' ? setInputType('url') : setInputType('file'))}
          >
            {inputType === 'file' ? 'URL' : 'File Upload'}
          </Button>
        </Box>
        <SubmitButton fullWidth />
      </Box>
    </Box>
  );
};

export default CreateBlog;
