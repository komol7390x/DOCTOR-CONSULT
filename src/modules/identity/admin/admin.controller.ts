import { FastifyReply, FastifyRequest } from 'fastify';
import { AdminService } from './admin.serive';
import { CreateAdmin } from './admin.schema';

export class AdminController {
  // ------------------------- CREATE -------------------------

  static async create(request: FastifyRequest<{ Body: CreateAdmin }>) {
    const service = new AdminService(request.server);
    const result = await service.createAdmin(request.body);
    return result;
  }

  // ------------------------- SIGN IN -------------------------

  static async signIn(request: FastifyRequest, reply: FastifyReply) {}

  // ------------------------- SIGN OUT -------------------------

  static async logOut(request: FastifyRequest) {}

  // ------------------------- GET ALL -------------------------

  static async getAll(request: FastifyRequest, reply: FastifyReply) {}

  // ------------------------- GET ONE -------------------------

  static async getOne(request: FastifyRequest, reply: FastifyReply) {}

  // ------------------------- DETAILS ME -------------------------

  static async detailsMe(request: FastifyRequest, reply: FastifyReply) {}

  // ------------------------- UPDATE -------------------------

  static async update(request: FastifyRequest) {}

  // ------------------------- UPDATE -------------------------

  static async isActive(request: FastifyRequest, reply: FastifyReply) {}

  // ------------------------- SOFT DELETE -------------------------

  static async softDelete(request: FastifyRequest, reply: FastifyReply) {}

  // ------------------------- HARD DELETE -------------------------

  static async hardDelete(request: FastifyRequest, reply: FastifyReply) {}
}
