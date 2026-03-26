"use client";

import { AppSidebar } from "@/components/app-sidebar";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { Clock, MessageSquare, Trash2, Search, Filter, ArrowRight, User } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { RootState } from "@/redux/store";

import { motion } from "framer-motion";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { useToast } from "@/hooks/use-toast";
import { Input } from "@/components/ui/input";
import { subscribeToChats, deleteChatFromRTDB } from "@/services/chatService";
import { auth } from "@/firebase";
import { Badge } from "@/components/ui/badge";

export default function Folder() {
  const user = useSelector((state: RootState) => state.user.user);
  const [chatHistory, setChatHistory] = useState<any[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const router = useRouter();
  const { toast } = useToast();
  const [isDeleting, setIsDeleting] = useState(false);
  const [openDialogUuid, setOpenDialogUuid] = useState<string | null>(null);

  useEffect(() => {
    if (auth.currentUser) {
      const unsub = subscribeToChats(auth.currentUser.uid, (chats) => {
        setChatHistory(chats);
      });
      return () => unsub();
    }
  }, []);

  const handleCardClicks = (uuid: string) => {
    router.push(`/dashboard?session=${uuid}`);
  };

  const handleDelete = async (uuid: string) => {
    if (!auth.currentUser) return;
    try {
      setIsDeleting(true);
      await deleteChatFromRTDB(auth.currentUser.uid, uuid);
      setOpenDialogUuid(null);
      toast({ title: "Session purged.", description: "Record removed from archive." });
    } catch (error) {
      toast({ title: "Purge failed.", variant: "destructive" });
    } finally {
      setIsDeleting(false);
    }
  };

  const filteredPrompts = chatHistory.filter((info) =>
    (info.title || "New Consultation").toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <SidebarProvider className="h-screen overflow-hidden bg-background">
      <AppSidebar />
      <div className="flex w-full h-screen relative">
        <div className="w-full flex flex-col bg-muted/5">
          <SidebarInset className="h-full flex flex-col bg-transparent">
            <header className="flex h-20 shrink-0 items-center border-b px-8 bg-background/50 backdrop-blur-md sticky top-0 z-10">
              <div className="flex items-center gap-4 mr-auto">
                <SidebarTrigger className="-ml-1 h-10 w-10 rounded-xl" />
                <Separator orientation="vertical" className="mx-2 h-6" />
                <div>
                    <h1 className="text-lg font-black uppercase tracking-widest text-foreground leading-none">Clinical Archive</h1>
                    <span className="text-[10px] font-bold text-primary uppercase tracking-[0.2em] mt-1 block">Node Indexing Active</span>
                </div>
              </div>

              <div className="flex items-center gap-4">
                <div className="relative group hidden md:block">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground group-focus-within:text-primary transition-colors" />
                    <Input
                        type="text"
                        placeholder="Filter session ID..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-64 lg:w-80 h-11 pl-11 rounded-xl border-2 bg-background/50 focus-visible:ring-primary focus-visible:border-primary transition-all font-bold text-sm"
                    />
                </div>
                <Button variant="outline" size="icon" className="h-11 w-11 rounded-xl border-2">
                    <Filter className="h-4 w-4" />
                </Button>
              </div>
            </header>

            <ScrollArea className="flex-1 px-8 py-10 lg:px-12">
              <div className="max-w-7xl mx-auto">
                <div className="flex items-center justify-between mb-10">
                    <div>
                        <h2 className="text-3xl font-black tracking-tight uppercase">Indexed Records</h2>
                        <p className="text-sm text-muted-foreground font-medium mt-1">Full clinical consultation history for current node.</p>
                    </div>
                    <Badge variant="outline" className="h-8 border-2 px-4 rounded-lg font-black text-[10px] uppercase tracking-widest bg-background">
                        {filteredPrompts.length} Entries
                    </Badge>
                </div>

                <div className="grid gap-6 grid-cols-1 md:grid-cols-2 xl:grid-cols-3">
                    {filteredPrompts.length > 0 ? (
                    filteredPrompts.map((info) => (
                        <motion.div
                        key={info.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.4 }}
                        >
                        <Card
                            className="cursor-pointer transition-all border-2 border-transparent hover:border-primary/50 hover:shadow-2xl bg-background group rounded-[2rem] card-shadow overflow-hidden flex flex-col"
                            onClick={() => handleCardClicks(info.id)}
                        >
                            <div className="p-8 flex flex-col h-full relative">
                            <div className="absolute top-0 right-0 p-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                <AlertDialog
                                    open={openDialogUuid === info.id}
                                    onOpenChange={(open) => setOpenDialogUuid(open ? info.id : null)}
                                >
                                    <AlertDialogTrigger asChild>
                                        <Button
                                            variant="ghost"
                                            size="icon"
                                            className="h-10 w-10 text-muted-foreground hover:text-destructive hover:bg-destructive/10 rounded-xl"
                                            onClick={(e) => e.stopPropagation()}
                                        >
                                            <Trash2 className="h-5 w-5" />
                                        </Button>
                                    </AlertDialogTrigger>
                                    <AlertDialogContent className="rounded-3xl border-none shadow-2xl">
                                        <AlertDialogHeader>
                                            <AlertDialogTitle className="font-black uppercase tracking-tight text-foreground">Purge Archive Record?</AlertDialogTitle>
                                            <AlertDialogDescription className="font-medium">This clinical session will be permanently erased from the node.</AlertDialogDescription>
                                        </AlertDialogHeader>
                                        <AlertDialogFooter>
                                            <AlertDialogCancel disabled={isDeleting} className="rounded-xl font-bold uppercase text-[10px] tracking-widest border-2">Abort</AlertDialogCancel>
                                            <AlertDialogAction disabled={isDeleting} onClick={() => handleDelete(info.id)} className="rounded-xl bg-destructive text-white font-bold uppercase text-[10px] tracking-widest">Execute Purge</AlertDialogAction>
                                        </AlertDialogFooter>
                                    </AlertDialogContent>
                                </AlertDialog>
                            </div>

                            <div className="h-14 w-14 rounded-2xl bg-primary/10 flex items-center justify-center text-primary mb-8 group-hover:scale-110 transition-transform duration-500">
                                <MessageSquare className="h-7 w-7" />
                            </div>

                            <div className="flex-1 space-y-4">
                                <div className="space-y-2">
                                    <span className="text-[10px] font-black uppercase tracking-[0.2em] text-primary/60">Clinical Session</span>
                                    <h3 className="font-black text-xl uppercase tracking-tight text-foreground line-clamp-2 leading-[1.1] group-hover:text-primary transition-colors">
                                        {info.title || "Consultation_Null"}
                                    </h3>
                                </div>
                                <div className="flex items-center gap-3 py-1 px-3 bg-muted/50 rounded-lg w-fit">
                                    <Clock className="h-3 w-3 text-muted-foreground" />
                                    <span className="text-[10px] font-bold text-muted-foreground uppercase">{info.lastMessageAt ? new Date(info.lastMessageAt).toLocaleDateString() : "Just Now"}</span>
                                </div>
                            </div>
                            
                            <div className="mt-10 pt-6 border-t border-dashed flex items-center justify-between">
                                <div className="flex -space-x-2">
                                    {[1, 2].map((i) => (
                                        <div key={i} className="h-7 w-7 rounded-lg border-2 border-background bg-muted flex items-center justify-center overflow-hidden">
                                            <div className="h-full w-full bg-primary/5 flex items-center justify-center">
                                                <User className="h-3 w-3 text-muted-foreground" />
                                            </div>
                                        </div>
                                    ))}
                                    <div className="h-7 w-7 rounded-lg border-2 border-background bg-primary flex items-center justify-center font-black text-[8px] text-white">+{info.messages?.length || 0}</div>
                                </div>
                                <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-primary opacity-0 group-hover:opacity-100 transform translate-x-4 group-hover:translate-x-0 transition-all duration-500">
                                    Sync Node <ArrowRight className="h-3 w-3" />
                                </div>
                            </div>
                            </div>
                        </Card>
                        </motion.div>
                    ))
                    ) : (
                    <div className="col-span-full flex flex-col items-center justify-center py-32 bg-background/50 rounded-[3rem] border-4 border-dashed border-muted">
                        <div className="h-24 w-24 rounded-[2.5rem] bg-muted/50 flex items-center justify-center mb-8">
                            <MessageSquare className="h-10 w-10 text-muted-foreground opacity-20" />
                        </div>
                        <p className="font-black text-muted-foreground uppercase tracking-[0.3em] text-sm">Clinical Archive Empty</p>
                        <Button variant="link" className="mt-4 font-bold uppercase tracking-widest text-[10px] text-primary" onClick={() => router.push('/dashboard')}>Initialize New Consultation</Button>
                    </div>
                    )}
                </div>
              </div>
            </ScrollArea>
          </SidebarInset>
        </div>
      </div>
    </SidebarProvider>
  );
}
