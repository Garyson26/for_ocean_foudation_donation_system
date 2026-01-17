// PayU Money Configuration
module.exports = {
  // Test credentials - Replace with production credentials
  MERCHANT_KEY: process.env.PAYU_MERCHANT_KEY,
  MERCHANT_SALT: process.env.PAYU_MERCHANT_SALT,

  // PayU URLs
  PAYU_BASE_URL: process.env.PAYU_BASE_URL || 'https://test.payu.in', // Test environment
  // PAYU_BASE_URL: 'https://secure.payu.in', // Production environment

  // Response URLs - Update with your domain
  SUCCESS_URL: process.env.SUCCESS_URL,
  FAILURE_URL: process.env.FAILURE_URL,
  CANCEL_URL: process.env.CANCEL_URL,
  NOTIFY_URL: process.env.NOTIFY_URL, // Webhook for status updates

  // Frontend URLs for redirection
  FRONTEND_SUCCESS_URL: process.env.FRONTEND_SUCCESS_URL,
  FRONTEND_FAILURE_URL: process.env.FRONTEND_FAILURE_URL,
};

