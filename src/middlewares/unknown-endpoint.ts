import { Request, Response } from 'express'

const unknownEndpoint = (_req: Request, res: Response) => {
  res.status(404).json({
    message: 'Unknown endpoint',
  })
}

export default unknownEndpoint
