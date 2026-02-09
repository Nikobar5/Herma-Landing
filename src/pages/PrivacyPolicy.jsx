import React from 'react';
import '../pages/Policy.css';

const PrivacyPolicy = () => {
  return (
    <div className="policy-container">
      <div className="container">
        <h1 className="policy-title">PRIVACY POLICY</h1>
        <div className="policy-content">
          <p>
            This Privacy Policy describes how Herma ("we," "us," or "our") handles information when you use our API proxy service and related website (the "Service"). By using the Service, you agree to the practices described below.
          </p>

          <h2>1. INFORMATION WE COLLECT</h2>

          <h3>Account Information</h3>
          <p>
            When you create an account, we collect your name, email address, password, and optionally your company name. Passwords are stored using industry-standard one-way hashing and are never stored in plaintext.
          </p>

          <h3>Usage Information</h3>
          <p>
            When you make API requests through the Service, we log metadata about each request, including the AI model used, token counts, cost, response time, and timestamp. This data is used for billing, service operation, and to provide you with usage analytics in your dashboard.
          </p>

          <h3>Payment Information</h3>
          <p>
            Payments are processed by Stripe. We do not store your credit card number or full payment details. We receive confirmation of successful payments and record transaction amounts in your account ledger.
          </p>

          <h3>Automatically Collected Information</h3>
          <p>
            We use Google Analytics to collect standard web analytics data such as pages visited, browser type, and general location. We also log IP addresses and request metadata for security and operational purposes.
          </p>

          <h2>2. HOW WE USE YOUR INFORMATION</h2>
          <p>We use the information we collect to:</p>
          <ul>
            <li>Operate, maintain, and provide the Service</li>
            <li>Process payments and maintain your credit balance</li>
            <li>Provide usage reporting and account management</li>
            <li>Monitor for abuse, fraud, and technical issues</li>
            <li>Improve the Service</li>
          </ul>

          <h2>3. API REQUEST CONTENT</h2>
          <p>
            When you send API requests through Herma, the content of those requests (such as messages in a chat completion) is forwarded to third-party AI model providers to generate responses. We do not store the content of your API requests or responses. Request content is transmitted in transit only and is not retained on our servers after the response is delivered.
          </p>

          <h2>4. THIRD-PARTY SERVICES</h2>
          <p>
            The Service relies on the following third-party providers to function:
          </p>
          <ul>
            <li><strong>AI Model Providers</strong> — Your API request content is forwarded to third-party AI providers to process and generate responses. These providers have their own privacy policies governing how they handle data.</li>
            <li><strong>Stripe</strong> — Processes payments. Subject to <a href="https://stripe.com/privacy" target="_blank" rel="noopener noreferrer">Stripe's Privacy Policy</a>.</li>
            <li><strong>Google Analytics</strong> — Collects website usage analytics. Subject to <a href="https://policies.google.com/privacy" target="_blank" rel="noopener noreferrer">Google's Privacy Policy</a>.</li>
          </ul>

          <h2>5. DATA RETENTION</h2>
          <p>
            Account information and usage logs are retained for as long as your account is active. If you wish to delete your account and associated data, contact us at the email below.
          </p>

          <h2>6. DATA SECURITY</h2>
          <p>
            We use commercially reasonable measures to protect your information, including encrypted connections (TLS), hashed passwords and API keys, and secure authentication. However, no method of transmission or storage is 100% secure.
          </p>

          <h2>7. YOUR RIGHTS</h2>
          <p>
            You may request access to, correction of, or deletion of your personal information by contacting us. If you are located in the EU/EEA, you may have additional rights under applicable data protection laws.
          </p>

          <h2>8. CHANGES TO THIS POLICY</h2>
          <p>
            We may update this Privacy Policy from time to time. Changes will be posted on this page with an updated date. Continued use of the Service after changes constitutes acceptance.
          </p>

          <div className="policy-contact">
            <p>
              For questions about this Privacy Policy, contact us at:
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

export default PrivacyPolicy;
