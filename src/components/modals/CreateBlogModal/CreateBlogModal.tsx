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
  Textarea,
} from '@chakra-ui/react';
import { FC, startTransition, unstable_useCacheRefresh as useCacheRefresh } from 'react';

import { pb } from '../../../lib/pocketbase';
import { useNavigate, useLocation } from 'react-router-dom';
import { AppState, useStore } from '../../../lib/store';
import SubmitButton from '../../UI/SubmitButton';
// import { BlogFormValues } from '../../../types/Blog';
// import useForm from '../../../hooks/useForm';
type CreateBlogModalProps = {
  isOpen: boolean;
  onClose: () => void;
};

type ActionForm = {
  // eslint-disable-next-line no-unused-vars
  get(name: string): string;
}

const CreateBlogModal: FC<CreateBlogModalProps> = ({ isOpen, onClose }) => {
  const navigate = useNavigate();
  const location = useLocation();
  // const [isSubmitting, setIsSubmitting] = useState(false);
  const user = useStore((state: AppState) => state.user);
  // const { values, handleChange, resetForm } = useForm<BlogFormValues>({
  //   title: '',
  //   image: '',
  //   content: '',
  // });
  const refresh = useCacheRefresh();

  const createBlogPostAction = async (formData: ActionForm | FormData) => {
    const title = formData.get('title');
    const content = formData.get('content');
    const image = formData.get('image');
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
      if (location.pathname !== '/') {
        startTransition(() => {
          refresh();
          navigate('/');
        });
      }
      onClose();
    }
  };

  return (
    <>
      <Modal isOpen={isOpen} onClose={onClose} isCentered>
        <ModalOverlay className='customModal' bg='blackAlpha.200' />
        <ModalContent
          borderWidth='2px'
          borderColor='#1b1b1d'
          action={createBlogPostAction}
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
                _placeholder={{
                  color: 'gray.400',
                }}
                placeholder={`Content (Use * for H1 e.g *This is a heading* )`}
                required
              />

              <Input
                name='image'
                type='url'
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
            <SubmitButton />
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
