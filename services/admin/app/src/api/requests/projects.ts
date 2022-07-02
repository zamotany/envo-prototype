import ky from 'ky';
import { GetProjectsResponse, Serialized } from '../types';

export const getProjects =
  (client: typeof ky) => async (): Promise<GetProjectsResponse> => {
    const response = (await client.get('projects').json()) as Serialized<
      GetProjectsResponse,
      { createdAt: string; updatedAt: string }
    >;

    return {
      ...response,
      data: response.data.map((project) => ({
        ...project,
        createdAt: new Date(project.createdAt),
        updatedAt: new Date(project.updatedAt),
      })),
    };
  };
