'use client';

import React, { useState, useEffect } from 'react';
import { UserRole, Token } from '@/lib/types';
import { queueStore, SmartQueueState } from '@/lib/store';
import { Navbar } from '@/components/Navbar';
import { QuickRoleSelector } from '@/components/QuickRoleSelector';
import { SupabaseConfigModal } from '@/components/SupabaseConfigModal';
import { NowServingBoard } from '@/components/NowServingBoard';

// Customer Components
import { CustomerLogin } from '@/components/Customer/CustomerLogin';
import { TokenRequest } from '@/components/Customer/TokenRequest';
import { TokenDisplay } from '@/components/Customer/TokenDisplay';
import { MyTokensHistory } from '@/components/Customer/MyTokensHistory';

// Staff Components
import { StaffLogin } from '@/components/Staff/StaffLogin';
import { CounterPortal } from '@/components/Staff/CounterPortal';

// Admin Components
import { AdminLogin } from '@/components/Admin/AdminLogin';
import { QueueHealthPanel } from '@/components/Admin/QueueHealthPanel';
import { LiveCounterGrid } from '@/components/Admin/LiveCounterGrid';
import { EmployeeAnalytics } from '@/components/Admin/EmployeeAnalytics';
import { AdminCharts } from '@/components/Admin/AdminCharts';
import { TokensMasterTable } from '@/components/Admin/TokensMasterTable';
import { OfficeManagement } from '@/components/Admin/OfficeManagement';

import { 
  Building2, 
  Ticket, 
  History, 
  Tv, 
  BarChart3, 
  FileSpreadsheet, 
  Settings, 
  LayoutDashboard, 
  CheckCircle2,
  ShieldAlert
} from 'lucide-react';

