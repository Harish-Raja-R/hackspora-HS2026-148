const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function runTest() {
  console.log("--- CRUD TEST ---");
  let userId;
  try {
    const user = await prisma.user.create({
      data: {
        email: `test_${Date.now()}@test.com`,
        passwordHash: 'dummy_hash',
        role: 'USER'
      }
    });
    userId = user.id;
    console.log("CREATE User: OK, ID:", user.id);

    const inv = await prisma.investigation.create({
      data: {
        user: { connect: { id: user.id } },
        title: 'Test Investigation',
        inputType: 'TEXT',
        status: 'COMPLETED',
        riskScore: 85,
      }
    });
    console.log("CREATE Investigation: OK, ID:", inv.id);

    const evidence = await prisma.evidence.create({
      data: {
        investigation: { connect: { id: inv.id } },
        type: 'TEXT_MATCH',
        contentHash: 'some-hash',
        metadata: { confidence: 90 }
      }
    });
    console.log("CREATE Evidence: OK, ID:", evidence.id);

    // Read
    const fetchedUser = await prisma.user.findUnique({
      where: { id: user.id },
      include: { investigations: true }
    });
    console.log("READ User & Rel: OK. Investigation Count:", fetchedUser.investigations.length);

    // Update
    const updatedUser = await prisma.user.update({
      where: { id: user.id },
      data: { role: 'SECURITY_ANALYST' }
    });
    console.log("UPDATE User: OK. New Role:", updatedUser.role);

    // Delete
    await prisma.evidence.delete({ where: { id: evidence.id } });
    await prisma.investigation.delete({ where: { id: inv.id } });
    await prisma.user.delete({ where: { id: user.id } });
    console.log("DELETE Cascaded/Cleaned up: OK");

    console.log("CRUD TEST PASSED");

  } catch (error) {
    console.error("CRUD TEST FAILED:", error);
  } finally {
    if (userId) {
        await prisma.user.deleteMany({ where: { passwordHash: 'dummy_hash' } });
    }
    await prisma.$disconnect();
  }
}

runTest();
