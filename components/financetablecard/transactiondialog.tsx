import { DialogContent, DialogTitle, DialogTrigger, DialogClose, DialogHeader, DialogFooter } from "../ui/dialog";
import { Dialog } from "../ui/dialog";
import { Input } from "../ui/input";
import { ReactNode, useEffect, useState } from "react";
import { Combobox } from "../ui/combobox";
import { getTransactionTypes, transactionTypeList } from "@/lib/db/sqlite";
import { Label } from "../ui/label";
import { Button } from "../ui/button";
import { toast } from "sonner";
import { convertToDate, convertToISO8601, pad0 } from "@/lib/utils";

export const TransactionDialog = ({
  children,
  defaultValues,
  onSubmit,
  title,
  volatileContext=false,
}: {
  children: ReactNode
  defaultValues?: {
    date?: string
    value?: string
    type?: string
    description?: string
  }
  onSubmit: (v: {
    date: string,
    value: number,
    type: string,
    description: string
  }) => void
  title: string,
  volatileContext?: boolean,
}) => {

  const [transactionTypes, setTransactionTypes] = useState<transactionTypeList>([]);
  const [selectedType, setSelectedType] = useState<string>(defaultValues?.type || "");

  useEffect(() => {
    (async () => {
      const newTypes = await getTransactionTypes();
      setTransactionTypes(newTypes);
    })()
  }, [])

  const valid = (date: string | undefined, value: string | undefined, description: string | undefined, type: string | undefined) => {
    // todo    
    return date && value && description && type;
  }

  const content = <DialogContent>
      <DialogHeader>
        <DialogTitle>
          {title}
        </DialogTitle>
      </DialogHeader>
      <form className="p-2 w-full gap-2 justify-between">
        <div className="flex flex-col gap-5">
          <div className="flex flex-col gap-1">
            <Label>Date</Label>
            <Input id="Date" placeholder="dd.mm.yyyy" defaultValue={defaultValues?.date} />
          </div>
          <div className="flex flex-col gap-1">
            <Label>Value</Label>
            <Input id="Value" placeholder="--.--" defaultValue={defaultValues?.value} />
          </div>
          <div className="flex flex-col gap-1">
            <Label>Transaction Type</Label>
            <Combobox 
              items={transactionTypes.map(v => {
                return {
                  label: v.type,
                  value: v.type
                }
              })}
              defaultValue={defaultValues?.type || ""}
              onValueChange={setSelectedType}
            />
          </div>
          <div className="flex flex-col gap-1">
            <Label>Description</Label>
            <Input id="Description" placeholder="Description" defaultValue={defaultValues?.description}  />
          </div>
        </div>
      </form>
      <DialogFooter>
        <DialogClose type="submit" asChild onClick={(e) => {
          let dateValue = document.querySelector<HTMLInputElement>("#Date")?.value;
          const valueValue = document.querySelector<HTMLInputElement>("#Value")?.value;
          const descValue = document.querySelector<HTMLInputElement>("#Description")?.value;
          const type = selectedType;

          console.log(dateValue);
          console.log(valueValue);
          console.log(descValue);

          if (valid(dateValue, valueValue, descValue, type)) {
            
            if (dateValue) {
              const parts = dateValue.split(".")
              parts[0] = pad0(parts[0])
              parts[1] = pad0(parts[1])
              dateValue = parts.join(".")
            }

            onSubmit({
              date: dateValue || "",
              value: parseFloat(valueValue || "0"),
              type: type || "",
              description: descValue || ""
            })
          } else {
            e.preventDefault();
            toast.error("Refused: Inputs are not valid.")
          }

        }}>
          <Button type="button" variant="secondary">
            Done
          </Button>
        </DialogClose>
      </DialogFooter>
    </DialogContent>

  if (volatileContext) {
    return content;
  } else {
    return <Dialog>
      <DialogTrigger asChild>
        {children}
      </DialogTrigger>
      {content}
    </Dialog>
  }
}