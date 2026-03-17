import { useState, useEffect, useCallback } from 'react';
import AdminDashboardLayout from '@/components/AdminDashboardLayout';
import { AdminApi } from '@/api/api';
import { useToast } from '@/hooks/use-toast';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Eye, Ban, ChevronLeft, ChevronRight, Users } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface User {
  id: number;
  name: string;
  lastname: string;
  email: string;
  role: string;
  isActive: boolean;
  personalSlug: string;
  publicId: string;
  createdAt: string;
}

interface UsersResponse {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
  users: User[];
}

const LIMIT = 10;

function UsersPage() {
  const [data, setData] = useState<UsersResponse | null>(null);
  const [page, setPage] = useState(1);
  const [isLoading, setIsLoading] = useState(true);
  const [banningId, setBanningId] = useState<number | null>(null);
  const { toast } = useToast();
  const navigate = useNavigate();
  const api = AdminApi.getInstance();

  const fetchUsers = useCallback(async (p: number) => {
    setIsLoading(true);
    try {
      const response = await api.get('/admin/users', { page: p, limit: LIMIT });
      setData(response.data.data);
    } catch {
      toast({ title: 'Error!', description: 'Failed to load users.' });
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchUsers(page);
  }, [page, fetchUsers]);

  const handleBan = async (userId: number, currentStatus: boolean) => {
    setBanningId(userId);
    try {
      await api.put(`/admin/users/${userId}/ban`, {});
      toast({
        title: 'Success!',
        description: `User ${currentStatus ? 'banned' : 'unbanned'} successfully.`,
      });
      fetchUsers(page);
    } catch {
      toast({ title: 'Error!', description: 'Failed to update user status.' });
    } finally {
      setBanningId(null);
    }
  };

  const formatDate = (iso: string) => new Date(iso).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' });

  return (
    <AdminDashboardLayout>
      <div className="space-y-6 animate-fade-in-up">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold">Users</h1>
            <p className="text-muted-foreground text-sm mt-1">
              {data ? `${data.total} total users` : 'Loading...'}
            </p>
          </div>
          <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
            <Users className="w-6 h-6 text-primary" />
          </div>
        </div>

        {/* Stats Card */}
        {data && (
          <div className="grid grid-cols-3 gap-4">
            <div className="bg-card border border-border/20 rounded-xl p-4">
              <p className="text-muted-foreground text-xs uppercase tracking-wide">Total Users</p>
              <p className="text-3xl font-bold mt-1">{data.total}</p>
            </div>
            <div className="bg-card border border-border/20 rounded-xl p-4">
              <p className="text-muted-foreground text-xs uppercase tracking-wide">Active</p>
              <p className="text-3xl font-bold mt-1 text-green-500">
                {data.users.filter(u => u.isActive).length}
              </p>
            </div>
            <div className="bg-card border border-border/20 rounded-xl p-4">
              <p className="text-muted-foreground text-xs uppercase tracking-wide">Banned</p>
              <p className="text-3xl font-bold mt-1 text-destructive">
                {data.users.filter(u => !u.isActive).length}
              </p>
            </div>
          </div>
        )}

        {/* Table */}
        <div className="bg-card border border-border/20 rounded-xl overflow-hidden">
          {isLoading ? (
            <div className="flex items-center justify-center py-20 text-muted-foreground">
              <span className="spinner mr-2" style={{ border: '2px solid transparent', borderTop: '2px solid currentColor', width: 20, height: 20, borderRadius: '50%', animation: 'spin 1s linear infinite', display: 'inline-block' }} />
              Loading users...
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Role</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Joined</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {data?.users.map((user) => (
                  <TableRow key={user.id}>
                    <TableCell className="font-medium">
                      {user.name} {user.lastname}
                    </TableCell>
                    <TableCell className="text-muted-foreground text-sm">{user.email}</TableCell>
                    <TableCell>
                      <Badge variant={user.role === 'admin' ? 'default' : 'secondary'}>
                        {user.role}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Badge variant={user.isActive ? 'outline' : 'destructive'}>
                        {user.isActive ? 'Active' : 'Banned'}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-muted-foreground text-sm">
                      {formatDate(user.createdAt)}
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex items-center justify-end gap-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => navigate(`/admin/users/${user.id}`)}
                          title="View user"
                        >
                          <Eye className="w-4 h-4" />
                        </Button>
                        <Button
                          variant={user.isActive ? 'destructive' : 'outline'}
                          size="sm"
                          onClick={() => handleBan(user.id, user.isActive)}
                          disabled={banningId === user.id}
                          title={user.isActive ? 'Ban user' : 'Unban user'}
                        >
                          {banningId === user.id ? (
                            <span style={{ width: 14, height: 14, border: '2px solid transparent', borderTop: '2px solid currentColor', borderRadius: '50%', display: 'inline-block', animation: 'spin 1s linear infinite' }} />
                          ) : (
                            <Ban className="w-4 h-4" />
                          )}
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
                {data?.users.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center text-muted-foreground py-10">
                      No users found.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          )}
        </div>

        {/* Pagination */}
        {data && data.totalPages > 1 && (
          <div className="flex items-center justify-between">
            <p className="text-sm text-muted-foreground">
              Page {data.page} of {data.totalPages}
            </p>
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setPage(p => Math.max(1, p - 1))}
                disabled={page === 1 || isLoading}
              >
                <ChevronLeft className="w-4 h-4" />
                Previous
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setPage(p => Math.min(data.totalPages, p + 1))}
                disabled={page === data.totalPages || isLoading}
              >
                Next
                <ChevronRight className="w-4 h-4" />
              </Button>
            </div>
          </div>
        )}
      </div>
    </AdminDashboardLayout>
  );
}

export default UsersPage;
