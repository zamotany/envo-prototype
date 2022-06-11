import httpErrors from 'http-errors';
import { CreateProjectSchema } from './schema';

export class ProjectsRepository {
  async getAll() {
    return [];
  }

  async insert(_data: CreateProjectSchema) {
    throw new httpErrors.NotImplemented();
  }

  async remove(_id: string) {
    throw new httpErrors.NotImplemented();
  }
}
