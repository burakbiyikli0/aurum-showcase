import { useState } from "react";
import { Typography, Box } from "@mui/material";
import StarRating from "./StarRating";

const colorMap = {
  yellow: { name: "Yellow Gold", hex: "#E6CA97" },
  white: { name: "White Gold", hex: "#D9D9D9" },
  rose: { name: "Rose Gold", hex: "#E1A4A9" },
};

const ProductCard = ({ product }) => {
  const [selectedColorKey, setSelectedColorKey] = useState("yellow");

  return (
    <Box sx={{ textAlign: "center" }}>
      <Box
        sx={{
          bgcolor: "#F7F7F7",
          aspectRatio: "1 / 1",
          mb: 2,
          p: 2,
          borderRadius: 2,
        }}
      >
        <img
          src={product.images[selectedColorKey]}
          alt={`${product.name} in ${colorMap[selectedColorKey].name}`}
          style={{ width: "100%", height: "100%", objectFit: "contain" }}
        />
      </Box>

      <Typography variant="h6" component="h3" gutterBottom>
        {product.name}
      </Typography>
      <Typography variant="body1" color="text.secondary" sx={{ mb: 1.5 }}>
        ${product.price.toFixed(2)} USD
      </Typography>

      <Box sx={{ display: "flex", justifyContent: "center", gap: 1, mb: 1 }}>
        {Object.keys(product.images).map((colorKey) => (
          <Box
            key={colorKey}
            onClick={() => setSelectedColorKey(colorKey)}
            sx={{
              width: 16,
              height: 16,
              borderRadius: "50%",
              bgcolor: colorMap[colorKey].hex,
              cursor: "pointer",
              border:
                selectedColorKey === colorKey
                  ? "2px solid"
                  : "2px solid transparent",
              borderColor: "primary.main",
              boxSizing: "border-box",
            }}
          />
        ))}
      </Box>

      <Typography
        variant="body2"
        sx={{ fontSize: "12px", color: "text.secondary", mb: 1.5 }}
      >
        {colorMap[selectedColorKey].name}
      </Typography>

      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          gap: 1,
        }}
      >
        <StarRating rating={product.rating} />
        <Typography variant="body2" sx={{ fontSize: "12px" }}>
          {product.rating}/5
        </Typography>
      </Box>
    </Box>
  );
};

export default ProductCard;
