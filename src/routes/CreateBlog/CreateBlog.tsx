import { Box, Button, Heading, Input } from '@chakra-ui/react';
import { startTransition, unstable_useCacheRefresh as useCacheRefresh, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useStore } from '../../lib/store';
import SubmitButton from '../../components/UI/SubmitButton/SubmitButton';
import { client } from '../../lib/upload';
import { addBlog } from '../../services/blogAPI';
import { BlogType } from '../../types/Blog';
import Editor from '../../components/UI/Editor/Editor';

const CreateBlog = () => {
  const refreshCache = useCacheRefresh();
  const navigate = useNavigate();
  const user = useStore((state) => state.user);
  const [inputType, setInputType] = useState('file');
  const [content, setContent] = useState('');

  const createBlogPostAction = async (formData: FormData) => {
    let imageSource = null;
    const title = formData.get('title');
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const image: any = formData.get('image');

    if (inputType === 'file' && (image?.type?.match('image.*') as string)) {
      const filey = await client.uploadFile(image);
      imageSource = `${filey.cdnUrl}-/format/auto/-/quality/smart/`;
    } else if (inputType === 'url') {
      imageSource = image;
    } else {
      alert('Please upload a valid image');
    }

    if (imageSource !== null) {
      const blog = await addBlog({
        title: title,
        content: content,
        image: imageSource,
        user: user?.id,
        likes: [],
      } as BlogType);
      navigate(`/blog/${blog?.id}`);
      startTransition(() => {
        refreshCache();
      });
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
          rounded='md'
          bgColor='#0c0c0e'
          my='5px'
          py='25px'
          border='0'
          type='text'
          placeholder='Title'
          _placeholder={{
            color: 'white',
          }}
          required
        />
        <Editor content={content} setContent={setContent} />

        <Box
          width='100%'
          display='flex'
          alignItems='center'
          justifyContent='center'
          flexDirection='row'
          flexWrap='wrap'
          bgColor='#0c0c0e'
          gap='5px'
          px='5px'
        >
          {inputType === 'file' ? (
            <Input
              name='image'
              color='white'
              width='auto'
              boxShadow='sm'
              py='5px'
              rounded='md'
              flex='1'
              accept='image/*'
              my='5px'
              type='file'
              title=' '
              border='0'
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
              rounded='md'
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
            bgColor='transparent'
            _hover={{
              bgColor: 'white',
              borderColor: 'white',
              color: 'black',
            }}
            border='2px solid white'
            color='white'
            rounded='md'
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
