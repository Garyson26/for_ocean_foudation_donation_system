import React from "react";
import { useNavigate, useSearchParams } from "react-router-dom";

function PaymentFailure() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const txnid = searchParams.get('txnid');
  const error = searchParams.get('error');
  const status = searchParams.get('status');

  const handleRetry = () => {
    navigate("/donate");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 to-pink-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-2xl mx-auto">
        {/* Failure Card */}
        <div className="bg-white rounded-2xl shadow-2xl overflow-hidden">
          {/* Header */}
          <div className="bg-gradient-to-r from-red-600 to-pink-600 p-8 text-center">
            <div className="flex justify-center mb-4">
              <div className="bg-white rounded-full p-4">
                <svg className="w-16 h-16 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
            </div>
            <h1 className="text-3xl font-bold text-white mb-2">
              {status === 'cancelled' ? 'Payment Cancelled' : 'Payment Failed'}
            </h1>
            <p className="text-red-100 text-lg">
              {status === 'cancelled'
                ? 'You cancelled the payment process'
                : 'We couldn\'t process your payment'}
            </p>
          </div>

          {/* Details */}
          <div className="p-8">
            {/* Error Message */}
            <div className="bg-red-50 border-l-4 border-red-500 p-4 mb-6">
              <div className="flex">
                <svg className="w-5 h-5 text-red-500 mr-3 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
                <div>
                  <p className="text-red-800 font-medium">
                    {error || status === 'cancelled'
                      ? 'Transaction was cancelled'
                      : 'Payment could not be completed'}
                  </p>
                  {error && error !== 'undefined' && (
                    <p className="text-red-700 text-sm mt-1">
                      Reason: {error}
                    </p>
                  )}
                </div>
              </div>
            </div>

            {txnid && (
              <div className="mb-6">
                <div className="flex justify-between items-center py-3 border-b border-gray-200">
                  <span className="text-gray-600 font-medium">Transaction ID</span>
                  <span className="text-gray-900 font-mono text-sm">{txnid}</span>
                </div>
              </div>
            )}

            {/* Reasons */}
            <div className="mb-6">
              <h3 className="font-semibold text-gray-800 mb-3">Common reasons for payment failure:</h3>
              <ul className="space-y-2">
                <li className="flex items-start gap-2 text-sm text-gray-600">
                  <span className="text-red-500 mt-1">•</span>
                  <span>Insufficient balance in your account</span>
                </li>
                <li className="flex items-start gap-2 text-sm text-gray-600">
                  <span className="text-red-500 mt-1">•</span>
                  <span>Incorrect card details or OTP</span>
                </li>
                <li className="flex items-start gap-2 text-sm text-gray-600">
                  <span className="text-red-500 mt-1">•</span>
                  <span>Bank server timeout or network issues</span>
                </li>
                <li className="flex items-start gap-2 text-sm text-gray-600">
                  <span className="text-red-500 mt-1">•</span>
                  <span>Transaction limit exceeded</span>
                </li>
              </ul>
            </div>

            {/* Actions */}
            <div className="flex gap-4">
              <button
                onClick={handleRetry}
                className="flex-1 bg-gradient-to-r from-red-600 to-pink-600 hover:from-red-700 hover:to-pink-700 text-white font-bold py-3 px-6 rounded-lg transition-all duration-200 transform hover:scale-105"
              >
                Try Again
              </button>
              <button
                onClick={() => navigate("/categories")}
                className="flex-1 bg-gray-200 hover:bg-gray-300 text-gray-700 font-bold py-3 px-6 rounded-lg transition-colors"
              >
                Back to Categories
              </button>
            </div>
          </div>
        </div>

        {/* Additional Info */}
        <div className="mt-6 text-center text-gray-600">
          <p className="text-sm">
            Need assistance? Contact us at <a href="mailto:support@donation.com" className="text-red-600 hover:text-red-700 font-semibold">support@donation.com</a>
          </p>
        </div>
      </div>
    </div>
  );
}

export default PaymentFailure;

