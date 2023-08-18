import { Flex } from '@chakra-ui/react';
import { FC } from 'react';
import Router from './router';

const App: FC = () => {
  return (
    <main>
      <Flex alignItems='center' justifyContent='center' width='100%'>
        <Router />
      </Flex>
    </main>
  );
};

export default App;
