import { prisma } from '../lib/prisma'
import { SignupRequest } from '../schemas/user.schema'

const createNew = async (user: SignupRequest) => {
  return await prisma.user.create({
    data: user,
    omit: { hashPassword: true },
  })
}

const verifyUserEmail = async (userId: string) => {
  return await prisma.user.update({
    where: {
      id: userId,
    },
    data: {
      isEmailVerified: true,
    },
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
    omit: {
      hashPassword: true,
    },
  })
}

const getOneByEmailForLogin = async (email: string) => {
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

const updateOneById = async (userId: string, user: SignupRequest) => {
  return await prisma.user.update({
    where: {
      id: userId,
    },
    data: user,
    omit: { hashPassword: true },
  })
}

export default {
  createNew,
  verifyUserEmail,
  getAll,
  getOneById,
  getOneByEmail,
  getOneByEmailForLogin,
  getOneByUsername,
  deleteOneById,
  updateOneById,
}
