import { render, screen } from "@testing-library/react";
import App from "./App";

test("renders homepage", () => {
  render(<App />);
  const linkElement = screen.getByText(/Welcome to Rover.com/i);
  expect(linkElement).toBeInTheDocument();
});
