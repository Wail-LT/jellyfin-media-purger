export async function register() {
  if (process.env.NEXT_RUNTIME === 'nodejs') {
    const { prisma } = await import('@/lib/prisma');
    await prisma.$connect();
    await prisma.settings.upsert({
      where: { id: 1 },
      create: { id: 1 },
      update: {},
    });
    const { initScheduler } = await import('@/lib/scheduler');
    await initScheduler();
  }
}
