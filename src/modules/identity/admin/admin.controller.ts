import { TokenName } from 'config/token-name';
import { FastifyReply, FastifyRequest } from 'fastify';

export class AdminController {
  static async login(request: FastifyRequest, reply: FastifyReply) {
    const { username, password } = request.body as any;

    const admin = await request.server.prisma.admin.findUnique({ where: { username } });
    if (!admin) throw new Error('Admin topilmadi');

    const isMatch = await request.server.crypto.compare(password, admin.password);
    if (!isMatch) throw new Error('Parol noto`g`ri');

    const payload = {
      id: admin.id,
      role: admin.role,
      isActive: admin.isActive
    };
    const token = await request.server.tokenPlugin.accessToken(payload);
    request.server.tokenPlugin.writeCookie(reply, TokenName.ACCESS, token);

    return { success: true, admin: { username: admin.username, role: admin.role } };
  }

  static async getAll(request: FastifyRequest) {
    return await request.server.prisma.admin.findMany({
      select: {
        id: true,
        fullname: true,
        isActive: true,
        username: true
      }
    });
  }

  static async logout(request: FastifyRequest, reply: FastifyReply) {
    reply.clearCookie(TokenName.ACCESS);
    return { success: true, message: 'Tizimdan chiqildi' };
  }
}
