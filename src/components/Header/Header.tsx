import { Button, Box, Link, Menu, MenuButton, MenuItem, MenuList } from '@chakra-ui/react';
import { useState, FC } from 'react';
import CreateBlogModal from '../modals/CreateBlogModal/CreateBlogModal';
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
      as='header'
      width='100%'
      py='10px'
      minH='70px'
      position={['static', 'sticky', 'sticky']}
      zIndex='1000'
      top={0}
      flexDirection={['row', 'row', 'row']}
      display='flex'
      alignItems='center'
      gap={['20px', '0', '0']}
      justifyContent={['center', 'space-between', 'space-between']}
      flexWrap='wrap'
    >
      <Link
        as={RouterLink}
        _hover={{
          textDecoration: 'none',
        }}
        to='/'
        fontSize={['md', 'md', 'lg']}
        fontWeight='bold'
        color='white'
      >
        PocketBlog
      </Link>
      <Box
        display='flex'
        alignItems='center'
        justifyContent='center'
        gap={['8px', '8px', '8px']}
        flexWrap='wrap'
        width={['100%', 'auto', 'auto']}
        flexDirection='row'
      >
        {user !== null ? (
          <>
            <Button
              width={['100%', 'auto', 'auto']}
              fontWeight='normal'
              onClick={handleModalClick}
              size='md'
              colorScheme='red'
              order={['1', '0', '0']}
            >
              Create
            </Button>
            {isOpen && <CreateBlogModal isOpen={isOpen} onClose={onClose} />}
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
                size={['md', 'md', 'md']}
                bgColor='transparent'
                as={Button}
              >
                {user?.username}
              </MenuButton>
              <MenuList border='0' bgColor='black'>
                <MenuItem as={RouterLink} to='/profile' color='white' bgColor='transparent'>
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
      </Box>
    </Box>
  );
};

export default Header;
