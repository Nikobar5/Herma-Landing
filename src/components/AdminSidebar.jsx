import React from 'react';

const BUSINESS_NAV = [
    { id: 'overview', label: 'Dashboard', icon: 'home' },
    { id: 'models', label: 'Models', icon: 'cube' },
    { id: 'requests', label: 'Requests', icon: 'arrow-right' },
    { id: 'latency', label: 'Latency', icon: 'clock' },
    { id: 'retention', label: 'Retention', icon: 'repeat' },
    { id: 'site-analytics', label: 'Site Analytics', icon: 'chart' },
    { id: 'funnel', label: 'Funnel', icon: 'funnel' },
    { id: 'customers', label: 'Customers', icon: 'users' },
];

const AGENT_NAV = [
    { id: 'agent-status', label: 'Agent Overview', icon: 'pulse' },
    { id: 'agent-activity', label: 'Activity Log', icon: 'terminal' },
    { id: 'agent-alerts', label: 'Alerts', icon: 'alert' },
];

const ICONS = {
    home: <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M2.25 12l8.954-8.955a1.126 1.126 0 011.591 0L21.75 12M4.5 9.75v10.125c0 .621.504 1.125 1.125 1.125H9.75v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21h4.125c.621 0 1.125-.504 1.125-1.125V9.75M8.25 21h8.25" /></svg>,
    cube: <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M21 7.5l-9-5.25L3 7.5m18 0l-9 5.25m9-5.25v9l-9 5.25M3 7.5l9 5.25M3 7.5v9l9 5.25m0-9v9" /></svg>,
    'arrow-right': <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M7.5 21L3 16.5m0 0L7.5 12M3 16.5h13.5m0-13.5L21 7.5m0 0L16.5 12M21 7.5H7.5" /></svg>,
    clock: <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>,
    repeat: <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M19.5 12c0-1.232-.046-2.453-.138-3.662a4.006 4.006 0 00-3.7-3.7 48.678 48.678 0 00-7.324 0 4.006 4.006 0 00-3.7 3.7c-.017.22-.032.441-.046.662M4.5 12c0 1.232.046 2.453.138 3.662a4.006 4.006 0 003.7 3.7 48.656 48.656 0 007.324 0 4.006 4.006 0 003.7-3.7c.017-.22.032-.441.046-.662" /></svg>,
    chart: <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M3 13.125C3 12.504 3.504 12 4.125 12h2.25c.621 0 1.125.504 1.125 1.125v6.75C7.5 20.496 6.996 21 6.375 21h-2.25A1.125 1.125 0 013 19.875v-6.75zM9.75 8.625c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125v11.25c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V8.625zM16.5 4.125c0-.621.504-1.125 1.125-1.125h2.25C20.496 3 21 3.504 21 4.125v15.75c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V4.125z" /></svg>,
    funnel: <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M12 3c2.755 0 5.455.232 8.083.678.533.09.917.556.917 1.096v1.044a2.25 2.25 0 01-.659 1.591l-5.432 5.432a2.25 2.25 0 00-.659 1.591v2.927a2.25 2.25 0 01-1.244 2.013L9.75 21v-6.568a2.25 2.25 0 00-.659-1.591L3.659 7.409A2.25 2.25 0 013 5.818V4.774c0-.54.384-1.006.917-1.096A48.32 48.32 0 0112 3z" /></svg>,
    pulse: <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M21 12h-4l-3 9L9 3l-3 9H3" /></svg>,
    terminal: <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M6.75 7.5l3 2.25-3 2.25m4.5 0h3m-9 8.25h13.5A2.25 2.25 0 0021 18V6a2.25 2.25 0 00-2.25-2.25H5.25A2.25 2.25 0 003 6v12a2.25 2.25 0 002.25 2.25z" /></svg>,
    alert: <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z" /></svg>,
    users: <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M15 19.128a9.38 9.38 0 002.625.372 9.337 9.337 0 004.121-.952 4.125 4.125 0 00-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 018.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0111.964-3.07M12 6.375a3.375 3.375 0 11-6.75 0 3.375 3.375 0 016.75 0zm8.25 2.25a2.625 2.625 0 11-5.25 0 2.625 2.625 0 015.25 0z" /></svg>,
};

