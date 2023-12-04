import { Flex } from '@chakra-ui/react';
import { FC } from 'react';
import Router from './router';
const App: FC = () => {
  return (
    <Flex as='main' display='flex' alignItems='center' justifyContent='center' width='100%' flexWrap='wrap'>
      <Router />
    </Flex>
  );
};

export default App;
