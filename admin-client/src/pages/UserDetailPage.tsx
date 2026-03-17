import { useState, useEffect } from 'react';
import AdminDashboardLayout from '@/components/AdminDashboardLayout';
import { AdminApi } from '@/api/api';
import { useToast } from '@/hooks/use-toast';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Ban, ArrowLeft, User } from 'lucide-react';
import { useParams, useNavigate } from 'react-router-dom';

interface UserDetail {
  id: number;
  name: string;
  lastname: string;
  email: string;
  phoneNumber: string;
  address: string;
  birthday: string;
  role: string;
  isActive: boolean;
  personalSlug: string;
  publicId: string;
  pictureId: string | null;
  resumeId: string | null;
  linkedin: string | null;
  github: string | null;
  xing: string | null;
  twitter: string | null;
  instagram: string | null;
  youtube: string | null;
  tiktok: string | null;
  hobbies: string[] | null;
  languages: unknown[] | null;
  skills: unknown[] | null;
  createdAt: string;
  updatedAt: string;
}

function UserDetailPage() {
  const { id } = useParams<{ id: string }>();
  const [user, setUser] = useState<UserDetail | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isBanning, setIsBanning] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();
  const api = AdminApi.getInstance();

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await api.get(`/admin/users/${id}`);
        setUser(response.data.data);
      } catch {
        toast({ title: 'Error!', description: 'Failed to load user details.' });
        navigate('/admin/users');
      } finally {
        setIsLoading(false);
      }
    };
    fetchUser();
  }, [id]);

  const handleBan = async () => {
    if (!user) return;
    setIsBanning(true);
    try {
      const response = await api.put(`/admin/users/${user.id}/ban`, {});
      setUser(prev => prev ? { ...prev, isActive: response.data.data.isActive } : prev);
      toast({
        title: 'Success!',
        description: `User ${user.isActive ? 'banned' : 'unbanned'} successfully.`,
      });
    } catch {
      toast({ title: 'Error!', description: 'Failed to update user status.' });
    } finally {
      setIsBanning(false);
    }
  };

  const formatDate = (iso: string) => {
    if (!iso) return '—';
    try {
      return new Date(iso).toLocaleDateString('en-GB', { day: '2-digit', month: 'long', year: 'numeric' });
    } catch {
      return iso;
    }
  };

  const Field = ({ label, value }: { label: string; value: unknown }) => (
    <div className="space-y-1">
      <p className="text-xs text-muted-foreground uppercase tracking-wide">{label}</p>
      <p className="text-sm font-medium">{String(value ?? '—') || '—'}</p>
    </div>
  );

  if (isLoading) {
    return (
      <AdminDashboardLayout>
        <div className="flex items-center justify-center py-20 text-muted-foreground">
          Loading user...
        </div>
      </AdminDashboardLayout>
    );
  }

  if (!user) return null;

  return (
    <AdminDashboardLayout>
      <div className="space-y-6 animate-fade-in-up">
        {/* Header */}
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="sm" onClick={() => navigate('/admin/users')}>
            <ArrowLeft className="w-4 h-4 mr-1" />
            Back
          </Button>
          <div className="flex-1">
            <h1 className="text-2xl font-bold">{user.name} {user.lastname}</h1>
            <p className="text-muted-foreground text-sm">{user.email}</p>
          </div>
          <div className="flex items-center gap-3">
            <Badge variant={user.isActive ? 'outline' : 'destructive'}>
              {user.isActive ? 'Active' : 'Banned'}
            </Badge>
            <Button
              variant={user.isActive ? 'destructive' : 'outline'}
              size="sm"
              onClick={handleBan}
              disabled={isBanning}
            >
              <Ban className="w-4 h-4 mr-2" />
              {isBanning ? 'Updating...' : user.isActive ? 'Ban User' : 'Unban User'}
            </Button>
          </div>
        </div>

        {/* Profile Section */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Avatar & basic info */}
          <div className="bg-card border border-border/20 rounded-xl p-6 flex flex-col items-center gap-3">
            <div className="w-20 h-20 rounded-full bg-gradient-to-r from-primary to-purple-600 flex items-center justify-center">
              <User className="w-10 h-10 text-white" />
            </div>
            <div className="text-center">
              <p className="font-bold text-lg">{user.name} {user.lastname}</p>
              <Badge variant={user.role === 'admin' ? 'default' : 'secondary'} className="mt-1">
                {user.role}
              </Badge>
            </div>
            <div className="w-full border-t border-border/20 pt-3 space-y-2">
              <Field label="Member since" value={formatDate(user.createdAt)} />
              <Field label="Public ID" value={user.publicId} />
            </div>
          </div>

          {/* Personal Info */}
          <div className="md:col-span-2 bg-card border border-border/20 rounded-xl p-6">
            <h2 className="font-semibold mb-4">Personal Information</h2>
            <div className="grid grid-cols-2 gap-4">
              <Field label="First Name" value={user.name} />
              <Field label="Last Name" value={user.lastname} />
              <Field label="Email" value={user.email} />
              <Field label="Phone" value={user.phoneNumber} />
              <Field label="Birthday" value={user.birthday ? formatDate(String(user.birthday)) : '—'} />
              <Field label="Address" value={user.address} />
            </div>
          </div>
        </div>

        {/* Social Links */}
        <div className="bg-card border border-border/20 rounded-xl p-6">
          <h2 className="font-semibold mb-4">Social Links</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <Field label="LinkedIn" value={user.linkedin} />
            <Field label="GitHub" value={user.github} />
            <Field label="Twitter / X" value={user.twitter} />
            <Field label="Instagram" value={user.instagram} />
            <Field label="YouTube" value={user.youtube} />
            <Field label="TikTok" value={user.tiktok} />
            <Field label="Xing" value={user.xing} />
          </div>
        </div>

        {/* Skills & Languages */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-card border border-border/20 rounded-xl p-6">
            <h2 className="font-semibold mb-4">Skills</h2>
            {user.skills && Array.isArray(user.skills) && user.skills.length > 0 ? (
              <div className="flex flex-wrap gap-2">
                {(user.skills as Array<{ name?: string }>).map((s, i) => (
                  <Badge key={i} variant="secondary">{s?.name ?? String(s)}</Badge>
                ))}
              </div>
            ) : (
              <p className="text-muted-foreground text-sm">No skills added.</p>
            )}
          </div>

          <div className="bg-card border border-border/20 rounded-xl p-6">
            <h2 className="font-semibold mb-4">Languages</h2>
            {user.languages && Array.isArray(user.languages) && user.languages.length > 0 ? (
              <div className="flex flex-wrap gap-2">
                {(user.languages as Array<{ name?: string; level?: number }>).map((l, i) => (
                  <Badge key={i} variant="outline">{l?.name ?? String(l)}{l?.level ? ` (${l.level}/5)` : ''}</Badge>
                ))}
              </div>
            ) : (
              <p className="text-muted-foreground text-sm">No languages added.</p>
            )}
          </div>
        </div>

        {/* Hobbies */}
        {user.hobbies && Array.isArray(user.hobbies) && user.hobbies.length > 0 && (
          <div className="bg-card border border-border/20 rounded-xl p-6">
            <h2 className="font-semibold mb-4">Hobbies</h2>
            <div className="flex flex-wrap gap-2">
              {user.hobbies.map((h, i) => (
                <Badge key={i} variant="secondary">{h}</Badge>
              ))}
            </div>
          </div>
        )}

        {/* Files */}
        <div className="bg-card border border-border/20 rounded-xl p-6">
          <h2 className="font-semibold mb-4">Files</h2>
          <div className="grid grid-cols-2 gap-4">
            <Field label="Profile Picture ID" value={user.pictureId} />
            <Field label="CV / Resume ID" value={user.resumeId} />
          </div>
        </div>
      </div>
    </AdminDashboardLayout>
  );
}

export default UserDetailPage;
