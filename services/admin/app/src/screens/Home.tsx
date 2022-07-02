import { ListIcon, Link } from '@chakra-ui/react';
import { Link as RouterLink } from 'react-router-dom';
import * as React from 'react';
import { VscCloud, VscEdit, VscDebugDisconnect } from 'react-icons/vsc';
import { ListLayout } from '../components/ListLayout';

export function Home() {
  const projects = [
    {
      id: 1,
      key: '1',
      name: 'Lorem ipsum dolor sit amet, consectetur adipisicing',
      isLive: true,
      hasDraft: false,
    },
    {
      id: 2,
      key: '2',
      name: 'Lorem ipsum dolor sit amet, consectetur adipisicing elit',
      isLive: true,
      hasDraft: true,
    },
    {
      id: 3,
      key: '3',
      name: 'Lorem ipsum dolor sit amet, consectetur adipisicing elit',
      isLive: false,
      hasDraft: true,
    },
    {
      id: 4,
      key: '4',
      name: 'Lorem ipsum dolor sit amet, consectetur adipisicing elit',
      isLive: false,
      hasDraft: false,
    },
  ];

  const renderProject = React.useCallback((project: typeof projects[0]) => {
    return (
      <Link
        as={RouterLink}
        to={`project/${project.id}`}
        backgroundColor="gray.50"
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
          <ListIcon as={VscCloud} color="green.500" />
        ) : null}
        {!project.hasDraft && !project.isLive ? (
          <ListIcon as={VscDebugDisconnect} color="gray.500" />
        ) : null}
        {project.name}
      </Link>
    );
  }, []);

  return (
    <ListLayout
      heading="Projects"
      description="Select project to view and edit."
      data={projects}
      renderItem={renderProject}
    />
  );
}
