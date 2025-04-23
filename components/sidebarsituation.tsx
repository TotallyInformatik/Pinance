'use client'
import { ReactNode, useEffect, useState } from "react";
import { Sidebar, SidebarContent, SidebarFooter, SidebarGroup, SidebarGroupContent, SidebarGroupLabel, SidebarHeader, SidebarInset, SidebarMenu, SidebarMenuAction, SidebarMenuButton, SidebarMenuItem, SidebarProvider } from "@/components/ui/sidebar";
import { BadgeEuro, DollarSign, Ellipsis, Euro, Files, LayoutDashboard, Menu, Plus, PoundSterling, Settings, SwissFranc } from "lucide-react";
import { ThemeToggler } from "./themetoggler";
import { Button } from "./ui/button";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "./ui/form";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod"
import { Input } from "./ui/input";
import { account, addAccount, getAccountList, removeAccountById, setAccount } from "@/lib/db/sqlite";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "./ui/dropdown-menu";

import { ScrollArea } from "./ui/scroll-area";
import { toast } from "sonner";
import { Separator } from "./ui/separator";
import { useRouter } from "next/navigation";
import { ACCOUNT_PARAM } from "@/app/accounts/page";
import { DialogTitle,Dialog,DialogClose,DialogContent, DialogFooter, DialogHeader, DialogTrigger  } from "@/components/ui/dialog";
import { Label } from "./ui/label";
import { Combobox } from "./ui/combobox";
import { CURRENCIES, DEFAULT_CURRENCY } from "@/lib/utils";

export const SidebarSituation = ({children} : {children: ReactNode}) => {

  const [sidebarOpen, setSidebarOpen] = useState<boolean>(true);
  const [accounts, setAccounts] = useState<account[]>([]);
  const [reload, setReload] = useState<boolean>(false);
  const router = useRouter();

  const formSchema = z.object({
    title: z.string()
  })
   

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: "",
    },
  })

  async function onSubmit(values: z.infer<typeof formSchema>) {
    if (accounts.some((account: account) => { return account.title == values.title })) {
      toast.error("Error: Account with the same name already exists.")
    } else {
      const result = await addAccount(values.title, DEFAULT_CURRENCY);
      accounts.push(result);
      setAccounts([...accounts])
    }
  }

  async function removeAccount(id: number) {
    await removeAccountById(id);
    const newAccounts = accounts.filter((account: account) => { return account.id != id; });
    setAccounts([...newAccounts])
  }


  useEffect(() => {
    (async () => {
      const newAccounts = (await getAccountList()) as account[];
      setAccounts(newAccounts);
    })()
  }, [reload])


  const CURRENCY_TO_LOGO: Record<string, ReactNode> = {
    "EUR": <Euro />,
    "CHF": <SwissFranc />,
    "GBP": <PoundSterling/>,
    "USD": <DollarSign />,
    "CAD": <DollarSign />,
  }

  return <SidebarProvider open={sidebarOpen} onOpenChange={setSidebarOpen}>
    <Sidebar collapsible="offcanvas" variant="inset">
      <SidebarHeader className="flex flex-row items-center">
        <BadgeEuro />
        <h1 className="text-xl font-semibold">πnance</h1>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarMenu>
            <SidebarMenuItem className="w-full">
              <SidebarMenuButton className="flex items-center" onClick={() => router.push("/")}>
                <LayoutDashboard/>
                <p>Home</p>
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarGroup>
        <SidebarGroup>
          <SidebarGroupLabel>Accounts</SidebarGroupLabel>
          <SidebarGroupContent>
            <ScrollArea>
            <SidebarMenu>
            {
              accounts.map((account) => {
                return <div key={account.id} className="flex justify-between">
                  <SidebarMenuItem className="w-full">
                    <SidebarMenuButton 
                      className="flex items-center" 
                      onClick={
                        () => {
                          router.push(`/accounts?${ACCOUNT_PARAM}=${account.id}`)
                          router.refresh();
                        }
                      }
                    >
                      {
                        CURRENCY_TO_LOGO[account.currency]
                      }
                      <p>{account.title}</p>
                    </SidebarMenuButton>
                    <Dialog>
                      <DropdownMenu modal={false}>
                        <DropdownMenuTrigger asChild>
                          <SidebarMenuAction>
                            <Ellipsis/>
                          </SidebarMenuAction>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent side="right" align="start">
                          <DropdownMenuItem onClick={() => removeAccount(account.id)}>
                            <span>Delete Account</span>
                          </DropdownMenuItem>
                          <DropdownMenuItem>
                            <DialogTrigger>
                              <span>Edit Account</span>
                            </DialogTrigger>
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                      <DialogStuff account={account} onDone={() => {
                        setReload(!reload)
                      }}/>
                    </Dialog>
                  </SidebarMenuItem>
                </div>
              })
            }
            </SidebarMenu>
            </ScrollArea>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8 flex">
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>New Account</FormLabel>
                  <FormControl>
                    <div className="flex gap-3"> 
                      <Input placeholder="ABCBank" {...field} />
                      <Button size="icon" type="submit">
                        <Plus/>
                      </Button>
                    </div>
                  </FormControl>
                  <FormDescription>
                    Create a new account and track that accounts wealth.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
          </form>
        </Form>
      </SidebarFooter>
    </Sidebar>
    <SidebarInset>
      <div className="h-[calc(100vh-50px)]">
        <SidebarHeader className="flex flex-row items-start justify-between px-8">
          <div className="w-fit flex flex-row items-center gap-3">
            <Button variant="outline" size="icon" onClick={() => {
              setSidebarOpen(!sidebarOpen);
            }}>
              <Menu />
            </Button>
            <Separator orientation="vertical" className="h-full data-[orientation=vertical]:h-6" />
          </div>
          <ThemeToggler />
        </SidebarHeader>
        <Separator className="h-2"/>
        <SidebarContent className="h-[calc(100%-20px)]">
          <ScrollArea className="h-full">
            <div className="p-8">
              {children}
            </div>
          </ScrollArea>
        </SidebarContent>
      </div>
    </SidebarInset>
  </SidebarProvider>
}

const DialogStuff = ({account, onDone}: {account: account, onDone: () => void}) => {
  
  const [selectedCurrency, setSelectedCurrency] = useState<string>(account.currency);

  console.log(account)

  return <DialogContent>
      <DialogHeader>
      <DialogTitle>
        Edit Account
      </DialogTitle>
    </DialogHeader>
    <form className="p-2 w-full gap-2 justify-between">
      <div className="flex flex-col gap-5">
        <div className="flex flex-col gap-1">
          <Label>Name</Label>
          <Input id={`bankname-${account.id}`} placeholder="ABCBank" defaultValue={account.title} />
        </div>
        <div className="flex flex-col gap-1">
          <Label>Currency</Label>
          <Combobox
            items={CURRENCIES.map(curr => {
              return {
                label: curr,
                value: curr
              }
            })}
            onValueChange={setSelectedCurrency}
            defaultValue={account.currency}
          />
        </div>
      </div>
    </form>
    <DialogFooter>
      <DialogClose type="submit" asChild onClick={(e) => {
        const name = document.querySelector<HTMLInputElement>(`#bankname-${account.id}`)?.value;
        if (name && selectedCurrency) {
          (async () => {
            await setAccount(account.id, selectedCurrency, name);
            onDone();
          })()
        }
      }}>
        <Button type="button" variant="secondary">
          Done
        </Button>
      </DialogClose>
    </DialogFooter>
  </DialogContent>
}