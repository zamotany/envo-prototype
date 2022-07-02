export type { HTTPError } from 'ky';

export interface Response<D> {
  data: D;
}

export interface LoginPayload {
  data: {
    username: string;
    password: string;
  };
}

export interface LoginResponse {
  data: {
    token: string;
  };
}

export interface Project {
  id: number;
  createdAt: Date;
  updatedAt: Date;
  name: string;
  description: string | null;
  ownerId: number;
}

export interface GetProjectsResponse extends Response<Project[]> {}

export type Replace<Input extends {}, Overrides extends {}> = Omit<
  Input,
  keyof Overrides
> &
  Overrides;

export type Serialized<
  Res extends Response<any>,
  Overrides extends {}
> = Res extends Response<infer Data>
  ? Data extends Array<infer Item>
    ? Response<Array<Replace<Item, Overrides>>>
    : Response<Replace<Data, Overrides>>
  : never;
