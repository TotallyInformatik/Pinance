
import { LoaderCircle } from "lucide-react"

export const Loading = () => {
  return <div className="h-full w-full flex items-center justify-center">
    <LoaderCircle className="animate-spin" />
  </div>  
}