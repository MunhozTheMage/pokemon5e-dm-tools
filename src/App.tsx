import { CssBaseline } from "@mui/material";
import { ThemeProvider } from "@mui/system";
import { QueryClient, QueryClientProvider } from "react-query";

import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import { AppHeaderLayout } from "./layouts/AppHeaderLayout";
import { MovesPage } from "./pages/Moves";

import { PokemonsPage, PokemonDetailsPage } from "./pages/Pokemons";

import { theme } from "./theme";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Navigate to="/pokemons" />} />

          <Route element={<AppHeaderLayout />}>
            <Route path="/pokemons" element={<PokemonsPage />}>
              <Route path=":pokemonId" element={<PokemonDetailsPage />} />
            </Route>

            <Route path="/moves" element={<MovesPage />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </ThemeProvider>
  </QueryClientProvider>
);

export default App;
