import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  console.log('🌱 Seeding database...')

  const admin = await prisma.user.upsert({
    where: { email: 'admin@setpiece.com' },
    update: {},
    create: { email: 'admin@setpiece.com', name: 'Admin', role: 'ADMIN', subscription: 'TEAM' },
  })

  const instructor = await prisma.user.upsert({
    where: { email: 'coach@setpiece.com' },
    update: {},
    create: { email: 'coach@setpiece.com', name: 'Ahmed Hassan', role: 'INSTRUCTOR', subscription: 'PRO' },
  })

  const videosData = [
    { title: 'تقنية الركلة الحرة المباشرة', description: 'تعلم كيفية تنفيذ الركلات الحرة المباشرة بدقة وقوة.', category: 'FREE_KICK', duration: 480, tags: ['free-kick', 'shooting', 'technique'] },
    { title: 'استراتيجيات الركنية الهجومية', description: 'تحليل أفضل استراتيجيات الكرات الركنية الهجومية.', category: 'CORNER', duration: 720, tags: ['corner', 'attacking', 'strategy'] },
    { title: 'تنفيذ ركلة الجزاء بثقة', description: 'نصائح وحيل لتنفيذ ركلات الجزاء بنجاح.', category: 'PENALTY', duration: 360, tags: ['penalty', 'mental', 'technique'] },
    { title: 'التوزيع السريع من الرمية الجانبية', description: 'طرق مبتكرة لاستغلال الرميات الجانبية.', category: 'THROW_IN', duration: 540, tags: ['throw-in', 'quick', 'tactic'] },
    { title: 'بناء الهجمة من ركلة المرمى', description: 'كيفية بناء الهجمات من ركلات المرمى بذكاء.', category: 'GOAL_KICK', duration: 600, tags: ['goal-kick', 'build-up', 'possession'] },
    { title: 'تكتيكات ركلة البداية', description: 'خطط مبتكرة لاستغلال ركلات البداية.', category: 'KICKOFF', duration: 420, tags: ['kickoff', 'tactic', 'surprise'] },
    { title: 'تنظيم دفاع الركلات الحرة', description: 'تنظيم الجدار الدفاعي والحائط البشري.', category: 'DEFENSIVE', duration: 660, tags: ['defensive', 'wall', 'organization'] },
    { title: 'خطط هجومية متطورة للكرات الثابتة', description: 'خطط هجومية متطورة من كبار المدربين.', category: 'ATTACKING', duration: 900, tags: ['attacking', 'advanced', 'tactic'] },
  ]

  for (const v of videosData) {
    await prisma.video.upsert({
      where: { muxAssetId: `asset_${v.title}` },
      update: {},
      create: {
        title: v.title, description: v.description,
        muxAssetId: `asset_${v.title}`, muxPlaybackId: `playback_${v.title}`,
        thumbnail: `/thumbnails/${v.category.toLowerCase()}.jpg`,
        duration: v.duration, category: v.category,
        tags: JSON.stringify(v.tags),
        isPremium: false,
      },
    })
  }

  const articlesData = [
    { title: 'فن الركلات الحرة غير المباشرة', slug: 'indirect-free-kick-art', excerpt: 'استراتيجيات متقدمة للركلات الحرة غير المباشرة.', category: 'FREE_KICK', readTime: 8, body: '# فن الركلات الحرة غير المباشرة\n\nالركلات الحرة غير المباشرة تتطلب تنسيقاً عالياً بين اللاعبين...\n\n## التمرير الذكي\nأفضل اللاعبين لا يسددون مباشرة بل يمررون بذكاء...' },
    { title: 'تحليل ركلات الزاوية لمانشستر سيتي', slug: 'man-city-corners', excerpt: 'تحليل تكتيكي لركلات الزاوية لمانشستر سيتي.', category: 'CORNER', readTime: 12, body: '# تحليل ركلات الزاوية لمانشستر سيتي\n\nتحت قيادة بيب غوارديولا، طور مانشستر سيتي نظاماً متقدماً للركلات الركنية...' },
    { title: 'سيكولوجية ركلة الجزاء', slug: 'penalty-psychology', excerpt: 'الجانب النفسي لتنفيذ ركلات الجزاء.', category: 'PENALTY', readTime: 6, body: '# سيكولوجية ركلة الجزاء\n\nركلة الجزاء هي اختبار للأعصاب بقدر ما هي اختبار للمهارة...' },
  ]

  for (const a of articlesData) {
    await prisma.article.upsert({
      where: { slug: a.slug },
      update: {},
      create: { ...a, isPremium: false, publishedAt: new Date() },
    })
  }

  const course = await prisma.course.upsert({
    where: { slug: 'set-piece-mastery' },
    update: {},
    create: {
      title: 'إتقان الكرات الثابتة',
      slug: 'set-piece-mastery',
      description: 'دورة شاملة لتعلم جميع أنواع الكرات الثابتة من الصفر إلى الاحتراف. تشمل تحليل فيديوهات حقيقية وتمارين عملية.',
      level: 'BEGINNER', category: 'FREE_KICK',
      thumbnail: '/courses/set-piece-mastery.jpg',
      isPremium: false,
      modules: {
        create: [
          {
            title: 'أساسيات الكرات الثابتة', order: 1,
            lessons: {
              create: [
                { title: 'مقدمة في الكرات الثابتة', type: 'VIDEO', content: JSON.stringify({ videoUrl: 'lesson-1-intro' }), duration: 300, order: 1 },
                { title: 'قوانين الكرات الثابتة', type: 'ARTICLE', content: JSON.stringify({ body: '# قوانين الكرات الثابتة\n\nقوانين الكرات الثابتة في كرة القدم الحديثة...' }), duration: null, order: 2 },
                { title: 'تمرين تفاعلي: التعرف على الأنواع', type: 'QUIZ', content: JSON.stringify({ questions: [{ q: 'ما هي أنواع الكرات الثابتة؟', options: ['5', '6', '7', '8'], answer: 2 }] }), duration: null, order: 3 },
              ],
            },
          },
          {
            title: 'الركلات الحرة', order: 2,
            lessons: {
              create: [
                { title: 'تقنية التسديد', type: 'VIDEO', content: JSON.stringify({ videoUrl: 'lesson-2-shooting' }), duration: 480, order: 1 },
                { title: 'رسم تكتيكي: وضع الجدار', type: 'DRAWING', content: JSON.stringify({ template: 'free-kick-wall' }), duration: null, order: 2 },
              ],
            },
          },
          {
            title: 'الكرات الركنية', order: 3,
            lessons: {
              create: [
                { title: 'الركنية القصيرة والطويلة', type: 'VIDEO', content: JSON.stringify({ videoUrl: 'lesson-3-corners' }), duration: 600, order: 1 },
                { title: 'تحليل تكتيكي متقدم', type: 'VIDEO', content: JSON.stringify({ videoUrl: 'lesson-4-analysis' }), duration: 720, order: 2 },
              ],
            },
          },
        ],
      },
    },
  })

  await prisma.enrollment.upsert({
    where: { userId_courseId: { userId: admin.id, courseId: course.id } },
    update: {},
    create: { userId: admin.id, courseId: course.id, progress: 45, completed: false },
  })

  console.log('✅ Seed completed!')
  console.log(`📧 Admin: admin@setpiece.com`)
  console.log(`📧 Instructor: coach@setpiece.com`)
}

main()
  .catch((e) => { console.error('❌ Seed failed:', e); process.exit(1) })
  .finally(async () => { await prisma.$disconnect() })
