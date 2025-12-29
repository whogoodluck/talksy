import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export const formatDuration = (seconds: number) => {
  const minutes = Math.floor(seconds / 60)
  const remainingSeconds = seconds % 60

  if (minutes > 0) {
    return `${minutes}m ${remainingSeconds}s`
  }
  return `${remainingSeconds}s`
}

export const getTime = (dateStr: string) => {
  const time = new Date(dateStr)
  return time.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' })
}

export function formatDate(date: string) {
  const givenDate = new Date(date)

  const year = givenDate.getFullYear().toString().slice(-2)

  const month = String(givenDate.getMonth() + 1).padStart(2, '0')
  const day = String(givenDate.getDate()).padStart(2, '0')

  return `${day}/${month}/${year}`
}

export const formatDateLabel = (date: Date) => {
  const today = new Date()
  const yesterday = new Date()
  yesterday.setDate(today.getDate() - 1)

  if (date.toDateString() === today.toDateString()) return 'Today'
  if (date.toDateString() === yesterday.toDateString()) return 'Yesterday'

  return date.toLocaleDateString(undefined, {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  })
}

export const formatTimeAgo = (date: string) => {
  const today = new Date()
  const givenDate = new Date(date)

  if (isNaN(givenDate.getTime())) {
    return 'Invalidate Date'
  }

  const seconds = Math.floor((today.getTime() - givenDate.getTime()) / 1000)

  const units = [
    { label: 'y', seconds: 31536000 },
    { label: 'mo', seconds: 2592000 },
    { label: 'd', seconds: 86400 },
    { label: 'h', seconds: 3600 },
    { label: 'm', seconds: 60 },
    { label: 's', seconds: 1 },
  ]

  for (const unit of units) {
    if (seconds >= unit.seconds) {
      const value = Math.floor(seconds / unit.seconds)
      return `${value}${unit.label}`
    }
  }

  return 'Just now'
}

export const formatLastSeen = (date: string) => {
  const today = new Date()
  const givenDate = new Date(date)

  if (isNaN(givenDate.getTime())) {
    return 'Invalidate Date'
  }

  const seconds = Math.floor((today.getTime() - givenDate.getTime()) / 1000)

  const units = [
    { label: 'y', seconds: 31536000 },
    { label: 'mo', seconds: 2592000 },
    { label: 'd', seconds: 86400 },
    { label: 'h', seconds: 3600 },
    { label: 'm', seconds: 60 },
    { label: 's', seconds: 1 },
  ]

  for (const unit of units) {
    if (seconds >= unit.seconds) {
      const value = Math.floor(seconds / unit.seconds)
      return `Last seen ${value}${unit.label} ago`
    }
  }

  return 'Last seen 1s ago'
}
