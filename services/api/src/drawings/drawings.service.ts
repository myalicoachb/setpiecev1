import { Injectable, NotFoundException } from '@nestjs/common'
import { PrismaService } from '../prisma/prisma.service'

@Injectable()
export class DrawingsService {
  constructor(private prisma: PrismaService) {}

  async findAll(query: { page?: number; limit?: number }) {
    const { page = 1, limit = 12 } = query
    const skip = (page - 1) * limit
    const [drawings, total] = await Promise.all([
      this.prisma.drawing.findMany({ skip, take: limit, orderBy: { createdAt: 'desc' } }),
      this.prisma.drawing.count(),
    ])
    return { drawings, total, page, limit }
  }

  async findOne(id: string) {
    const drawing = await this.prisma.drawing.findUnique({ where: { id } })
    if (!drawing) throw new NotFoundException()
    return drawing
  }

  async create(data: { title: string; svgContent?: string; imageUrl: string; width?: number; height?: number }) {
    return this.prisma.drawing.create({ data })
  }

  async update(id: string, data: { title?: string; svgContent?: string; imageUrl?: string; width?: number; height?: number }) {
    const drawing = await this.prisma.drawing.findUnique({ where: { id } })
    if (!drawing) throw new NotFoundException()
    return this.prisma.drawing.update({ where: { id }, data })
  }

  async delete(id: string) {
    await this.prisma.drawing.delete({ where: { id } })
    return { deleted: true }
  }
}
