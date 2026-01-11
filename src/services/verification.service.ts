import { VerificationType } from '@prisma/client'
import { prisma } from '../lib/prisma'

const deleteExpiredCodes = async () => {
  return await prisma.verificationCode.deleteMany({
    where: {
      expiresAt: {
        lt: new Date(),
      },
    },
  })
}

const deleteUserCodes = async (userId: string, type?: VerificationType) => {
  return await prisma.verificationCode.deleteMany({
    where: {
      userId,
      ...(type && { type }),
    },
  })
}

const createVerificationCode = async (userId: string, type: VerificationType) => {
  await deleteUserCodes(userId, type)

  const code = Math.floor(100000 + Math.random() * 900000).toString()
  const expiresAt = new Date(Date.now() + 10 * 60 * 1000)

  return await prisma.verificationCode.create({
    data: {
      code,
      userId,
      type,
      expiresAt,
    },
  })
}

const verifyCode = async (userId: string, code: string, type: VerificationType) => {
  const verificationCode = await prisma.verificationCode.findFirst({
    where: {
      userId,
      code,
      type,
      isUsed: false,
      expiresAt: {
        gt: new Date(),
      },
    },
  })

  if (!verificationCode) {
    return null
  }

  await prisma.verificationCode.update({
    where: {
      id: verificationCode.id,
    },
    data: {
      isUsed: true,
    },
  })

  return verificationCode
}

const checkVerificationCode = async (email: string, code: string, type: VerificationType) => {
  return await prisma.verificationCode.findFirst({
    where: {
      user: {
        email,
      },
      code,
      type,
      isUsed: false,
      expiresAt: {
        gt: new Date(),
      },
    },
  })
}

const verifyCodeByEmail = async (email: string, code: string, type: VerificationType) => {
  const verificationCode = await prisma.verificationCode.findFirst({
    where: {
      user: {
        email,
      },
      code,
      type,
      isUsed: false,
      expiresAt: {
        gt: new Date(),
      },
    },
  })

  if (!verificationCode) {
    return null
  }

  await prisma.verificationCode.update({
    where: {
      id: verificationCode.id,
    },
    data: {
      isUsed: true,
    },
  })

  return verificationCode
}

export default {
  deleteExpiredCodes,
  deleteUserCodes,
  createVerificationCode,
  verifyCode,
  checkVerificationCode,
  verifyCodeByEmail,
}
