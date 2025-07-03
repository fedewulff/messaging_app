const { PrismaClient } = require("../../generated/prisma")

const prisma = new PrismaClient({
  omit: {
    user: {
      password: true,
      refToken: true,
    },
  },
})

module.exports = prisma
