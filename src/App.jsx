// src/App.jsx
import { useEffect } from "react";

export default function App() {
  useEffect(() => {
    const target = "https://portfolio-barath-szilvia.netlify.app/";
    // replace so the Back button doesn't bounce back to this page
    window.location.replace(target);
  }, []);

  return (
    <main style={{ height: "100vh", display: "grid", placeItems: "center" }}>
      <div>
        <p>Redirecting…</p>
        <a href="https://portfolio-barath-szilvia.netlify.app/">
          Click here if you are not redirected.
        </a>
      </div>
    </main>
  );
}
