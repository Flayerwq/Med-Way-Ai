"use client";

import {
  Check,
  Sparkles,
  Zap,
  Building2,
  HelpCircle,
  LifeBuoy,
  AlertCircle,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { cn } from "@/lib/utils";
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/app-sidebar";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/redux/store";
import {
  createpayment,
  getSubscriptions,
  postIssue,
  postpayment,
} from "@/services/api";

import { useRazorpay, RazorpayOrderOptions } from "react-razorpay";

import { getAuth } from "firebase/auth";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useToast } from "@/hooks/use-toast";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogTitle,
} from "@/components/ui/dialog";
import { AlertDialogHeader } from "@/components/ui/alert-dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

const tiers = [
  {
    name: "Basic",
    price: "$9.99",
    billing: "per month",
    description: "Perfect for individuals getting started",
    icon: Zap,
    features: [
      "24/7 AI Medical Assistant",
      "Basic Health Tracking",
      "Symptom Checker",
      "Email Support",
      "1 User Account",
      "HIPAA Compliant Storage",
    ],
    highlighted: false,
    cta: "Get started",
    badge: "Daily usage",
  },
  {
    name: "Pro",
    price: "$19.99",
    billing: "per month",
    description: "Ideal for healthcare professionals",
    icon: Sparkles,
    features: [
      "Everything in Basic, plus:",
      "Priority Response Time",
      "Advanced Health Analytics",
      "Custom Medical Reports",
      "Up to 3 User Accounts",
      "24/7 Priority Support",
      "Customizable Templates",
    ],
    highlighted: true,
    cta: "Get Started",
    badge: "Most Popular",
  },
  {
    name: "Premium",
    price: "$49.99",
    billing: "per month",
    description: "For large medical practices",
    icon: Building2,
    features: [
      "Everything in Professional, plus:",
      "Custom AI Model Training",
      "API Access",
      "Dedicated Account Manager",
      "Unlimited User Accounts",
      "Custom Integration Support",
      "SLA Guarantee",
      "Advanced Analytics Dashboard",
    ],
    highlighted: false,
    cta: "Get started",
    badge: "For doctors",
  },
];

