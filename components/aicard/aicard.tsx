import { Send } from "lucide-react"
import { Button } from "../ui/button"
import { Card } from "../ui/card"
import { Input } from "../ui/input"
import { useContext, useState } from "react"
import { fetch } from "@tauri-apps/plugin-http"
import { Loading } from "../loading"
import { PageContext } from "@/app/accounts/page"
import { addTransaction, setTotalByAccountAndMonth } from "@/lib/db/sqlite"
import { toast } from "sonner"
import { useRouter } from "next/navigation"
import { cn } from "@/lib/utils"

export const AICard = ({
  className
}: {
  className?: string
}) => {

  const [text, setText] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  const [file, setFile] = useState<File | undefined>();

  const context = useContext(PageContext);
  const router = useRouter();

  const handleFileUpload = async () => {
    
    if (!file) return;


    setLoading(true);
    const data = new FormData();
    data.append("file", file);

    const textResponse = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/app/transactions/pdf2text`, {
      method: 'POST',
      body: data
    });

    const text = (await textResponse.json())["result"];
    
    if (!text) return;

    const dataResponse = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/app/transactions/text2data`, {
      method: 'POST',
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        text: text
      })
    });

    const json = await dataResponse.json()
    const jsonData = JSON.parse(json.result);

    console.log(jsonData);

    if (jsonData.status == "OK") {
      await Promise.all(jsonData.transactions.map((transaction: any) => 
        addTransaction(transaction.date, transaction.value, transaction.type, transaction.description, context.accountData.id)
      ))

      const m = jsonData.month;
      const y = jsonData.year;
      const balance = jsonData.finalBalance;
      await setTotalByAccountAndMonth(m-1, y, context.accountData.id, balance);

      context.toggleReload();

    } else {
      toast.error("Error: The AI assistant could not process your file.")
    }

    setLoading(false)

  };
  
  return <Card className={cn("p-8 gap-4", className)}>
    <div>
      <h2 className='text-3xl font-bold justify-self-start mb-1'>Bank Statement:</h2>
      <p className="text-muted-foreground text-sm">Upload your bank statement for this month:</p>
    </div>
    <form className="w-full flex justify-between gap-2" onSubmit={e => {
      e.preventDefault();
      handleFileUpload();
    }}>
      <Input type="file" accept="application/pdf"  className="w-[200px]" onChange={(e) => setFile(e.target.files?.[0])} />
      <Button variant="outline" disabled={!file || loading}>
        {
          loading ? <Loading/>
          :
          <Send/>
        }
      </Button>
    </form>
    <p>
        {text}
    </p>
  </Card>
}