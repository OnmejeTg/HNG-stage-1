import express, { Express, Request, Response } from "express";
import cors from "cors";
import { error } from "console";

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
  if (num <= 1) return false; // 0 and 1 are not prime
  if (num <= 3) return true; // 2 and 3 are prime

  if (num % 2 === 0 || num % 3 === 0) return false; // Eliminate multiples of 2 and 3

  for (let i = 5; i * i <= num; i += 6) {
    if (num % i === 0 || num % (i + 2) === 0) return false;
  }

  return true;
};

const isPerfectSquare = (number: number): boolean => {
  if (number < 0) return false; // Negative numbers are not perfect squares
  const sqrt = Math.sqrt(number);
  return sqrt === Math.floor(sqrt); // Check if sqrt is an integer
};

const calculateDigitSum = (number: number): number => {
  let sum = 0;
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
  if (value % 2 === 0) {
    properties.push("Even");
  } else {
    properties.push("Odd");
  }

  if (isArmstrong(value)) {
    properties.push("Armstrong");
  }
  return properties;
};

app.get("/api/classify-number", async (req: Request, res: Response) => {
  try {
    const number = parseInt(req.query.number as string, 10);
    if (isNaN(number) || number <= 0) {
      res.status(400).json({
        number: "alphabet",
        error: true,
      });
    }
    const funFact = await fetchRandomNumberFact(number);
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
    console.error("Error-26:", error);
    res.status(500).json({
      error: "Failed to fetch number fact",
      details: error instanceof Error ? error.message : "Unknown error",
    });
  }
});

app.listen(PORT, () => {
  console.log(`🚀 Server is running on port ${PORT}`);
});
