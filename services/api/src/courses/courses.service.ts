import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common'
import { PrismaService } from '../prisma/prisma.service'

@Injectable()
export class CoursesService {
  constructor(private prisma: PrismaService) {}

  async findAll(query: { category?: string; q?: string; page?: number; limit?: number }) {
    const { category, q, page = 1, limit = 12 } = query
    const where: any = { published: true }
    if (category) where.category = category
    if (q)
      where.OR = [
        { title: { contains: q, mode: 'insensitive' } },
        { description: { contains: q, mode: 'insensitive' } },
      ]
    const skip = (page - 1) * limit
    const [courses, total] = await Promise.all([
      this.prisma.course.findMany({
        where,
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
        include: { _count: { select: { lessons: true, enrollments: true } } },
      }),
      this.prisma.course.count({ where }),
    ])
    return { courses, total, page, limit }
  }

  async findOne(id: string) {
    const course = await this.prisma.course.findUnique({
      where: { id },
      include: { lessons: { orderBy: { order: 'asc' } } },
    })
    if (!course) throw new NotFoundException()
    return course
  }

  async create(data: { title: string; description?: string; category?: string; price?: number; thumbnailUrl?: string }) {
    return this.prisma.course.create({ data })
  }

  async enroll(courseId: string, userId: string) {
    const course = await this.prisma.course.findUnique({ where: { id: courseId } })
    if (!course) throw new NotFoundException('Course not found')
    const existing = await this.prisma.enrollment.findUnique({
      where: { userId_courseId: { userId, courseId } },
    })
    if (existing) return existing
    return this.prisma.enrollment.create({
      data: { userId, courseId },
    })
  }

  async updateProgress(courseId: string, userId: string, lessonId: string) {
    const enrollment = await this.prisma.enrollment.findUnique({
      where: { userId_courseId: { userId, courseId } },
    })
    if (!enrollment) throw new ForbiddenException('Not enrolled')
    const completed = await this.prisma.lessonCompletion.findUnique({
      where: { userId_lessonId: { userId, lessonId } },
    })
    if (completed) return completed
    return this.prisma.lessonCompletion.create({
      data: { userId, lessonId },
    })
  }

  async getProgress(courseId: string, userId: string) {
    const totalLessons = await this.prisma.lesson.count({ where: { courseId } })
    const completed = await this.prisma.lessonCompletion.count({
      where: { userId, lesson: { courseId } },
    })
    return { totalLessons, completed, progress: totalLessons > 0 ? Math.round((completed / totalLessons) * 100) : 0 }
  }

  async delete(id: string) {
    await this.prisma.course.delete({ where: { id } })
    return { deleted: true }
  }
}
