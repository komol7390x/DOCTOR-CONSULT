import { TokenName } from 'config/token-name';
import { FastifyReply, FastifyRequest } from 'fastify';

export class AdminController {
  
  static async create(request: FastifyRequest, reply: FastifyReply) {}

  static async signIn(request: FastifyRequest, reply: FastifyReply) {}

  static async logOut(request: FastifyRequest) {}

  static async getAll(request: FastifyRequest, reply: FastifyReply) {}

  static async getOne(request: FastifyRequest, reply: FastifyReply) {}

  static async detailsMe(request: FastifyRequest, reply: FastifyReply) {}

  static async update(request: FastifyRequest) {}

  static async isActive(request: FastifyRequest, reply: FastifyReply) {}

  static async softDelete(request: FastifyRequest, reply: FastifyReply) {}

  static async hardDelete(request: FastifyRequest, reply: FastifyReply) {}
}
