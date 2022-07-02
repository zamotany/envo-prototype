import { ListIcon, Link, useToast } from '@chakra-ui/react';
import { Link as RouterLink } from 'react-router-dom';
import * as React from 'react';
import { VscCloud, VscEdit, VscDebugDisconnect } from 'react-icons/vsc';
import { useQuery } from 'react-query';
import { ListLayout } from '../components/ListLayout';
import { useApiClient } from '../api';

export function Home() {
  const toast = useToast();
  const apiClient = useApiClient();
  const projectsQuery = useQuery('projects', apiClient.getProjects, {
    onError: () => {
      toast({
        title: 'Ups!',
        description: 'There was a problem fetching projects.',
        status: 'error',
        duration: 9000,
        isClosable: true,
      });
    },
  });

  const projects = (projectsQuery.data?.data ?? []).map((project) => ({
    ...project,
    // TODO: fetch this info from backend - needs implementation in admin-api
    isLive: false,
    hasDraft: false,
  }));

  const renderProject = React.useCallback((project: any) => {
    return (
      <Link
        as={RouterLink}
        to={`project/${project.id}`}
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
        {project.hasDraft ? <ListIcon as={VscEdit} color="yellow.500" /> : null}
        {!project.hasDraft && project.isLive ? (
          <ListIcon as={VscCloud} color="green.500" verticalAlign="middle" />
        ) : null}
        {!project.hasDraft && !project.isLive ? (
          <ListIcon
            as={VscDebugDisconnect}
            color="gray.500"
            verticalAlign="middle"
          />
        ) : null}
        {project.name}
      </Link>
    );
  }, []);

  return (
    <ListLayout
      isLoading={projectsQuery.isLoading}
      heading="Projects"
      description="Select project to view and edit."
      data={projects}
      renderItem={renderProject}
    />
  );
}
