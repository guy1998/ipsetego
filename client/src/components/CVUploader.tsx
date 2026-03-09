import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { FileText, Upload, Eye, Trash2, Download } from 'lucide-react';

interface CVUploaderProps {
  onCVUpload?: (file: string, fileName: string) => void;
}

const CVUploader = ({ onCVUpload }: CVUploaderProps) => {
  const [cvFile, setCvFile] = useState<{ data: string; name: string } | null>(
    null
  );
  const [isDragging, setIsDragging] = useState(false);
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const files = e.dataTransfer.files;
    if (files.length > 0) {
      handleFileSelect(files[0]);
    }
  };

  const handleFileSelect = (file: File) => {
    // Accept PDF and image files
    if (
      file.type === 'application/pdf' ||
      file.type.startsWith('image/')
    ) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setCvFile({
          data: reader.result as string,
          name: file.name,
        });
        onCVUpload?.(reader.result as string, file.name);
      };
      reader.readAsDataURL(file);
    } else {
      alert('Please upload a PDF or image file');
    }
  };

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      handleFileSelect(files[0]);
    }
  };

  const handleDeleteCV = () => {
    setCvFile(null);
  };

  const getFileSize = (base64: string) => {
    const binary = atob(base64.split(',')[1]);
    return (binary.length / (1024 * 1024)).toFixed(2);
  };

  return (
    <>
      <Card className="p-6 border-border/20">
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-bold flex items-center gap-2">
              <FileText className="w-5 h-5 text-primary" />
              Curriculum Vitae
            </h3>
            {cvFile && (
              <Badge variant="default" className="bg-green-500/10 text-green-700 dark:text-green-400">
                Uploaded
              </Badge>
            )}
          </div>

          {!cvFile ? (
            <div
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
              onClick={() => document.getElementById('cv-input')?.click()}
              className={`border-2 border-dashed rounded-lg p-12 text-center cursor-pointer transition-all duration-200 ${
                isDragging
                  ? 'border-primary bg-primary/5'
                  : 'border-border/30 hover:border-primary/50'
              }`}
            >
              <div className="flex flex-col items-center justify-center gap-3">
                <div className="p-3 bg-primary/10 rounded-lg">
                  <Upload className="w-8 h-8 text-primary" />
                </div>
                <div>
                  <p className="font-medium mb-1">Drag and drop your CV here</p>
                  <p className="text-sm text-muted-foreground">
                    or click to browse (PDF or Image)
                  </p>
                </div>
              </div>
              <input
                id="cv-input"
                type="file"
                accept=".pdf,image/*"
                hidden
                onChange={handleFileInputChange}
              />
            </div>
          ) : (
            <div className="border border-border/20 rounded-lg p-6 space-y-4">
              <div className="flex items-start justify-between">
                <div className="flex items-start gap-4">
                  <div className="p-3 bg-primary/10 rounded-lg flex-shrink-0">
                    {cvFile.data.includes('pdf') ? (
                      <FileText className="w-6 h-6 text-primary" />
                    ) : (
                      <FileText className="w-6 h-6 text-primary" />
                    )}
                  </div>
                  <div>
                    <p className="font-medium">{cvFile.name}</p>
                    <p className="text-sm text-muted-foreground">
                      {getFileSize(cvFile.data)} MB
                    </p>
                  </div>
                </div>
              </div>

              <div className="flex gap-2">
                <Button
                  size="sm"
                  variant="outline"
                  className="flex-1"
                  onClick={() => setIsPreviewOpen(true)}
                >
                  <Eye className="w-4 h-4 mr-2" />
                  Preview
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => {
                    const link = document.createElement('a');
                    link.href = cvFile.data;
                    link.download = cvFile.name;
                    link.click();
                  }}
                >
                  <Download className="w-4 h-4 mr-2" />
                  Download
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  className="text-destructive hover:text-destructive"
                  onClick={handleDeleteCV}
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>

              <Button
                size="sm"
                variant="ghost"
                className="w-full text-muted-foreground hover:text-foreground"
                onClick={() => document.getElementById('cv-input')?.click()}
              >
                <Upload className="w-4 h-4 mr-2" />
                Change CV
              </Button>
              <input
                id="cv-input"
                type="file"
                accept=".pdf,image/*"
                hidden
                onChange={handleFileInputChange}
              />
            </div>
          )}

          <p className="text-xs text-muted-foreground">
            Your CV will be available in your portfolio preview
          </p>
        </div>
      </Card>

      {/* CV Preview Modal */}
      <Dialog open={isPreviewOpen} onOpenChange={setIsPreviewOpen}>
        <DialogContent className="max-w-4xl h-[80vh] flex flex-col">
          <DialogHeader>
            <DialogTitle>CV Preview</DialogTitle>
            <DialogDescription>{cvFile?.name}</DialogDescription>
          </DialogHeader>
          <div className="flex-1 overflow-auto">
            {cvFile?.data.includes('pdf') ? (
              <iframe
                src={cvFile.data}
                className="w-full h-full border-0 rounded-lg"
                title="CV Preview"
              />
            ) : (
              <div className="flex items-center justify-center h-full bg-muted rounded-lg">
                <img
                  src={cvFile?.data}
                  alt="CV Preview"
                  className="max-w-full max-h-full object-contain"
                />
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default CVUploader;
