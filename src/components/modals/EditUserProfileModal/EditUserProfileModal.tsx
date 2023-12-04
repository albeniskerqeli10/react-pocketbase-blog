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
import { FC, ChangeEvent, FormEvent } from 'react';
import { ExtendedUser } from '../../../types/Auth';

type EditUserProfileModalProps = {
  isOpen: boolean;
  onClose: () => void;
  user: ExtendedUser;
  // eslint-disable-next-line no-unused-vars
  handleSubmit: (e: FormEvent<HTMLFormElement>) => void;
  // eslint-disable-next-line no-unused-vars
  handleChange: (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
};

const EditUserProfileModal: FC<EditUserProfileModalProps> = ({ user, handleSubmit, handleChange, isOpen, onClose }) => {
  return (
    <>
      <Modal colorScheme='secondaryRed' isOpen={isOpen} onClose={onClose} isCentered>
        <ModalOverlay bgColor='rgba(0,0,0,0.6)' />
        <ModalContent onSubmit={handleSubmit} borderWidth='2px' borderColor='#1b1b1d' as='form' bgColor='black'>
          <ModalHeader bgColor='transparent' color='white'>
            Change Account Details
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
                name='email'
                onChange={handleChange}
                placeholder='E-mail'
                defaultValue={user.email}
                _placeholder={{
                  color: 'gray.400',
                }}
              />
              <Input
                name='username'
                type='text'
                onChange={handleChange}
                _placeholder={{
                  color: 'gray.400',
                }}
                defaultValue={user.username}
                placeholder={`Username`}
              />

              <Input
                name='avatar'
                type='url'
                onChange={handleChange}
                _placeholder={{
                  color: 'gray.400',
                }}
                defaultValue={user.avatar}
                placeholder='Profile picture(only url)'
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
            <Button type='submit' fontWeight='normal' colorScheme='secondaryRed'>
              Submit
            </Button>
            <Button
              type='button'
              fontWeight='normal'
              colorScheme='secondaryRed'
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

export default EditUserProfileModal;
