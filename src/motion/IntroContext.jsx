import { createContext, useContext } from "react";

/** `true` once the page-load curtain has lifted. Hero entrance + video start wait for it. */
export const IntroContext = createContext(true);
export const useIntroReady = () => useContext(IntroContext);
