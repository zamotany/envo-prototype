import { Flex, Text, Container } from '@chakra-ui/react';
import * as React from 'react';

export function PageLayout({ children }: { children: React.ReactNode }) {
  return (
    <Flex width="full" direction="column">
      <Flex width="full" py="2">
        <Container maxWidth="container.lg">
          <Text
            textColor="teal.600"
            fontSize="4xl"
            fontWeight="bold"
            textAlign="center"
          >
            envo
          </Text>
        </Container>
      </Flex>
      <Container py="4">{children}</Container>
    </Flex>
  );
}
