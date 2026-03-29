import { render, screen } from "@testing-library/react";
import { BrowserRouter } from "react-router-dom";
import App from "./App";
import { AuthProvider } from "./auth/AuthContext";

test("renders products page", () => {
  render(
    <BrowserRouter>
      <AuthProvider>
        <App />
      </AuthProvider>
    </BrowserRouter>,
  );
  const heading = screen.getByRole("heading", { name: /products/i });
  expect(heading).toBeInTheDocument();
});
