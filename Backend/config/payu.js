// PayU Money Configuration
module.exports = {
  // Test credentials - Replace with production credentials
  MERCHANT_KEY: process.env.PAYU_MERCHANT_KEY || 'WpQBfa',
  MERCHANT_SALT: process.env.PAYU_MERCHANT_SALT || 'a6l6MCqPwMZCxSmx6rvrKWp11rJB2y7k',

  // PayU URLs
  PAYU_BASE_URL: process.env.PAYU_BASE_URL || 'https://test.payu.in', // Test environment
  // PAYU_BASE_URL: 'https://secure.payu.in', // Production environment

  // Response URLs - Update with your domain
  SUCCESS_URL: process.env.SUCCESS_URL || 'http://localhost:5000/api/payment/success',
  FAILURE_URL: process.env.FAILURE_URL || 'http://localhost:5000/api/payment/failure',
  CANCEL_URL: process.env.CANCEL_URL || 'http://localhost:5000/api/payment/cancel',
  NOTIFY_URL: process.env.NOTIFY_URL || 'http://localhost:5000/api/payment/webhook', // Webhook for status updates

  // Frontend URLs for redirection
  FRONTEND_SUCCESS_URL: process.env.FRONTEND_SUCCESS_URL || 'http://localhost:5173/payment-success',
  FRONTEND_FAILURE_URL: process.env.FRONTEND_FAILURE_URL || 'http://localhost:5173/payment-failure',
};

