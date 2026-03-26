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
import { Clock, Download, MessageSquare, Bot, ArrowLeft, Loader2 } from "lucide-react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { getChatSession } from "@/services/chatService";
import { auth } from "@/firebase";
import ReactMarkdown from "react-markdown";

export default function FolderDetail() {
  const params = useParams();
  const router = useRouter();
  const [session, setSession] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (auth.currentUser && params.uuid) {
      getChatSession(auth.currentUser.uid, params.uuid as string).then(data => {
        setSession(data);
        setLoading(false);
      });
    }
  }, [params.uuid]);

  const handleDownload = async (url: string) => {
    if (!url) return;
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "http://127.0.0.1:8000";
    const absoluteUrl = url.startsWith('http') ? url : `${baseUrl}${url.startsWith('/') ? '' : '/'}${url}`;
    
    try {
      const res = await fetch(absoluteUrl);
      const blob = await res.blob();
      const link = document.body.appendChild(document.createElement("a"));
      link.href = window.URL.createObjectURL(blob);
      link.download = `MedWay_Report.pdf`;
      link.click();
      link.remove();
    } catch {
      window.open(absoluteUrl, '_blank');
    }
  };

  if (loading) {
    return (
      <div className="h-screen w-full flex items-center justify-center bg-background">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!session) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-black uppercase tracking-tighter">Report Missing</h2>
          <p className="text-muted-foreground mt-2">The requested consultation could not be indexed.</p>
          <Button variant="outline" className="mt-6 font-bold uppercase text-xs" onClick={() => router.push('/folder')}>
            <ArrowLeft className="h-4 w-4 mr-2" /> Back to Archive
          </Button>
        </div>
      </div>
    );
  }

  return (
    <SidebarProvider className="h-screen overflow-hidden">
      <AppSidebar />
      <div className="flex w-full h-screen">
        <div className="w-full flex flex-col">
          <SidebarInset className="h-full flex flex-col">
            <header className="flex h-14 lg:h-16 shrink-0 items-center border-b bg-background px-4">
              <div className="flex items-center gap-2">
                <SidebarTrigger className="-ml-1" />
                <Separator orientation="vertical" className="mx-2 h-4" />
                <Breadcrumb>
                  <BreadcrumbList>
                    <BreadcrumbItem>
                      <BreadcrumbLink href="/folder">Archive</BreadcrumbLink>
                    </BreadcrumbItem>
                    <BreadcrumbSeparator />
                    <BreadcrumbItem>
                      <BreadcrumbPage>Consultation Report</BreadcrumbPage>
                    </BreadcrumbItem>
                  </BreadcrumbList>
                </Breadcrumb>
              </div>
            </header>

            <ScrollArea className="flex-1">
              <div className="container max-w-4xl mx-auto py-8 lg:py-12 px-6">
                <div className="mb-10">
                  <div className="flex items-center gap-3 text-muted-foreground mb-4">
                    <Clock className="h-4 w-4" />
                    <span className="text-xs font-black uppercase tracking-widest">
                      {session.lastMessageAt ? new Date(session.lastMessageAt).toLocaleString() : "Recently Indexed"}
                    </span>
                  </div>
                  <h1 className="text-3xl lg:text-4xl font-black text-foreground uppercase tracking-tighter leading-none">
                    {session.title || "Clinical consultation"}
                  </h1>
                </div>

                <div className="space-y-8">
                  {session.messages.map((msg: any, idx: number) => (
                    <Card key={idx} className={`p-6 lg:p-8 border-2 ${msg.role === 'user' ? 'bg-muted/30 border-dashed' : 'bg-background border-primary/20 shadow-lg shadow-primary/5'}`}>
                      <div className="flex items-start gap-4">
                        <div className={`h-10 w-10 rounded-xl flex items-center justify-center shrink-0 ${msg.role === 'user' ? 'bg-muted text-muted-foreground' : 'bg-primary text-white'}`}>
                          {msg.role === 'user' ? <MessageSquare className="h-5 w-5" /> : <Bot className="h-5 w-5" />}
                        </div>
                        <div className="flex-1 min-w-0">
                          <h2 className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground mb-4">
                            {msg.role === 'user' ? 'PATIENT_INPUT' : 'CLINICAL_ANALYSIS'}
                          </h2>
                          <div className={`prose prose-sm lg:prose-base max-w-none font-medium leading-relaxed ${msg.role === 'assistant' ? 'text-foreground' : 'text-muted-foreground'}`}>
                            <ReactMarkdown>{msg.content}</ReactMarkdown>
                          </div>
                        </div>
                      </div>
                    </Card>
                  ))}
                </div>

                {session.pdfUrl && (
                  <div className="mt-12 p-10 rounded-[2.5rem] bg-primary text-white text-center shadow-2xl shadow-primary/30">
                    <div className="h-16 w-16 bg-white/20 rounded-2xl flex items-center justify-center mx-auto mb-6">
                        <Download className="h-8 w-8" />
                    </div>
                    <h2 className="text-2xl font-black uppercase tracking-tighter mb-2">Formal Report Ready</h2>
                    <p className="text-primary-foreground/80 font-medium mb-8">The comprehensive clinical synthesis has been generated as a PDF.</p>
                    <Button
                      onClick={() => handleDownload(session.pdfUrl)}
                      className="bg-white text-primary hover:bg-white/90 font-black uppercase tracking-widest h-14 px-8 rounded-2xl"
                    >
                      Download Clinical PDF
                    </Button>
                  </div>
                )}
              </div>
            </ScrollArea>
          </SidebarInset>
        </div>
      </div>
    </SidebarProvider>
  );
}
