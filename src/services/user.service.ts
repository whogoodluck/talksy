import { User } from '@prisma/client'
import { prisma } from '../lib/prisma'
import { SignupRequest } from '../schemas/user.schema'

export const USER_SAFE_FIELDS = {
  hashPassword: true,
}

const generateUniqueUsernameFromEmail = async (email: string) => {
  let username = email.split('@')[0]

  const existingUser = await prisma.user.findUnique({
    where: {
      username,
    },
  })

  if (existingUser) {
    username = `${username.replace(/[^a-z]/g, '')}_${existingUser.id.slice(0, 5)}`
  }

  return username
}

const createNew = async (user: SignupRequest) => {
  return await prisma.user.create({
    data: user,
    omit: USER_SAFE_FIELDS,
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
    omit: USER_SAFE_FIELDS,
  })
}

const getAll = async () => {
  return await prisma.user.findMany({
    orderBy: {
      createdAt: 'desc',
    },
    omit: USER_SAFE_FIELDS,
  })
}

const getOneById = async (userId: string) => {
  return await prisma.user.findUnique({
    where: {
      id: userId,
    },
    omit: USER_SAFE_FIELDS,
  })
}

const getOneByEmail = async (email: string) => {
  return await prisma.user.findUnique({
    where: {
      email,
    },
    omit: USER_SAFE_FIELDS,
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
      username,
    },
    omit: USER_SAFE_FIELDS,
  })
}

const updateOneById = async (userId: string, user: Partial<User>) => {
  return await prisma.user.update({
    where: {
      id: userId,
    },
    data: user,
    omit: USER_SAFE_FIELDS,
  })
}

const deleteOneById = async (userId: string) => {
  return await prisma.user.delete({
    where: {
      id: userId,
    },
  })
}

const deleteUnverifiedUsers = async (daysOld: number = 7) => {
  const cutoffDate = new Date()
  cutoffDate.setDate(cutoffDate.getDate() - daysOld)

  return await prisma.user.deleteMany({
    where: {
      isEmailVerified: false,
      createdAt: {
        lt: cutoffDate,
      },
    },
  })
}

export default {
  generateUniqueUsernameFromEmail,
  createNew,
  verifyUserEmail,
  getAll,
  getOneById,
  getOneByEmail,
  getOneByEmailForLogin,
  getOneByUsername,
  updateOneById,
  deleteOneById,
  deleteUnverifiedUsers,
}
