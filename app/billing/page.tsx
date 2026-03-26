"use client";

import { useEffect, useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/app-sidebar";
import {
  AlertCircle,
  Bell,
  CreditCard,
  Download,
  Edit2,
  Globe,
  HelpCircle,
  Package,
  Plus,
  Receipt,
  Settings,
  Shield,
  Wallet,
  ChevronRight,
  CheckCircle2,
  Calendar,
  Clock,
  ArrowUpRight,
  History,
  PieChart,
  Zap,
  CreditCard as CreditCardIcon,
  Star,
  Sparkles,
  LifeBuoy,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/redux/store";
import { getAuth } from "firebase/auth";
import { getPayData, getSubData, postIssue } from "@/services/api";
import Link from "next/link";
import { useToast } from "@/hooks/use-toast";
import { Textarea } from "@/components/ui/textarea";

export default function BillingPage() {
  const [usageProgress] = useState(65);

  // Mock billing data - replace with real data in production
  const billing = {
    currentPlan: {
      name: "Professional",
      price: "$49.99",
      interval: "month",
      status: "Active",
      nextBilling: "May 1, 2024",
      features: [
        "Unlimited AI consultations",
        "Priority support",
        "Advanced analytics",
        "Custom templates",
        "Dedicated account manager",
        "API access",
      ],
    },
    usage: {
      current: 650,
      limit: 1000,
      percentage: 65,
    },
    invoices: [
      {
        id: "INV-2024-001",
        date: "April 1, 2024",
        amount: "$49.99",
        status: "Paid",
        items: [{ name: "Professional Plan", price: "$49.99" }],
      },
      {
        id: "INV-2024-002",
        date: "March 1, 2024",
        amount: "$49.99",
        status: "Paid",
        items: [{ name: "Professional Plan", price: "$49.99" }],
      },
      {
        id: "INV-2024-003",
        date: "February 1, 2024",
        amount: "$49.99",
        status: "Paid",
        items: [{ name: "Professional Plan", price: "$49.99" }],
      },
    ],
  };

  const getStatusColor = (status: string) => {
    return status === "PAID"
      ? "bg-green-500/10 text-green-500"
      : "bg-yellow-500/10 text-yellow-500";
  };

  const dispatch = useDispatch();
  const auth = getAuth();
  const firebaseUser = auth.currentUser;

  const users = useSelector((state: RootState) => state.user.user);

  const subscription = useSelector((state: RootState) => state.subData.subData);
  const paydata =
    useSelector((state: RootState) => state.payData.payment) || [];
  const isLoading = useSelector((state: RootState) => state.subData.isLoading);
  const error = useSelector((state: RootState) => state.subData.error);

  const [load, setLoad] = useState(false)

  //   if (!firebaseUser) {
  //     console.error("❌ User is not authenticated.");
  //     return;
  //   }

  useEffect(() => {
    const fetchData = async () => {
      try {
        await dispatch(getSubData()); // Fetch subscription data
        await dispatch(getPayData());
      } catch (err) {
        // console.error("❌ Error fetching Firebase token:", err);
      }
    };

    fetchData();
  }, [dispatch]);

  // useEffect(() => {
  //   setLoad(
  //     subscription !== null &&
  //       typeof subscription === "object" &&
  //       paydata !== null &&
  //       Array.isArray(paydata) &&
  //       paydata.length > 0
  //   );
  // }, [subscription, paydata]);

  useEffect(() => {
    setLoad(
      subscription !== null &&
        typeof subscription === "object" &&
        paydata !== null &&
        Array.isArray(paydata)
    );
  }, [subscription, paydata]);

  const startDate = new Date(subscription?.start_date);

  const formattedStartDate = startDate.toLocaleDateString("en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  const endDate = new Date(subscription?.end_date);

  const formattedEndDate = endDate.toLocaleDateString("en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const [open, setOpen] = useState(false);
  const [title, setTitle] = useState("");
  const [message, setMessage] = useState("");
  const [dialogType, setDialogType] = useState("support"); // "support" or "issue"

  const handleOpen = (type: "support" | "issue") => {
    setDialogType(type);
    setOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!title.trim() || !message.trim()) {
      toast({ title: "Title and message are required." });
      return; // 👈 stop if validation fails
    }

    setLoading(true);

    try {
      await dispatch(postIssue(title, message));
      toast({ title: "Issue reported" });

      setOpen(false);
      setTitle("");
      setMessage("");
    } catch (err) {
      toast({ title: "Failed to report issue" });
      // console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <SidebarProvider className="h-screen overflow-hidden">
      <AppSidebar />
      <div className="flex w-full h-screen">
        <div className="w-full flex flex-col">
          <SidebarInset className="h-full flex flex-col">
            {/* Header */}
            <header className="flex h-16 shrink-0 items-center border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
              <div className="flex items-center gap-2 px-4 w-full">
                <SidebarTrigger className="-ml-1" />
                <Separator orientation="vertical" className="mr-2 h-4" />
                <Breadcrumb>
                  <BreadcrumbList>
                    <BreadcrumbItem className="hidden md:block">
                      <BreadcrumbLink href="#">
                        Medical AI Assistant
                      </BreadcrumbLink>
                    </BreadcrumbItem>
                    <BreadcrumbSeparator className="hidden md:block" />
                    <BreadcrumbItem>
                      <BreadcrumbPage>Billing & Subscription</BreadcrumbPage>
                    </BreadcrumbItem>
                  </BreadcrumbList>
                </Breadcrumb>
              </div>
            </header>

            {/* Main Content */}
            <div className="flex-1 overflow-auto">
              <div className="mx-auto max-w-7xl px-4 py-6 sm:py-8">
                {/* Current Plan Overview */}
                <Card
                  className={cn(
                    "mb-6 sm:mb-8 transition-all hover:shadow-lg overflow-hidden",
                    "bg-gradient-to-br from-purple-50 to-blue-50 dark:from-purple-900/20 dark:to-blue-900/20"
                  )}
                >
                  <CardHeader className="sm:pb-4">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-0">
                      <div className="flex items-center gap-3">
                        <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                          <Package className="h-6 w-6 text-primary" />
                        </div>
                        <div>
                          <CardTitle>
                            {load ? `${subscription?.name} plan` : "Loading"}
                          </CardTitle>
                          <CardDescription className="mt-1">
                            Your current subscription
                          </CardDescription>
                        </div>
                      </div>
                      <Badge variant="secondary" className="px-3 py-1 w-fit">
                        {/* {subscription?.is_active ? "Active" : "Not active"} */}
                        {load
                          ? `${
                              subscription?.is_active ? "Active" : "Not active"
                            }`
                          : "Loading"}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6 mb-6">
                      <div className="p-4 rounded-lg bg-background/50">
                        <div className="flex items-center gap-2 mb-2">
                          <CreditCard className="h-4 w-4 text-muted-foreground" />
                          <p className="text-sm text-muted-foreground">
                            Monthly Payment
                          </p>
                        </div>
                        <p className="text-xl sm:text-2xl font-semibold">
                          {/* ${subscription?.amount} */}
                          {load ? `₹${subscription?.amount}` : "Loading"}
                          <span className="text-sm text-muted-foreground ml-1">
                            {/* /{billing.currentPlan.interval} */}
                            {load ? `/month` : ""}
                          </span>
                        </p>
                      </div>
                      <div className="p-4 rounded-lg bg-background/50">
                        <div className="flex items-center gap-2 mb-2">
                          <Calendar className="h-4 w-4 text-muted-foreground" />
                          <p className="text-sm text-muted-foreground">
                            Next Billing
                          </p>
                        </div>
                        <p className="text-xl sm:text-2xl font-semibold">
                          {/* {formattedEndDate} */}
                          {load ? `${formattedEndDate}` : "Loading"}
                        </p>
                      </div>
                    </div>
                    <div className="space-y-5">
                      <div className="flex justify-end mt-1">
                        <Button size="sm" className="gap-2 w-full sm:w-auto">
                          View plans
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Main Content Tabs */}
                <Tabs defaultValue="invoices" className="space-y-6">
                  <TabsList className="bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 sticky top-0 z-10 w-full justify-start">
                    <TabsTrigger value="invoices" className="">
                      Billing History
                    </TabsTrigger>
                  </TabsList>

                  {/* Invoices Tab */}
                  <TabsContent value="invoices">
                    <Card>
                      <CardHeader>
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-0">
                          <div>
                            <CardTitle>Billing History</CardTitle>
                            <CardDescription className="mt-2">
                              View and download your past invoices
                            </CardDescription>
                          </div>
                        </div>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-4">
                          {load ? (
                            paydata.length > 0 ? (
                              paydata.map((invoice) => {
                                const downloadUrl = `${invoice.invoice_url}?download=1`;
                                return (
                                  <div
                                    key={invoice.id}
                                    className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-4 rounded-lg bg-muted/50 hover:bg-muted/70 transition-colors gap-3 sm:gap-0"
                                  >
                                    <div className="flex items-center gap-4">
                                      <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                                        <Receipt className="h-5 w-5 text-primary" />
                                      </div>
                                      <div>
                                        <p className="font-medium">
                                          {invoice.subscription}
                                        </p>
                                        <p className="text-sm text-muted-foreground">
                                          {formattedStartDate}
                                        </p>
                                      </div>
                                    </div>

                                    <div className="flex items-center justify-between w-full sm:w-auto gap-2 sm:ml-14">
                                      <div className="text-left">
                                        <p className="font-medium">
                                          ₹{invoice.amount} / month
                                        </p>
                                        <Badge
                                          variant="secondary"
                                          className={cn(
                                            "px-2 py-0.5",
                                            getStatusColor(invoice.status)
                                          )}
                                        >
                                          {invoice.status}
                                        </Badge>
                                      </div>
                                      {invoice.invoice_url && (
                                        <a href={downloadUrl} download>
                                          <Button
                                            variant="ghost"
                                            size="icon"
                                            className="hover:bg-primary/10"
                                          >
                                            <Download className="h-5 w-5" />
                                          </Button>
                                        </a>
                                      )}
                                    </div>
                                  </div>
                                );
                              })
                            ) : (
                              <p className="text-center text-muted-foreground">
                                No payment history found.
                              </p>
                            )
                          ) : (
                            <p className="text-center text-muted-foreground">
                              Loading...
                            </p>
                          )}

                          {/* {paydata.length > 0 ? (
                            paydata.map((invoice) => {
                              const downloadUrl = `${invoice.invoice_url}?download=1`;
                              return (
                                <div
                                  key={invoice.id}
                                  className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-4 rounded-lg bg-muted/50 hover:bg-muted/70 transition-colors gap-3 sm:gap-0"
                                >
                                  <div className="flex items-center gap-4">
                                    <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                                      <Receipt className="h-5 w-5 text-primary" />
                                    </div>
                                    <div>
                                      <p className="font-medium">
                                        {invoice.subscription}
                                      </p>
                                      <p className="text-sm text-muted-foreground">
                                        {formattedStartDate}
                                      </p>
                                    </div>
                                  </div>

                                  <div className="flex items-center justify-between w-full sm:w-auto gap-2 sm:ml-14">
                                    <div className="text-left">
                                      <p className="font-medium">
                                        ${invoice.amount} / month
                                      </p>
                                      <Badge
                                        variant="secondary"
                                        className={cn(
                                          "px-2 py-0.5",
                                          getStatusColor(invoice.status)
                                        )}
                                      >
                                        {invoice.status}
                                      </Badge>
                                    </div>
                                    {invoice.invoice_url && (
                                      <a href={downloadUrl} download>
                                        <Button
                                          variant="ghost"
                                          size="icon"
                                          className="hover:bg-primary/10"
                                        >
                                          <Download className="h-5 w-5" />
                                        </Button>
                                      </a>
                                    )}
                                  </div>
                                </div>
                              );
                            })
                          ) : (
                            <p className="text-center text-muted-foreground">
                              No payment history found.
                            </p>
                          )} */}
                        </div>
                      </CardContent>
                    </Card>
                  </TabsContent>
                </Tabs>

                {/* Support Section */}
                <div className="mt-6 sm:mt-8 text-center space-y-6 bg-card rounded-xl p-4 sm:p-8 shadow-sm">
                  <div className="flex items-center justify-center gap-2 text-muted-foreground">
                    <HelpCircle className="h-5 sm:h-6 w-5 sm:w-6" />
                    <span className="text-base sm:text-lg">
                      Need help with your account?
                    </span>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                    <Button
                      variant="outline"
                      className="gap-2"
                      onClick={() => handleOpen("support")}
                    >
                      <LifeBuoy className="h-4 w-4" />
                      Contact Support
                    </Button>
                    <Button
                      variant="outline"
                      className="gap-2"
                      onClick={() => handleOpen("issue")}
                    >
                      <AlertCircle className="h-4 w-4" />
                      Report an Issue
                    </Button>
                  </div>
                  <p className="text-xs sm:text-sm text-muted-foreground">
                    Our support team is available 24/7 to help you with any
                    questions or concerns.
                  </p>
                </div>

                <Dialog open={open} onOpenChange={setOpen}>
                  <DialogContent className="sm:max-w-md max-w-[90vw] w-full">
                    <DialogHeader>
                      <DialogTitle>
                        {dialogType === "support"
                          ? "Contact Support"
                          : "Report an Issue"}
                      </DialogTitle>
                    </DialogHeader>

                    <div className="grid gap-4 py-4">
                      <div className="grid gap-2">
                        <Input
                          placeholder="Title"
                          value={title}
                          required
                          onChange={(e) => setTitle(e.target.value)}
                        />
                        <Textarea
                          className="min-h-[100px]"
                          required
                          placeholder={
                            dialogType === "support"
                              ? "Contact Support"
                              : "Report an Issue"
                          }
                          rows={4}
                          value={message}
                          onChange={(e) => setMessage(e.target.value)}
                        />
                      </div>

                      {/* Support Contact Section */}
                      <div className="text-xs sm:text-sm mt-4 p-3 sm:p-4 rounded-md bg-muted/50">
                        <p>
                          <span className="font-semibold">Support Email:</span>{" "}
                          mail2reportrx@gmail.com
                        </p>
                        <p>
                          <span className="font-semibold">Phone:</span>+
                          91-9320402128 / +91-9969223614
                        </p>
                      </div>
                    </div>

                    <DialogFooter>
                      <Button
                        variant="default"
                        onClick={handleSubmit}
                        disabled={loading}
                        className="w-full sm:w-auto"
                      >
                        {loading ? "Submitting..." : "Submit"}
                      </Button>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>
              </div>
            </div>
          </SidebarInset>
        </div>
      </div>
    </SidebarProvider>
  );
}
