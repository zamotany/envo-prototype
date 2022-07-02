import { Link } from '@chakra-ui/react';
import { Link as RouterLink } from 'react-router-dom';
import * as React from 'react';
import { ListLayout } from '../components/ListLayout';

export function Project() {
  const environments = [
    {
      id: 1,
      key: '1',
      name: 'Development',
    },
    {
      id: 2,
      key: '2',
      name: 'Staging',
    },
    {
      id: 2,
      key: '2',
      name: 'Production',
    },
  ];

  const renderEnvironment = React.useCallback(
    (environment: typeof environments[0]) => {
      return (
        <Link
          as={RouterLink}
          to={`environment/${environment.id}`}
          backgroundColor="white"
          border="1px"
          borderColor="gray.200"
          px="4"
          py="2"
          rounded="base"
          shadow="sm"
          display="block"
          _hover={{
            boxShadow: 'lg',
          }}
        >
          {environment.name}
        </Link>
      );
    },
    []
  );

  return (
    <ListLayout
      heading="Environments"
      description="Select environment to view and edit."
      data={environments}
      renderItem={renderEnvironment}
      backPath="/admin"
    />
  );
}
