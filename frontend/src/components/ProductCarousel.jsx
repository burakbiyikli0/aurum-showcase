import { useState, useEffect, useCallback } from "react";
import useEmblaCarousel from "embla-carousel-react";
import { Box, IconButton, useMediaQuery } from "@mui/material";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import ProductCard from "./ProductCard";
import CarouselProgressBar from "./CarouselProgressBar";
import theme from "../theme";

const ProductCarousel = ({ products }) => {
  const [emblaRef, emblaApi] = useEmblaCarousel({
    align: "start",
    containScroll: "trimSnaps",
    // THE KEY CHANGE: Disable the infinite loop
    loop: false,
  });
  const isDesktop = useMediaQuery(theme.breakpoints.up("md"));

  // State for the progress bar
  const [progress, setProgress] = useState(0);

  // --- NEW STATE & LOGIC FOR ARROW BUTTONS ---
  const [prevBtnDisabled, setPrevBtnDisabled] = useState(true);
  const [nextBtnDisabled, setNextBtnDisabled] = useState(true);

  const scrollPrev = useCallback(
    () => emblaApi && emblaApi.scrollPrev(),
    [emblaApi]
  );
  const scrollNext = useCallback(
    () => emblaApi && emblaApi.scrollNext(),
    [emblaApi]
  );

  const onSelect = useCallback(() => {
    if (!emblaApi) return;

    setPrevBtnDisabled(!emblaApi.canScrollPrev());
    setNextBtnDisabled(!emblaApi.canScrollNext());
  }, [emblaApi]);

  const onScroll = useCallback(() => {
    if (!emblaApi) return;
    setProgress(emblaApi.scrollProgress());
  }, [emblaApi]);

  useEffect(() => {
    if (!emblaApi) return;

    onScroll();
    onSelect();
    emblaApi.on("scroll", onScroll).on("reInit", onScroll);
    emblaApi.on("select", onSelect).on("reInit", onSelect);

    return () => {
      emblaApi.off("scroll", onScroll).off("reInit", onScroll);
      emblaApi.off("select", onSelect).off("reInit", onSelect);
    };
  }, [emblaApi, onScroll, onSelect]);

  return (
    <Box sx={{ position: "relative", maxWidth: "1200px", mx: "auto" }}>
      <Box sx={{ overflow: "hidden" }} ref={emblaRef}>
        <Box sx={{ display: "flex", ml: -2 }}>
          {products.map((product) => (
            <Box
              key={product.name}
              sx={{
                flex: {
                  xs: "0 0 90%",
                  sm: "0 0 50%",
                  md: "0 0 33.33%",
                  lg: "0 0 25%",
                },
                minWidth: 0,
                pl: 2,
              }}
            >
              <ProductCard product={product} />
            </Box>
          ))}
        </Box>
      </Box>

      <CarouselProgressBar progress={progress} />

      {isDesktop && (
        <>
          <IconButton
            onClick={scrollPrev}
            disabled={prevBtnDisabled}
            sx={{
              position: "absolute",
              top: "40%",
              left: { lg: -60, md: -40 },
              transform: "translateY(-50%)",
              bgcolor: "white",
              "&:hover": { bgcolor: "grey.200" },
              boxShadow: 1,
              zIndex: 1,
              borderRadius: "50%",
              transition: "opacity 0.2s",

              opacity: prevBtnDisabled ? 0.3 : 1,
            }}
          >
            <ChevronLeftIcon />
          </IconButton>
          <IconButton
            onClick={scrollNext}
            disabled={nextBtnDisabled}
            sx={{
              position: "absolute",
              top: "40%",
              right: { lg: -60, md: -40 },
              transform: "translateY(-50%)",
              bgcolor: "white",
              "&:hover": { bgcolor: "grey.200" },
              boxShadow: 1,
              zIndex: 1,
              borderRadius: "50%",
              transition: "opacity 0.2s",

              opacity: nextBtnDisabled ? 0.3 : 1,
            }}
          >
            <ChevronRightIcon />
          </IconButton>
        </>
      )}
    </Box>
  );
};

export default ProductCarousel;
