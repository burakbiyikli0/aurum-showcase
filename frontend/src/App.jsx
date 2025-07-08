import { useState, useEffect } from "react";
import { useDebounce } from "use-debounce";
import {
  ThemeProvider,
  CssBaseline,
  Container,
  Typography,
  Box,
  Alert,
  CircularProgress,
} from "@mui/material";
import theme from "./theme";
import ProductCarousel from "./components/ProductCarousel";
import ProductFilters from "./components/ProductFilters";

function App() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [priceRange, setPriceRange] = useState([0, 10000]);
  const [popularity, setPopularity] = useState(0);

  const [debouncedPriceRange] = useDebounce(priceRange, 500);
  const [debouncedPopularity] = useDebounce(popularity, 500);

  useEffect(() => {
    async function fetchProducts() {
      setLoading(true);
      setError(null);
      try {
        const params = new URLSearchParams({
          minPrice: debouncedPriceRange[0],
          maxPrice: debouncedPriceRange[1],
          minPopularity: debouncedPopularity,
        });

        const baseUrl = import.meta.env.PROD
          ? window.location.origin
          : "http://localhost:4000";

        const apiUrl = `${baseUrl}/api/products?${params.toString()}`;

        const response = await fetch(apiUrl);
        if (!response.ok) {
          throw new Error(
            `The server responded with an error: ${response.status}`
          );
        }
        const data = await response.json();
        setProducts(data);
      } catch (e) {
        setError(e.message);
        console.error("Failed to fetch products:", e);
      } finally {
        setLoading(false);
      }
    }
    fetchProducts();
  }, [debouncedPriceRange, debouncedPopularity]);

  const renderContent = () => {
    if (loading) {
      return (
        <Box sx={{ display: "flex", justifyContent: "center", my: 10 }}>
          <CircularProgress />
        </Box>
      );
    }

    if (error) {
      return (
        <Alert severity="error" sx={{ my: 5 }}>
          Failed to load products. Error: {error}
        </Alert>
      );
    }

    if (products.length > 0) {
      return <ProductCarousel products={products} />;
    }

    return (
      <Typography align="center" sx={{ my: 10, color: "text.secondary" }}>
        No products match the selected filters.
      </Typography>
    );
  };

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />

      <Box sx={{ bgcolor: "grey.50", minHeight: "100vh" }}>
        <Container maxWidth="lg" sx={{ py: { xs: 4, md: 6 } }}>
          <Typography
            variant="h1"
            align="center"
            sx={{
              mb: { xs: 4, md: 6 },
              fontWeight: 300,
            }}
          >
            Aurum Showcase
          </Typography>

          <ProductFilters
            priceRange={priceRange}
            setPriceRange={setPriceRange}
            popularity={popularity}
            setPopularity={setPopularity}
          />

          <main>{renderContent()}</main>
        </Container>
      </Box>
    </ThemeProvider>
  );
}

export default App;
