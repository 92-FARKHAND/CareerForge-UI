'use client';

import { useState } from 'react';
import { Trash2 } from 'lucide-react';

import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { getApiErrorMessage } from '@/lib/utils/api-error';

interface ConfirmDeleteButtonProps {
  /** Accessible name for the trigger, e.g. "Delete resume". */
  label: string;
  title: string;
  description: string;
  /** Should reject if the delete fails; the message is shown in the dialog. */
  onConfirm: () => Promise<unknown>;
  /** Render a labelled button instead of an icon-only one. */
  showLabel?: boolean;
}

export function ConfirmDeleteButton({
  label,
  title,
  description,
  onConfirm,
  showLabel = false,
}: ConfirmDeleteButtonProps) {
  const [open, setOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleConfirm() {
    setIsDeleting(true);
    setError(null);

    try {
      await onConfirm();
      setOpen(false);
    } catch (err) {
      setError(getApiErrorMessage(err, 'Could not delete. Please try again.'));
    } finally {
      setIsDeleting(false);
    }
  }

  return (
    <Dialog
      open={open}
      onOpenChange={(next) => {
        // Don't let the dialog close mid-request.
        if (isDeleting) return;
        setOpen(next);
        if (!next) setError(null);
      }}
    >
      <DialogTrigger
        render={
          showLabel ? (
            <Button variant="outline" size="sm" />
          ) : (
            <Button variant="ghost" size="icon" aria-label={label} title={label} />
          )
        }
      >
        <Trash2 className="text-destructive" />
        {showLabel ? label : null}
      </DialogTrigger>

      <DialogContent>
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription>{description}</DialogDescription>
        </DialogHeader>

        {error ? (
          <p
            role="alert"
            className="rounded-lg border border-destructive/30 bg-destructive/10 px-3 py-2 text-sm text-destructive"
          >
            {error}
          </p>
        ) : null}

        <DialogFooter>
          <Button
            variant="outline"
            onClick={() => setOpen(false)}
            disabled={isDeleting}
          >
            Cancel
          </Button>
          <Button
            variant="destructive"
            onClick={handleConfirm}
            disabled={isDeleting}
          >
            {isDeleting ? 'Deleting…' : 'Delete'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
