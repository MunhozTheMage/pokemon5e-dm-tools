import { createBrowserRouter } from "react-router-dom";
import { Landing } from "./pages/Landing";

export const routes = createBrowserRouter(
  [
    {
      path: "/",
      element: <Landing />,
    },
  ],
  {
    basename: "/pokemon5e-dm-tools",
  }
);