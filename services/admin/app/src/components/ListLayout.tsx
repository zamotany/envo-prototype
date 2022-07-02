import { Heading, Text, Box, List, ListItem, Button } from '@chakra-ui/react';
import * as React from 'react';
import { VscArrowLeft } from 'react-icons/vsc';
import { useNavigate } from 'react-router-dom';

interface ListLayoutProps<T extends { key: string }> {
  heading: string;
  description?: string;
  data: T[];
  renderItem: (item: T, index: number) => React.ReactNode;
  backPath?: string;
}

export function ListLayout<T extends { key: string }>({
  heading,
  description,
  data,
  renderItem,
  backPath,
}: ListLayoutProps<T>) {
  const navigate = useNavigate();

  const goBack = React.useCallback(() => {
    if (backPath) {
      navigate(backPath);
    }
  }, [backPath]);

  return (
    <Box>
      {backPath ? (
        <Button
          leftIcon={<VscArrowLeft />}
          variant="outline"
          colorScheme="teal"
          size="sm"
          mb={4}
          onClick={goBack}
        >
          Back
        </Button>
      ) : null}
      <Heading as="h1" size="lg">
        {heading}
      </Heading>
      {description ? <Text fontSize="sm">{description}</Text> : null}
      <List spacing={2} mt={6}>
        {React.useMemo(
          () =>
            data.map((item, index) => (
              <ListItem key={item.key}>{renderItem(item, index)}</ListItem>
            )),
          [data]
        )}
      </List>
    </Box>
  );
}
