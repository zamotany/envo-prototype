import '@fontsource/open-sans/400.css';
import '@fontsource/open-sans/700.css';
import '@fontsource/nova-mono';
import React from 'react';
import ReactDOM from 'react-dom/client';
import { ChakraProvider } from '@chakra-ui/react';
import { BrowserRouter } from 'react-router-dom';
import { Root } from './Root';
import { theme } from './theme';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <BrowserRouter>
      <ChakraProvider theme={theme}>
        <Root />
      </ChakraProvider>
    </BrowserRouter>
  </React.StrictMode>
);
