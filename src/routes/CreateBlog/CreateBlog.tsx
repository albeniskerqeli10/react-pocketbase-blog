// import { Box, Button, Heading, Input } from '@chakra-ui/react';
// import { startTransition, unstable_useCacheRefresh as useCacheRefresh, useState } from 'react';
// import { useNavigate } from 'react-router-dom';
// import { useStore } from '../../lib/store';
// import SubmitButton from '../../components/UI/SubmitButton/SubmitButton';
// import { client } from '../../lib/upload';
// import { addBlog, getBlogs, refreshCache } from '../../services/blogAPI';
// import { BlogType, Tag } from '../../types/Blog';
// import Editor from '../../components/UI/Editor/Editor';
// import TagInput from '../../components/TagInput/TagInput';

// const CreateBlog = () => {
//   const [inputType, setInputType] = useState('file');
//   const [content, setContent] = useState('');
//   const [tags, setTags] = useState<Tag[]>([]);
//   const user = useStore((state) => state.user);
//   // const refreshCache = useCacheRefresh();
//   const navigate = useNavigate();
//   const handleTagClick = (tag: Tag) => {
//     if (!tags.includes(tag)) {
//       setTags([...tags, tag]);
//     }
//   };

//   const handleDeleteTag = (tagID: number) => {
//     setTags([...tags.filter((tag) => tag.id !== tagID)]);
//   };

//   const createBlogPostAction = async (_previousState, formData: FormData) => {
//     let imageSource: string;
//     const title = formData.get('title');
//     const image: string | any = formData.get('image');

//     if (inputType === 'file' && (image?.type?.match('image.*') as string)) {
//       const filey = await client.uploadFile(image);
//       imageSource = `${filey.cdnUrl}-/format/auto/-/quality/smart/`;
//     } else if (inputType === 'url') {
//       imageSource = image;
//     } else {
//       imageSource = '';
//     }

//     if (title !== '') {
//       if (!imageSource.includes('/')) {
//         alert('Please upload a valid image');
//         return;
//       }

//       startTransition(async () => {
//         const blog = await addBlog({
//           title: title,
//           content: content,
//           image: imageSource as any,
//           user: user?.id,
//           likes: [],
//           tags: tags.length > 0 ? tags.map((tag) => tag.id) : [],
//         } as BlogType);
//         navigate(`/blog/${blog?.id}`);
//         // refreshCache();
//         const dogs = await getBlogs('-created');
//         refreshCache({ key: 'blogs', data: dogs });
//       });
//     } else {
//       alert('Please fill all the fields');
//     }
//   };

//   return (
//     <Box
//       width='100%'
//       color='white'
//       bgColor='transparent'
//       display='flex'
//       alignItems='center'
//       minHeight='100vh'
//       justifyContent='start'
//       flexDirection='column'
//       flexWrap='wrap'
//       py='15px'
//     >
//       <Heading alignSelf='center' py='15px' fontSize='md' fontFamily='inherit' fontWeight='normal'>
//         Create a blog
//       </Heading>
//       <Box
//         as='form'
//         action={createBlogPostAction as any}
//         width='100%'
//         display='flex'
//         alignItems='center'
//         justifyContent='center'
//         flexDirection='column'
//         flexWrap='wrap'
//         gap='20px'
//       >
//         <Input
//           name='title'
//           boxShadow='sm'
//           rounded='md'
//           bgColor='#060608'
//           my='5px'
//           py='25px'
//           border='0'
//           type='text'
//           placeholder='Title'
//           _placeholder={{
//             color: 'white',
//           }}
//         />
//         <Editor content={content} setContent={setContent} />
//         <TagInput tags={tags} handleTagClick={handleTagClick} handleDeleteTag={handleDeleteTag} />

