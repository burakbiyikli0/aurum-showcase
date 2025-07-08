import { Box } from "@mui/material";
import StarIcon from "@mui/icons-material/Star";
import StarHalfIcon from "@mui/icons-material/StarHalf";
import StarBorderIcon from "@mui/icons-material/StarBorder";

const StarRating = ({ rating }) => {
  const fullStars = Math.floor(rating);
  const halfStar = rating % 1 >= 0.5 ? 1 : 0;
  const emptyStars = 5 - fullStars - halfStar;

  return (
    <Box
      sx={{ display: "flex", alignItems: "center", color: "text.secondary" }}
    >
      {[...Array(fullStars)].map((_, i) => (
        <StarIcon
          key={`full-${i}`}
          sx={{ color: "#ffc107" }}
          fontSize="small"
        />
      ))}
      {halfStar === 1 && (
        <StarHalfIcon key="half" sx={{ color: "#ffc107" }} fontSize="small" />
      )}
      {[...Array(emptyStars)].map((_, i) => (
        <StarBorderIcon
          key={`empty-${i}`}
          sx={{ color: "#ffc107" }}
          fontSize="small"
        />
      ))}
    </Box>
  );
};

export default StarRating;
