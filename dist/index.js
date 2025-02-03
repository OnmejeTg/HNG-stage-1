"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const app = (0, express_1.default)();
const PORT = 8000;
const API_URL = "http://numbersapi.com";
app.use((0, cors_1.default)());
const fetchRandomNumberFact = (number) => __awaiter(void 0, void 0, void 0, function* () {
    const response = yield fetch(`${API_URL}/${number}/math`);
    if (!response.ok) {
        throw new Error(`API request failed with status: ${response.status}`);
    }
    return response.text();
});
const isPrime = (num) => {
    if (num <= 1)
        return false; // 0 and 1 are not prime
    if (num <= 3)
        return true; // 2 and 3 are prime
    if (num % 2 === 0 || num % 3 === 0)
        return false; // Eliminate multiples of 2 and 3
    for (let i = 5; i * i <= num; i += 6) {
        if (num % i === 0 || num % (i + 2) === 0)
            return false;
    }
    return true;
};
const isPerfectSquare = (number) => {
    if (number < 0)
        return false; // Negative numbers are not perfect squares
    const sqrt = Math.sqrt(number);
    return sqrt === Math.floor(sqrt); // Check if sqrt is an integer
};
const calculateDigitSum = (number) => {
    let sum = 0;
    while (number > 0) {
        sum += number % 10;
        number = Math.floor(number / 10);
    }
    return sum;
};
const isArmstrong = (num) => {
    const digits = num.toString().split("").map(Number);
    const power = digits.length;
    const sum = digits.reduce((acc, digit) => acc + Math.pow(digit, power), 0);
    return sum === num;
};
const numProperties = (value) => {
    let properties = [];
    if (value % 2 === 0) {
        properties.push("Even");
    }
    else {
        properties.push("Odd");
    }
    if (isArmstrong(value)) {
        properties.push("Armstrong");
    }
    return properties;
};
// app.get("/api/classify-number", async (req: Request, res: Response) => {
//   try {
//     const number = parseInt(req.query.number as string, 10);
//     if (isNaN(number) || number <= 0) {
//       res.status(400).json({
//         number: "alphabet",
//         error: true,
//       });
//     }
//     const funFact = await fetchRandomNumberFact(number);
//     const result: ResponseData = {
//       number: number,
//       is_prime: isPrime(number),
//       is_perfect: isPerfectSquare(number),
//       properties: numProperties(number),
//       digit_sum: calculateDigitSum(number),
//       fun_fact: funFact,
//     };
//     res.status(200).json(result);
//   } catch (error) {
//     console.error("Error-26:", error);
//     res.status(500).json({
//       error: "Failed to fetch number fact",
//       details: error instanceof Error ? error.message : "Unknown error",
//     });
//   }
// });
app.get("/api/classify-number", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const numberParam = req.query.number;
        // Validation remains the same as before
        if (!numberParam) {
            res.status(400).json({
                error: "Missing number parameter",
                details: "Please provide a 'number' query parameter",
            });
            return;
        }
        if (!/^\+?\d+$/.test(numberParam)) {
            res.status(400).json({
                error: "Invalid number format",
                details: "Number must be a positive integer without decimal points or special characters",
            });
            return;
        }
        const number = parseInt(numberParam, 10);
        if (number <= 0) {
            res.status(400).json({
                error: "Invalid number value",
                details: "Number must be a positive integer greater than zero",
            });
            return;
        }
        // Processing
        const funFact = yield fetchRandomNumberFact(number);
        const result = {
            number: number,
            is_prime: isPrime(number),
            is_perfect: isPerfectSquare(number),
            properties: numProperties(number),
            digit_sum: calculateDigitSum(number),
            fun_fact: funFact,
        };
        res.status(200).json(result);
    }
    catch (error) {
        console.error("Error processing request:", error);
        res.status(500).json({
            error: "Internal server error",
            details: error instanceof Error ? error.message : "Unknown error",
        });
    }
}));
app.listen(PORT, () => {
    console.log(`🚀 Server is running on port ${PORT}`);
});
