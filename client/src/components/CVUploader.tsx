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
import { FileText, Upload, Eye, Download } from 'lucide-react';
import { Api } from '@/api/api';

interface CVUploaderProps {
  resumeId?: string;
  onUploadSuccess?: (resumeId: string) => void;
}

const CVUploader = ({ resumeId, onUploadSuccess }: CVUploaderProps) => {
  const api = Api.getInstance();
  const [isDragging, setIsDragging] = useState(false);
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [previewBlobUrl, setPreviewBlobUrl] = useState<string | null>(null);

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
      uploadFile(files[0]);
    }
  };

  const uploadFile = async (file: File) => {
    if (file.type !== 'application/pdf' && !file.type.startsWith('image/')) {
      alert('Please upload a PDF or image file');
      return;
    }

    setIsUploading(true);
    try {
      const formData = new FormData();
      formData.append('cv', file);
      const response = await api.post('/user/upload-cv', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      if (response.data.data?.resumeId) {
        setPreviewBlobUrl(null);
        onUploadSuccess?.(response.data.data.resumeId);
      }
    } catch (error) {
      console.error('CV upload failed:', error);
      alert('Failed to upload CV. Please try again.');
    } finally {
      setIsUploading(false);
    }
  };

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      uploadFile(files[0]);
    }
  };

  const loadPreview = async () => {
    if (!resumeId) return;
    if (previewBlobUrl) {
      setIsPreviewOpen(true);
      return;
    }
    try {
      const response = await api.get(`/uploads/cv/${resumeId}`, undefined, {
        responseType: 'blob',
      });
      const blob = new Blob([response.data], { type: response.headers['content-type'] || 'application/pdf' });
      const url = URL.createObjectURL(blob);
      setPreviewBlobUrl(url);
      setIsPreviewOpen(true);
    } catch (error) {
      console.error('Failed to load CV preview:', error);
      alert('Failed to load CV preview.');
    }
  };

  const handleDownload = async () => {
    if (!resumeId) return;
    try {
      const response = await api.get(`/uploads/cv/${resumeId}`, undefined, {
        responseType: 'blob',
      });
      const blob = new Blob([response.data]);
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = resumeId;
      link.click();
      URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Failed to download CV:', error);
    }
  };

  const isPdf = resumeId ? resumeId.toLowerCase().endsWith('.pdf') : true;

  return (
    <>
      <Card className="p-6 border-border/20">
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-bold flex items-center gap-2">
              <FileText className="w-5 h-5 text-primary" />
              Curriculum Vitae
            </h3>
            {resumeId && (
              <Badge variant="default" className="bg-green-500/10 text-green-700 dark:text-green-400">
                Uploaded
              </Badge>
            )}
          </div>

          {!resumeId ? (
            <div
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
              onClick={() => !isUploading && document.getElementById('cv-input')?.click()}
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
                  <p className="font-medium mb-1">
                    {isUploading ? 'Uploading...' : 'Drag and drop your CV here'}
                  </p>
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
              <div className="flex items-start gap-4">
                <div className="p-3 bg-primary/10 rounded-lg flex-shrink-0">
                  <FileText className="w-6 h-6 text-primary" />
                </div>
                <div>
                  <p className="font-medium">Resume</p>
                  <p className="text-sm text-muted-foreground">{isPdf ? 'PDF document' : 'Image file'}</p>
                </div>
              </div>

              <div className="flex gap-2">
                <Button
                  size="sm"
                  variant="outline"
                  className="flex-1"
                  onClick={loadPreview}
                >
                  <Eye className="w-4 h-4 mr-2" />
                  Preview
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={handleDownload}
                >
                  <Download className="w-4 h-4 mr-2" />
                  Download
                </Button>
              </div>

              <Button
                size="sm"
                variant="ghost"
                className="w-full text-muted-foreground hover:text-foreground"
                disabled={isUploading}
                onClick={() => document.getElementById('cv-input-replace')?.click()}
              >
                <Upload className="w-4 h-4 mr-2" />
                {isUploading ? 'Uploading...' : 'Change CV'}
              </Button>
              <input
                id="cv-input-replace"
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
            <DialogDescription>Resume</DialogDescription>
          </DialogHeader>
          <div className="flex-1 overflow-auto">
            {previewBlobUrl && (
              isPdf ? (
                <iframe
                  src={previewBlobUrl}
                  className="w-full h-full border-0 rounded-lg"
                  title="CV Preview"
                />
              ) : (
                <div className="flex items-center justify-center h-full bg-muted rounded-lg">
                  <img
                    src={previewBlobUrl}
                    alt="CV Preview"
                    className="max-w-full max-h-full object-contain"
                  />
                </div>
              )
            )}
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default CVUploader;
