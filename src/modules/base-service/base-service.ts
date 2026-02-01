import { FastifyInstance } from 'fastify';
import Error from 'http-errors';

export class BaseService<T extends { id: string | number }, C, U, D> {
  constructor(
    protected readonly fastify: FastifyInstance,
    protected readonly delegate: D
  ) {}

  private get model(): any {
    return this.delegate;
  }

  async create(data: C): Promise<T> {
    return await this.model.create({ data });
  }

  async findAll(args?: { where?: object; include?: object; orderBy?: object }): Promise<T[]> {
    return await this.model.findMany(args);
  }

  async findAllWithPagination(params: { page?: number; limit?: number; where?: object; include?: object; orderBy?: object }) {
    const page = Math.max(1, params.page || 1);
    const limit = Math.min(100, Math.max(1, params.limit || 10));
    const skip = (page - 1) * limit;

    const [items, total] = await Promise.all([
      this.model.findMany({
        where: params.where,
        include: params.include,
        orderBy: params.orderBy,
        skip,
        take: limit
      }),
      this.model.count({ where: params.where })
    ]);

    return {
      items: items as T[],
      total,
      page,
      limit
    };
  }

  async findOneById(id: T['id'], include?: object): Promise<T> {
    const data = await this.model.findUnique({
      where: { id },
      include
    });

    if (!data) {
      throw new Error.NotFound(`Resource with ID ${id} not found`);
    }
    return data;
  }

  async update(id: T['id'], data: U): Promise<T> {
    await this.findOneById(id);
    return await this.model.update({
      where: { id },
      data
    });
  }

  async delete(id: T['id']): Promise<T> {
    await this.findOneById(id);
    return await this.model.delete({ where: { id } });
  }

  async updateStatus(id: T['id'], active: boolean): Promise<T> {
    const record = (await this.findOneById(id)) as any;

    if (!('isActive' in record)) {
      throw new Error.BadRequest('This model does not have an isActive field');
    }

    return await this.model.update({
      where: { id },
      data: { isActive: active }
    });
  }

  async softDelete(id: T['id'], status: boolean = true): Promise<T> {
    const record = (await this.findOneById(id)) as any;

    const updateData: any = {};
    if ('isDeleted' in record) updateData.isDeleted = status;
    if ('isActive' in record) updateData.isActive = !status;

    if (Object.keys(updateData).length === 0) {
      throw new Error.BadRequest('Model does not support soft delete');
    }

    return await this.model.update({
      where: { id },
      data: updateData
    });
  }

  static success<T>(data: T, statusCode: number = 200) {
    return {
      success: true,
      statusCode,
      message: 'success',
      data
    };
  }
}
