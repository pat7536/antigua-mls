'use client';

import Link from 'next/link';

export default function Footer() {
  return (
    <footer style={{
      backgroundColor: '#f9fafb',
      borderTop: '1px solid #e5e7eb',
      marginTop: '64px',
      padding: '32px 0 24px'
    }}>
      <div className="container">
        <div style={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '24px',
          marginBottom: '16px'
        }}>
          <Link
            href="/legal-disclaimer"
            style={{
              color: '#6b7280',
              textDecoration: 'none',
              fontSize: '0.875rem',
              fontWeight: '500',
              transition: 'color 0.2s ease'
            }}
            onMouseOver={(e) => e.currentTarget.style.color = '#374151'}
            onMouseOut={(e) => e.currentTarget.style.color = '#6b7280'}
          >
            Legal Disclaimer
          </Link>
          
          <span style={{ color: '#d1d5db', fontSize: '0.875rem' }}>•</span>
          
          <a
            href="mailto:info@antigua-mls.com"
            style={{
              color: '#6b7280',
              textDecoration: 'none',
              fontSize: '0.875rem',
              fontWeight: '500',
              transition: 'color 0.2s ease'
            }}
            onMouseOver={(e) => e.currentTarget.style.color = '#374151'}
            onMouseOut={(e) => e.currentTarget.style.color = '#6b7280'}
          >
            Contact
          </a>
        </div>
        
        <div style={{
          textAlign: 'center',
          fontSize: '0.75rem',
          color: '#9ca3af'
        }}>
          © {new Date().getFullYear()} Antigua-MLS. All rights reserved.
        </div>
      </div>
    </footer>
  );
}