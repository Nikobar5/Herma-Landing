import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useHermaAuth } from '../context/HermaAuthContext';
import { createCheckout, getBalance } from '../services/hermaApi';

const CREDIT_PACKAGES = [
  { id: '10', amount: '$10', credits: '$10.00', description: 'Starter' },
  { id: '25', amount: '$25', credits: '$25.00', description: 'Popular', popular: true },
  { id: '50', amount: '$50', credits: '$50.00', description: 'Professional' },
  { id: '100', amount: '$100', credits: '$100.00', description: 'Enterprise' },
];

const PurchasePage = () => {
  const { isAuthenticated } = useHermaAuth();
  const [balance, setBalance] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (isAuthenticated) {
      getBalance()
        .then((data) => setBalance(data.balance ?? data.balance_usd ?? 0))
        .catch(() => {});
    }
  }, [isAuthenticated]);

  const handlePurchase = async (packageId) => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const data = await createCheckout(packageId);
      window.location.href = data.checkout_url;
    } catch (err) {
      console.error('Checkout error:', err);
      setError(err.message || 'Failed to start checkout. Please try again.');
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white pt-32">
      {/* Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-0 right-0 w-1/2 h-1/2 bg-blue-600 opacity-5 rounded-bl-full transform -translate-y-1/4 translate-x-1/4"></div>
        <div className="absolute bottom-0 left-0 w-1/2 h-1/2 bg-indigo-500 opacity-5 rounded-tr-full transform translate-y-1/4 -translate-x-1/4"></div>
      </div>

      <div className="container mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 py-12 relative z-10">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-indigo-600">
            Add API Credits
          </h1>
          <p className="text-xl text-blue-700 mb-4">
            Pay as you go — no subscriptions, no commitments
          </p>
          {isAuthenticated && balance !== null && (
            <div className="inline-flex items-center gap-2 bg-white px-6 py-3 rounded-full shadow-md border border-blue-100">
              <span className="text-gray-600">Current Balance:</span>
              <span className="text-2xl font-bold text-blue-600">${Number(balance).toFixed(2)}</span>
            </div>
          )}
        </div>

        {error && (
          <div className="max-w-2xl mx-auto mb-8 p-4 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-red-700 text-sm text-center">{error}</p>
          </div>
        )}

        {/* Credit Packages */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          {CREDIT_PACKAGES.map((pkg) => (
            <div
              key={pkg.id}
              className={`relative bg-white rounded-2xl shadow-lg border p-8 flex flex-col items-center transition-all duration-300 hover:shadow-xl hover:-translate-y-1 ${
                pkg.popular ? 'border-blue-500 ring-2 ring-blue-500' : 'border-gray-200'
              }`}
            >
              {pkg.popular && (
                <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                  <span className="bg-amber-500 text-amber-900 px-4 py-1 rounded-full text-sm font-semibold">
                    Most Popular
                  </span>
                </div>
              )}
              <div className="text-sm font-medium text-gray-500 mb-2">{pkg.description}</div>
              <div className="text-4xl font-bold text-gray-900 mb-4">{pkg.amount}</div>
              <div className="text-sm text-gray-600 mb-6">in API credits</div>
              <button
                onClick={() => handlePurchase(pkg.id)}
                disabled={loading}
                className={`w-full px-6 py-3 font-semibold rounded-xl transition duration-300 disabled:opacity-50 disabled:cursor-not-allowed ${
                  pkg.popular
                    ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white hover:from-blue-700 hover:to-indigo-700 shadow-lg hover:shadow-xl'
                    : 'bg-white border-2 border-blue-600 text-blue-600 hover:bg-blue-50'
                }`}
              >
                {loading ? 'Processing...' : 'Buy Credits'}
              </button>
            </div>
          ))}
        </div>

        {/* Trust Indicators */}
        <div className="bg-white rounded-xl shadow-lg border border-gray-100 p-6 mb-12">
          <div className="grid md:grid-cols-3 gap-6 text-center">
            <div className="flex items-center justify-center gap-3">
              <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
              </div>
              <div>
                <div className="font-semibold text-gray-900">100% Private</div>
                <div className="text-sm text-gray-600">Data never leaves your device</div>
              </div>
            </div>
            <div className="flex items-center justify-center gap-3">
              <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
              </div>
              <div>
                <div className="font-semibold text-gray-900">Secure Payment</div>
                <div className="text-sm text-gray-600">Protected by Stripe</div>
              </div>
            </div>
            <div className="flex items-center justify-center gap-3">
              <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center">
                <svg className="w-5 h-5 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <div>
                <div className="font-semibold text-gray-900">Pay As You Go</div>
                <div className="text-sm text-gray-600">No subscriptions required</div>
              </div>
            </div>
          </div>
        </div>

        {/* Sign-in prompt for unauthenticated users */}
        {!isAuthenticated && (
          <div className="text-center">
            <div className="bg-white p-8 rounded-xl shadow-lg border border-blue-100 max-w-2xl mx-auto">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Sign in to purchase credits</h2>
              <p className="text-gray-600 mb-6">Create an account or sign in to get started</p>
              <button
                onClick={() => navigate('/login')}
                className="px-8 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-semibold rounded-lg shadow-lg hover:shadow-xl transform transition duration-300 hover:scale-105"
              >
                Sign In
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default PurchasePage;
