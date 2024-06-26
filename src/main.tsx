import { createRoot } from 'react-dom/client';
import App from './App.tsx';
import { ChakraProvider } from '@chakra-ui/react';
import '@fontsource/roboto/400.css'; // Defaults to weight 400
import '@fontsource/source-sans-pro'; // Defaults to weight 400
import { inject } from '@vercel/analytics';
import { extendTheme, type ThemeConfig } from '@chakra-ui/react';

inject({
  mode: 'production',
});

// export const dd = fetchData(
//   'https://react-pocketbase-microblog.pockethost.io/api/collections/blogs/records?page=0&perPage=30&sort=-created&expand=user&fields=id%2Ctitle%2Cimage%2Cexpand.user.avatar%2C%20expand.user.username%2C%20user%20',
// );

// 2. Add your color mode config
const config: ThemeConfig = {
  initialColorMode: 'dark',
  useSystemColorMode: false,
};
const theme = extendTheme(config, {
  styles: {
    global: {
      '*:focus-visible': {},
    },
  },

  colors: {
    secondaryRed: {
      500: '#cf2f2f',
    },
  },
});
// eslint-disable-next-line @typescript-eslint/no-non-null-assertion

createRoot(document.getElementById('root') as HTMLElement).render(
  <ChakraProvider theme={theme}>
    <App />
  </ChakraProvider>,
);
