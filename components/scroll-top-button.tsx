"use client";

import KeyboardArrowUpRoundedIcon from "@mui/icons-material/KeyboardArrowUpRounded";
import { useEffect, useState } from "react";

const SHOW_AFTER_SCROLL_Y = 320;

export function ScrollTopButton() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const onScroll = () => {
      setIsVisible(window.scrollY > SHOW_AFTER_SCROLL_Y);
    };

    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const handleScrollTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth"
    });
  };

  return (
    <button
      type="button"
      className={`scroll-top-btn ${isVisible ? "show" : ""}`}
      onClick={handleScrollTop}
      aria-label="Scroll to top"
    >
      <KeyboardArrowUpRoundedIcon fontSize="inherit" />
    </button>
  );
}
