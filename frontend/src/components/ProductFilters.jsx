import { Box, Typography, Slider, Paper } from "@mui/material";

const MAX_PRICE = 10000;

function valueText(value) {
  return `$${value}`;
}

const ProductFilters = ({
  priceRange,
  setPriceRange,
  popularity,
  setPopularity,
}) => {
  return (
    <Paper
      variant="outlined"
      sx={{ p: 3, mb: { xs: 4, md: 8 }, borderRadius: 2 }}
    >
      <Box
        sx={{
          display: "flex",
          flexDirection: { xs: "column", md: "row" },
          gap: 4,
        }}
      >
        <Box sx={{ flex: 1 }}>
          <Typography gutterBottom>Price Range</Typography>
          <Slider
            value={priceRange}
            onChange={(e, newValue) => setPriceRange(newValue)}
            valueLabelDisplay="auto"
            getAriaValueText={valueText}
            min={0}
            max={MAX_PRICE}
            step={100}
          />
        </Box>
        <Box sx={{ flex: 1 }}>
          <Typography gutterBottom>Minimum Popularity</Typography>
          <Slider
            value={popularity}
            onChange={(e, newValue) => setPopularity(newValue)}
            valueLabelDisplay="auto"
            getAriaValueText={(v) => `${v}/5`}
            min={0}
            max={5}
            step={0.5}
          />
        </Box>
      </Box>
    </Paper>
  );
};

export default ProductFilters;
