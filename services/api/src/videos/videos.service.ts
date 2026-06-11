import { Injectable, NotFoundException } from '@nestjs/common'
import { PrismaService } from '../prisma/prisma.service'

@Injectable()
export class VideosService {
  constructor(private prisma: PrismaService) {}

  async findAll(query: { category?: string; q?: string; page?: number; limit?: number }) {
    const { category, q, page = 1, limit = 12 } = query
    const where: any = {}
    if (category) where.category = category
    if (q)
      where.OR = [
        { title: { contains: q, mode: 'insensitive' } },
        { description: { contains: q, mode: 'insensitive' } },
      ]
    const skip = (page - 1) * limit
    const [videos, total] = await Promise.all([
      this.prisma.video.findMany({ where, skip, take: limit, orderBy: { createdAt: 'desc' } }),
      this.prisma.video.count({ where }),
    ])
    return { videos, total, page, limit }
  }

  async findOne(id: string) {
    const video = await this.prisma.video.findUnique({ where: { id } })
    if (!video) throw new NotFoundException()
    return video
  }

  async create(data: { title: string; description?: string; url: string; category?: string; thumbnailUrl?: string }) {
    return this.prisma.video.create({ data })
  }

  async delete(id: string) {
    await this.prisma.video.delete({ where: { id } })
    return { deleted: true }
  }
}
