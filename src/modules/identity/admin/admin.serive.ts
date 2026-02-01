import { FastifyInstance } from 'fastify';
import { Admin, Prisma } from 'generated/prisma';
import { BaseService } from 'modules/base-service/base-service';

export class AdminService extends BaseService<Admin, Prisma.AdminUncheckedCreateInput, Prisma.AdminUncheckedUpdateInput, Prisma.AdminDelegate<any>> {
  constructor(fastify: FastifyInstance) {
    super(fastify, fastify.prisma.admin);
  }
}
