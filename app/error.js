'use client';
import { useEffect } from 'react';

export default function Error({ error, reset }) {
  useEffect(() => {
    console.error('Path page error:', error);
  }, [error]);

  return (
    <div style={{ padding: '40px 20px', maxWidth: 700, margin: '0 auto', fontFamily: 'monospace' }}>
      <h2 style={{ color: '#c00', marginBottom: 16 }}>页面出错了</h2>
      <pre style={{ whiteSpace: 'pre-wrap', wordBreak: 'break-word', background: '#f5f5f5', padding: 16, borderRadius: 8, fontSize: 13, color: '#333' }}>
        {error?.message || 'Unknown error'}
        {error?.stack ? '\n\n' + error.stack : ''}
      </pre>
      <button onClick={reset} style={{ marginTop: 16, padding: '8px 20px', background: '#a68848', color: '#fff', border: 'none', borderRadius: 4, cursor: 'pointer' }}>
        重试
      </button>
    </div>
  );
}
