class JsonResponse<T> {
  status: 'success' | 'error'
  message: string
  data?: T
  errors?: any

  constructor({
    status,
    message,
    data,
    errors,
  }: {
    status: 'success' | 'error'
    message: string
    data?: T
    errors?: any
  }) {
    this.status = status
    this.message = message
    this.data = data
    this.errors = errors
  }
}

export default JsonResponse
