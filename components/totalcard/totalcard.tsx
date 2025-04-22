import { useContext, useEffect, useState } from "react"
import { Card } from "../ui/card"
import { PageContext } from "@/app/accounts/page";
import { getTotalByAccountAndMonth, setTotalByAccountAndMonth } from "@/lib/db/sqlite";
import { Pencil } from "lucide-react";
import { Button } from "../ui/button";
import { Dialog, DialogTrigger, DialogContent, DialogTitle, DialogDescription, DialogClose, DialogFooter, DialogHeader } from "../ui/dialog";
import { Input } from "../ui/input";
import { cn } from "@/lib/utils";

export const TotalCard = ({
  className
}: {
  className?: string
}) => {

  const [total, setTotal] = useState<number | undefined>();
  const context = useContext(PageContext);

  useEffect(() => {
    (async () => {
      const result = await getTotalByAccountAndMonth(context.month, context.year, context.accountData.id);

      setTotal(result?.total)

    }) ()
  }, [context.month, context.year, context.reload])

  const valid = (balance: string) => {
    return true 
  }

  return <Card className={cn("p-8 gap-4", className)}>
    <div className="flex items-end gap-8">
    <div>
      <h2 className="mb-1">Final Balance</h2>
      <p className="text-3xl font-bold">{total || "--.--"} {context.accountData.currency}</p>
    </div>
    <Dialog>
      <DialogTrigger>
        <Button asChild variant="outline" className="p-2 w-fit">
          <Pencil/>
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            Edit Final Balance
          </DialogTitle>
          <DialogDescription>
            This is the final balance after the entire month. The application will track your balance development over each month.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={(e) => e.preventDefault()}>
          <Input id="finalbalance" placeholder="--.--" defaultValue={total} />
        </form>
        <DialogFooter className="sm:justify-end">
          <DialogClose asChild onClick={async () => {
            const balance = document.querySelector<HTMLInputElement>("#finalbalance")?.value;
            if (balance && valid(balance)) {
              const balanceAsNumber = parseFloat(balance);
              await setTotalByAccountAndMonth(context.month, context.year, context.accountData.id, balanceAsNumber);
              setTotal(balanceAsNumber)
            }
          }}>
            <Button type="button" variant="secondary">
              Done
            </Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
    </div>
  </Card>

}