import { Flex } from '@chakra-ui/react';
import { FC } from 'react';
import Router from './router';
import { Helmet } from 'react-helmet';
const App: FC = () => {
  return (
    <Flex as='main' display='flex' alignItems='center' justifyContent='center' width='100%' flexWrap='wrap'>
      <Helmet>
        <title>{document.title}</title>
      </Helmet>
      <Router />
    </Flex>
  );
};

export default App;
