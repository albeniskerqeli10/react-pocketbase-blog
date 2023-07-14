import { Container } from '@chakra-ui/react';
import { Outlet } from 'react-router-dom';
import Header from '../Header/Header';
import { useEffect, FC } from 'react';
import { AppState, useStore } from '../../lib/store';
import { pb } from '../../lib/pocketbase';
import { ExtendedUser } from '../../types/Auth';
const Layout: FC = () => {
  const setUser = useStore((state: AppState) => state.setUser);
  useEffect(() => {
    const changeUser = () => {
      pb.authStore.onChange(() => {
        setUser(pb.authStore.model as ExtendedUser);
      });
    };
    changeUser();
  }, [setUser]);
  return (
    <Container
      maxW='1140px'
      display='flex'
      flexDirection='column'
      alignItems='center'
      justifyContent='start'
      minHeight='80vh'
    >
      <Header />
      <Outlet />
    </Container>
  );
};

export default Layout;
