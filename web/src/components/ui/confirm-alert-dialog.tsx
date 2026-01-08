import type { Dispatch, ReactNode, SetStateAction } from 'react'
import { LoadingButton } from '../loading-button'
import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from './alert-dialog'

interface ConfirmAlertDialogProps {
  open: boolean
  onOpenChange: Dispatch<SetStateAction<boolean>>
  icon?: ReactNode
  title: string
  description?: string
  confirmText?: string
  loadingText?: string
  isLoading?: boolean
  onConfirm: () => void
  variant?: 'default' | 'destructive'
}

export function ConfirmAlertDialog({
  open,
  onOpenChange,
  icon,
  title,
  description,
  confirmText = 'Confirm',
  loadingText,
  isLoading = false,
  onConfirm,
  variant = 'destructive',
}: ConfirmAlertDialogProps) {
  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle className='flex items-center gap-3'>
            {icon}
            {title}
          </AlertDialogTitle>

          {description && <AlertDialogDescription>{description}</AlertDialogDescription>}
        </AlertDialogHeader>

        <AlertDialogFooter>
          <LoadingButton
            variant={variant}
            onClick={onConfirm}
            isLoading={isLoading}
            loadingText={loadingText}
            loaderVariant='background'
          >
            {confirmText}
          </LoadingButton>

          <AlertDialogCancel disabled={isLoading}>Cancel</AlertDialogCancel>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}
