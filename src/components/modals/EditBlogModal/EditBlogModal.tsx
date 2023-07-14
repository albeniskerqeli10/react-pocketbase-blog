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
import { FC, ChangeEvent, FormEvent } from 'react';

type EditBlogModalProps = {
  isOpen: boolean;
  onClose: () => void;
  // eslint-disable-next-line no-unused-vars
  handleSubmit: (e: FormEvent<HTMLFormElement>) => void;
  // eslint-disable-next-line no-unused-vars
  handleChange: (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
};

const EditBlogModal: FC<EditBlogModalProps> = ({ handleSubmit, handleChange, isOpen, onClose }) => {
  return (
    <>
      <Modal colorScheme='red' useInert={false} isOpen={isOpen} onClose={onClose} isCentered>
        <ModalOverlay bgColor='blackAlpha.300' />
        <ModalContent
          onSubmit={handleSubmit}
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
                placeholder='Blog title'
                _placeholder={{
                  color: 'gray.400',
                }}
              />
              <Textarea
                name='content'
                resize='horizontal'
                onChange={handleChange}
                _placeholder={{
                  color: 'gray.400',
                }}
                placeholder={`Blog content (Use * for H1 like *This is a heading* )`}
              />

              <Input
                name='image'
                type='url'
                onChange={handleChange}
                _placeholder={{
                  color: 'gray.400',
                }}
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

export default EditBlogModal;
