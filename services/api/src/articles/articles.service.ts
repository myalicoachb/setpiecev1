import { Injectable, NotFoundException } from '@nestjs/common'
import { PrismaService } from '../prisma/prisma.service'

@Injectable()
export class ArticlesService {
  constructor(private prisma: PrismaService) {}

  async findAll(query: { category?: string; q?: string; page?: number; limit?: number }) {
    const { category, q, page = 1, limit = 12 } = query
    const where: any = {}
    if (category) where.category = category
    if (q)
      where.OR = [
        { title: { contains: q, mode: 'insensitive' } },
        { content: { contains: q, mode: 'insensitive' } },
      ]
    const skip = (page - 1) * limit
    const [articles, total] = await Promise.all([
      this.prisma.article.findMany({ where, skip, take: limit, orderBy: { createdAt: 'desc' } }),
      this.prisma.article.count({ where }),
    ])
    return { articles, total, page, limit }
  }

  async findOne(id: string) {
    const article = await this.prisma.article.findUnique({ where: { id } })
    if (!article) throw new NotFoundException()
    return article
  }

  async create(data: { title: string; content: string; excerpt?: string; category?: string; imageUrl?: string }) {
    return this.prisma.article.create({ data })
  }

  async update(id: string, data: { title?: string; content?: string; excerpt?: string; category?: string; imageUrl?: string }) {
    const article = await this.prisma.article.findUnique({ where: { id } })
    if (!article) throw new NotFoundException()
    return this.prisma.article.update({ where: { id }, data })
  }

  async delete(id: string) {
    await this.prisma.article.delete({ where: { id } })
    return { deleted: true }
  }
}
