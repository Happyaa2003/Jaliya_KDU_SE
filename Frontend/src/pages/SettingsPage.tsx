import { useState, useEffect } from 'react';
import { DashboardLayout } from '@/components/DashboardLayout';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import {
  UserPlus, KeyRound, Trash2, ShieldCheck, X, Eye, EyeOff, Loader2
} from 'lucide-react';
import { toast } from 'sonner';
import { usersApi } from '@/services/api';
import { ConfirmDialog } from '@/components/ConfirmDialog';

interface AdminUser {
  id: string;
  email: string;
  full_name: string;
}

export default function SettingsPage() {
  // ── Admin users list ──────────────────────────────────────
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [loadingUsers, setLoadingUsers] = useState(true);

  // ── Add Admin form ────────────────────────────────────────
  const [showAddForm, setShowAddForm] = useState(false);
  const [newEmail, setNewEmail] = useState('');
  const [newName, setNewName] = useState('');
  const [newPass, setNewPass] = useState('');
  const [showNewPass, setShowNewPass] = useState(false);
  const [savingNew, setSavingNew] = useState(false);

  // ── Change Password form ──────────────────────────────────
  const [cpUserId, setCpUserId] = useState('');
  const [cpNewPass, setCpNewPass] = useState('');
  const [cpConfirm, setCpConfirm] = useState('');
  const [showCpPass, setShowCpPass] = useState(false);
  const [savingCp, setSavingCp] = useState(false);

  // ── Delete Admin ──────────────────────────────────────────
  const [deleteTarget, setDeleteTarget] = useState<AdminUser | null>(null);
  const [deleting, setDeleting] = useState(false);

  // ── Logged-in user ────────────────────────────────────────
  const storedUser = (() => {
    try { return JSON.parse(localStorage.getItem('sms_user') || '{}'); } catch { return {}; }
  })();

  // Fetch users on mount
  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    setLoadingUsers(true);
    try {
      const data = await usersApi.list();
      setUsers(data);
      // Pre-select current user for change-password
      if (!cpUserId && data.length > 0) {
        const me = data.find((u: AdminUser) => u.email === storedUser.email);
        setCpUserId(me ? me.id : data[0].id);
      }
    } catch {
      toast.error('Failed to load admin users');
    } finally {
      setLoadingUsers(false);
    }
  };

  const handleAddAdmin = async () => {
    if (!newEmail || !newPass || !newName) {
      toast.error('All fields are required');
      return;
    }
    setSavingNew(true);
    try {
      const created = await usersApi.create(newEmail, newPass, newName);
      setUsers(prev => [...prev, created]);
      setNewEmail(''); setNewName(''); setNewPass('');
      setShowAddForm(false);
      toast.success(`Admin "${created.full_name}" created!`);
    } catch (err: any) {
      toast.error(err?.response?.data?.detail || 'Failed to create admin');
    } finally {
      setSavingNew(false);
    }
  };

  const handleChangePassword = async () => {
    if (!cpNewPass) { toast.error('New password is required'); return; }
    if (cpNewPass !== cpConfirm) { toast.error('Passwords do not match'); return; }
    if (cpNewPass.length < 6) { toast.error('Password must be at least 6 characters'); return; }
    setSavingCp(true);
    try {
      await usersApi.changePassword(cpUserId, cpNewPass);
      setCpNewPass(''); setCpConfirm('');
      toast.success('Password changed successfully!');
    } catch (err: any) {
      toast.error(err?.response?.data?.detail || 'Failed to change password');
    } finally {
      setSavingCp(false);
    }
  };

  const handleDeleteAdmin = async () => {
    if (!deleteTarget) return;
    setDeleting(true);
    try {
      await usersApi.delete(deleteTarget.id);
      setUsers(prev => prev.filter(u => u.id !== deleteTarget.id));
      // If we deleted the selected cp user, select the first remaining
      if (cpUserId === deleteTarget.id) {
        const remaining = users.filter(u => u.id !== deleteTarget.id);
        setCpUserId(remaining[0]?.id ?? '');
      }
      toast.success(`Admin "${deleteTarget.full_name}" deleted`);
      setDeleteTarget(null);
    } catch (err: any) {
      toast.error(err?.response?.data?.detail || 'Failed to delete admin');
    } finally {
      setDeleting(false);
    }
  };

  return (
    <DashboardLayout>
      <div className="page-container">
        <div className="page-header">
          <div>
            <h1 className="page-title">Settings</h1>
            <p className="page-subtitle">Manage admin accounts and security</p>
          </div>
        </div>

        <div className="space-y-8 max-w-3xl">

          {/* ── Admin Users Card ───────────────────────────────── */}
          <div className="glass-card-subtle p-6 md:p-8">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-5 h-5 text-primary" />
                <h2 className="text-base font-semibold">Admin Users</h2>
              </div>
              <Button
                size="sm"
                className="btn-glow gap-1.5"
                onClick={() => setShowAddForm(v => !v)}
              >
                {showAddForm ? <X className="w-4 h-4" /> : <UserPlus className="w-4 h-4" />}
                {showAddForm ? 'Cancel' : 'Add Admin'}
              </Button>
            </div>

            {/* Add Admin form */}
            {showAddForm && (
              <div className="mb-6 p-4 rounded-lg border border-primary/20 bg-primary/5 space-y-4">
                <p className="text-sm font-medium text-primary">New Admin Account</p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <Label htmlFor="new-name">Full Name</Label>
                    <Input id="new-name" value={newName} onChange={e => setNewName(e.target.value)}
                      placeholder="e.g. Dr. Smith" className="input-field" />
                  </div>
                  <div className="space-y-1.5">
                    <Label htmlFor="new-email">Email</Label>
                    <Input id="new-email" type="email" value={newEmail}
                      onChange={e => setNewEmail(e.target.value)}
                      placeholder="admin@university.edu" className="input-field" />
                  </div>
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="new-pass">Password</Label>
                  <div className="relative">
                    <Input id="new-pass" type={showNewPass ? 'text' : 'password'}
                      value={newPass} onChange={e => setNewPass(e.target.value)}
                      placeholder="Min. 6 characters" className="input-field pr-10" />
                    <button type="button" onClick={() => setShowNewPass(v => !v)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground">
                      {showNewPass ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>
                <Button onClick={handleAddAdmin} disabled={savingNew} className="btn-glow w-full sm:w-auto">
                  {savingNew ? <><Loader2 className="w-4 h-4 mr-2 animate-spin" />Creating...</> : 'Create Admin'}
                </Button>
              </div>
            )}

            {/* Users table */}
            {loadingUsers ? (
              <div className="flex items-center gap-2 text-muted-foreground text-sm py-4">
                <Loader2 className="w-4 h-4 animate-spin" /> Loading admins...
              </div>
            ) : users.length === 0 ? (
              <p className="text-sm text-muted-foreground py-4">No admin users found.</p>
            ) : (
              <div className="overflow-x-auto rounded-lg border border-border/50">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-border/50 bg-muted/30">
                      <th className="text-left px-4 py-3 font-medium text-muted-foreground">Name</th>
                      <th className="text-left px-4 py-3 font-medium text-muted-foreground">Email</th>
                      <th className="text-left px-4 py-3 font-medium text-muted-foreground">ID</th>
                      <th className="text-right px-4 py-3 font-medium text-muted-foreground">Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {users.map((u, i) => {
                      const isSelf = u.email === storedUser.email;
                      return (
                        <tr key={u.id}
                          className={`border-b border-border/30 hover:bg-muted/20 transition-colors ${i === users.length - 1 ? 'border-0' : ''}`}>
                          <td className="px-4 py-3 font-medium">{u.full_name}</td>
                          <td className="px-4 py-3 text-muted-foreground">{u.email}</td>
                          <td className="px-4 py-3 text-muted-foreground font-mono text-xs truncate max-w-[120px]">{u.id}</td>
                          <td className="px-4 py-3 text-right">
                            {!isSelf && (
                              <button
                                onClick={() => setDeleteTarget(u)}
                                title="Delete this admin"
                                className="inline-flex items-center justify-center w-7 h-7 rounded-md text-destructive hover:bg-destructive/10 transition-colors"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            )}
                            {isSelf && (
                              <span className="text-xs text-muted-foreground italic">you</span>
                            )}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}
          </div>

          {/* ── Change Password Card ───────────────────────────── */}
          <div className="glass-card-subtle p-6 md:p-8">
            <div className="flex items-center gap-2 mb-6">
              <KeyRound className="w-5 h-5 text-primary" />
              <h2 className="text-base font-semibold">Change Password</h2>
            </div>

            <div className="space-y-5">
              {/* Select which admin */}
              <div className="space-y-1.5">
                <Label htmlFor="cp-user">Select Admin</Label>
                <select
                  id="cp-user"
                  value={cpUserId}
                  onChange={e => setCpUserId(e.target.value)}
                  className="input-field w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/50"
                >
                  {users.map(u => (
                    <option key={u.id} value={u.id}>{u.full_name} ({u.email})</option>
                  ))}
                </select>
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="cp-new">New Password</Label>
                <div className="relative">
                  <Input id="cp-new" type={showCpPass ? 'text' : 'password'}
                    value={cpNewPass} onChange={e => setCpNewPass(e.target.value)}
                    placeholder="Min. 6 characters" className="input-field pr-10" />
                  <button type="button" onClick={() => setShowCpPass(v => !v)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground">
                    {showCpPass ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="cp-confirm">Confirm New Password</Label>
                <Input id="cp-confirm" type="password"
                  value={cpConfirm} onChange={e => setCpConfirm(e.target.value)}
                  placeholder="Re-enter new password" className="input-field" />
              </div>

              {cpNewPass && cpConfirm && cpNewPass !== cpConfirm && (
                <p className="text-xs text-destructive flex items-center gap-1">
                  <X className="w-3 h-3" /> Passwords do not match
                </p>
              )}

              <Button onClick={handleChangePassword} disabled={savingCp || !cpUserId} className="btn-glow">
                {savingCp
                  ? <><Loader2 className="w-4 h-4 mr-2 animate-spin" />Updating...</>
                  : <><KeyRound className="w-4 h-4 mr-2" />Update Password</>}
              </Button>
            </div>
          </div>

        </div>
      </div>

      {/* Delete confirm dialog */}
      <ConfirmDialog
        open={!!deleteTarget}
        onOpenChange={() => setDeleteTarget(null)}
        title="Delete Admin"
        description={`Permanently delete admin "${deleteTarget?.full_name}" (${deleteTarget?.email})? This cannot be undone.`}
        onConfirm={handleDeleteAdmin}
        confirmLabel={deleting ? 'Deleting…' : 'Delete'}
      />
    </DashboardLayout>
  );
}
