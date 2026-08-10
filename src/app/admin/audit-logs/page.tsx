'use client';

import React, { useState, useEffect } from 'react';

export default function AdminAuditLogsPage() {
  const [logs, setLogs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/audit-logs')
      .then((res) => res.json())
      .then((data: any) => {
        if (Array.isArray(data)) setLogs(data);
      })
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="space-y-8">
      <div>
        <h2 className="font-serif text-2xl text-ink font-normal mb-1">Security & Operation Audit Logs</h2>
        <p className="font-sans text-xs text-warm-400">
          Permanent administrative record tracking officer actions, content additions, and deletions.
        </p>
      </div>

      <div className="border border-warm-200 overflow-x-auto rounded-[2px]">
        {loading ? (
          <p className="p-4 font-mono text-xs text-warm-300">Loading audit log stream...</p>
        ) : (
          <table className="w-full text-left font-sans text-xs">
            <thead className="bg-warm-100/60 font-mono text-[10px] uppercase text-warm-400 border-b border-warm-200">
              <tr>
                <th className="p-3">Timestamp</th>
                <th className="p-3">Officer</th>
                <th className="p-3">Action</th>
                <th className="p-3">Details</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-warm-200 font-mono text-xs">
              {logs.map((log: any) => (
                <tr key={log.id} className="hover:bg-warm-100/30">
                  <td className="p-3 text-warm-400 whitespace-nowrap">{log.timestamp}</td>
                  <td className="p-3 text-ink font-bold">{log.officerName || log.officerEmail}</td>
                  <td className="p-3">
                    <span className="px-2 py-0.5 bg-ieee-subtle text-ieee-blue rounded-[2px] font-bold text-[10px]">
                      {log.action}
                    </span>
                  </td>
                  <td className="p-3 text-warm-400 font-sans">{log.details}</td>
                </tr>
              ))}

              {logs.length === 0 && (
                <tr>
                  <td colSpan={4} className="p-8 text-center text-warm-300">
                    No audit records registered.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
