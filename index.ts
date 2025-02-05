import express, { Express, Request, Response } from "express";
import cors from "cors";

const app: Express = express();
const PORT = 8000;
const API_URL = "http://numbersapi.com";

app.use(cors());

interface ResponseData {
  number: number;
  is_prime: boolean;
  is_perfect: boolean;
  properties: string[];
  digit_sum: number;
  fun_fact: string;
}

const fetchRandomNumberFact = async (number: number) => {
  const response = await fetch(`${API_URL}/${number}/math`);
  if (!response.ok) {
    throw new Error(`API request failed with status: ${response.status}`);
  }
  return response.text();
};

const isPrime = (num: number): boolean => {
  if (num <= 1) return false;
  if (num <= 3) return true;
  if (num % 2 === 0 || num % 3 === 0) return false;
  for (let i = 5; i * i <= num; i += 6) {
    if (num % i === 0 || num % (i + 2) === 0) return false;
  }
  return true;
};

const isPerfectSquare = (num: number): boolean => {
  if (num <= 1) return false;
  let sum = 1; // 1 is a proper divisor for all numbers >1
  for (let i = 2; i <= Math.sqrt(num); i++) {
    if (num % i === 0) {
      sum += i;
      const otherDivisor = num / i;
      if (otherDivisor !== i) sum += otherDivisor;
    }
  }
  return sum === num;
};

const calculateDigitSum = (number: number): number => {
  let sum = 0;
  number = Math.abs(number);
  while (number > 0) {
    sum += number % 10;
    number = Math.floor(number / 10);
  }
  return sum;
};

const isArmstrong = (num: number): boolean => {
  const digits = num.toString().split("").map(Number);
  const power = digits.length;
  const sum = digits.reduce((acc, digit) => acc + Math.pow(digit, power), 0);
  return sum === num;
};

const numProperties = (value: number): string[] => {
  let properties: string[] = [];
  if (isArmstrong(value)) properties.push("armstrong");
  properties.push(value % 2 === 0 ? "even" : "odd");
  return properties;
};

app.get(
  "/api/classify-number",
  async (req: express.Request, res: express.Response) => {
    try {
      const numberParam = req.query.number as string;

      if (!numberParam) {
        res.status(400).json({
          error: "Missing number parameter",
          details: "Please provide a 'number' query parameter",
        });
        return;
      }

      // Ensure the numberParam consists only of digits and an optional leading + or -
      if (!/^-?\d+$/.test(numberParam)) {
        res.status(400).json({
          number: numberParam,
          error: true,
        });
        return;
      }

      // Convert to integer and validate
      const number = Number(numberParam);
      if (isNaN(number)) {
        res.status(400).json({
          number: numberParam,
          error: true,
        });
        return;
      }

      // Fetch fun fact
      const funFact = await fetchRandomNumberFact(number);

      // Construct response
      const result: ResponseData = {
        number: number,
        is_prime: isPrime(number),
        is_perfect: isPerfectSquare(number),
        properties: numProperties(number),
        digit_sum: calculateDigitSum(number),
        fun_fact: funFact,
      };

      res.status(200).json(result);
    } catch (error) {
      console.error("Error processing request:", error);
      res.status(500).json({
        error: "Internal server error",
        details: error instanceof Error ? error.message : "Unknown error",
      });
    }
  }
);

app.listen(PORT, () => {
  console.log(`🚀 Server is running on port ${PORT}`);
});
