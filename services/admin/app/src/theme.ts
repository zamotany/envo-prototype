import { extendTheme } from '@chakra-ui/react';

export const theme = extendTheme({
  fonts: {
    heading: `'Open Sans', sans-serif`,
    body: `'Open Sans', sans-serif`,
  },
  styles: {
    global: {
      'html, body': {
        backgroundColor: 'gray.100',
        color: 'gray.600',
      },
    },
  },
});
