import type { Metadata } from 'next';
import Header from '@/components/Header';

export const metadata: Metadata = {
  title: 'Legal Disclaimer | Antigua-MLS',
  description: 'Legal disclaimer for Antigua-MLS, an independent property discovery platform.',
};

export default function LegalDisclaimerPage() {
  const contactEmail = process.env.NEXT_PUBLIC_CONTACT_EMAIL || 'contact@antigua-mls.com';

  return (
    <div>
      <Header />
      <main className="main">
        <div className="container">
          <div style={{ 
            maxWidth: '800px', 
            margin: '0 auto',
            backgroundColor: 'white',
            padding: '48px',
            borderRadius: '8px',
            boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
            lineHeight: '1.7'
          }}>
            <h1 style={{
              fontSize: '2.5rem',
              fontWeight: 'bold',
              color: '#1f2937',
              marginBottom: '24px',
              textAlign: 'center'
            }}>
              Legal Disclaimer
            </h1>
            
            <p style={{
              fontSize: '0.875rem',
              color: '#6b7280',
              textAlign: 'center',
              marginBottom: '32px',
              fontWeight: '500'
            }}>
              Last Updated: January 4, 2026
            </p>

            <div style={{
              fontSize: '1rem',
              color: '#374151',
              lineHeight: '1.7'
            }}>
              <p style={{ marginBottom: '24px' }}>
                Antigua-MLS ("Antigua-MLS", "we", "our", or "us") operates an independent online property discovery and advertising platform. By accessing or using this website, you acknowledge and agree to the terms of this Legal Disclaimer.
              </p>

              <hr style={{ margin: '32px 0', border: 'none', borderTop: '1px solid #e5e7eb' }} />

              <h2 style={{
                fontSize: '1.5rem',
                fontWeight: '600',
                color: '#1f2937',
                marginTop: '32px',
                marginBottom: '16px'
              }}>
                1. Not a Real Estate Brokerage or Agent
              </h2>
              
              <p style={{ marginBottom: '16px' }}>
                Antigua-MLS is <strong>not a real estate brokerage, real estate agent or REALTOR®</strong>.
              </p>
              
              <p style={{ marginBottom: '16px' }}>
                We do <strong>not</strong> represent buyers, sellers, landlords, or tenants, and we do <strong>not</strong> engage in real estate trading, negotiations, transactions, or advisory services of any kind.
              </p>
              
              <p style={{ marginBottom: '16px' }}>
                Antigua-MLS functions solely as an <strong>independent property discovery and information platform</strong>, displaying property information sourced from third-party providers for informational purposes only.
              </p>
              
              <p style={{ marginBottom: '16px' }}>
                Use of this website does <strong>not</strong> create a brokerage, agency, fiduciary, or professional relationship between Antigua-MLS and any user.
              </p>

              <hr style={{ margin: '32px 0', border: 'none', borderTop: '1px solid #e5e7eb' }} />

              <h2 style={{
                fontSize: '1.5rem',
                fontWeight: '600',
                color: '#1f2937',
                marginBottom: '16px'
              }}>
                2. No Professional Advice
              </h2>
              
              <p style={{ marginBottom: '16px' }}>
                All information provided on Antigua-MLS is for <strong>general informational purposes only</strong>.
              </p>
              
              <p style={{ marginBottom: '16px' }}>
                Nothing on this website constitutes real estate, legal, financial, investment, or tax advice. Users should consult licensed real estate professionals, lawyers, accountants, or other qualified advisors before making any real estate or financial decisions.
              </p>

              <hr style={{ margin: '32px 0', border: 'none', borderTop: '1px solid #e5e7eb' }} />

              <h2 style={{
                fontSize: '1.5rem',
                fontWeight: '600',
                color: '#1f2937',
                marginBottom: '16px'
              }}>
                3. Third-Party Listings and Content
              </h2>
              
              <p style={{ marginBottom: '16px' }}>
                Property listings, images, descriptions, pricing, availability, and related information displayed on Antigua-MLS are provided by <strong>third-party sources</strong>, including real estate agents, brokerages, property owners, developers, and external websites.
              </p>
              
              <p style={{ marginBottom: '16px' }}>
                Antigua-MLS does <strong>not</strong> create, edit, verify, or endorse third-party listing content and assumes <strong>no responsibility or liability</strong> for the accuracy, completeness, legality, or reliability of such content.
              </p>
              
              <p style={{ marginBottom: '16px' }}>
                Responsibility for listing content rests solely with the original listing provider.
              </p>

              <hr style={{ margin: '32px 0', border: 'none', borderTop: '1px solid #e5e7eb' }} />

              <h2 style={{
                fontSize: '1.5rem',
                fontWeight: '600',
                color: '#1f2937',
                marginBottom: '16px'
              }}>
                4. Accuracy of Information
              </h2>
              
              <p style={{ marginBottom: '16px' }}>
                While Antigua-MLS believes the information displayed on this website to be reliable, <strong>all information is provided "as is" and is not guaranteed</strong>.
              </p>
              
              <p style={{ marginBottom: '16px' }}>
                Property details, prices, availability, and status may change without notice and may be inaccurate, outdated, or incomplete.
              </p>
              
              <p style={{ marginBottom: '16px' }}>
                Users are strongly encouraged to <strong>independently verify all property information</strong> directly with the listing agent, broker, owner, or other appropriate source before relying on it.
              </p>

              <hr style={{ margin: '32px 0', border: 'none', borderTop: '1px solid #e5e7eb' }} />

              <h2 style={{
                fontSize: '1.5rem',
                fontWeight: '600',
                color: '#1f2937',
                marginBottom: '16px'
              }}>
                5. Copyright and Intellectual Property
              </h2>
              
              <p style={{ marginBottom: '16px' }}>
                All third-party listing content, including photographs, descriptions, and branding, remains the <strong>intellectual property of its respective owners</strong>.
              </p>
              
              <p style={{ marginBottom: '16px' }}>
                Antigua-MLS does not claim ownership of third-party content and displays such content for informational and discovery purposes, often with attribution and links to the original source.
              </p>
              
              <p style={{ marginBottom: '16px' }}>
                If you are a copyright holder and believe that content on Antigua-MLS infringes your intellectual property rights, please contact us promptly. Upon valid notice, we will review and, where appropriate, remove or modify the content.
              </p>

              <hr style={{ margin: '32px 0', border: 'none', borderTop: '1px solid #e5e7eb' }} />

              <h2 style={{
                fontSize: '1.5rem',
                fontWeight: '600',
                color: '#1f2937',
                marginBottom: '16px'
              }}>
                6. No Affiliation or Endorsement
              </h2>
              
              <p style={{ marginBottom: '16px' }}>
                Antigua-MLS is an <strong>independent platform</strong> and is <strong>not affiliated with, endorsed by, or operated by</strong> any real estate board, MLS system, REALTOR® association, government authority, or regulatory body.
              </p>
              
              <p style={{ marginBottom: '16px' }}>
                MLS®, REALTOR®, and related marks are trademarks of their respective owners and are used only in a descriptive or nominative manner where applicable.
              </p>

              <hr style={{ margin: '32px 0', border: 'none', borderTop: '1px solid #e5e7eb' }} />

              <h2 style={{
                fontSize: '1.5rem',
                fontWeight: '600',
                color: '#1f2937',
                marginBottom: '16px'
              }}>
                7. Not Intended to Solicit
              </h2>
              
              <p style={{ marginBottom: '16px' }}>
                This website is <strong>not intended to solicit</strong> properties already listed for sale or individuals who are subject to exclusive brokerage or representation agreements.
              </p>

              <hr style={{ margin: '32px 0', border: 'none', borderTop: '1px solid #e5e7eb' }} />

              <h2 style={{
                fontSize: '1.5rem',
                fontWeight: '600',
                color: '#1f2937',
                marginBottom: '16px'
              }}>
                8. Limitation of Liability
              </h2>
              
              <p style={{ marginBottom: '16px' }}>
                To the fullest extent permitted by law, Antigua-MLS disclaims all liability for any loss, damage, claim, or expense arising out of or related to:
              </p>
              
              <ul style={{ 
                marginBottom: '16px',
                paddingLeft: '24px',
                listStyleType: 'disc'
              }}>
                <li style={{ marginBottom: '8px' }}>Use of or reliance on information displayed on this website</li>
                <li style={{ marginBottom: '8px' }}>Errors or omissions in listing data</li>
                <li style={{ marginBottom: '8px' }}>Interactions or transactions between users and third-party listing providers</li>
              </ul>
              
              <p style={{ marginBottom: '16px' }}>
                This includes, without limitation, direct, indirect, incidental, consequential, or special damages.
              </p>

              <hr style={{ margin: '32px 0', border: 'none', borderTop: '1px solid #e5e7eb' }} />

              <h2 style={{
                fontSize: '1.5rem',
                fontWeight: '600',
                color: '#1f2937',
                marginBottom: '16px'
              }}>
                9. Jurisdiction and Use
              </h2>
              
              <p style={{ marginBottom: '16px' }}>
                This website is operated from Canada and provides information relating to properties in Antigua & Barbuda and other jurisdictions. Users are responsible for ensuring compliance with all applicable local laws and regulations when using this site.
              </p>

              <hr style={{ margin: '32px 0', border: 'none', borderTop: '1px solid #e5e7eb' }} />

              <h2 style={{
                fontSize: '1.5rem',
                fontWeight: '600',
                color: '#1f2937',
                marginBottom: '16px'
              }}>
                10. Changes to This Disclaimer
              </h2>
              
              <p style={{ marginBottom: '16px' }}>
                Antigua-MLS reserves the right to update or modify this Legal Disclaimer at any time without prior notice. Continued use of the website constitutes acceptance of any changes.
              </p>

              <hr style={{ margin: '32px 0', border: 'none', borderTop: '1px solid #e5e7eb' }} />

              <div style={{
                marginTop: '32px',
                padding: '24px',
                backgroundColor: '#f9fafb',
                borderRadius: '8px',
                border: '1px solid #e5e7eb'
              }}>
                <h2 style={{
                  fontSize: '1.25rem',
                  fontWeight: '600',
                  color: '#1f2937',
                  marginBottom: '12px'
                }}>
                  Contact
                </h2>
                
                <p style={{ marginBottom: '12px' }}>
                  If you have questions regarding this disclaimer or wish to report a rights concern, please contact us at:
                </p>
                
                <p style={{ 
                  fontWeight: '600',
                  color: '#2563eb',
                  fontSize: '1.125rem'
                }}>
                  info@antigua-mls.com
                </p>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}