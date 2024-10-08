import * as React from "react";
import Link from "next/link";
import { Tooltip } from "react-tooltip";
import ReactDOM from "react-dom/client";

import {
  createColumnHelper,
  flexRender,
  getCoreRowModel,
  useReactTable,
} from "@tanstack/react-table";
import convertTokensToThousandsK from "../lib/convertTokensToThousansK";

type Proposal = {
  id: string;
  proposer: string;
  forVotes: string;
  againstVotes: string;
  startBlock: string;
  endBlock: string;
  executed: boolean;
  canceled: boolean;
  description: string;
  totalVotes: string;
};

const columnHelper = createColumnHelper<Proposal>();

const Table = ({ data, submitted }: { data: any; submitted: boolean }) => {
  const columns = React.useMemo(() => {
    const cols = [
      columnHelper.accessor("id", {
        header: () => "Proposal ID",
        cell: (info) => {
          const value = info.getValue();
          const convertedValue = value ? value.toString().slice(0, 8) : "";
          return (
            <Link
              href={"/proposal/[proposalId]"}
              as={`/proposal/${value}`}
              className="proposal-link"
            >
              {convertedValue}
            </Link>
          );
        },
      }),
      columnHelper.accessor("description", {
        header: () => "Description",
        cell: (info) => {
          const description = info.getValue().split("\n")[0];
          return description.length > 32 ? (
            <div
              data-tooltip-id="my-tooltip"
              data-tooltip-content={description}
            >
              {`${description.substring(0, 32)}...`}
            </div>
          ) : (
            <span>{description}</span>
          );
        },
      }),
    ];

    if (submitted) {
      cols.push(
        columnHelper.accessor("forVotes", {
          header: () => "For Votes",
          cell: (info) => {
            const value = info.getValue();
            const convertedValue = value
              ? convertTokensToThousandsK(value)
              : "";
            return <>{convertedValue}</>;
          },
        }),
        columnHelper.accessor("againstVotes", {
          header: () => "Against Votes",
          cell: (info) => {
            const value = info.getValue();
            const convertedValue = value
              ? convertTokensToThousandsK(value)
              : "";
            return <>{convertedValue}</>;
          },
        }),
        columnHelper.accessor("totalVotes", {
          header: () => "Total Votes",
          cell: (info) => {
            const value = info.getValue();
            const convertedValue = value
              ? convertTokensToThousandsK(value)
              : "";
            return <>{convertedValue}</>;
          },
        })
      );
    }

    return cols;
  }, [submitted]);

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
  });

  return (
    <div className="table-container">
      <table>
        <thead>
          {table.getHeaderGroups().map((headerGroup) => (
            <tr key={headerGroup.id}>
              {headerGroup.headers.map((header) => (
                <th key={header.id}>
                  {header.isPlaceholder
                    ? null
                    : flexRender(
                        header.column.columnDef.header,
                        header.getContext()
                      )}
                </th>
              ))}
            </tr>
          ))}
        </thead>
        <tbody>
          {table.getRowModel().rows.map((row) => (
            <tr key={row.id}>
              {row.getVisibleCells().map((cell) => (
                <td key={cell.id}>
                  {flexRender(cell.column.columnDef.cell, cell.getContext())}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
      <Tooltip
        id="my-tooltip"
        style={{ width: "300px", background: "#1a74ec" }}
      />
    </div>
  );
};

export default Table;
