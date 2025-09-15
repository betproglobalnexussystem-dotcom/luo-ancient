# Payment Integration Setup

This document explains how to set up the payment integration with Relworx Mobile Money and PayPal.

## Environment Variables

Create a `.env.local` file in your project root with the following variables:

```env
# Relworx Payment Configuration
RELWORX_API_KEY=your_relworx_api_key_here
RELWORX_ACCOUNT_NO=your_relworx_account_number_here

# PayPal Configuration
PAYPAL_CLIENT_ID=your_paypal_client_id_here
PAYPAL_CLIENT_SECRET=your_paypal_client_secret_here

# Application Configuration
NEXT_PUBLIC_BASE_URL=http://localhost:3000
NODE_ENV=development
```

## Relworx Setup

1. **Create a Relworx Account**
   - Visit [Relworx](https://relworx.com) and create a business account
   - Complete the verification process
   - Get your API key and account number from the dashboard

2. **Configure Mobile Money**
   - Ensure your account supports the currencies you want to accept (UGX, KES, TZS)
   - Test with small amounts first

## PayPal Setup

1. **Create a PayPal Developer Account**
   - Visit [PayPal Developer](https://developer.paypal.com)
   - Create a new application
   - Get your Client ID and Client Secret

2. **Configure Webhooks** (Optional but recommended)
   - Set up webhook endpoints for payment notifications
   - Use the URLs: `https://yourdomain.com/api/webhooks/paypal`

## Testing

### Relworx Testing
- Use test phone numbers provided by Relworx
- Test with small amounts (e.g., 100 UGX)
- Check the Relworx dashboard for transaction status

### PayPal Testing
- Use PayPal Sandbox for testing
- Create test accounts in PayPal Developer Console
- Test both successful and failed payment scenarios

## Production Deployment

1. **Update Environment Variables**
   - Use production API keys
   - Set `NODE_ENV=production`
   - Update `NEXT_PUBLIC_BASE_URL` to your production domain

2. **Security Considerations**
   - Never commit API keys to version control
   - Use environment variables for all sensitive data
   - Enable HTTPS in production
   - Implement proper error handling and logging

## API Endpoints

### Relworx Mobile Money
- **POST** `/api/payments/relworx` - Request payment
- **GET** `/api/payments/status?reference=xxx&type=relworx` - Check payment status

### PayPal
- **POST** `/api/payments/paypal` - Create PayPal order
- **PUT** `/api/payments/paypal` - Capture PayPal payment
- **GET** `/api/payments/status?reference=xxx&type=paypal` - Check payment status

## Payment Flow

1. User selects a subscription plan
2. Payment method selection (Mobile Money or PayPal)
3. Payment request sent to respective API
4. User completes payment on their device/browser
5. Payment status is polled and verified
6. User is redirected to success page
7. Subscription is activated

## Error Handling

The system includes comprehensive error handling for:
- Invalid phone numbers
- Insufficient funds
- Network errors
- API rate limiting
- Invalid currencies
- Payment timeouts

## Support

For issues with:
- **Relworx**: Contact Relworx support
- **PayPal**: Check PayPal Developer documentation
- **Integration**: Check the application logs and error messages







