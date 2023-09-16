import { createRoot } from 'react-dom/client';
import App from './App.tsx';
import { ChakraProvider } from '@chakra-ui/react';
import '@fontsource/roboto/400.css'; // Defaults to weight 400

import { inject } from '@vercel/analytics';
inject({
  mode: 'production',
});

// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
createRoot(document.getElementById('root')!).render(
  <ChakraProvider>
    <App />
  </ChakraProvider>,
);
