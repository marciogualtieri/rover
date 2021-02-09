import React, { Component } from "react";
import { useTable, usePagination } from "react-table";

function RankingsTable({ data }) {
  const columns = React.useMemo(
    () => [
      {
        Header: "Ratings",
        accessor: row => row.ratings.toFixed(2)
      },
      {
        Header: "Name",
        accessor: "sitter.name"
      },
      {
        Header: "Phone",
        accessor: "sitter.phone"
      },
      {
        Header: "Email",
        accessor: "sitter.email"
      },
      {
        Header: "Image",
        accessor: "sitter.image",
        Cell: ({ cell: { value } }) => {
          return (
            <div>
              <img height={34} src={value} />
            </div>
          );
        },
        id: "image"
      }
    ],
    []
  );

  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    rows,
    prepareRow
  } = useTable({ columns, data });

  return (
    <table className="table table-striped table-bordered" {...getTableProps()}>
      <thead>
        {headerGroups.map(headerGroup => (
          <tr {...headerGroup.getHeaderGroupProps()}>
            {headerGroup.headers.map(column => (
              <th {...column.getHeaderProps()}>{column.render("Header")}</th>
            ))}
          </tr>
        ))}
      </thead>
      <tbody {...getTableBodyProps()}>
        {rows.map(row => {
          prepareRow(row);
          return (
            <tr {...row.getRowProps()}>
              {row.cells.map(cell => {
                return <td {...cell.getCellProps()}>{cell.render("Cell")}</td>;
              })}
            </tr>
          );
        })}
      </tbody>
    </table>
  );
}

export default RankingsTable;
