'use client';

import { useState } from 'react';
import { useUser } from '@clerk/nextjs';

type FormData = {
  fullName: string;
  email: string;
  agencyName: string;
  licenseNumber: string;
  phoneNumber: string;
  additionalNotes: string;
  // File upload will be added in future enhancement
};

type AgentRequestFormProps = {
  onSuccess?: () => void;
  onCancel?: () => void;
};

export default function AgentRequestForm({
  onSuccess,
  onCancel,
}: AgentRequestFormProps) {
  const { user } = useUser();
  const [formData, setFormData] = useState<FormData>({
    fullName: user?.fullName || '',
    email: user?.primaryEmailAddress?.emailAddress || '',
    agencyName: '',
    licenseNumber: '',
    phoneNumber: '',
    additionalNotes: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);

    try {
      const response = await fetch('/api/agent-requests', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to submit request');
      }

      // Success! Call the onSuccess callback
      onSuccess?.();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="agent-request-form">
      <div className="form-header">
        <h2>Become an Agent</h2>
        <p>
          Apply to become a verified agent on Antigua MLS. Our team will review
          your application and get back to you shortly.
        </p>
      </div>

      {error && (
        <div
          className="error-message"
          style={{
            padding: '12px',
            marginBottom: '20px',
            backgroundColor: '#fee2e2',
            color: '#dc2626',
            borderRadius: '6px',
            fontSize: '14px',
          }}
        >
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="form">
        <div className="form-row">
          <div className="form-group">
            <label htmlFor="fullName">Full Name *</label>
            <input
              type="text"
              id="fullName"
              name="fullName"
              value={formData.fullName}
              onChange={handleChange}
              required
              className="form-input"
              placeholder="Enter your full name"
            />
          </div>

          <div className="form-group">
            <label htmlFor="email">Email *</label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
              className="form-input"
              placeholder="Enter your email address"
            />
          </div>
        </div>

        <div className="form-row">
          <div className="form-group">
            <label htmlFor="agencyName">Agency Name *</label>
            <input
              type="text"
              id="agencyName"
              name="agencyName"
              value={formData.agencyName}
              onChange={handleChange}
              required
              className="form-input"
              placeholder="Enter your agency name"
            />
          </div>

          <div className="form-group">
            <label htmlFor="licenseNumber">License Number *</label>
            <input
              type="text"
              id="licenseNumber"
              name="licenseNumber"
              value={formData.licenseNumber}
              onChange={handleChange}
              required
              className="form-input"
              placeholder="Enter your license number"
            />
          </div>
        </div>

        <div className="form-group">
          <label htmlFor="phoneNumber">Phone Number *</label>
          <input
            type="tel"
            id="phoneNumber"
            name="phoneNumber"
            value={formData.phoneNumber}
            onChange={handleChange}
            required
            className="form-input"
            placeholder="Enter your phone number"
          />
        </div>

        <div className="form-group">
          <label htmlFor="additionalNotes">Additional Notes (Optional)</label>
          <textarea
            id="additionalNotes"
            name="additionalNotes"
            value={formData.additionalNotes}
            onChange={handleChange}
            className="form-input"
            rows={4}
            placeholder="Any additional information you'd like to share..."
          />
        </div>

        {/* File Upload - Placeholder for future enhancement */}
        <div className="form-group">
          <label>License Documentation (Optional)</label>
          <div
            style={{
              padding: '24px',
              border: '2px dashed #d1d5db',
              borderRadius: '8px',
              textAlign: 'center',
              color: '#6b7280',
              background: '#f9fafb',
            }}
          >
            <p style={{ marginBottom: '8px' }}>📄 File upload coming soon</p>
            <p style={{ fontSize: '0.85rem' }}>
              For now, please mention any relevant documentation in the notes
              above.
            </p>
          </div>
        </div>

        <div className="form-actions">
          <button
            type="button"
            onClick={onCancel}
            className="btn btn-secondary"
            disabled={isSubmitting}
          >
            Cancel
          </button>
          <button
            type="submit"
            className="btn btn-primary"
            disabled={isSubmitting}
          >
            {isSubmitting ? (
              <>
                <span style={{ marginRight: '8px' }}>⏳</span>
                Submitting...
              </>
            ) : (
              'Submit Application'
            )}
          </button>
        </div>
      </form>
    </div>
  );
}
