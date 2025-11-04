'use client';

import { useEffect, useState } from 'react';
import Script from 'next/script';

export default function ChatKitWidget() {
  const [isMinimized, setIsMinimized] = useState(true);

  useEffect(() => {
    const configureChatKit = () => {
      const chatKitElement = document.querySelector('openai-chatkit') as any;
      if (chatKitElement && !isMinimized) {
        console.log('Found ChatKit element:', chatKitElement);
        console.log('ChatKit element methods:', Object.getOwnPropertyNames(chatKitElement));
        
        // Try multiple configuration approaches
        const config = {
          api: {
            async getClientSecret() {
              console.log('Fetching client secret from API...');
              try {
                const response = await fetch('/api/chatkit-token', {
                  method: 'POST',
                  headers: {
                    'Content-Type': 'application/json',
                  },
                });
                
                if (!response.ok) {
                  throw new Error(`HTTP error! status: ${response.status}`);
                }
                
                const data = await response.json();
                console.log('Client secret fetched successfully:', data);
                return data.client_secret;
              } catch (error) {
                console.error('Failed to fetch client secret:', error);
                throw error;
              }
            }
          }
        };

        // Try different configuration methods
        if (typeof chatKitElement.setOptions === 'function') {
          console.log('Using setOptions method...');
          chatKitElement.setOptions(config);
        } else if (typeof chatKitElement.configure === 'function') {
          console.log('Using configure method...');
          chatKitElement.configure(config);
        } else {
          console.log('Setting api property directly...');
          chatKitElement.api = config.api;
        }

        // Set welcome message as direct properties (not via setOptions)
        const welcomeMsg = "Hi! I'm Winston — your Antigua MLS Property Concierge. Ask me how I can help you with Antigua real estate!";
        
        console.log('Setting welcome message as direct properties...');
        chatKitElement.welcomeMessage = welcomeMsg;
        chatKitElement.initialMessage = welcomeMsg;
        
        // Also try setting the attribute directly
        chatKitElement.setAttribute('welcome-message', welcomeMsg);

        // Force a refresh if possible
        if (chatKitElement.refresh) {
          chatKitElement.refresh();
        }
      } else if (!chatKitElement) {
        console.log('ChatKit element not found');
      }
    };

    // Configure when expanded
    if (!isMinimized) {
      setTimeout(configureChatKit, 500);
      setTimeout(configureChatKit, 1500);
      setTimeout(configureChatKit, 3000);
    }
  }, [isMinimized]);

  return (
    <>
      <Script 
        src="https://cdn.platform.openai.com/deployments/chatkit/chatkit.js"
        strategy="afterInteractive"
        onLoad={() => {
          console.log('ChatKit script loaded successfully');
        }}
        onError={(error) => {
          console.error('Failed to load ChatKit script:', error);
        }}
      />
      
      {/* Chat Widget Container */}
      <div style={{
        position: 'fixed',
        bottom: '24px',
        right: '24px',
        zIndex: 9999
      }}>
        {/* Minimized Chat Bubble */}
        {isMinimized && (
          <div 
            onClick={() => setIsMinimized(false)}
            style={{
              background: '#009688',
              color: 'white',
              borderRadius: '50px',
              padding: '12px 20px',
              cursor: 'pointer',
              boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              transition: 'all 0.3s ease',
              maxWidth: '200px'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = '#00796b';
              e.currentTarget.style.transform = 'translateY(-2px)';
              e.currentTarget.style.boxShadow = '0 6px 16px rgba(0, 0, 0, 0.2)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = '#009688';
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.boxShadow = '0 4px 12px rgba(0, 0, 0, 0.15)';
            }}
          >
            <div style={{ fontSize: '20px' }}>💬</div>
            <div style={{ 
              fontSize: '14px', 
              fontWeight: '500', 
              whiteSpace: 'nowrap' 
            }}>Chat with Winston</div>
          </div>
        )}
        
        {/* Full Chat Widget */}
        {!isMinimized && (
          <div style={{
            width: '400px',
            height: '600px',
            background: 'white',
            borderRadius: '12px',
            boxShadow: '0 8px 32px rgba(0, 0, 0, 0.15)',
            overflow: 'hidden',
            display: 'flex',
            flexDirection: 'column'
          }}>
            <div style={{
              background: '#009688',
              color: 'white',
              padding: '12px 16px',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              fontWeight: '500'
            }}>
              <span>Antigua MLS Concierge</span>
              <button 
                onClick={() => setIsMinimized(true)}
                style={{
                  background: 'none',
                  border: 'none',
                  color: 'white',
                  fontSize: '18px',
                  cursor: 'pointer',
                  padding: '4px 8px',
                  borderRadius: '4px',
                  transition: 'background 0.2s ease'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = 'rgba(255, 255, 255, 0.1)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = 'none';
                }}
              >
                ✕
              </button>
            </div>
            <div 
              id="chatkit-container"
              style={{ 
                flex: 1,
                display: 'flex',
                flexDirection: 'column'
              }}
            >
              {!isMinimized && (
                <openai-chatkit
                  key={`chatkit-${Date.now()}`}
                  workflow-id='wf_690815eedbb481909864c0dca642e7b10f6b30a319786ac2'
                  title='Antigua MLS Concierge'
                  theme-color='#009688'
                  welcome-message="Hi! I'm Winston — your Antigua MLS Property Concierge. Ask me how I can help you with Antigua real estate!"
                  style={{
                    width: '100%',
                    height: '100%',
                    border: 'none',
                    display: 'block'
                  }}
                ></openai-chatkit>
              )}
            </div>
          </div>
        )}
      </div>
    </>
  );
}