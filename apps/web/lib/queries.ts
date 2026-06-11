import { prisma } from './db'

export const videoQueries = {
  list: (params: { category?: string; level?: string; q?: string; page?: number; limit?: number }) => {
    const { category, q, page = 1, limit = 12 } = params
    const where: any = {}
    if (category && category !== 'ALL') where.category = category
    if (q) where.OR = [{ title: { contains: q, mode: 'insensitive' } }, { description: { contains: q, mode: 'insensitive' } }]
    const skip = (page - 1) * limit
    return Promise.all([
      prisma.video.findMany({ where, skip, take: limit, orderBy: { createdAt: 'desc' } }),
      prisma.video.count({ where }),
    ])
  },
  byId: (id: string) => prisma.video.findUnique({ where: { id } }),
  related: (category: string, excludeId: string) =>
    prisma.video.findMany({ where: { category: category as any, id: { not: excludeId } }, take: 4, orderBy: { createdAt: 'desc' } }),
}

export const courseQueries = {
  list: (params: { level?: string; category?: string }) => {
    const where: any = {}
    if (params.level && params.level !== 'ALL') where.level = params.level
    if (params.category && params.category !== 'ALL') where.category = params.category
    return prisma.course.findMany({ where, include: { modules: { include: { lessons: true } }, _count: { select: { enrollments: true } } }, orderBy: { createdAt: 'desc' } })
  },
  bySlug: (slug: string) =>
    prisma.course.findUnique({
      where: { slug },
      include: {
        modules: { orderBy: { order: 'asc' }, include: { lessons: { orderBy: { order: 'asc' } } } },
        _count: { select: { enrollments: true } },
      },
    }),
}

export const articleQueries = {
  list: (params: { category?: string; q?: string; page?: number }) => {
    const { category, q, page = 1 } = params
    const where: any = { publishedAt: { not: null } }
    if (category && category !== 'ALL') where.category = category
    if (q) where.OR = [{ title: { contains: q, mode: 'insensitive' } }, { excerpt: { contains: q, mode: 'insensitive' } }]
    return Promise.all([
      prisma.article.findMany({ where, skip: (page - 1) * 10, take: 10, orderBy: { publishedAt: 'desc' } }),
      prisma.article.count({ where }),
    ])
  },
  bySlug: (slug: string) => prisma.article.findUnique({ where: { slug } }),
}

export const enrollmentQueries = {
  upsert: (userId: string, courseId: string) =>
    prisma.enrollment.upsert({ where: { userId_courseId: { userId, courseId } }, update: {}, create: { userId, courseId } }),
  updateProgress: (userId: string, courseId: string, progress: number) =>
    prisma.enrollment.update({ where: { userId_courseId: { userId, courseId } }, data: { progress: Math.min(progress, 100), completed: progress >= 100 } }),
  getUserEnrollments: (userId: string) =>
    prisma.enrollment.findMany({ where: { userId }, include: { course: true }, orderBy: { createdAt: 'desc' } }),
}

export const drawingQueries = {
  getUserDrawings: (userId: string) => prisma.drawing.findMany({ where: { userId }, orderBy: { createdAt: 'desc' } }),
  getPublicDrawings: () => prisma.drawing.findMany({ where: { isPublic: true }, include: { user: { select: { name: true, avatar: true } } }, orderBy: { createdAt: 'desc' } }),
}

export const savedContentQueries = {
  getUserSaved: (userId: string) => prisma.savedContent.findMany({ where: { userId }, orderBy: { createdAt: 'desc' } }),
  toggle: (userId: string, contentId: string, contentType: string) =>
    prisma.$transaction(async (tx) => {
      const existing = await tx.savedContent.findUnique({ where: { userId_contentId_contentType: { userId, contentId, contentType } } })
      if (existing) { await tx.savedContent.delete({ where: { id: existing.id } }); return { saved: false } }
      await tx.savedContent.create({ data: { userId, contentId, contentType } })
      return { saved: true }
    }),
}