export default function Home() {
  const [role, setRole] = useState<UserRole | 'display'>('customer');
  const [state, setState] = useState<SmartQueueState>(queueStore.getState());
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [showDbModal, setShowDbModal] = useState(false);

  // Authenticated user state
  const [currentUser, setCurrentUser] = useState<{
    email: string;
    name?: string;
    role: UserRole;
    staff_id?: string;
    counter_id?: string;
  } | null>({
    email: 'customer.demo@gov.smartqueue.org',
    name: 'Demo Citizen',
    role: 'customer',
  });

  // Customer sub-tab
  const [customerTab, setCustomerTab] = useState<'request' | 'my_tokens' | 'board'>('request');
  const [selectedCustomerToken, setSelectedCustomerToken] = useState<Token | null>(null);

  // Admin sub-tab
  const [adminTab, setAdminTab] = useState<'overview' | 'charts' | 'table' | 'manage'>('overview');

  useEffect(() => {
    queueStore.init();
    const unsub = queueStore.subscribe(() => {
      setState({ ...queueStore.getState() });
    });
    return unsub;
  }, []);

  // Sync selectedCustomerToken with state updates
  const activeUserTokens = state.tokens.filter(
    (t) =>
      currentUser &&
      t.customer_email.toLowerCase() === currentUser.email.toLowerCase() &&
      (t.status === 'waiting' || t.status === 'called' || t.status === 'serving')
  );

  const displayedToken = selectedCustomerToken
    ? state.tokens.find((t) => t.id === selectedCustomerToken.id) || null
    : activeUserTokens[0] || null;

  const handleRoleChange = (newRole: UserRole | 'display') => {
    setRole(newRole);
    // If switching role, set default demo user for smoother testing
    if (newRole === 'customer' && (!currentUser || currentUser.role !== 'customer')) {
      setCurrentUser({
        email: 'customer.demo@gov.smartqueue.org',
        name: 'Demo Citizen',
        role: 'customer',
      });
    } else if (newRole === 'staff' && (!currentUser || currentUser.role !== 'staff')) {
      const defaultStaff = state.staff.find((s) => s.role === 'staff') || state.staff[0];
      setCurrentUser({
        email: defaultStaff.email,
        name: defaultStaff.full_name,
        role: 'staff',
        staff_id: defaultStaff.id,
        counter_id: defaultStaff.assigned_counter_id,
      });
    } else if (newRole === 'admin' && (!currentUser || currentUser.role !== 'admin')) {
      const adminStaff = state.staff.find((s) => s.role === 'admin') || state.staff[3];
      setCurrentUser({
        email: adminStaff?.email || 'anita.desai@gov.smartqueue.org',
        name: adminStaff?.full_name || 'Officer Anita Desai',
        role: 'admin',
      });
    }
  };

  const handleLogout = () => {
    setCurrentUser(null);
  };

  const handleUnlockToken = (tokenId: string) => {
    queueStore.unlockTokenKey(tokenId, currentUser?.name || 'Admin Officer');
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-950 text-slate-100 font-sans">
      {/* Top Navigation */}
      <Navbar
        currentRole={role}
        onRoleChange={handleRoleChange}
        currentUser={currentUser}
        onLogout={handleLogout}
        soundEnabled={soundEnabled}
        onToggleSound={() => setSoundEnabled(!soundEnabled)}
        onOpenSupabaseConfig={() => setShowDbModal(true)}
      />

      {/* 1-Click Quick Role Switcher */}
      <QuickRoleSelector
        onSelectRole={(targetRole, user) => {
          setRole(targetRole);
          setCurrentUser(user);
        }}
      />

      {/* Main Body Content */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-4 sm:p-6 lg:p-8 space-y-6">
        {/* ========================================================================= */}
        {/* 1. PUBLIC TV DISPLAY MODE */}
        {/* ========================================================================= */}
        {role === 'display' && (
          <div className="space-y-4">
            <NowServingBoard soundEnabled={soundEnabled} />
          </div>
        )}

        {/* ========================================================================= */}
        {/* 2. CITIZEN / CUSTOMER PORTAL */}
        {/* ========================================================================= */}
        {role === 'customer' && (
          <div className="space-y-6">
            {!currentUser || currentUser.role !== 'customer' ? (
              <CustomerLogin
                onLoginSuccess={(cust) => {
                  setCurrentUser(cust);
                }}
              />
            ) : (
              <div className="space-y-6">
                {/* Citizen Navigation Sub-Tabs */}
                <div className="flex flex-wrap items-center justify-between gap-3 bg-slate-900 p-2 rounded-2xl border border-slate-800">
                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() => {
                        setCustomerTab('request');
                        setSelectedCustomerToken(null);
                      }}
                      className={`flex items-center space-x-2 px-4 py-2 rounded-xl text-xs font-bold transition cursor-pointer ${
                        customerTab === 'request'
                          ? 'bg-blue-600 text-white shadow-md'
                          : 'text-slate-400 hover:text-white hover:bg-slate-800'
                      }`}
                    >
                      <Ticket className="w-4 h-4" />
                      <span>Request / Active Token</span>
                      {activeUserTokens.length > 0 && (
                        <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
                      )}
                    </button>

                    <button
                      onClick={() => setCustomerTab('my_tokens')}
                      className={`flex items-center space-x-2 px-4 py-2 rounded-xl text-xs font-bold transition cursor-pointer ${
                        customerTab === 'my_tokens'
                          ? 'bg-blue-600 text-white shadow-md'
                          : 'text-slate-400 hover:text-white hover:bg-slate-800'
                      }`}
                    >
                      <History className="w-4 h-4" />
                      <span>My Tokens History ({state.tokens.filter(t => t.customer_email.toLowerCase() === currentUser.email.toLowerCase()).length})</span>
                    </button>

                    <button
                      onClick={() => setCustomerTab('board')}
                      className={`flex items-center space-x-2 px-4 py-2 rounded-xl text-xs font-bold transition cursor-pointer ${
                        customerTab === 'board'
                          ? 'bg-indigo-600 text-white shadow-md'
                          : 'text-slate-400 hover:text-white hover:bg-slate-800'
                      }`}
                    >
                      <Tv className="w-4 h-4" />
                      <span>Now Serving Board</span>
                    </button>
                  </div>

                  <div className="text-xs text-slate-400 pr-2">
                    Citizen: <strong className="text-white">{currentUser.name}</strong> ({currentUser.email})
                  </div>
                </div>

                {/* SubTab 1: Request or Display Active Token */}
                {customerTab === 'request' && (
                  <div className="space-y-6">
                    {displayedToken ? (
                      <div className="space-y-4">
                        <TokenDisplay
                          token={displayedToken}
                          service={state.services.find((s) => s.id === displayedToken.service_id)}
                          office={state.offices.find((o) => o.id === displayedToken.office_id)}
                          counter={state.counters.find((c) => c.id === displayedToken.counter_id)}
                          allTokens={state.tokens}
                          customerEmail={currentUser.email}
                          onTokenCancelled={() => setSelectedCustomerToken(null)}
                        />

                        <div className="text-center">
                          <button
                            onClick={() => setSelectedCustomerToken(null)}
                            className="text-xs text-blue-400 hover:underline inline-flex items-center gap-1 cursor-pointer"
                          >
                            + Request another token for a different service
                          </button>
                        </div>
                      </div>
                    ) : (
                      <TokenRequest
                        offices={state.offices}
                        services={state.services}
                        tokens={state.tokens}
                        customerEmail={currentUser.email}
                        customerName={currentUser.name}
                        onTokenCreated={(tok) => {
                          setSelectedCustomerToken(tok);
                        }}
                      />
                    )}
                  </div>
                )}

                {/* SubTab 2: My Tokens History */}
                {customerTab === 'my_tokens' && (
                  <MyTokensHistory
                    tokens={state.tokens}
                    services={state.services}
                    offices={state.offices}
                    customerEmail={currentUser.email}
                    onSelectToken={(tok) => {
                      setSelectedCustomerToken(tok);
                      setCustomerTab('request');
                    }}
                  />
                )}

                {/* SubTab 3: Now Serving Board */}
                {customerTab === 'board' && (
                  <NowServingBoard soundEnabled={soundEnabled} />
                )}
              </div>
            )}
          </div>
        )}

        {/* ========================================================================= */}
        {/* 3. STAFF COUNTER PORTAL */}
        {/* ========================================================================= */}
        {role === 'staff' && (
          <div className="space-y-6">
            {!currentUser || currentUser.role !== 'staff' || !currentUser.staff_id ? (
              <StaffLogin
                onLoginSuccess={(staff) => {
                  setCurrentUser(staff);
                }}
              />
            ) : (
              <CounterPortal
                staffId={currentUser.staff_id}
                assignedCounterId={currentUser.counter_id}
                soundEnabled={soundEnabled}
              />
            )}
          </div>
        )}

        {/* ========================================================================= */}
        {/* 4. ADMIN / EXECUTIVE OFFICER DASHBOARD */}
        {/* ========================================================================= */}
        {role === 'admin' && (
          <div className="space-y-6">
            {!currentUser || currentUser.role !== 'admin' ? (
              <AdminLogin
                onLoginSuccess={(adm) => {
                  setCurrentUser(adm);
                }}
              />
            ) : (
              <div className="space-y-6">
                {/* Admin Subtabs Bar */}
                <div className="flex flex-wrap items-center justify-between gap-3 bg-slate-900 p-2 rounded-2xl border border-slate-800">
                  <div className="flex flex-wrap items-center gap-2">
                    <button
                      onClick={() => setAdminTab('overview')}
                      className={`flex items-center space-x-2 px-3.5 py-2 rounded-xl text-xs font-bold transition cursor-pointer ${
                        adminTab === 'overview'
                          ? 'bg-blue-600 text-white shadow-md'
                          : 'text-slate-400 hover:text-white hover:bg-slate-800'
                      }`}
                    >
                      <LayoutDashboard className="w-4 h-4" />
                      <span>Executive Overview</span>
                    </button>

                    <button
                      onClick={() => setAdminTab('charts')}
                      className={`flex items-center space-x-2 px-3.5 py-2 rounded-xl text-xs font-bold transition cursor-pointer ${
                        adminTab === 'charts'
                          ? 'bg-blue-600 text-white shadow-md'
                          : 'text-slate-400 hover:text-white hover:bg-slate-800'
                      }`}
                    >
                      <BarChart3 className="w-4 h-4" />
                      <span>Analytics Charts</span>
                    </button>

                    <button
                      onClick={() => setAdminTab('table')}
                      className={`flex items-center space-x-2 px-3.5 py-2 rounded-xl text-xs font-bold transition cursor-pointer ${
                        adminTab === 'table'
                          ? 'bg-blue-600 text-white shadow-md'
                          : 'text-slate-400 hover:text-white hover:bg-slate-800'
                      }`}
                    >
                      <FileSpreadsheet className="w-4 h-4" />
                      <span>Tokens Master Registry & CSV</span>
                    </button>

                    <button
                      onClick={() => setAdminTab('manage')}
                      className={`flex items-center space-x-2 px-3.5 py-2 rounded-xl text-xs font-bold transition cursor-pointer ${
                        adminTab === 'manage'
                          ? 'bg-blue-600 text-white shadow-md'
                          : 'text-slate-400 hover:text-white hover:bg-slate-800'
                      }`}
                    >
                      <Settings className="w-4 h-4" />
                      <span>Offices & Staff Config</span>
                    </button>
                  </div>

                  <div className="text-xs text-slate-400 pr-2">
                    Officer: <strong className="text-white">{currentUser.name}</strong>
                  </div>
                </div>

                {/* Tab 1: Executive Overview */}
                {adminTab === 'overview' && (
                  <div className="space-y-6">
                    {/* Queue Health Watchdog Panel */}
                    <QueueHealthPanel
                      healthStats={queueStore.getQueueHealthStats()}
                      lockedTokens={state.tokens.filter((t) => t.is_key_locked)}
                      onUnlockToken={handleUnlockToken}
                    />

                    {/* Live Counter Fleet Grid */}
                    <LiveCounterGrid
                      counters={state.counters}
                      services={state.services}
                      staff={state.staff}
                      tokens={state.tokens}
                      offices={state.offices}
                    />

                    {/* Employee Analytics & Benchmark Table */}
                    <EmployeeAnalytics
                      performanceList={queueStore.getEmployeePerformance()}
                    />
                  </div>
                )}

                {/* Tab 2: Analytics Charts */}
                {adminTab === 'charts' && (
                  <div className="space-y-6">
                    <AdminCharts
                      tokens={state.tokens}
                      services={state.services}
                      staff={state.staff}
                    />
                  </div>
                )}

                {/* Tab 3: Tokens Master Table */}
                {adminTab === 'table' && (
                  <TokensMasterTable
                    tokens={state.tokens}
                    services={state.services}
                    staff={state.staff}
                    offices={state.offices}
                  />
                )}

                {/* Tab 4: System Management */}
                {adminTab === 'manage' && (
                  <OfficeManagement
                    offices={state.offices}
                    services={state.services}
                    counters={state.counters}
                    staff={state.staff}
                  />
                )}
              </div>
            )}
          </div>
        )}
      </main>

      {/* Supabase Configuration Modal */}
      <SupabaseConfigModal
        isOpen={showDbModal}
        onClose={() => setShowDbModal(false)}
      />

      {/* Government Footer */}
      <footer className="bg-slate-900 border-t border-slate-800 text-slate-400 text-xs py-6 mt-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center space-x-2">
            <Building2 className="w-4 h-4 text-blue-400" />
            <span className="font-semibold text-white">SmartQueue Government Digital Platform</span>
            <span>•</span>
            <span>Supabase Realtime PostgreSQL Infrastructure</span>
          </div>

          <div className="flex items-center space-x-4 text-slate-400">
            <span>Daily Reset: 00:00 UTC</span>
            <span>•</span>
            <span>Zero Data Tampering Audit Logging</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
