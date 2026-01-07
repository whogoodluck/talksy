import { Trash2 } from 'lucide-react'
import type { Dispatch, SetStateAction } from 'react'
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

interface DeleteAlertDialogProps {
  open: boolean
  onOpenChange: Dispatch<SetStateAction<boolean>>
  icon?: React.ReactNode
  title?: string
  description?: string
  isLoading: boolean
  onAction: () => void
  actionName?: string
}

function DeleteAlertDialog({
  open,
  onOpenChange,
  icon,
  title = 'Delete?',
  description = 'Are you sure you want to delete?',
  isLoading,
  onAction,
  actionName = 'Delete',
}: DeleteAlertDialogProps) {
  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle className='flex items-center gap-3'>
            {icon ? icon : <Trash2 />}
            {title}
          </AlertDialogTitle>
          <AlertDialogDescription>{description}</AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <LoadingButton
            variant='destructive'
            onClick={onAction}
            isLoading={isLoading}
            loadingText='Deleting...'
          >
            {actionName}
          </LoadingButton>
          <AlertDialogCancel disabled={isLoading}>Cancel</AlertDialogCancel>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}

export default DeleteAlertDialog