export default function Home() {
  const user = useSelector((state: RootState) => state.user.user);
  const dispatch = useDispatch();
  const { error, isLoading, Razorpay } = useRazorpay();

  const subData = useSelector(
    (state: RootState) => state.subscriptions.subscriptionPlans
  ); // Access subscription data from Redux store

  useEffect(() => {
    dispatch(getSubscriptions()); // Dispatch the action to fetch data
  }, [dispatch]);

  // console.log(subData, "this is subdata");

  const getMockFeatures = (name) => {
    switch (name) {
      case "Pro":
        return [
          "Everything in Basic, plus:",
          "Priority Response Time",
          "Advanced Health Analytics",
          "Custom Medical Reports",
          "Up to 3 User Accounts",
          "24/7 Priority Support",
        ];
      case "Premium":
        return [
          "Everything in Professional, plus:",
          "Custom AI Model Training",
          "API Access",
          "Dedicated Account Manager",
          "Unlimited User Accounts",
          "Custom Integration Support",
        ];
      case "Basic":
      default:
        return [
          "24/7 AI Medical Assistant",
          "Basic Health Tracking",
          "Symptom Checker",
          "Email Support",
        ];
    }
  };

  const transformSubscriptions = (subscriptions) => {
    return subscriptions
      .filter((sub) => sub.name !== "Free") // Exclude the "Free" plan
      .map((sub) => ({
        id: sub.id,
        name: sub.name,
        price: `₹${sub.amount}`,
        billing: "per month", // You can add billing duration if available
        description: getDescription(sub.name),
        icon: getIcon(sub.name), // You'll need to add logic to get the icon for each plan
        features: [
          `${sub.queries} Queries per month`,
          `${sub.images} Images per month`,
          ...getMockFeatures(sub.name),
          // You can add more features if needed
        ],
        highlighted: sub.name === "Basic", // Highlight Basic plan
        cta: "Get started",
        badge: sub.name === "Basic" ? "Most Popular" : "Daily usage", // Badge for Pro plan
      }))
      .sort((a, b) => {
        // Sort so that 'Basic' comes first, followed by 'Pro' and 'Premium'
        const order = ["Basic", "Pro", "Premium"];
        return order.indexOf(a.name) - order.indexOf(b.name);
      });
  };

  // Helper functions to get description and icon based on the plan name
  const getDescription = (name) => {
    switch (name) {
      case "Pro":
        return "Ideal for healthcare professionals";
      case "Premium":
        return "For large medical practices";
      case "Basic":
      default:
        return "Perfect for individuals getting started";
    }
  };

  const getIcon = (name) => {
    switch (name) {
      case "Pro":
        return Sparkles; // You can replace with the actual icon component
      case "Premium":
        return Building2;
      case "Basic":
      default:
        return Zap;
    }
  };

  // Use this transformed data in your component
  const transformedTiers = transformSubscriptions(subData);

  

  const buttonClick = async (tierName: string) => {
    // console.log("Button clicked for tier:", tierName);

    const auth = getAuth();
    const firebaseUser = auth.currentUser;

    if (!firebaseUser) {
      // console.error("❌ User is not authenticated.");
      return;
    }

    try {
      const newJwtToken = await firebaseUser.getIdToken(true); // ✅ Get new token

      if (!newJwtToken) {
        // console.error("❌ Failed to refresh Firebase token.");
        return;
      }

      const response = await dispatch(createpayment({ sub_name: tierName }));
      const data = response.data;

      // console.log(data, "hehe the data");

      if (!data || !data.amount || !data.order_id) {
        // console.error("❌ Failed to get order details.");
        return;
      }

      const options = {
        key: "rzp_live_qqz0LOttIwwvbP",
        amount: data.amount, // ✅ Ensure this comes from the backend
        currency: "INR",
        name: "Test Company",
        description: "Test Transaction",
        order_id: data.order_id,
        handler: async (paymentResponse: any) => {
          // console.log("✅ Payment successful:", paymentResponse);
          await donePayment(paymentResponse, tierName); // ✅ Pass tierName explicitly
        },
        prefill: {
          name: user?.full_name || "John Doe",
          email: user?.email || "johndoe@example.com",
          contact: "9999999999",
        },
        theme: { color: "#F37254" },
      } as any;

      const RazorpayInstance = new Razorpay(options);
      RazorpayInstance.open();
    } catch (err) {
      // console.error("❌ Error refreshing token:", err);
    }
  };

  const router = useRouter();

  const donePayment = async (paymentData: any, tierName: string) => {
    try {
      const auth = getAuth();
      const firebaseUser = auth.currentUser;

      if (!firebaseUser) {
        // console.error("❌ User is not authenticated.");
        return;
      }

      const newSJwtToken = await firebaseUser.getIdToken(true); // ✅ Get new token

      if (!newSJwtToken) {
        // console.error("❌ Failed to refresh Firebase token.");
        return;
      }

      // if (!jwtToken) {
      //   console.error("❌ JWT token is missing.");
      //   return;
      // }

      const formData = {
        razorpay_payment_id: paymentData.razorpay_payment_id,
        razorpay_order_id: paymentData.razorpay_order_id,
        razorpay_signature: paymentData.razorpay_signature,
        sub_name: tierName, // ✅ Ensure this is passed correctly
      };

      // console.log("✅ Sending payment details to backend:", formData);

      await dispatch(postpayment(formData));

      router.push("/dashboard"); // ✅ Redirect after successful payment
    } catch (error) {
      // console.error("❌ Error in payment:", error);
    }
  };

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
            <header className="flex h-16 shrink-0 items-center border-b bg-background">
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
                      <BreadcrumbPage>Pricing Plans</BreadcrumbPage>
                    </BreadcrumbItem>
                  </BreadcrumbList>
                </Breadcrumb>
              </div>
            </header>

            <div className="flex-1 overflow-auto">
              <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
                <div className="text-center space-y-4 mb-8 sm:mb-12">
                  <Badge
                    variant="secondary"
                    className="px-3 py-1 sm:px-4 sm:py-2 mb-4"
                  >
                    Pricing Plans
                  </Badge>
                  <h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-foreground">
                    Choose Your Perfect Plan
                  </h1>
                  <p className="text-base sm:text-lg text-muted-foreground max-w-2xl mx-auto px-4 sm:px-0">
                    All plans include our core AI features with HIPAA compliance
                    and world-class security.
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 px-2 sm:px-0">
                  {transformedTiers.map((tier) => (
                    <Card
                      key={tier.id}
                      className={cn(
                        "relative flex flex-col mb-5",
                        tier.highlighted &&
                          "border-primary shadow-xl lg:scale-[1.02] bg-primary/[0.03]",
                        !tier.highlighted && "bg-card border-border/40"
                      )}
                    >
                      <div className="absolute -top-3 left-4 sm:left-6">
                        <Badge
                          variant={tier.highlighted ? "default" : "secondary"}
                          className="px-2 py-0.5 sm:px-3 sm:py-1 text-xs sm:text-sm font-medium"
                        >
                          {tier.badge}
                        </Badge>
                      </div>

                      <CardHeader className="pb-6 sm:pb-8 pt-4 sm:pt-6">
                        <div className="flex items-center gap-2 sm:gap-3 mb-2">
                          <tier.icon
                            className={cn(
                              "h-5 w-5 sm:h-6 sm:w-6",
                              tier.highlighted
                                ? "text-primary"
                                : "text-muted-foreground"
                            )}
                          />
                          <CardTitle className="text-xl sm:text-2xl font-bold">
                            {tier.name}
                          </CardTitle>
                        </div>
                        <CardDescription className="text-sm">
                          {tier.description}
                        </CardDescription>
                      </CardHeader>

                      <CardContent className="flex-1">
                        <div className="flex items-baseline mb-6 sm:mb-8">
                          <span className="text-4xl sm:text-5xl font-bold tracking-tight">
                            {tier.price}
                          </span>
                          <span className="ml-2 text-sm sm:text-base text-muted-foreground">
                            {tier.billing}
                          </span>
                        </div>

                        <ul className="space-y-3 sm:space-y-4 text-sm">
                          {tier.features.map((feature, index) => (
                            <li
                              key={index}
                              className="flex items-start gap-2 sm:gap-3"
                            >
                              <Check
                                className={cn(
                                  "h-4 w-4 sm:h-5 sm:w-5 shrink-0 mt-0.5",
                                  tier.highlighted
                                    ? "text-primary"
                                    : "text-muted-foreground"
                                )}
                              />
                              <span
                                className={cn(index === 0 && "font-medium")}
                              >
                                {feature}
                              </span>
                            </li>
                          ))}
                        </ul>
                      </CardContent>

                      <CardFooter className="pt-6 sm:pt-8">
                        <Button
                          className={cn(
                            "w-full text-sm font-medium shadow-sm",
                            tier.highlighted
                              ? "bg-primary hover:bg-primary/90"
                              : "bg-primary hover:bg-primary/90"
                          )}
                          size="lg"
                          onClick={() => buttonClick(tier.name)}
                        >
                          {tier.cta}
                        </Button>
                      </CardFooter>
                    </Card>
                  ))}
                </div>

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
                    <AlertDialogHeader>
                      <DialogTitle>
                        {dialogType === "support"
                          ? "Contact Support"
                          : "Report an Issue"}
                      </DialogTitle>
                    </AlertDialogHeader>

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
                          support@example.com
                        </p>
                        <p>
                          <span className="font-semibold">Phone:</span> +1 234
                          567 890
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
