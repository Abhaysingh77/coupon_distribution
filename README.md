# Coupon Claim System

This is a simple coupon claim system where users can claim a coupon once per hour. The system tracks the claim time using cookies and prevents users from claiming again until the timer reaches zero.

## Features
- Users can claim a coupon with a unique code.
- A countdown timer prevents multiple claims within an hour.
- Uses cookies to persist claim time.
- Retrieves client IP and user agent for validation.
- Responsive UI with an improved design.

## Technologies Used
- React.js
- Axios (for API requests)
- js-cookie (for cookie management)
- Node.js & Express (for backend API)

## Installation

1. Clone the repository:
   ```sh
   git clone https://github.com/your-username/coupon-claim.git
   cd coupon-claim
   ```
2. Install dependencies:
   ```sh
   npm install
   ```
3. Start the frontend:
   ```sh
   npm start
   ```
4. Run the backend (assuming it's in a separate folder):
   ```sh
   cd backend
   npm install
   npm start
   ```

## API Endpoint
### Claim Coupon
```
POST /api/claim
```
#### Request Body
```json
{
  "clientId": "unique-client-id",
  "userAgent": "user-agent-string",
  "ip": "client-ip"
}
```
#### Response (Success)
```json
{
  "couponCode": "COUPON123"
}
```
#### Response (Failure)
```json
{
  "message": "You can only claim once per hour."
}
```

## Usage
1. Click on the "Claim Coupon" button.
2. If successful, a unique coupon code will be displayed.
3. If already claimed, a countdown timer will show when you can claim again.
4. After an hour, the button becomes active again.

## License
This project is licensed under the MIT License.

