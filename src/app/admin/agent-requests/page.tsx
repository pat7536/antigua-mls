'use client';

import { useState, useEffect } from 'react';
import { useUser } from '@clerk/nextjs';
import { useUserRole } from '@/contexts/UserRoleContext';
import Header from '@/components/Header';
import Link from 'next/link';

type AgentRequest = {
  id: string;
  fullName: string;
  email: string;
  agencyName: string;
  status: string;
  userId: string;
  submittedAt: string;
  notes: string;
  createdTime: string;
};

export default function AdminAgentRequestsPage() {
  const { user } = useUser();
  const { role } = useUserRole();
  const [agentRequests, setAgentRequests] = useState<AgentRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [processingId, setProcessingId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (user && role === 'admin') {
      fetchAgentRequests();
    }
  }, [user, role]);

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

  // Check if user has admin role
  if (role !== 'admin') {
    return (
      <div>
        <Header />
        <main className="main">
          <div className="container">
            <div className="text-center">
              <h1>Access Denied</h1>
              <p>This page is only accessible to administrators.</p>
              <p>Current role: <strong>{role}</strong></p>
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

  const fetchAgentRequests = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/admin/agent-requests');
      
      if (!response.ok) {
        throw new Error('Failed to fetch agent requests');
      }

      const data = await response.json();
      setAgentRequests(data.agentRequests || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  const handleApproval = async (requestId: string, action: 'approve' | 'reject') => {
    try {
      setProcessingId(requestId);
      const response = await fetch(`/api/admin/agent-requests/${requestId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ action }),
      });

      if (!response.ok) {
        throw new Error(`Failed to ${action} agent request`);
      }

      const result = await response.json();
      
      // Update the local state
      setAgentRequests(prev => 
        prev.map(request => 
          request.id === requestId 
            ? { ...request, status: result.status }
            : request
        )
      );

      // Show success message
      alert(result.message);
    } catch (err) {
      alert(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setProcessingId(null);
    }
  };

  const formatDate = (dateString: string) => {
    try {
      return new Date(dateString).toLocaleDateString();
    } catch {
      return dateString;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'pending': return '#f59e0b';
      case 'approved': return '#10b981';
      case 'rejected': return '#ef4444';
      default: return '#6b7280';
    }
  };

  if (loading) {
    return (
      <div>
        <Header />
        <main className="main">
          <div className="container">
            <div className="text-center">
              <h1>Loading agent requests...</h1>
            </div>
          </div>
        </main>
      </div>
    );
  }

  if (error) {
    return (
      <div>
        <Header />
        <main className="main">
          <div className="container">
            <div className="text-center">
              <h1>Error</h1>
              <p>{error}</p>
              <button 
                onClick={fetchAgentRequests} 
                className="btn btn-primary"
              >
                Retry
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
          <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
            <div style={{ marginBottom: '32px' }}>
              <h1 style={{ 
                fontSize: '2rem', 
                fontWeight: '700', 
                color: '#1f2937',
                marginBottom: '8px'
              }}>
                Agent Requests Management
              </h1>
              <p style={{ color: '#6b7280', fontSize: '1.1rem' }}>
                Review and approve agent applications
              </p>
            </div>

            {agentRequests.length === 0 ? (
              <div className="text-center" style={{ padding: '48px' }}>
                <h2>No agent requests found</h2>
                <p>There are currently no pending agent applications.</p>
              </div>
            ) : (
              <div style={{
                background: 'white',
                borderRadius: '12px',
                boxShadow: '0 4px 6px rgba(0, 0, 0, 0.05)',
                overflow: 'hidden',
              }}>
                <div style={{ overflowX: 'auto' }}>
                  <table style={{ 
                    width: '100%', 
                    borderCollapse: 'collapse',
                    fontSize: '0.95rem'
                  }}>
                    <thead>
                      <tr style={{ 
                        background: '#f9fafb', 
                        borderBottom: '1px solid #e5e7eb' 
                      }}>
                        <th style={{ 
                          padding: '16px', 
                          textAlign: 'left', 
                          fontWeight: '600',
                          color: '#374151'
                        }}>Name</th>
                        <th style={{ 
                          padding: '16px', 
                          textAlign: 'left', 
                          fontWeight: '600',
                          color: '#374151'
                        }}>Email</th>
                        <th style={{ 
                          padding: '16px', 
                          textAlign: 'left', 
                          fontWeight: '600',
                          color: '#374151'
                        }}>Agency</th>
                        <th style={{ 
                          padding: '16px', 
                          textAlign: 'left', 
                          fontWeight: '600',
                          color: '#374151'
                        }}>Status</th>
                        <th style={{ 
                          padding: '16px', 
                          textAlign: 'left', 
                          fontWeight: '600',
                          color: '#374151'
                        }}>Submitted</th>
                        <th style={{ 
                          padding: '16px', 
                          textAlign: 'left', 
                          fontWeight: '600',
                          color: '#374151'
                        }}>Details</th>
                        <th style={{ 
                          padding: '16px', 
                          textAlign: 'center', 
                          fontWeight: '600',
                          color: '#374151'
                        }}>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {agentRequests.map((request) => (
                        <tr key={request.id} style={{ 
                          borderBottom: '1px solid #e5e7eb',
                          transition: 'background-color 0.2s'
                        }}>
                          <td style={{ padding: '16px', fontWeight: '500' }}>
                            {request.fullName}
                          </td>
                          <td style={{ padding: '16px', color: '#6b7280' }}>
                            {request.email}
                          </td>
                          <td style={{ padding: '16px' }}>
                            {request.agencyName}
                          </td>
                          <td style={{ padding: '16px' }}>
                            <span style={{
                              display: 'inline-block',
                              padding: '4px 12px',
                              borderRadius: '20px',
                              fontSize: '0.875rem',
                              fontWeight: '500',
                              backgroundColor: getStatusColor(request.status) + '20',
                              color: getStatusColor(request.status),
                              border: `1px solid ${getStatusColor(request.status)}40`
                            }}>
                              {request.status}
                            </span>
                          </td>
                          <td style={{ padding: '16px', color: '#6b7280' }}>
                            {formatDate(request.createdTime)}
                          </td>
                          <td style={{ padding: '16px', color: '#6b7280', fontSize: '0.875rem' }}>
                            {request.notes ? (
                              <div style={{ 
                                maxWidth: '200px', 
                                overflow: 'hidden',
                                textOverflow: 'ellipsis',
                                whiteSpace: 'nowrap'
                              }} title={request.notes}>
                                {request.notes}
                              </div>
                            ) : (
                              'No additional notes'
                            )}
                          </td>
                          <td style={{ padding: '16px', textAlign: 'center' }}>
                            {request.status === 'Pending' ? (
                              <div style={{ display: 'flex', gap: '8px', justifyContent: 'center' }}>
                                <button
                                  onClick={() => handleApproval(request.id, 'approve')}
                                  disabled={processingId === request.id}
                                  style={{
                                    padding: '8px 16px',
                                    backgroundColor: '#10b981',
                                    color: 'white',
                                    border: 'none',
                                    borderRadius: '6px',
                                    fontSize: '0.875rem',
                                    fontWeight: '500',
                                    cursor: processingId === request.id ? 'not-allowed' : 'pointer',
                                    opacity: processingId === request.id ? 0.5 : 1,
                                    transition: 'all 0.2s'
                                  }}
                                >
                                  {processingId === request.id ? 'Processing...' : 'Approve'}
                                </button>
                                <button
                                  onClick={() => handleApproval(request.id, 'reject')}
                                  disabled={processingId === request.id}
                                  style={{
                                    padding: '8px 16px',
                                    backgroundColor: '#ef4444',
                                    color: 'white',
                                    border: 'none',
                                    borderRadius: '6px',
                                    fontSize: '0.875rem',
                                    fontWeight: '500',
                                    cursor: processingId === request.id ? 'not-allowed' : 'pointer',
                                    opacity: processingId === request.id ? 0.5 : 1,
                                    transition: 'all 0.2s'
                                  }}
                                >
                                  Reject
                                </button>
                              </div>
                            ) : (
                              <span style={{ color: '#6b7280', fontSize: '0.875rem' }}>
                                {request.status}
                              </span>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}