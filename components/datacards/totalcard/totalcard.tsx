import { useContext, useEffect, useState } from "react"
import { Card } from "../../ui/card"
import { PageContext } from "@/app/accounts/page";
import { getTotalByAccountAndMonth, getTransactionsByAccountWithinMonthSummedUp, setTotalByAccountAndMonth } from "@/lib/db/sqlite";
import { Pencil } from "lucide-react";
import { Button } from "../../ui/button";
import { Dialog, DialogTrigger, DialogContent, DialogTitle, DialogDescription, DialogClose, DialogFooter, DialogHeader } from "../../ui/dialog";
import { Input } from "../../ui/input";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

export const TotalCard = ({
  className
}: {
  className?: string
}) => {

  const [total, setTotal] = useState<number | undefined>();
  const [netoutcome, setNetoutcome] = useState<number | undefined>();
  const context = useContext(PageContext);

  useEffect(() => {
    (async () => {
      const totalresult = await getTotalByAccountAndMonth(context.month+1, context.year, context.accountData.id);
      const netresult = await getTransactionsByAccountWithinMonthSummedUp(context.year,context.month+1, context.accountData.id);

      setTotal(totalresult?.total)
      setNetoutcome(netresult.sum);

    }) ()
  }, [context.month, context.year, context.reload])

  const validate = (balance: string) => {
    return !isNaN(parseFloat(balance))
  }

  return <Card className={cn("p-8 gap-10", className)}>
    <div className="flex items-end gap-8">
      <div>
        <h2 className="mb-1 text-muted-foreground">Final Balance</h2>
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
            <DialogClose asChild onClick={async (e) => {
              const balance = document.querySelector<HTMLInputElement>("#finalbalance")?.value;
              if (balance && validate(balance)) {
                const balanceAsNumber = parseFloat(parseFloat(balance).toFixed(2));
                await setTotalByAccountAndMonth(context.month, context.year, context.accountData.id, balanceAsNumber);
                setTotal(balanceAsNumber)
              } else {
                toast.error("Error: Invalid Input")
                e.preventDefault();
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
    <div>
      <p className="mb-1 text-muted-foreground">Net Outcome</p>
      <h2 className='mt-0 text-3xl font-bold justify-self-start'>{netoutcome && netoutcome > 0 ? "+" : ""}{netoutcome || "--.--"} {context.accountData.currency}</h2>
    </div>
  </Card>

}