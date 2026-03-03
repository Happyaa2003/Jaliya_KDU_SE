import { useState } from 'react';
import { DashboardLayout } from '@/components/DashboardLayout';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Info, Save } from 'lucide-react';
import { toast } from 'sonner';

export default function SettingsPage() {
  const [host, setHost] = useState('localhost');
  const [port, setPort] = useState('5432');
  const [username, setUsername] = useState('admin');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSave = async () => {
    setLoading(true);
    await new Promise(r => setTimeout(r, 1000));
    setLoading(false);
    toast.success('Configuration saved (simulated)');
  };

  return (
    <DashboardLayout>
      <div className="page-container">
        <div className="page-header">
          <div>
            <h1 className="page-title">Settings</h1>
            <p className="page-subtitle">System configuration</p>
          </div>
        </div>

        <div className="glass-card-subtle p-6 md:p-8 max-w-2xl">
          <h2 className="text-base font-semibold mb-6">Database Configuration</h2>

          <div className="space-y-5">
            <div className="space-y-2">
              <Label htmlFor="host">Database Host</Label>
              <Input id="host" value={host} onChange={e => setHost(e.target.value)} className="input-field" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="port">Port</Label>
              <Input id="port" value={port} onChange={e => setPort(e.target.value)} className="input-field" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="dbuser">Username</Label>
              <Input id="dbuser" value={username} onChange={e => setUsername(e.target.value)} className="input-field" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="dbpass">Password</Label>
              <Input id="dbpass" type="password" value={password} onChange={e => setPassword(e.target.value)} placeholder="Enter database password" className="input-field" />
            </div>
          </div>

          <div className="flex items-start gap-2 mt-6 p-3 bg-info/5 rounded-lg border border-info/10">
            <Info className="w-4 h-4 text-info mt-0.5 shrink-0" />
            <p className="text-xs text-muted-foreground">Configurations are externally managed. Changes here are for reference only.</p>
          </div>

          <Button onClick={handleSave} className="mt-6 btn-glow" disabled={loading}>
            {loading ? (
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full animate-spin" />
                Saving...
              </div>
            ) : (
              <>
                <Save className="w-4 h-4 mr-2" /> Save Configuration
              </>
            )}
          </Button>
        </div>
      </div>
    </DashboardLayout>
  );
}
