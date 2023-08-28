// "react": "^18.3.0-canary-98f3f14d2-20230818",
// "react-dom": "^18.3.0-canary-98f3f14d2-20230818",

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
  Spinner,
  Textarea,
} from '@chakra-ui/react';
import { FormEvent, FC, useState, startTransition, unstable_useCacheRefresh as useCacheRefresh } from 'react';
import { pb } from '../../../lib/pocketbase';
import { useNavigate } from 'react-router-dom';
import { AppState, useStore } from '../../../lib/store';
import { BlogFormValues } from '../../../types/Blog';
import useForm from '../../../hooks/useForm';
type CreateBlogModalProps = {
  isOpen: boolean;
  onClose: () => void;
};

const CreateBlogModal: FC<CreateBlogModalProps> = ({ isOpen, onClose }) => {
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const user = useStore((state: AppState) => state.user);
  const { values, handleChange, resetForm } = useForm<BlogFormValues>({
    title: '',
    image: '',
    content: '',
  });

  const { title, content, image } = values;

  const handleCreateBlogPost = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      if (title !== '' || content !== '' || image !== '') {
        await pb.collection('blogs').create(
          {
            title: title,
            content: content,
            image: image,
            user: user?.id,
            likes: [],
          },
          {
            expand: 'user',
          },
        );

        startTransition(() => {
          navigate('/');
          onClose();
          setIsSubmitting(false);
          resetForm();
        });
      }
    } catch (err) {
      /* */
    }
  };
  return (
    <>
      <Modal isOpen={isOpen} onClose={onClose} isCentered>
        <ModalOverlay className='customModal' bg='blackAlpha.200' />
        <ModalContent
          borderWidth='2px'
          borderColor='#1b1b1d'
          onSubmit={handleCreateBlogPost}
          boxShadow='xl'
          as='form'
          bgColor='black'
        >
          <ModalHeader bgColor='transparent' color='white'>
            Create a Blog Post
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
                value={values.title || ''}
                placeholder='Title'
                _placeholder={{
                  color: 'gray.400',
                }}
                required
              />
              <Textarea
                name='content'
                resize='none'
                minHeight='120px'
                onChange={handleChange}
                value={values.content || ''}
                _placeholder={{
                  color: 'gray.400',
                }}
                placeholder={`Content (Use * for H1 e.g *This is a heading* )`}
                required
              />

              <Input
                name='image'
                type='url'
                onChange={handleChange}
                value={values.image || ''}
                _placeholder={{
                  color: 'gray.400',
                }}
                placeholder='Image Url'
                required
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
            {isSubmitting ? (
              <Button type='button' disabled={true} fontWeight='normal' colorScheme='red'>
                <Spinner size='sm' mr={4} color='white' bgColor='transparent' /> Submitting
              </Button>
            ) : (
              <Button type='submit' fontWeight='normal' colorScheme='red'>
                Submit
              </Button>
            )}

            <Button type='button' fontWeight='normal' colorScheme='red' variant='outline' mr={3} onClick={onClose}>
              Close
            </Button>
          </ModalFooter>
          {/* {errorMessage !== "" && <Text color="white">{errorMessage}</Text>} */}
        </ModalContent>
      </Modal>
    </>
  );
};

export default CreateBlogModal;
