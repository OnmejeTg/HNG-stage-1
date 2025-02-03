# Express Number Classification API

## Overview

This is a simple Express-based API that classifies a given number based on different properties. It determines whether a number is prime, a perfect square, an Armstrong number, and more. Additionally, it fetches a fun fact about the number from an external API.

## Features

- Check if a number is prime.
- Determine if a number is a perfect square.
- Identify if a number is an Armstrong number.
- Compute the sum of the digits of the number.
- Fetch a fun fact about the number from the Numbers API.

## API Endpoint

### `GET /api/classify-number`

**Query Parameters:**

- `number` (required): The number to be classified.

**Response Format:**

```json
{
  "number": 371,
  "is_prime": false,
  "is_perfect": false,
  "properties": ["Odd", "Armstrong"],
  "digit_sum": 11,
  "fun_fact": "371 is an Armstrong number."
}
```

**Error Response:**
If an invalid number is passed, the API returns:

```json
{
  "number": "invalid",
  "error": true
}
```

## Installation & Setup

### Prerequisites

- Node.js installed
- npm or yarn

### Steps to Run

1. Clone the repository:
   ```sh
   git clone <https://github.com/OnmejeTg/HNG-stage-1.git>
   cd <HNG-stage-1>
   ```
2. Install dependencies:
   ```sh
   npm install
   ```
3. Start the server:
   ```sh
   npm run serve
   ```

The server will run on `http://localhost:8000` by default.

## Technologies Used

- Node.js
- Express.js
- TypeScript
- Numbers API (for number facts)

## License

This project is licensed under the MIT License.
