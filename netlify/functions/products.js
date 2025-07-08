const axios = require("axios");

const API_KEY = process.env.METAL_API_KEY || "ecefa0f880c0c94dd28bc94da727246b";
const BASE_URL = "https://api.metalpriceapi.com/v1/latest";
const OUNCES_IN_GRAM = 31.1035;

let goldPriceCache = {
  pricePerGram: null,
  timestamp: null,
};
const CACHE_DURATION_MS = 5 * 60 * 1000;

const PRODUCTS_DATA = [
  {
    name: "Engagement Ring 1",
    popularityScore: 0.85,
    weight: 2.1,
    images: {
      yellow:
        "https://cdn.shopify.com/s/files/1/0484/1429/4167/files/EG085-100P-Y.jpg?v=1696588368",
      rose: "https://cdn.shopify.com/s/files/1/0484/1429/4167/files/EG085-100P-R.jpg?v=1696588406",
      white:
        "https://cdn.shopify.com/s/files/1/0484/1429/4167/files/EG085-100P-W.jpg?v=1696588402",
    },
  },
  {
    name: "Engagement Ring 2",
    popularityScore: 0.51,
    weight: 3.4,
    images: {
      yellow:
        "https://cdn.shopify.com/s/files/1/0484/1429/4167/files/EG012-Y.jpg?v=1707727068",
      rose: "https://cdn.shopify.com/s/files/1/0484/1429/4167/files/EG012-R.jpg?v=1707727068",
      white:
        "https://cdn.shopify.com/s/files/1/0484/1429/4167/files/EG012-W.jpg?v=1707727068",
    },
  },
  {
    name: "Engagement Ring 3",
    popularityScore: 0.92,
    weight: 3.8,
    images: {
      yellow:
        "https://cdn.shopify.com/s/files/1/0484/1429/4167/files/EG020-100P-Y.jpg?v=1683534032",
      rose: "https://cdn.shopify.com/s/files/1/0484/1429/4167/files/EG020-100P-R.jpg?v=1683534032",
      white:
        "https://cdn.shopify.com/s/files/1/0484/1429/4167/files/EG020-100P-W.jpg?v=1683534032",
    },
  },
  {
    name: "Engagement Ring 4",
    popularityScore: 0.88,
    weight: 4.5,
    images: {
      yellow:
        "https://cdn.shopify.com/s/files/1/0484/1429/4167/files/EG022-100P-Y.jpg?v=1683532153",
      rose: "https://cdn.shopify.com/s/files/1/0484/1429/4167/files/EG022-100P-R.jpg?v=1683532153",
      white:
        "https://cdn.shopify.com/s/files/1/0484/1429/4167/files/EG022-100P-W.jpg?v=1683532153",
    },
  },
  {
    name: "Engagement Ring 5",
    popularityScore: 0.8,
    weight: 2.5,
    images: {
      yellow:
        "https://cdn.shopify.com/s/files/1/0484/1429/4167/files/EG074-100P-Y.jpg?v=1696232035",
      rose: "https://cdn.shopify.com/s/files/1/0484/1429/4167/files/EG074-100P-R.jpg?v=1696927124",
      white:
        "https://cdn.shopify.com/s/files/1/0484/1429/4167/files/EG074-100P-W.jpg?v=1696927124",
    },
  },
  {
    name: "Engagement Ring 6",
    popularityScore: 0.82,
    weight: 1.8,
    images: {
      yellow:
        "https://cdn.shopify.com/s/files/1/0484/1429/4167/files/EG075-100P-Y.jpg?v=1696591786",
      rose: "https://cdn.shopify.com/s/files/1/0484/1429/4167/files/EG075-100P-R.jpg?v=1696591802",
      white:
        "https://cdn.shopify.com/s/files/1/0484/1429/4167/files/EG075-100P-W.jpg?v=1696591798",
    },
  },
  {
    name: "Engagement Ring 7",
    popularityScore: 0.7,
    weight: 5.2,
    images: {
      yellow:
        "https://cdn.shopify.com/s/files/1/0484/1429/4167/files/EG094-100P-Y.jpg?v=1696589183",
      rose: "https://cdn.shopify.com/s/files/1/0484/1429/4167/files/EG094-100P-R.jpg?v=1696589214",
      white:
        "https://cdn.shopify.com/s/files/1/0484/1429/4167/files/EG094-100P-W.jpg?v=1696589210",
    },
  },
  {
    name: "Engagement Ring 8",
    popularityScore: 0.9,
    weight: 3.7,
    images: {
      yellow:
        "https://cdn.shopify.com/s/files/1/0484/1429/4167/files/EG115-100P-Y.jpg?v=1696596076",
      rose: "https://cdn.shopify.com/s/files/1/0484/1429/4167/files/EG115-100P-R.jpg?v=1696596151",
      white:
        "https://cdn.shopify.com/s/files/1/0484/1429/4167/files/EG115-100P-W.jpg?v=1696596147",
    },
  },
];

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

exports.handler = async (event, context) => {
  const headers = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Headers": "Content-Type",
    "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
  };

  if (event.httpMethod === "OPTIONS") {
    return {
      statusCode: 200,
      headers,
      body: "",
    };
  }

  if (event.httpMethod !== "GET") {
    return {
      statusCode: 405,
      headers,
      body: JSON.stringify({ error: "Method not allowed" }),
    };
  }

  try {
    const goldPrice = await getLiveGoldPrice();

    let productsWithPrice = PRODUCTS_DATA.map((product) => {
      const calculatedPrice =
        (product.popularityScore + 1) * product.weight * goldPrice;
      const ratingOutOfFive = (product.popularityScore * 5).toFixed(1);

      return {
        ...product,
        price: calculatedPrice,
        rating: parseFloat(ratingOutOfFive),
      };
    });

    const queryParams = event.queryStringParameters || {};
    const { minPrice, maxPrice, minPopularity } = queryParams;

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

    return {
      statusCode: 200,
      headers,
      body: JSON.stringify(productsWithPrice),
    };
  } catch (error) {
    console.error("Error in products function:", error);
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({
        error: "Failed to process product data.",
        details: error.message,
      }),
    };
  }
};
