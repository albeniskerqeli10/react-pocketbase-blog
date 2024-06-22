import { Flex } from '@chakra-ui/react';
import { FC } from 'react';
import Router from './router';
import { SpeedInsights } from '@vercel/speed-insights/react';
// import fetchData from './utils/fetchData';

const App: FC = () => {
  // useEffect(() => {
  //   if (navigator.onLine !== true) {
  //     const ff: any = document?.querySelector('#root');
  //     ff.innerHTML = null;
  //     alert('No internet connection');
  //   } else {
  //     window.location.reload();
  //   }
  // }, []);

  // useEffect(() => {
  //   const link: any = document.createElement('link');
  //   link.rel = 'prefetch';
  //   link.as = 'fetch';
  //   link.href =
  //     'https://react-pocketbase-microblog.pockethost.io/api/collections/blogs/records?page=0&perPage=30&sort=-created&expand=user&fields=id%2Ctitle%2Cimage%2Cexpand.user.avatar%2C%20expand.user.username%2C%20user%20';

  //   const head = document.head;

  //   if (!head.innerHTML.includes(link)) {
  //     head.appendChild(link);
  //   }
  // }, []);

  return (
    <Flex as='main' display='flex' alignItems='center' justifyContent='center' width='100%' flexWrap='wrap'>
      {/* <link
        rel='prefetch'
        as='fetch'
        href='https://react-pocketbase-microblog.pockethost.io/api/collections/blogs/records?page=0&perPage=30&sort=-created&expand=user&fields=id%2Ctitle%2Cimage%2Cexpand.user.avatar%2C%20expand.user.username%2C%20user%20'
      /> */}
      <Router />
      <SpeedInsights />
    </Flex>
  );
};

export default App;
