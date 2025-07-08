const express = require("express");
const cors = require("cors");
const axios = require("axios");
const fs = require("fs");
const path = require("path");

const app = express();
const PORT = process.env.PORT || 4000;

app.use(
  cors({
    origin:
      process.env.NODE_ENV === "production"
        ? [process.env.FRONTEND_URL, "https://aurum-showcase.netlify.app"]
        : ["http://localhost:5173", "http://localhost:3000"],
    credentials: true,
  })
);

if (process.env.NODE_ENV === "production") {
  app.use(express.static(path.join(__dirname, "../frontend/dist")));
}

const API_KEY = process.env.METAL_API_KEY || "ecefa0f880c0c94dd28bc94da727246b";
const BASE_URL = "https://api.metalpriceapi.com/v1/latest";
const OUNCES_IN_GRAM = 31.1035;

let goldPriceCache = {
  pricePerGram: null,
  timestamp: null,
};
const CACHE_DURATION_MS = 5 * 60 * 1000;

async function getLiveGoldPrice() {
  const now = Date.now();
  if (
    goldPriceCache.pricePerGram &&
    now - goldPriceCache.timestamp < CACHE_DURATION_MS
  ) {
    console.log("Returning cached gold price.");
    return goldPriceCache.pricePerGram;
  }

  try {
    console.log("Fetching live gold price...");

    const url = `${BASE_URL}?api_key=${API_KEY}&currencies=XAU`;
    const response = await axios.get(url);

    if (!response.data.success) {
      throw new Error(
        `API request failed: ${JSON.stringify(response.data.error)}`
      );
    }

    const rate = response.data.rates?.XAU;
    if (!rate || typeof rate !== "number") {
      throw new Error(`Invalid XAU rate received: ${rate}`);
    }

    const pricePerOunce = 1 / rate;
    const pricePerGram = pricePerOunce / OUNCES_IN_GRAM;

    goldPriceCache = { pricePerGram: pricePerGram, timestamp: now };

    console.log(
      `Live gold price fetched successfully: ${pricePerGram.toFixed(2)}/gram`
    );

    return pricePerGram;
  } catch (error) {
    console.error("Failed to fetch live gold price:", error.message);

    const fallbackPrice = 75.0;
    console.log(`Using fallback gold price: ${fallbackPrice}/gram`);
    return fallbackPrice;
  }
}

app.get("/api/products", async (req, res) => {
  try {
    const goldPrice = await getLiveGoldPrice();
    const productsFilePath = path.join(__dirname, "products.json");
    const productsData = JSON.parse(fs.readFileSync(productsFilePath, "utf8"));

    let productsWithPrice = productsData.map((product) => {
      const calculatedPrice =
        (product.popularityScore + 1) * product.weight * goldPrice;
      const ratingOutOfFive = (product.popularityScore * 5).toFixed(1);

      return {
        ...product,
        price: calculatedPrice,
        rating: parseFloat(ratingOutOfFive),
      };
    });

    const { minPrice, maxPrice, minPopularity } = req.query;

    if (minPrice !== undefined) {
      productsWithPrice = productsWithPrice.filter(
        (p) => p.price >= parseFloat(minPrice)
      );
    }
    if (maxPrice !== undefined) {
      productsWithPrice = productsWithPrice.filter(
        (p) => p.price <= parseFloat(maxPrice)
      );
    }
    if (minPopularity !== undefined) {
      const minPopularityScore = parseFloat(minPopularity) / 5;
      productsWithPrice = productsWithPrice.filter(
        (p) => p.popularityScore >= minPopularityScore
      );
    }

    res.json(productsWithPrice);
  } catch (error) {
    console.error("Error in /api/products:", error);
    res.status(500).json({
      error: "Failed to process product data.",
      details: error.message,
    });
  }
});

app.get("/api/health", (req, res) => {
  res.json({ status: "OK", timestamp: new Date().toISOString() });
});

if (process.env.NODE_ENV === "production") {
  app.get("*", (req, res) => {
    res.sendFile(path.join(__dirname, "../frontend/dist/index.html"));
  });
}

app.listen(PORT, () => {
  console.log(
    `Backend server is running and listening on http://localhost:${PORT}`
  );
  console.log(`Environment: ${process.env.NODE_ENV || "development"}`);
});
