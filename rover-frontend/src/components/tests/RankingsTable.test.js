import { render, screen } from "@testing-library/react";
import { renderToString } from "react-dom/server";
import RankingsTable from "../RankingsTable";

function getRowValues() {
  var rows = screen.getAllByRole("row");
  var values = rows.map(row => {
    var cells = row.querySelectorAll("td,th");
    return [...cells].map(cell => cell.innerHTML);
  });
  return values;
}

test("renders error message", () => {
  var expectedText = "Test Message";
  var data = [
    {
      sitter: {
        id: 1,
        email: "moe@pantherbrewing.com",
        name: "Moe Howard",
        phone: "+11633847457",
        image: "https://imagescom/moe.jpg"
      },
      ratings: 5.0,
      overall: 5.0
    },
    {
      sitter: {
        id: 2,
        email: "larry@pantherbrewing.com",
        name: "Larry Fine",
        phone: "+14983477354",
        image: "https://imagescom/larry.jpg"
      },
      ratings: 4.0,
      overall: 4.0
    },
    {
      sitter: {
        id: 3,
        email: "curly@pantherbrewing.com",
        name: "Curly Howard",
        phone: "+14983477354",
        image: "https://imagescom/curly.jpg"
      },
      ratings: 3.0,
      overall: 3.0
    }
  ];

  var expectedValues = [
    ["Ratings", "Name", "Phone", "Email", "Image"],
    [
      "5.00",
      "Moe Howard",
      "+11633847457",
      "moe@pantherbrewing.com",
      '<div><img height="34" src="https://imagescom/moe.jpg"></div>'
    ],
    [
      "4.00",
      "Larry Fine",
      "+14983477354",
      "larry@pantherbrewing.com",
      '<div><img height="34" src="https://imagescom/larry.jpg"></div>'
    ],
    [
      "3.00",
      "Curly Howard",
      "+14983477354",
      "curly@pantherbrewing.com",
      '<div><img height="34" src="https://imagescom/curly.jpg"></div>'
    ]
  ];

  const { debug } = render(<RankingsTable data={data} />);
  debug();

  const tableElement = screen.getByRole("table");
  expect(tableElement).toBeInTheDocument();
  expect(tableElement).toHaveClass("table");
  expect(tableElement).toHaveClass("table-striped");
  expect(tableElement).toHaveClass("table-bordered");

  var values = getRowValues();
  expect(values).toEqual(expectedValues);
});
