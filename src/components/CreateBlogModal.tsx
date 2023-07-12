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
  Textarea,
} from '@chakra-ui/react';
import { ChangeEvent, FormEvent, FC, useState, startTransition } from 'react';
import { pb } from '../lib/pocketbase';
import { useNavigate } from 'react-router-dom';
import { AppState, useStore } from '../lib/store';
import { BlogFormValues } from '../types/Blog';
type CreateBlogModalProps = {
  isOpen: boolean;
  onClose: () => void;
};

const CreateBlogModal: FC<CreateBlogModalProps> = ({ isOpen, onClose }) => {
  const navigate = useNavigate();
  const user = useStore((state: AppState) => state.user);
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

  const handleCreateBlogPost = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      if (
        inputFormValues.title !== '' ||
        inputFormValues.content !== '' ||
        inputFormValues.image !== ''
      ) {
        await pb.collection('blogs').create({
          title: inputFormValues.title,
          content: inputFormValues.content,
          image: inputFormValues.image,
          user: user?.id,
        });

        startTransition(() => {
          onClose();
          navigate('/');
        });
        setInputFormValues({
          title: '',
          content: '',
          image: '',
        });
      }
    } catch (err) {
      console.error('Something went wrong, please try again');
    }
  };
  return (
    <>
      <Modal useInert={false} isOpen={isOpen} onClose={onClose} isCentered>
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
                placeholder='Blog title'
                _placeholder={{
                  color: 'gray.400',
                }}
                required
              />
              <Textarea
                name='content'
                resize='horizontal'
                onChange={handleChange}
                _placeholder={{
                  color: 'gray.400',
                }}
                placeholder={`Blog content (Use * for H1 like *This is a heading* )`}
                required
              />

              <Input
                name='image'
                type='url'
                onChange={handleChange}
                _placeholder={{
                  color: 'gray.400',
                }}
                placeholder='Paste your image url here'
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
            <Button type='submit' fontWeight='normal' colorScheme='red'>
              Submit
            </Button>

            <Button
              type='button'
              fontWeight='normal'
              colorScheme='red'
              variant='outline'
              mr={3}
              onClick={onClose}
            >
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
