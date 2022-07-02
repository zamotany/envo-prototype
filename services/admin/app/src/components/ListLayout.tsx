import {
  Heading,
  Text,
  Box,
  List,
  ListItem,
  Button,
  AlertIcon,
  Alert,
} from '@chakra-ui/react';
import * as React from 'react';
import { VscArrowLeft } from 'react-icons/vsc';
import { useNavigate } from 'react-router-dom';
import { BarLoader } from 'react-spinners';

interface ListLayoutProps<
  T extends { key: string | number } | { id: string | number }
> {
  heading: string;
  description?: string;
  data: T[];
  renderItem: (item: T, index: number) => React.ReactNode;
  backPath?: string;
  isLoading?: boolean;
}

export function ListLayout<
  T extends { key: string | number } | { id: string | number }
>({
  heading,
  description,
  data,
  renderItem,
  backPath,
  isLoading,
}: ListLayoutProps<T>) {
  const navigate = useNavigate();

  const goBack = React.useCallback(() => {
    if (backPath) {
      navigate(backPath);
    }
  }, [backPath]);

  const listContent = React.useMemo(
    () => (
      <List spacing={2} mt={6}>
        {data.map((item, index) => (
          <ListItem key={'key' in item ? item.key : item.id}>
            {renderItem(item, index)}
          </ListItem>
        ))}
      </List>
    ),
    [data]
  );

  const descriptionElement = React.useMemo(() => {
    if (isLoading) {
      return <BarLoader color="var(--chakra-colors-gray-600)" />;
    }

    if (!data.length) {
      return null;
    }

    return description ? <Text>{description}</Text> : null;
  }, [isLoading, description]);

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
      <Heading as="h1" size="lg" mb="2">
        {heading}
      </Heading>
      {descriptionElement}
      {!isLoading ? listContent : null}
      {!isLoading && !data.length ? (
        <Alert status="warning">
          <AlertIcon />
          There's no data to display.
        </Alert>
      ) : null}
    </Box>
  );
}
