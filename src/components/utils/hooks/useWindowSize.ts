import { useState, useEffect } from "react";

/*
 ** This hook is used to grab the current size of the users screen everytime it is updated
 ** Output: { width: number, height: number }
 */

export const mobileScreenMax = 480;
export const smScreenMax = 767;
export const mdScreenMax = 1024;
export const lgScreenMax = 1280;
export const xlScreenMin = 1440;

type ScreenSize = {
  min?: number;
  max?: number;
};

type ScreenSizes = {
  mobile: ScreenSize;
  sm: ScreenSize;
  md: ScreenSize;
  lg: ScreenSize;
  xl: ScreenSize;
};

export enum ScreenOptions {
  MOBILE,
  SM,
  MD,
  LG,
  XL,
}

export const screenSizes: ScreenSizes = {
  mobile: {
    max: 480,
  },
  sm: {
    min: 480,
    max: 767,
  },
  md: {
    min: 767,
    max: 1024,
  },
  lg: {
    min: 1024,
    max: 1280,
  },
  xl: {
    min: 1280,
  },
};

export default function useWindowSize() {
  const [windowSize, setWindowSize] = useState({
    width: 0,
    height: 0,
    screen: ScreenOptions.LG,
  });
  useEffect(() => {
    function handleResize() {
      const width = window.innerWidth;
      const height = window.innerHeight;
      let screen;
      if (width < screenSizes.mobile.max!) {
        screen = ScreenOptions.MOBILE;
      } else if (width < screenSizes.sm.max!) {
        screen = ScreenOptions.SM;
      } else if (width < screenSizes.md.max!) {
        screen = ScreenOptions.MD;
      } else if (width < screenSizes.lg.max!) {
        screen = ScreenOptions.LG;
      } else {
        screen = ScreenOptions.XL;
      }
      setWindowSize({ width, height, screen });
    }
    window.addEventListener("resize", handleResize);
    handleResize();
    return () => window.removeEventListener("resize", handleResize);
  }, []);
  return windowSize;
}
