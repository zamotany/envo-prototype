import { Button } from '@chakra-ui/react';
import * as React from 'react';
import { useParams } from 'react-router-dom';
import { ListLayout } from '../components/ListLayout';

export function Environment() {
  const { projectId } = useParams();

  const configs = [
    {
      id: 1,
      key: '1',
    },
  ];

  const renderEnvironment = React.useCallback((_config: typeof configs[0]) => {
    return (
      <Button
        backgroundColor="gray.50"
        px="4"
        py="2"
        rounded="base"
        shadow="sm"
        display="block"
        fontWeight="normal"
        width="full"
        textAlign="left"
        _hover={{
          boxShadow: 'lg',
        }}
      >
        Lorem Ipsum
      </Button>
    );
  }, []);

  return (
    <ListLayout
      heading="Configs"
      description="Select config to view and edit."
      data={configs}
      renderItem={renderEnvironment}
      backPath={`/admin/project/${projectId}`}
    />
  );
}
