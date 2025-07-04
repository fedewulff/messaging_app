const { PrismaClient } = require("../../generated/prisma")

const prisma = new PrismaClient({
  omit: {
    user: {
      refToken: true,
    },
  },
})

module.exports = prisma