//         <Box
//           width='100%'
//           display='flex'
//           alignItems='center'
//           justifyContent='center'
//           flexDirection='row'
//           flexWrap='wrap'
//           rounded='md'
//           bgColor='#060608'
//           gap='5px'
//           px='5px'
//         >
//           {inputType === 'file' ? (
//             <Input
//               name='image'
//               color='white'
//               width='auto'
//               boxShadow='sm'
//               py='5px'
//               rounded='md'
//               flex='1'
//               accept='image/*'
//               my='7px'
//               type='file'
//               title=' '
//               border='0'
//               placeholder='File'
//               _placeholder={{
//                 color: 'white',
//               }}
//             />
//           ) : (
//             <Input
//               name='image'
//               color='white'
//               width='auto'
//               border='0'
//               boxShadow='sm'
//               py='22px'
//               rounded='md'
//               flex='1'
//               my='5px'
//               type='url'
//               placeholder='Image'
//               _placeholder={{
//                 color: 'white',
//               }}
//             />
//           )}
//           <Button
//             tabIndex={-1}
//             type='button'
//             bgColor='transparent'
//             _hover={{
//               bgColor: 'white',
//               borderColor: 'white',
//               color: 'black',
//             }}
//             border='2px solid white'
//             color='white'
//             py='2'
//             px='5'
//             rounded='md'
//             fontSize='sm'
//             onClick={() => setInputType(inputType === 'file' ? 'url' : 'file')}
//           >
//             {inputType === 'file' ? 'URL' : 'File Upload'}
//           </Button>
//         </Box>

//         <SubmitButton fullWidth={true} />
//       </Box>
//     </Box>
//   );
// };

// export default CreateBlog;

import { Box, Button, Heading, Input } from '@chakra-ui/react';
import {  unstable_useCacheRefresh as useCacheRefresh, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useStore } from '../../lib/store';
import SubmitButton from '../../components/UI/SubmitButton/SubmitButton';
import { client } from '../../lib/upload';
import { addBlog, getBlogs } from '../../services/blogAPI';
import { BlogType, Tag } from '../../types/Blog';
import Editor from '../../components/UI/Editor/Editor';
import TagInput from '../../components/TagInput/TagInput';

const CreateBlog = () => {
  const [inputType, setInputType] = useState('file');
  const [content, setContent] = useState('');
  const [tags, setTags] = useState<Tag[]>([]);
  const user = useStore((state) => state.user);
  const refreshCache = useCacheRefresh();
  const navigate = useNavigate();
  const handleTagClick = (tag: Tag) => {
    if (!tags.find((t) => t.id === tag.id)) {
      setTags([...tags, tag]);
    }
  };

  const handleDeleteTag = (tagID: number) => {
    setTags([...tags.filter((tag) => tag.id !== tagID)]);
  };

  const createBlogPostAction = async (formData: FormData) => {
    let imageSource;
    const title = formData.get('title');
    const image: string | any = formData.get('image');

    if (inputType === 'file' && (image?.type?.match('image.*') as string)) {
      const filey = await client.uploadFile(image);
      imageSource = `${filey.cdnUrl}-/format/auto/-/quality/smart/`;
    } else if (inputType === 'url') {
      imageSource = image;
    } else {
      imageSource = '';
    }

    if (title !== '' && content !== '') {
      if (!imageSource.includes('/')) {
        alert('Please upload a valid image');
        return;
      }
      const blog = await addBlog({
        title: title,
        content: content,
        image: imageSource,
        user: user?.id,
        likes: [],
        tags: tags.length > 0 ? tags.map((tag) => tag.id) : [],
      } as BlogType);
      const dogs = await getBlogs('-created');
      console.log(dogs, 'dogs');
      // refreshCache({ key: 'blogs', data: dogs });
      refreshCache();
      navigate(`/blog/${blog?.id}`);
    } else {
      alert('Please fill all the fields');
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
      py='15px'
    >
      <Heading alignSelf='center' py='15px' fontSize='md' fontFamily='inherit' fontWeight='normal'>
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
          bgColor='#060608'
          my='5px'
          py='25px'
          border='0'
          type='text'
          placeholder='Title'
          _placeholder={{
            color: 'white',
          }}
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
          rounded='md'
          bgColor='#060608'
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
              my='7px'
              type='file'
              title=' '
              border='0'
              placeholder='File'
              _placeholder={{
                color: 'white',
              }}
            />
          ) : (
            <Input
              name='image'
              color='white'
              width='auto'
              border='0'
              boxShadow='sm'
              py='22px'
              rounded='md'
              flex='1'
              my='5px'
              type='url'
              placeholder='Image'
              _placeholder={{
                color: 'white',
              }}
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
            py='2'
            px='5'
            rounded='md'
            fontSize='sm'
            onClick={() => setInputType(inputType === 'file' ? 'url' : 'file')}
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
