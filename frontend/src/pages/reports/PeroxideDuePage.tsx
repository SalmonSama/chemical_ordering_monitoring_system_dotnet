import { useState, useEffect } from 'react';
import type { CSSProperties } from 'react';
import { useNavigate } from 'react-router-dom';
import apiClient from '../../api/client';

interface PeroxideDueRow {
  id: string;
  statusIndicator: string;
  itemName: string;
  lotNumber: string;
  labName: string;
  locationName: string;
  monitorDueIn: number;
  monitorDate: string;
  lastMonitorDate: string | null;
  lastPpmResult: string;
  lastClassification: string;
  openDate: string | null;
}

export default function PeroxideDuePage() {
  const navigate = useNavigate();
  const [data, setData] = useState<PeroxideDueRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [filterStatus, setFilterStatus] = useState('');

  useEffect(() => {
    apiClient.get<PeroxideDueRow[]>('/dashboard/peroxide-due')
      .then(res => setData(res.data))
      .catch(err => console.error(err))
      .finally(() => setLoading(false));
  }, []);

  const exportCsv = () => {
    if (!data || data.length === 0) return;
    const rows = filteredData.map(r => ({
      'Status': r.statusIndicator.toUpperCase(),
      'Item Name': r.itemName,
      'Lot Number': r.lotNumber,
      'Lab': r.labName,
      'Location': r.locationName,
      'Due In (Days)': r.monitorDueIn,
      'Next Monitor Date': new Date(r.monitorDate).toLocaleDateString(),
      'Last Test Date': r.lastMonitorDate ? new Date(r.lastMonitorDate).toLocaleDateString() : 'Never',
      'Last PPM Result': r.lastPpmResult,
      'Last Class': r.lastClassification,
    }));

    const headers = Object.keys(rows[0]);
    const csvContent = [
      headers.join(','), 
      ...rows.map(row => headers.map(h => `"${(row as any)[h] ?? ''}"`).join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `Peroxide_Schedule_${new Date().toISOString().substring(0, 10)}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const filteredData = filterStatus ? data.filter(d => d.statusIndicator === filterStatus) : data;

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
        <div>
          <h1 style={styles.title}>Peroxide Due Dashboard</h1>
          <p style={styles.subtitle}>Schedules and urgency for peroxide-forming chemical tests.</p>
        </div>
        <button onClick={exportCsv} style={styles.exportBtn}>📥 Export CSV</button>
      </div>

      <div style={styles.filterBar}>
        <label style={styles.filterLabel}>
          Status Filter:
          <select value={filterStatus} onChange={e => setFilterStatus(e.target.value)} style={styles.select}>
            <option value="">All Monitored Lots</option>
            <option value="overdue">Overdue</option>
            <option value="due_soon">Due Soon (≤ 7 days)</option>
            <option value="quarantined">Quarantined</option>
            <option value="warning">Warning Level</option>
            <option value="normal">Normal</option>
          </select>
        </label>
      </div>

      <div style={styles.panel}>
        {loading ? (
          <div style={{ color: '#94a3b8' }}>Loading peroxide schedules...</div>
        ) : (
          <div style={styles.tableWrapper}>
            <table style={styles.table}>
              <thead>
                <tr>
                  <th style={styles.th}>Status</th>
                  <th style={styles.th}>Item & Lot</th>
                  <th style={styles.th}>Lab & Location</th>
                  <th style={styles.th}>Next Monitor Date</th>
                  <th style={styles.th}>Due In</th>
                  <th style={styles.th}>Last Test</th>
                  <th style={styles.th}>Last Result</th>
                  <th style={styles.th}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredData.map(row => (
                  <tr key={row.id}>
                    <td style={styles.td}>
                      <span style={{...styles.badge, ...getStatusBadgeStyle(row.statusIndicator)}}>
                        {row.statusIndicator.replace('_', ' ').toUpperCase()}
                      </span>
                    </td>
                    <td style={styles.td}>
                      <strong>{row.itemName}</strong>
                      <div style={{ fontSize: '0.8rem', color: '#60a5fa', marginTop: '0.2rem' }}>
                        <code style={styles.code}>{row.lotNumber}</code>
                      </div>
                    </td>
                    <td style={styles.td}>
                      <div>{row.labName}</div>
                      <div style={{ fontSize: '0.8rem', color: '#94a3b8' }}>{row.locationName}</div>
                    </td>
                    <td style={styles.td}>{new Date(row.monitorDate).toLocaleDateString()}</td>
                    <td style={styles.td}>
                      <strong style={{ color: row.monitorDueIn < 0 ? '#f87171' : (row.monitorDueIn <= 7 ? '#fbbf24' : '#e2e8f0') }}>
                        {row.monitorDueIn} days
                      </strong>
                    </td>
                    <td style={styles.td}>{row.lastMonitorDate ? new Date(row.lastMonitorDate).toLocaleDateString() : 'Never'}</td>
                    <td style={styles.td}>
                      <div>{row.lastPpmResult}</div>
                      {row.lastClassification !== '—' && (
                        <div style={{ fontSize: '0.75rem', color: '#94a3b8' }}>({row.lastClassification})</div>
                      )}
                    </td>
                    <td style={styles.td}>
                      <button 
                        style={styles.actionLink}
                        onClick={() => navigate('/monitoring/peroxide')}
                      >
                        Log Test
                      </button>
                    </td>
                  </tr>
                ))}
                {filteredData.length === 0 && data.length > 0 && (
                   <tr><td colSpan={8} style={{...styles.td, textAlign: 'center', color: '#94a3b8'}}>No lots match the selected filter.</td></tr>
                )}
                {data.length === 0 && (
                   <tr><td colSpan={8} style={{...styles.td, textAlign: 'center', color: '#94a3b8'}}>No lots currently require peroxide monitoring.</td></tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}

function getStatusBadgeStyle(status: string): CSSProperties {
  switch (status) {
    case 'overdue': return { background: 'rgba(239, 68, 68, 0.2)', color: '#f87171' };
    case 'quarantined': return { background: 'rgba(239, 68, 68, 0.2)', color: '#f87171', border: '1px solid #f87171' };
    case 'due_soon': return { background: 'rgba(245, 158, 11, 0.2)', color: '#fbbf24' };
    case 'warning': return { background: 'rgba(249, 115, 22, 0.2)', color: '#f97316' };
    case 'normal': return { background: 'rgba(16, 185, 129, 0.2)', color: '#34d399' };
    default: return { background: 'rgba(148, 163, 184, 0.2)', color: '#e2e8f0' };
  }
}

const styles: Record<string, CSSProperties> = {
  title: { color: '#f1f5f9', fontSize: '1.75rem', fontWeight: 800, margin: 0 },
  subtitle: { color: '#94a3b8', fontSize: '1rem', marginTop: '0.25rem' },
  exportBtn: {
    background: '#334155', color: '#f1f5f9', border: '1px solid #475569',
    borderRadius: '6px', padding: '0.5rem 1rem', fontSize: '0.9rem', fontWeight: 600, cursor: 'pointer'
  },
  filterBar: { display: 'flex', gap: '1rem', marginBottom: '1rem', background: '#1e293b', padding: '1rem', borderRadius: '8px', border: '1px solid #334155' },
  filterLabel: { color: '#94a3b8', fontSize: '0.85rem', display: 'flex', alignItems: 'center', gap: '0.5rem', fontWeight: 600 },
  select: { background: '#0f172a', color: '#e2e8f0', border: '1px solid #334155', borderRadius: '4px', padding: '0.4rem', fontSize: '0.9rem' },
  panel: { background: '#1e293b', borderRadius: '12px', border: '1px solid #334155', padding: '1rem', overflow: 'hidden' },
  tableWrapper: { overflowX: 'auto' },
  table: { width: '100%', borderCollapse: 'collapse' },
  th: { textAlign: 'left', padding: '0.75rem', color: '#64748b', borderBottom: '1px solid #334155', fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.05em', whiteSpace: 'nowrap' },
  td: { padding: '0.75rem', color: '#e2e8f0', fontSize: '0.9rem', borderBottom: '1px solid rgba(51, 65, 85, 0.5)', verticalAlign: 'middle' },
  badge: { padding: '0.2rem 0.5rem', borderRadius: '4px', fontSize: '0.7rem', fontWeight: 700, letterSpacing: '0.05em', whiteSpace: 'nowrap' },
  code: { background: '#0f172a', color: '#e2e8f0', padding: '0.1rem 0.3rem', borderRadius: '4px', border: '1px solid #334155', fontSize: '0.85rem' },
  actionLink: { background: 'none', border: 'none', color: '#60a5fa', textDecoration: 'underline', cursor: 'pointer', fontSize: '0.85rem', padding: 0 }
};
