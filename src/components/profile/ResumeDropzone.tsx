'use client';

import { useRef, useState } from 'react';
import { Loader2, UploadCloud } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { cn } from '@/lib/utils';

const ACCEPTED_TYPES = '.pdf,.doc,.docx';

interface ResumeDropzoneProps {
  onFileSelected: (file: File) => void;
  isUploading?: boolean;
  error?: string | null;
}

export function ResumeDropzone({
  onFileSelected,
  isUploading = false,
  error,
}: ResumeDropzoneProps) {
  const [isDragActive, setIsDragActive] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  function handleFiles(files: FileList | null) {
    const file = files?.[0];
    if (file) {
      onFileSelected(file);
    }
  }

  return (
    <Card
      className={cn(
        'border-dashed shadow-none transition-colors',
        isDragActive && 'border-primary bg-primary/5',
      )}
      onDragOver={(event) => {
        event.preventDefault();
        setIsDragActive(true);
      }}
      onDragLeave={() => setIsDragActive(false)}
      onDrop={(event) => {
        event.preventDefault();
        setIsDragActive(false);
        handleFiles(event.dataTransfer.files);
      }}
    >
      <CardContent className="flex flex-col items-center gap-4 py-16 text-center">
        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
          <UploadCloud className="h-6 w-6 text-primary" />
        </div>
        <div className="space-y-1">
          <h3 className="text-base font-semibold">Upload your resume</h3>
          <p className="max-w-sm text-sm text-muted-foreground">
            Drop a PDF or Word document here, or browse your files.
            We&apos;ll extract your details automatically.
          </p>
        </div>
        <div>
          <Button
            type="button"
            onClick={() => inputRef.current?.click()}
            disabled={isUploading}
          >
            {isUploading ? (
              <Loader2 className="animate-spin" />
            ) : (
              <UploadCloud />
            )}
            {isUploading ? 'Uploading…' : 'Choose file'}
          </Button>
          <input
            ref={inputRef}
            type="file"
            accept={ACCEPTED_TYPES}
            className="sr-only"
            aria-label="Resume file"
            onChange={(event) => handleFiles(event.target.files)}
          />
        </div>
        {error ? (
          <p className="text-sm text-destructive" role="alert">
            {error}
          </p>
        ) : null}
      </CardContent>
    </Card>
  );
}
