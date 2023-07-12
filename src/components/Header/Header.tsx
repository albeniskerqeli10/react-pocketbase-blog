import { Button, Box, Wrap, Link, Menu, MenuButton, MenuItem, MenuList } from '@chakra-ui/react';
import { useState, FC } from 'react';
import CreateBlogModal from '../CreateBlogModal';
import { Link as RouterLink } from 'react-router-dom';
import { AppState, useStore } from '../../lib/store';
const Header: FC = () => {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const user = useStore((state: AppState) => state.user);
  const logout = useStore((state: AppState) => state.logoutUser);
  const onClose = () => {
    setIsOpen(false);
  };
  const handleModalClick = () => {
    setIsOpen(true);
  };
  return (
    <Box
      width='100%'
      py='10px'
      minH='70px'
      display='flex'
      alignItems='center'
      justifyContent='space-between'
      flexWrap='wrap'
    >
      <Link
        as={RouterLink}
        _hover={{
          textDecoration: 'none',
        }}
        to='/'
        fontSize='2xl'
        fontWeight='bold'
        color='white'
      >
        MicroBlog
      </Link>
      <Wrap
        display='flex'
        alignItems='center'
        justifyContent='center'
        textAlign='center'
        flexDirection='row'
      >
        {user !== null ? (
          <>
            <Button fontWeight='normal' onClick={handleModalClick} size='md' colorScheme='red'>
              Create
            </Button>
            <CreateBlogModal isOpen={isOpen} onClose={onClose} />
            <Menu isLazy>
              <MenuButton
                color='white'
                _hover={{
                  border: 'none',
                }}
                _active={{
                  border: 'none',
                }}
                border='0'
                bgColor='transparent'
                as={Button}
              >
                {user?.username}
              </MenuButton>
              <MenuList border='0' bgColor='black'>
                <MenuItem color='white' bgColor='transparent'>
                  Profile
                </MenuItem>
                <MenuItem color='white' bgColor='transparent' onClick={logout}>
                  Logout
                </MenuItem>
              </MenuList>
            </Menu>{' '}
          </>
        ) : (
          <>
            <Button fontWeight='normal' to='/login' as={RouterLink} size='md' colorScheme='red'>
              Sign In
            </Button>
            <Button
              fontWeight='normal'
              as={RouterLink}
              to='/signup'
              size='md'
              colorScheme='black'
              border='2px solid white'
            >
              Sign Up
            </Button>
          </>
        )}
      </Wrap>
    </Box>
  );
};

export default Header;
