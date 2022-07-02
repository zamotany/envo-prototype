import { Flex, Container, Button, Box } from '@chakra-ui/react';
import * as React from 'react';
import { VscSignOut } from 'react-icons/vsc';
import { useUser } from '../context';
import { Logo } from './Logo';

export function PageLayout({ children }: { children: React.ReactNode }) {
  const { setToken, isAuthenticated } = useUser({ subscribe: true });

  const logout = React.useCallback(() => {
    setToken();
    // TODO: invalidate token on backend
  }, []);

  return (
    <Flex width="full" direction="column">
      <Flex width="full" py="2">
        <Container maxWidth="container.md">
          <Logo
            fill="teal.500"
            backgroundFill="gray.50"
            boxSize="200px"
            margin="auto"
          />
        </Container>
      </Flex>
      <Container py="1" maxWidth="container.md" position="relative">
        {isAuthenticated ? (
          <Box position="absolute" right="1rem" top="1">
            <Button onClick={logout} size="sm" rightIcon={<VscSignOut />}>
              Logout
            </Button>
          </Box>
        ) : null}
        {children}
      </Container>
    </Flex>
  );
}