function NavItem({ item, isActive, onClick, collapsed, isAgent }) {
    return (
        <button
            onClick={onClick}
            title={collapsed ? item.label : undefined}
            className={`w-full flex items-center gap-3 text-left transition-colors relative ${collapsed ? 'px-0 py-2 justify-center' : 'px-4 py-1.5'
                } ${isActive
                    ? 'text-[var(--text-primary)] font-medium'
                    : 'text-[var(--text-tertiary)] hover:text-[var(--text-secondary)] hover:bg-[var(--bg-tertiary)]/30'
                }`}
        >
            <span className={`shrink-0 transition-opacity ${isActive ? 'opacity-100' : 'opacity-50'}`}>{ICONS[item.icon]}</span>
            {!collapsed && (
                <span className="text-[11px] font-medium tracking-wide truncate">{item.label}</span>
            )}
            {isActive && !collapsed && (
                <div className="absolute right-4 w-1.5 h-1.5 rounded-full bg-[var(--text-primary)]" />
            )}
        </button>
    );
}

export default function AdminSidebar({ activeTab, onTabChange, collapsed, onToggleCollapse, agentHealth }) {
    // Determine agent status indicator color
    const agentStatusColor = agentHealth === 'healthy' ? '#34D399' : agentHealth === 'unhealthy' ? '#F87171' : '#71717A';

    return (
        <aside className={`admin-sidebar flex flex-col transition-all duration-200 ${collapsed ? 'w-16' : 'w-56'}`}
            style={{ height: '100vh', position: 'sticky', top: 0, overflowY: 'auto', overflowX: 'hidden' }}>
            {/* Header */}
            <div className={`flex items-center h-14 px-4 ${collapsed ? 'justify-center' : 'justify-between'}`}>
                {!collapsed && (
                    <span className="text-sm font-semibold text-[var(--text-primary)] truncate" style={{ fontFamily: 'var(--font-heading)' }}>
                        Command Center
                    </span>
                )}
                <button onClick={onToggleCollapse}
                    className="text-[var(--text-tertiary)] hover:text-[var(--text-primary)] transition-colors p-1 rounded-md hover:bg-[var(--bg-tertiary)]"
                    title={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}>
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                        {collapsed ? <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
                            : <path strokeLinecap="round" strokeLinejoin="round" d="M18.75 19.5l-7.5-7.5 7.5-7.5m-6 15L5.25 12l7.5-7.5" />}
                    </svg>
                </button>
            </div>

            {/* Business Analytics section */}
            <nav className="flex-1 py-2">
                {!collapsed && (
                    <div className="px-4 pt-2 pb-1 text-[10px] font-medium text-[var(--text-tertiary)] uppercase tracking-wider">
                        Business Analytics
                    </div>
                )}
                {collapsed && <div className="h-px bg-[var(--border-primary)] mx-2 my-1" />}
                {BUSINESS_NAV.map((item) => (
                    <NavItem key={item.id} item={item} isActive={activeTab === item.id}
                        onClick={() => onTabChange(item.id)} collapsed={collapsed} isAgent={false} />
                ))}

                {/* Divider with agent label */}
                <div className="mx-3 my-3">
                    <div className="h-px bg-[var(--border-secondary)]" />
                </div>
                {!collapsed ? (
                    <div className="px-4 pb-1 flex items-center gap-2">
                        <span className="text-[10px] font-medium uppercase tracking-wider" style={{ color: '#FBBF24' }}>
                            Agent System
                        </span>
                        <span className="w-2 h-2 rounded-full" style={{ background: agentStatusColor, boxShadow: agentHealth === 'healthy' ? `0 0 6px ${agentStatusColor}` : 'none' }} />
                    </div>
                ) : (
                    <div className="flex justify-center py-1">
                        <span className="w-2 h-2 rounded-full" style={{ background: agentStatusColor }} />
                    </div>
                )}
                {AGENT_NAV.map((item) => (
                    <NavItem key={item.id} item={item} isActive={activeTab === item.id}
                        onClick={() => onTabChange(item.id)} collapsed={collapsed} isAgent={true} />
                ))}
            </nav>
        </aside>
    );
}
