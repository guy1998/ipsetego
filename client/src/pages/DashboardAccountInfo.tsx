import React, { useEffect, useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Mail, Calendar, RefreshCw, Download } from 'lucide-react';
import { Api } from '@/api/api';
import { useToast } from '@/hooks/use-toast';
import PortfolioDashboardLayout from '@/components/PortfolioDashboardLayout';

const AccountInfoContent = () => {
  const api = Api.getInstance();
  const { toast } = useToast();

  const [email, setEmail] = useState('');
  const [createdAt, setCreatedAt] = useState('');
  const [updatedAt, setUpdatedAt] = useState('');
  const [modalOpen, setModalOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    api.get('/user/profile').then((res) => {
      const user = res.data.data;
      if (user) {
        setEmail(user.email || '');
        setCreatedAt(user.createdAt ? new Date(user.createdAt).toLocaleString() : '—');
        setUpdatedAt(user.updatedAt ? new Date(user.updatedAt).toLocaleString() : '—');
      }
    }).catch(() => {});
  }, []);

  const handleRequestData = async () => {
    setLoading(true);
    setModalOpen(false);
    try {
      await api.post('/user/request-data');
      toast({
        title: 'Request sent!',
        description: 'Check your email for a secure download link.',
      });
    } catch {
      toast({
        title: 'Error',
        description: 'Failed to send request. Please try again.',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-4xl font-bold">Account Information</h1>
        <p className="text-muted-foreground text-lg mt-1">
          View your account details and manage your data.
        </p>
      </div>

      <Card className="p-6 border-border/20 space-y-5">
        <h2 className="text-xl font-bold">Account Details</h2>
        <div className="space-y-4">
          <div className="flex items-start gap-3">
            <div className="p-2 bg-primary/10 rounded-lg flex-shrink-0">
              <Mail className="w-4 h-4 text-primary" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Email Address</p>
              <p className="font-medium">{email || '—'}</p>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <div className="p-2 bg-primary/10 rounded-lg flex-shrink-0">
              <Calendar className="w-4 h-4 text-primary" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Account Created</p>
              <p className="font-medium">{createdAt || '—'}</p>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <div className="p-2 bg-primary/10 rounded-lg flex-shrink-0">
              <RefreshCw className="w-4 h-4 text-primary" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Last Profile Update</p>
              <p className="font-medium">{updatedAt || '—'}</p>
            </div>
          </div>
        </div>
      </Card>

      <Card className="p-6 border-border/20 space-y-3">
        <h2 className="text-xl font-bold">Your Data</h2>
        <p className="text-sm text-muted-foreground">
          Request a complete export of everything tied to your account — your profile, projects, experience, certifications, profile picture, and CV.
        </p>
        <Button variant="outline" onClick={() => setModalOpen(true)} disabled={loading}>
          <Download className="w-4 h-4 mr-2" />
          {loading ? 'Sending...' : 'Request My Data'}
        </Button>
      </Card>

      <Dialog open={modalOpen} onOpenChange={setModalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Request Your Data</DialogTitle>
            <DialogDescription>
              We'll send a secure download link to your registered email address. Clicking the link will download a ZIP archive containing your full profile, projects, experience, certifications, profile picture, and CV. The link will expire after 24 hours.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setModalOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleRequestData}>Continue</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

const DashboardAccountInfo = () => (
  <PortfolioDashboardLayout>
    <AccountInfoContent />
  </PortfolioDashboardLayout>
);

export default DashboardAccountInfo;
