import { Check, ChevronsUpDown } from "lucide-react"
import { Button } from "./button"
import { Popover, PopoverContent, PopoverTrigger } from "./popover"
import { useState } from "react"
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "./command"
import { cn } from "@/lib/utils"

export type comboboxitem = {
  value: string,
  label: string
}

export const Combobox = ({
  items,
  onValueChange,
  defaultValue,
}: {
  items: comboboxitem[],
  onValueChange: (s: string) => void
  defaultValue?: string
}) => {
  const [open, setOpen] = useState(false)
  const [value, setValue] = useState(defaultValue || "")

  return <Popover open={open} onOpenChange={() => {}}>
    <PopoverTrigger asChild>
      <Button
        variant="outline"
        role="combobox"
        aria-expanded={open}
        className="justify-between"
        onClick={() => {
          setOpen(!open)
        }}
      >
        {value
          ? items.find((item) => item.value === value)?.label
          : "Select item..."}
        <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
      </Button>
    </PopoverTrigger>
    <PopoverContent className="p-0" style={{
          pointerEvents: "auto"
        }}>
      <Command>
        <CommandList>
          <CommandEmpty>No items found.</CommandEmpty>
          <CommandGroup>
            {items.map((item) => (
              <CommandItem
                key={item.value}
                value={item.value}
                onSelect={(currentValue) => {
                  onValueChange(currentValue)
                  setValue(currentValue === value ? "" : currentValue)
                  setOpen(false)
                }}
              >
                <Check
                  className={cn(
                    "mr-2 h-4 w-4",
                    value === item.value ? "opacity-100" : "opacity-0"
                  )}
                />
                {item.label}
              </CommandItem>
            ))}
          </CommandGroup>
        </CommandList>
      </Command>
    </PopoverContent>
  </Popover>
}