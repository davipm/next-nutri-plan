'use client';

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { useAlertActions, useAlertState } from '@/store/use-global-store';

export function GlobalAlertDialog() {
  const { open, config } = useAlertState();
  const { closeAlert, handleCancel, handleConfirm } = useAlertActions();

  const title = config?.title ?? 'Confirm action';
  const description = config?.description;
  const confirmLabel = config?.confirmLabel ?? 'Confirm';
  const cancelLabel = config?.cancelLabel ?? 'Cancel';
  const showCancel = config?.showCancel ?? true;
  const confirmVariant = config?.variant === 'destructive' ? 'destructive' : 'default';

  const handleOpenChange = (isOpen: boolean) => {
    if (!isOpen) {
      closeAlert();
    }
  };

  return (
    <AlertDialog onOpenChange={handleOpenChange} open={open}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>{title}</AlertDialogTitle>
          {description && <AlertDialogDescription>{description}</AlertDialogDescription>}
        </AlertDialogHeader>
        <AlertDialogFooter>
          {showCancel && (
            <AlertDialogCancel onClick={handleCancel}>{cancelLabel}</AlertDialogCancel>
          )}
          <AlertDialogAction onClick={handleConfirm} variant={confirmVariant}>
            {confirmLabel}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
