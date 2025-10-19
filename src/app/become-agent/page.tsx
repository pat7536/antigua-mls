'use client';

import { useState } from 'react';
import { useUser } from '@clerk/nextjs';
import { useUserRole } from '@/contexts/UserRoleContext';
import AgentRequestForm from '@/components/AgentRequestForm';
import Header from '@/components/Header';
import Link from 'next/link';

export default function BecomeAgentPage() {
  const { user } = useUser();
  const { role } = useUserRole();
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);

  // Check if user is authenticated
  if (!user) {
    return (
      <div>
        <Header />
        <main className="main">
          <div className="container">
            <div className="text-center">
              <h1>Access Denied</h1>
              <p>Please sign in to access this page.</p>
            </div>
          </div>
        </main>
      </div>
    );
  }

  // Check if user has viewer role (as specified in requirements)
  if (role !== 'viewer') {
    return (
      <div>
        <Header />
        <main className="main">
          <div className="container">
            <div className="text-center">
              <h1>Access Denied</h1>
              <p>This page is only accessible to users with viewer role.</p>
              <p>
                Current role: <strong>{role}</strong>
              </p>
              <div style={{ marginTop: '20px' }}>
                <Link href="/" className="btn btn-primary">
                  Back to Home
                </Link>
              </div>
            </div>
          </div>
        </main>
      </div>
    );
  }

  const handleSuccess = () => {
    setShowSuccessMessage(true);
  };

  const handleBackToHome = () => {
    window.location.href = '/';
  };

  if (showSuccessMessage) {
    return (
      <div>
        <Header />
        <main className="main">
          <div className="container">
            <div
              className="success-message"
              style={{
                maxWidth: '600px',
                margin: '0 auto',
                background: 'white',
                borderRadius: '12px',
                padding: '48px 32px',
                textAlign: 'center',
                boxShadow: '0 4px 6px rgba(0, 0, 0, 0.05)',
              }}
            >
              <div
                style={{
                  width: '80px',
                  height: '80px',
                  background: '#10b981',
                  borderRadius: '50%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  margin: '0 auto 24px',
                  fontSize: '2rem',
                }}
              >
                ✓
              </div>
              <h2
                style={{
                  fontSize: '1.75rem',
                  fontWeight: '700',
                  color: '#1f2937',
                  marginBottom: '16px',
                }}
              >
                Application Submitted!
              </h2>
              <p
                style={{
                  fontSize: '1.1rem',
                  color: '#6b7280',
                  lineHeight: '1.6',
                  marginBottom: '32px',
                }}
              >
                Thanks for your request! Our team will review your agent
                application and get back to you shortly. You'll receive an email
                confirmation once your application has been processed.
              </p>
              <button
                onClick={handleBackToHome}
                className="btn btn-primary"
                style={{ padding: '12px 32px', fontSize: '1rem' }}
              >
                Back to Home
              </button>
            </div>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div>
      <Header />
      <main className="main">
        <div className="container">
          <AgentRequestForm
            onSuccess={handleSuccess}
            onCancel={handleBackToHome}
          />
        </div>
      </main>
    </div>
  );
}
