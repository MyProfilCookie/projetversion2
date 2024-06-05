/* eslint-disable no-unused-vars */
import ReactDOM from "react-dom/client";
import "./assets/scss/index.scss";
import { RouterProvider } from "react-router-dom";
import router from "./router/Router.jsx";
import AuthProvider from "./contexts/AuthProvider.jsx";
import {
  useQuery,
  useMutation,
  useQueryClient,
  QueryClient,
  QueryClientProvider,
} from "@tanstack/react-query";
import { LikeRecetteProvider } from "./contexts/LikeRecetteProvider.jsx";
import { ThemeProvider } from "./hooks/ThemeContext.jsx";
import { CartProvider } from "./contexts/CartProvider.jsx";

const queryClient = new QueryClient();

ReactDOM.createRoot(document.getElementById("root")).render(
  <AuthProvider>
    <LikeRecetteProvider>
      <QueryClientProvider client={queryClient}>
        <ThemeProvider>
          <CartProvider>
            <RouterProvider router={router} />
          </CartProvider>
        </ThemeProvider>
      </QueryClientProvider>
    </LikeRecetteProvider>
  </AuthProvider>,
);
