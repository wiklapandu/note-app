import "../styles/globals.css";
import { CookiesProvider } from "react-cookie";
import { useEffect, useState } from "react";

function MyApp({ Component, pageProps }) {
  const [showChild, setShowChild] = useState(false);

  useEffect(() => {
    setShowChild(true);
  }, [showChild]);

  if (!showChild) {
    return null;
  }
  return (
    <CookiesProvider>
      <Component {...pageProps} />
    </CookiesProvider>
  );
}

export default MyApp;
