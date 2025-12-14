import userService from '../services/user.service'
import verificationService from '../services/verification.service'
import logger from '../utils/logger'

const cleanupExpiredCodes = async () => {
  try {
    const result = await verificationService.deleteExpiredCodes()
    logger.info(`Deleted ${result.count} expired codes`)
  } catch (error) {
    if (error instanceof Error) {
      logger.error(error.message)
    }
  }
}

const cleanupUnverifiedUsers = async () => {
  try {
    const result = await userService.deleteUnverifiedUsers()
    logger.info(`Deleted ${result.count} unverified users`)
  } catch (error) {
    if (error instanceof Error) {
      logger.error(error.message)
    }
  }
}

export const runAllCleanups = async () => {
  logger.info('Running cleanup jobs')
  await cleanupExpiredCodes()
  await cleanupUnverifiedUsers()

  process.exit()
}

runAllCleanups()
