"use client"

import { removeTransaction, transaction, updateTransaction } from "@/lib/db/sqlite"
import { ColumnDef, SortingState } from "@tanstack/react-table"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "../ui/dropdown-menu"
import { Button } from "../ui/button"
import { ArrowUpDown, MoreHorizontal } from "lucide-react"
import { Dispatch, SetStateAction, useState } from "react"
import { TransactionDialog } from "./transactiondialog"
import { Dialog, DialogTrigger } from "@radix-ui/react-dialog"

export const getColumns = (
  currency: string,
  data: transaction[],
  setData: Dispatch<SetStateAction<transaction[]>>
) => {

  return [
    {
      accessorKey: "date",
      header: ({ column }) => {
        return (
          <div className="w-full flex">
            <Button
              variant="ghost"
              onClick={() => {
                column.toggleSorting(column.getIsSorted() === "asc")
              }}
              className="p-0"
            >
              <ArrowUpDown className="h-4 w-4" />
              Date
            </Button>
          </div>
        )
      },
    },
    {
      accessorKey: "value",
      header: ({ column }) => {
        return (
          <div className="w-full flex justify-end">
            <Button
              variant="ghost"
              onClick={() => {
                console.log(column.getIsSorted());
                column.toggleSorting(column.getIsSorted() === "asc")
              }}
            >
              Value
              <ArrowUpDown className="ml-2 h-4 w-4" />
            </Button>
          </div>
        )
      },
      cell: ({ row }) => {
        const amount = parseFloat(row.getValue("value"))
        const formatted = new Intl.NumberFormat("de-DE", {
          style: "currency",
          currency: currency,
        }).format(amount)
   
        return <div className="text-right font-medium">{formatted}</div>
      },
    },
    {
      accessorKey: "type",
      header: "Type",
    },
    {
      accessorKey: "description",
      header: "Description",
    },
    {
      accessorKey: "actions",
      header: "",
      cell: ({ row }) => {   

        const originalRow = row.original;

        return (
          <div className="w-full flex justify-end">
            <Dialog>
              <DropdownMenu modal={false}>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="h-8 w-8 p-0">
                    <MoreHorizontal className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                
                <DropdownMenuContent align="end">

                <DropdownMenuItem>
                    <DialogTrigger>
                      Edit Transaction
                    </DialogTrigger>
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => {
                    const id = originalRow.id;
                    const newData = data.filter((d) => d.id != id)
                    setData([...newData])
                    removeTransaction(id);

                  }}>Delete Transaction</DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
              <TransactionDialog
                volatileContext
                defaultValues={{
                  date: originalRow.date,
                  value: originalRow.value.toString(),
                  type: originalRow.type || "",
                  description: originalRow.description
                }}
                onSubmit={(v) => {
                  (async () => {
                    const id = originalRow.id

                    const index = data.findIndex((v) => v.id = id)
                    if (index != -1) {
                      await updateTransaction(id, v.date, v.value, v.type, v.description);
                      data[index] = {
                        id: id,
                        date: v.date,
                        value: v.value,
                        type: v.type,
                        description: v.description
                      }
                      setData([...data])
                    } 
                  })()
                }}
                title="Edit Transaction"
              >
                Edit Transaction
              </TransactionDialog>
            </Dialog>
          </div>
        )
      },
      enableHiding: false,
    }
  ] as ColumnDef<transaction>[]
}
