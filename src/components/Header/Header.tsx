import { Button, Box, Link, Menu, MenuButton, MenuItem, MenuList } from '@chakra-ui/react';
import { FC, memo } from 'react';
import { Link as RouterLink } from 'react-router-dom';
import { AppState, useStore } from '../../lib/store';
import SearchBox from '../SearchBox/SearchBox';
const Header: FC = () => {
  const user = useStore((state: AppState) => state.user);
  const logout = useStore((state: AppState) => state.logoutUser);
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
      {user !== null ? (
        <>
          <SearchBox />
          <Box
            display='flex'
            alignItems='center'
            justifyContent='center'
            gap={['8px', '8px', '8px']}
            flexWrap='wrap'
            width={['100%', 'auto', 'auto']}
            flexDirection='row'
          >
            <Button
              as={RouterLink}
              to='/create-blog'
              width={['100%', 'auto', 'auto']}
              fontWeight='normal'
              size='md'
              colorScheme='red'
              order={['1', '0', '0']}
            >
              Create
            </Button>
            <Menu isLazy={true}>
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
          </Box>
        </>
      ) : (
        <Box
          display='flex'
          alignItems='center'
          justifyContent='center'
          gap={['8px', '8px', '8px']}
          flexWrap='wrap'
          width={['100%', 'auto', 'auto']}
          flexDirection='row'
        >
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
        </Box>
      )}
    </Box>
  );
};

export default memo(Header);
