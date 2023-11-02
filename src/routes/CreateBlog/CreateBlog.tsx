import { Box, Button, Heading, Input } from '@chakra-ui/react';
import { startTransition, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useStore } from '../../lib/store';
import SubmitButton from '../../components/UI/SubmitButton/SubmitButton';
import { client } from '../../lib/upload';
import { addBlog } from '../../services/blogAPI';
import { BlogType, TagType } from '../../types/Blog';
import Editor from '../../components/UI/Editor/Editor';
import TagInput from '../../components/TagInput/TagInput';
import { useQueryClient } from '@tanstack/react-query';

const CreateBlog = () => {
  const [inputType, setInputType] = useState('file');
  const [content, setContent] = useState('');
  const [tags, setTags] = useState<TagType[]>([]);
  const queryClient = useQueryClient();
  const user = useStore((state) => state.user);
  const navigate = useNavigate();
  const handleTagClick = (tag: TagType) => {
    if (!tags.includes(tag)) {
      setTags([...tags, tag]);
    }
  };

  const handleDeleteTag = (tagID: number) => {
    setTags([...tags.filter((tag) => tag.id !== tagID)]);
  };

  const createBlogPostAction = async (formData: FormData) => {
    let imageSource;
    const title = formData.get('title');
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
        tags: tags.length > 0 ? [...new Set(tags.map((tag) => tag.id))] : [],
      } as BlogType);
       queryClient.invalidateQueries({
         queryKey: ['blogs'],
         refetchType: 'all',
       });

      navigate(`/blog/${blog?.id}`);
    }
  };

  return (
    <Box
      width='100%'
      color='white'
      bgColor='transparent'
      display='flex'
      alignItems='center'
      minHeight='100vh'
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
        gap='20px'
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
        <TagInput tags={tags} handleTagClick={handleTagClick} handleDeleteTag={handleDeleteTag} />

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

        <SubmitButton fullWidth={true} />
      </Box>
    </Box>
  );
};

export default CreateBlog;
