import React from 'react';
import '../pages/Policy.css';

const TermsOfService = () => {
  return (
    <div className="policy-container">
      <div className="container">
        <h1 className="policy-title">TERMS OF SERVICE</h1>
        <div className="policy-content">
          <div className="policy-notice">
            <p>
              By creating an account or using the Herma API service ("the Service"), you agree to be bound by these Terms. If you do not agree, do not use the Service.
            </p>
          </div>

          <h2>1. SERVICE DESCRIPTION</h2>
          <p>
            Herma provides an API proxy service that routes requests to third-party AI model providers on your behalf. You access the Service via API keys issued through your account. The Service includes usage tracking, billing, and a web dashboard.
          </p>

          <h2>2. ACCOUNTS</h2>
          <p>
            You must provide accurate information when creating an account. You are responsible for maintaining the security of your account credentials and API keys. You are responsible for all activity that occurs under your account. Notify us immediately if you suspect unauthorized use.
          </p>

          <h2>3. BILLING AND CREDITS</h2>
          <p>
            The Service operates on a prepaid credit model. You purchase credits via Stripe, and usage is deducted from your balance based on the tokens consumed per request. Credit purchases are non-refundable except where required by law. We reserve the right to change pricing at any time; changes will apply to future purchases only.
          </p>

          <h2>4. ACCEPTABLE USE</h2>
          <p>You agree not to:</p>
          <ul>
            <li>Use the Service for any unlawful purpose or to violate any applicable laws</li>
            <li>Attempt to gain unauthorized access to the Service or its systems</li>
            <li>Reverse engineer, decompile, or attempt to extract the source code of the Service</li>
            <li>Resell or redistribute access to the Service without authorization</li>
            <li>Send content that violates the acceptable use policies of underlying AI model providers</li>
            <li>Interfere with or disrupt the integrity or performance of the Service</li>
          </ul>
          <p>
            We may suspend or terminate your account if we reasonably believe you have violated these terms.
          </p>

          <h2>5. CONTENT AND AI OUTPUT</h2>
          <p>
            You retain ownership of the content you submit through the Service. We do not claim ownership over your inputs or the AI-generated outputs. You are solely responsible for how you use AI-generated content, including ensuring it is accurate and appropriate for your use case. AI outputs may be inaccurate or incomplete.
          </p>

          <h2>6. THIRD-PARTY PROVIDERS</h2>
          <p>
            The Service relies on third-party AI model providers to process your requests. These providers may have their own terms of service and acceptable use policies. We do not guarantee the availability, accuracy, or performance of any third-party model.
          </p>

          <h2>7. INTELLECTUAL PROPERTY</h2>
          <p>
            The Service, including its software, design, and documentation, is owned by Herma and protected by applicable intellectual property laws. These Terms do not grant you any rights to our trademarks, logos, or other proprietary assets.
          </p>

          <h2>8. DISCLAIMER OF WARRANTIES</h2>
          <p className="caps-notice">
            THE SERVICE IS PROVIDED "AS IS" AND "AS AVAILABLE" WITHOUT WARRANTIES OF ANY KIND, EXPRESS OR IMPLIED. WE DISCLAIM ALL WARRANTIES, INCLUDING WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE, AND NON-INFRINGEMENT. WE DO NOT WARRANT THAT THE SERVICE WILL BE UNINTERRUPTED, ERROR-FREE, OR SECURE, OR THAT AI-GENERATED OUTPUTS WILL BE ACCURATE OR SUITABLE FOR ANY PURPOSE.
          </p>

          <h2>9. LIMITATION OF LIABILITY</h2>
          <p className="caps-notice">
            TO THE MAXIMUM EXTENT PERMITTED BY LAW, HERMA SHALL NOT BE LIABLE FOR ANY INDIRECT, INCIDENTAL, SPECIAL, CONSEQUENTIAL, OR PUNITIVE DAMAGES, OR ANY LOSS OF PROFITS, DATA, OR GOODWILL, ARISING OUT OF OR RELATED TO YOUR USE OF THE SERVICE. OUR TOTAL LIABILITY SHALL NOT EXCEED THE AMOUNT YOU HAVE PAID US IN THE 12 MONTHS PRECEDING THE CLAIM.
          </p>

          <h2>10. INDEMNIFICATION</h2>
          <p>
            You agree to indemnify and hold harmless Herma and its officers, directors, employees, and agents from any claims, damages, or expenses arising from your use of the Service, your content, or your violation of these Terms.
          </p>

          <h2>11. TERMINATION</h2>
          <p>
            Either party may terminate this agreement at any time. We may suspend or terminate your access immediately if you breach these Terms. Upon termination, your right to use the Service ceases and any remaining credit balance may be forfeited.
          </p>

          <h2>12. GOVERNING LAW</h2>
          <p>
            These Terms are governed by the laws of the United States. Any disputes will be resolved in the courts of the United States. If you reside in the EU/EEA, the governing law and forum shall be those of your usual place of residence.
          </p>

          <h2>13. CHANGES TO TERMS</h2>
          <p>
            We may modify these Terms at any time. Material changes will be posted on this page. Continued use of the Service after changes constitutes acceptance of the updated Terms.
          </p>

          <div className="policy-contact">
            <p>
              If you have any questions about these Terms, contact us at:
            </p>
            <p>
              <a href="mailto:hermalocal@gmail.com">hermalocal@gmail.com</a>
            </p>
          </div>

          <p className="policy-updated">
            Last updated: February 9, 2026
          </p>
        </div>
      </div>
    </div>
  );
};

export default TermsOfService;
