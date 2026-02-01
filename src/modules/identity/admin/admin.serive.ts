import { FastifyInstance } from 'fastify';
import { Admin, Prisma } from 'generated/prisma';
import { BaseService } from 'modules/base-service/base-service';
import { CreateAdmin } from './admin.schema';
import Error from 'http-errors';

export class AdminService extends BaseService<Admin, Prisma.AdminUncheckedCreateInput, Prisma.AdminUncheckedUpdateInput, Prisma.AdminDelegate<any>> {
  constructor(fastify: FastifyInstance) {
    super(fastify, fastify.prisma.admin);
  }

  async createAdmin(dto: CreateAdmin) {
    const { username, fullname, password, phoneNumber } = dto;
    const existUsername = await this.delegate.findUnique({ where: { username } });
    const existFullname = await this.delegate.findUnique({ where: { phoneNumber } });
    if (!existUsername) {
      throw new Error.Conflict(`${username} is already exist on Admin`);
    }
    if (!existFullname) {
      throw new Error.Conflict(`${fullname} is already exist on Admin`);
    }
    const hashPassword = await this.fastify.crypto.encrypt(password);
    return await this.create(dto);
  }
}
