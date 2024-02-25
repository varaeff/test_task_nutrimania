import { render, screen } from "@testing-library/react";
import App from "./App";
import DateRow from "./Components/DateRow";
import Calendar from "./Components/Calendar";

test("renders dateRow component", () => {
  render(<App />);
  const dateRow = screen.getByTestId("dateRow");
  expect(dateRow).toBeInTheDocument();
});

test("renders nutritions component", () => {
  render(<App />);
  const nutritionsComponent = screen.getAllByText("hello world");
  expect(nutritionsComponent.length).toBeGreaterThan(1);
});

test("renders calendar component", () => {
  render(<App />);
  const calendarComponent = screen.getByText(/Календарь/i);
  expect(calendarComponent).toBeInTheDocument();
});

test("renders date in dateRow", () => {
  render(<DateRow activeDate={new Date()} />);
  const rightDate = new Date().getDate().toString();
  const currentDate = screen.getByText(`${rightDate}`, { exact: false });
  expect(currentDate).toBeInTheDocument();
});

test("no Right arrow in dateRow", () => {
  render(<DateRow activeDate={new Date()} />);
  const rightArrow = screen.getByTestId("rightArrow");
  expect(rightArrow).toHaveAttribute("disabled");
});

test("renders days row in calendar", () => {
  render(<Calendar calendarDate={new Date()} />);
  const daysRow = screen.getByText(/ср/i);
  expect(daysRow).toBeInTheDocument();
});

test("no Right arrow in calendar", () => {
  render(<Calendar calendarDate={new Date()} />);
  const rightArrow = screen.getByTestId("calendarRightArrow");
  expect(rightArrow).toHaveAttribute("disabled");
});
