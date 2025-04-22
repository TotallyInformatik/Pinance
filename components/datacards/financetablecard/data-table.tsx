"use client"

import {
  ColumnDef,
  ColumnFiltersState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  SortingState,
  useReactTable,
  VisibilityState,
} from "@tanstack/react-table"

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Button } from "../../ui/button"
import { Dispatch, SetStateAction, useEffect, useState } from "react"
import { Input } from "../../ui/input"
import { DropdownMenu, DropdownMenuCheckboxItem, DropdownMenuContent, DropdownMenuTrigger } from "../../ui/dropdown-menu"
import { ChevronDown, MoreHorizontal, Plus } from "lucide-react"
import { account, addTransaction, getTransactionTypes, transaction } from "@/lib/db/sqlite"
import { TransactionDialog } from "./transactiondialog"
import { cn, convertToDate, convertToISO8601 } from "@/lib/utils"
import { Separator } from "../../ui/separator"

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[]
  data: TData[]
  setData: Dispatch<SetStateAction<TData[]>>
  account: account,
  currentMonth: number,
  currentYear: number
}

export function DataTable<TData, TValue>({
  columns,
  data,
  setData,
  account,
  currentMonth,
  currentYear
}: DataTableProps<TData, TValue>) {

  const [sorting, setSorting] = useState<SortingState>([])
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>(
    []
  )
  const [columnVisibility, setColumnVisibility] =
    useState<VisibilityState>({})
  const table = useReactTable<TData>({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    onSortingChange: setSorting,
    getSortedRowModel: getSortedRowModel(),
    onColumnFiltersChange: setColumnFilters,
    getFilteredRowModel: getFilteredRowModel(),
    onColumnVisibilityChange: setColumnVisibility,
    state: {
      sorting,
      columnFilters,
      columnVisibility,
    },
  })

  return (
    <div>
      <div className="flex items-center justify-between gap-3 pb-4">
        <Input
          placeholder="filter by type..."
          value={(table.getColumn("type")?.getFilterValue() as string) ?? ""}
          onChange={(event) =>
            table.getColumn("type")?.setFilterValue(event.target.value)
          }
          className="w-[150px]"
        />
        <div>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="ml-auto">
                Columns <ChevronDown/>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              {table
                .getAllColumns()
                .filter(
                  (column) => column.getCanHide()
                )
                .map((column) => {
                  return (
                    <DropdownMenuCheckboxItem
                      key={column.id}
                      className="capitalize"
                      checked={column.getIsVisible()}
                      onCheckedChange={(value) =>
                        column.toggleVisibility(!!value)
                      }
                    >
                      {column.id}
                    </DropdownMenuCheckboxItem>
                  )
                })}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
      <div className="flex flex-col justify-between rounded-[10px] border pb-0 min-h-[500px]">
        <Table>
          <TableHeader className="bg-muted z-10" style={{
            borderRadius: "50%"
          }}>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header, idx) => {
                  return (
                    <TableHead key={header.id} className={
                      cn(
                        idx == headerGroup.headers.length-1 && "rounded-tr-[9px]",
                        idx == 0 && "rounded-tl-[9px]" 
                      )
                    }>
                    {header.isPlaceholder
                        ? null
                        : flexRender(
                            header.column.columnDef.header,
                            header.getContext()
                          )}
                    </TableHead>
                  )
                })}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody className="**:data-[slot=table-cell]:first:w-8">
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() && "selected"}
                >
                  {row.getVisibleCells().map((cell) => {
                    return <TableCell key={cell.id}>
                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </TableCell>
                  })}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={columns.length} className="h-24 text-center">
                  No results.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
        <div className=" justify-self-end">
        <Separator />
        <div className="flex items-center justify-between gap-10">
          <TransactionDialog
            onSubmit={(v) => {
              
              (async () => {
                const newId = await addTransaction(v.date, v.value, v.type, v.description, account.id);
                const date = convertToDate(convertToISO8601(v.date))


                if ((date.getMonth() + 1) == currentMonth && date.getFullYear() == currentYear) {
                  data.push({
                    id: newId,
                    date: v.date,
                    description: v.description,
                    value: v.value,
                    type: v.type
                  } as TData)
                  setData([...data])
                }
              })()

            }}
            title="Add Transaction"
          >
            <Button asChild variant="ghost">
              <p><Plus /></p>
            </Button>
          </TransactionDialog>
          <div className="flex items-center justify-end">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => table.previousPage()}
              disabled={!table.getCanPreviousPage()}
            >
              Previous
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => table.nextPage()}
              disabled={!table.getCanNextPage()}
            >
              Next
            </Button>
          </div>
        </div>
        </div>
      </div>
    </div>
  )
}
