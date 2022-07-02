import { Flex, Container } from '@chakra-ui/react';
import * as React from 'react';
import { Logo } from './Logo';

export function PageLayout({ children }: { children: React.ReactNode }) {
  return (
    <Flex width="full" direction="column">
      <Flex width="full" py="2">
        <Container maxWidth="container.md">
          <Logo
            fill="teal.500"
            backgroundFill="gray.100"
            boxSize="200px"
            margin="auto"
          />
        </Container>
      </Flex>
      <Container py="1" maxWidth="container.md">
        {children}
      </Container>
    </Flex>
  );
}
