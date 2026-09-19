import { useState } from 'react';
import { WelcomeModal } from '@/components/WelcomeModal';
import { Sidebar, TopBar, type ViewKey } from '@/components/Shell';
import { OverviewView } from '@/views/OverviewView';
import { CopilotView } from '@/views/CopilotView';
import { AgentsView } from '@/views/AgentsView';
import { RagView } from '@/views/RagView';
import { PipelinesView } from '@/views/PipelinesView';
import { MlView } from '@/views/MlView';
import { XaiView } from '@/views/XaiView';
import { AutoMlView } from '@/views/AutoMlView';
import { MlopsView } from '@/views/MlopsView';
import { SecurityView } from '@/views/SecurityView';
import { ReportsView } from '@/views/ReportsView';
import { AlertsView } from '@/views/AlertsView';
import { ApiView } from '@/views/ApiView';
import { SettingsView } from '@/views/SettingsView';
import { Drawer } from '@/components/ui';
import { Bell } from 'lucide-react';
import { ALERTS } from '@/lib/data';
import type { IndustryKey } from '@/lib/data';

function App() {
  const [entered, setEntered] = useState(false);
  const [view, setView] = useState<ViewKey>('overview');
  const [industry, setIndustry] = useState<IndustryKey>('business');
  const [collapsed, setCollapsed] = useState(false);
  const [alertsOpen, setAlertsOpen] = useState(false);

  const renderView = () => {
    switch (view) {
      case 'overview': return <OverviewView industry={industry} />;
      case 'copilot': return <CopilotView />;
      case 'agents': return <AgentsView />;
      case 'rag': return <RagView />;
      case 'pipelines': return <PipelinesView />;
      case 'ml': return <MlView />;
      case 'xai': return <XaiView />;
      case 'automl': return <AutoMlView />;
      case 'mlops': return <MlopsView />;
      case 'security': return <SecurityView />;
      case 'reports': return <ReportsView />;
      case 'alerts': return <AlertsView />;
      case 'api': return <ApiView />;
      case 'settings': return <SettingsView />;
      default: return <OverviewView industry={industry} />;
    }
  };

  if (!entered) {
    return <WelcomeModal onEnter={() => setEntered(true)} />;
  }

  return (
    <div className="min-h-screen bg-[#05070d]">
      <Sidebar view={view} setView={setView} collapsed={collapsed} />
      <div className={`transition-all duration-300 ${collapsed ? 'ml-16' : 'ml-60'}`}>
        <TopBar
          industry={industry}
          setIndustry={setIndustry}
          onToggleSidebar={() => setCollapsed(!collapsed)}
          onOpenSettings={() => setView('settings')}
          onOpenAlerts={() => setAlertsOpen(true)}
        />
        <main className="p-4 sm:p-6 max-w-[1600px] mx-auto">
          {renderView()}
        </main>
      </div>

      {/* Quick alerts drawer */}
      <Drawer open={alertsOpen} onClose={() => setAlertsOpen(false)} title="Recent Alerts" icon={Bell} width={420}>
        <div className="space-y-2">
          {ALERTS.map((a) => (
            <div key={a.id} className="flex items-start gap-3 aura-glass rounded-lg p-3">
              <div className={`h-2 w-2 rounded-full mt-1.5 shrink-0 ${a.severity === 'critical' ? 'bg-red-400' : a.severity === 'warning' ? 'bg-amber-400' : 'bg-blue-400'}`} />
              <div className="flex-1 min-w-0">
                <p className="text-sm text-slate-200">{a.title}</p>
                <div className="flex items-center gap-2 mt-1">
                  <span className="text-[10px] text-slate-500">{a.source}</span>
                  <span className="text-[10px] text-slate-600">{a.time}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </Drawer>
    </div>
  );
}

export default App;
