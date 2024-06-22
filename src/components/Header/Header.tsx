import { Button, Box, Link, Menu, MenuButton, MenuItem, MenuList, Avatar } from '@chakra-ui/react';
import { FC } from 'react';
import { Link as RouterLink } from 'react-router-dom';
import { AppState, useStore } from '../../lib/store';
import SearchBox from '../SearchBox/SearchBox';
// import { BellRinging } from '@phosphor-icons/react';
const Header: FC = () => {
  const user = useStore((state: AppState) => state.user);
  const logout = useStore((state: AppState) => state.logoutUser);

  // const scrollPagetoTop = () => {
  //   if (window.scrollY !== 0) {
  //     window.scrollTo({
  //       top: 0,
  //       behavior: 'smooth',
  //     });
  //   }
  // };

  return (
    <Box
      as='header'
      width='100%'
      bgColor='#121212'
      py='10px'
      minH='70px'
      position={['static', 'sticky', 'sticky']}
      zIndex='1000'
      top={0}
      flexDirection={['row', 'row', 'row']}
      display='flex'
      alignItems='center'
      gap={['20px', '0', '0']}
      justifyContent='space-between'
      flexWrap='wrap'
    >
      <Link
        to='/'
        // onClick={scrollPagetoTop}
        as={RouterLink}
        _hover={{
          textDecoration: 'none',
        }}
        className='logo'
        fontSize={['md', 'md', 'lg']}
        fontWeight='bold'
        color='white'
      >
        POCKETBLOG
      </Link>
      {user !== null ? (
        <>
          <SearchBox />
          <Box
            display='flex'
            alignItems='center'
            justifyContent='center'
            gap='15px'
            flexWrap='wrap'
            width={['auto', 'auto', 'auto']}
            flexDirection='row'
          >
            <Button
              onMouseEnter={async () => {
                return await import('../../routes/CreateBlog/CreateBlog');
              }}
              as={RouterLink}
              to='/create-blog'
              width={['auto', 'auto', 'auto']}
              fontWeight='normal'
              size='md'
              colorScheme='secondaryRed'
              boxShadow='sm'
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
                tabIndex={0}
                border='0'
                size={['md', 'md', 'md']}
                bgColor='transparent'
                as={Avatar}
                ignoreFallback={true}
                name={user?.username}
                cursor='pointer'
                width='40px'
                height='40px'
                src={user?.avatar}
              ></MenuButton>
              <MenuList border='0' rounded='sm' bgColor='#060608' boxShadow='md'>
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
          width='auto'
          flexDirection='row'
        >
          <Button fontWeight='normal' to='/login' as={RouterLink} size='md' colorScheme='red' boxShadow='sm'>
            Sign In
          </Button>
          <Button
            fontWeight='normal'
            as={RouterLink}
            to='/signup'
            size='md'
            colorScheme='black'
            border='2px solid white'
            boxShadow='sm'
          >
            Sign Up
          </Button>
        </Box>
      )}
    </Box>
  );
};

export default Header;
