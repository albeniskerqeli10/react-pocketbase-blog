import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  ModalFooter,
  Button,
  Input,
  Box,
} from '@chakra-ui/react';
import { FC, FormEvent, startTransition, useState } from 'react';
import { BlogFormValues, BlogType } from '../../../types/Blog';
import { editBlog } from '../../../services/blogAPI';
import useForm from '../../../hooks/useForm';
import Editor from '../../UI/Editor/Editor';

type EditBlogModalProps = {
  isOpen: boolean;
  onClose: () => void;
  blog: BlogType;
};

const EditBlogModal: FC<EditBlogModalProps> = ({ blog, isOpen, onClose }) => {
  const { values, handleChange, resetForm } = useForm<BlogFormValues>({
    title: '',
    content: '',
    image: '',
  });
  const [content, setContent] = useState(blog.content);
  const handleEditBlogPost = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const editedBlog = await editBlog({
      blog: blog,
      values: {
        title: values.title,
        content: content,
        image: values.image,
      },
    });
    if (editedBlog) {
      startTransition(() => {
        onClose();
        resetForm();
      });
    }
  };

  return (
    <>
      <Modal colorScheme='red' useInert={false} isOpen={isOpen} onClose={onClose} isCentered>
        <ModalOverlay bgColor='rgba(0,0,0,0.6)' />
        <ModalContent
          minHeight='85vh'
          onSubmit={handleEditBlogPost}
          borderWidth='2px'
          borderColor='#1b1b1d'
          as='form'
          bgColor='black'
        >
          <ModalHeader bgColor='transparent' color='white'>
            Edit this Blog Post
          </ModalHeader>
          <ModalCloseButton color='white' />
          <ModalBody py='20px' bgColor='transparent' color='white'>
            <Box
              bgColor='transparent'
              display='flex'
              alignItems='center'
              justifyContent='center'
              flexDirection='column'
              gap='20px'
            >
              <Input
                name='title'
                onChange={handleChange}
                defaultValue={blog.title}
                placeholder='Blog title'
                _placeholder={{
                  color: 'gray.400',
                }}
              />
              <Editor content={content} setContent={setContent} />

              <Input
                name='image'
                type='url'
                onChange={handleChange}
                _placeholder={{
                  color: 'gray.400',
                }}
                defaultValue={blog.image}
                placeholder='Paste your image url here'
              />
            </Box>
          </ModalBody>

          <ModalFooter
            bgColor='transparent'
            display='flex'
            alignItems='center'
            flexDirection='row'
            justifyContent='start'
            gap='3'
          >
            <Button type='submit' fontWeight='normal' colorScheme='red'>
              Submit
            </Button>
            <Button type='button' fontWeight='normal' color='white' variant='outline' mr={3} onClick={onClose}>
              Close
            </Button>
          </ModalFooter>
          {/* {errorMessage !== "" && <Text color="white">{errorMessage}</Text>} */}
        </ModalContent>
      </Modal>
    </>
  );
};

export default EditBlogModal;
