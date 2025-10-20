import { prisma } from '../lib/prisma'
import { RegisterRequest } from '../schemas/user.schema'

const createNew = async (user: RegisterRequest) => {
  return await prisma.user.create({
    data: user,
    omit: { hashPassword: true },
  })
}

const getAll = async () => {
  return await prisma.user.findMany({
    orderBy: {
      createdAt: 'desc',
    },
    omit: { hashPassword: true },
  })
}

const getOneById = async (userId: string) => {
  return await prisma.user.findUnique({
    where: {
      id: userId,
    },
    omit: { hashPassword: true },
  })
}

const getOneByEmail = async (email: string) => {
  return await prisma.user.findUnique({
    where: {
      email,
    },
  })
}

const getOneByUsername = async (username: string) => {
  return await prisma.user.findUnique({
    where: {
      username: username,
    },
    omit: {
      hashPassword: true,
    },
  })
}

const deleteOneById = async (userId: string) => {
  return await prisma.user.delete({
    where: {
      id: userId,
    },
  })
}

export default {
  createNew,
  getAll,
  getOneById,
  getOneByEmail,
  getOneByUsername,
  deleteOneById,
}
