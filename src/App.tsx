import { Flex } from '@chakra-ui/react';
import { FC } from 'react';
import Router from './router';
import { Helmet } from 'react-helmet';
const App: FC = () => {
  return (
    <main>
      <Helmet>
        <title>{document.title}</title>
      </Helmet>
      <Flex alignItems='center' justifyContent='center' width='100%'>
        <Router />
      </Flex>
    </main>
  );
};

export default App;
