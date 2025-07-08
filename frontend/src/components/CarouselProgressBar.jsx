import React from "react";
import { Box } from "@mui/material";

const CarouselProgressBar = ({ progress }) => {
  const thumbPosition = `calc(${progress * 100}% - 8px)`;

  return (
    <Box
      sx={{
        height: "2px",
        bgcolor: "grey.300",
        mt: 6,
        mx: "auto",
        position: "relative",
      }}
    >
      <Box
        sx={{
          height: "100%",
          bgcolor: "primary.main",
          width: `${progress * 100}%`,

          transition: "width 0.2s ease-out",
        }}
      />

      <Box
        sx={{
          position: "absolute",
          top: "50%",
          left: thumbPosition,
          width: "16px",
          height: "16px",
          bgcolor: "white",
          border: "1px solid",
          borderColor: "grey.400",
          borderRadius: "50%",
          transform: "translateY(-50%)",
          transition: "left 0.2s ease-out",
        }}
      />
    </Box>
  );
};

export default CarouselProgressBar;
