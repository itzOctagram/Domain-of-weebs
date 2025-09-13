import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import "./index.css";
import App from "./App";
// import { ClerkProvider } from '@clerk/clerk-react'
import { AnilistAuthProvider } from "./AnilistContext";

// const clerkKey = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY
// if (!clerkKey) {
//   throw new Error("Missing Publishable Key")
// }

if (import.meta.env.PROD) {
  console.log = () => {};
}

const root = ReactDOM.createRoot(
  document.getElementById("root") as HTMLElement
);
root.render(
  <AnilistAuthProvider storageKey="anilist_user">
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </AnilistAuthProvider>
);
