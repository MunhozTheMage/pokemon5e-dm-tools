import { Outlet } from "react-router-dom";
import { AppHeader } from "../components/AppHeader";

export const AppHeaderLayout = () => (
  <>
    <AppHeader />
    <Outlet />
  </>
);
