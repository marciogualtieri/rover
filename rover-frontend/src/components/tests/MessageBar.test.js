import { render, screen } from "@testing-library/react";
import MessageBar from "../MessageBar";

test("renders error message", () => {
  var expectedText = "Test Message";
  const { debug } = render(
    <MessageBar message={{ text: expectedText, isErrorMessage: true }} />
  );
  debug();

  const divElement = screen.getByText(expectedText);
  expect(divElement).toBeInTheDocument();
  expect(divElement).toHaveClass("alert");
  expect(divElement).toHaveClass("alert-danger");
});

test("renders success message", () => {
  var expectedText = "Test Message";
  const { debug } = render(
    <MessageBar message={{ text: expectedText, isErrorMessage: false }} />
  );
  debug();

  const divElement = screen.getByText(expectedText);
  expect(divElement).toBeInTheDocument();
  expect(divElement).toHaveClass("alert");
  expect(divElement).toHaveClass("alert-success");
});
