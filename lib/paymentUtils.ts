import axios from "axios";
import { toast } from "sonner";

declare global {
  interface Window {
    Razorpay: any;
  }
}

interface PaymentOptions {
  userId: string;
  userName: string;
  userEmail: string;
  onSuccess?: () => void;
  onClose?: () => void;
  onLoadingChange?: (loading: boolean) => void;
  refreshUser?: () => Promise<void>;
}

// Load Razorpay script dynamically
export const loadRazorpayScript = (): Promise<void> => {
  return new Promise((resolve, reject) => {
    if (typeof window !== "undefined" && window.Razorpay) {
      resolve();
      return;
    }

    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.onload = () => {
      console.log("Razorpay script loaded");
      resolve();
    };
    script.onerror = () => {
      console.error("Failed to load Razorpay script");
      reject(new Error("Failed to load Razorpay script"));
    };
    document.body.appendChild(script);
  });
};

// Generate subscription ID
export const generateSubscriptionId = async (): Promise<string> => {
  try {
    const response = await axios.post("/api/create-subscription");
    console.log("Subscription response:", response.data);
    const subscriptionId = response.data.id;
    if (!subscriptionId) {
      throw new Error("No subscription ID received");
    }
    return subscriptionId;
  } catch (error) {
    console.error("Error generating subscription ID:", error);
    throw error;
  }
};

// Make payment with Razorpay
export const makePayment = async (
  subscriptionId: string,
  options: PaymentOptions
) => {
  console.log("Initializing payment for subscription:", subscriptionId);

  // Check if Razorpay is loaded
  if (typeof window.Razorpay === "undefined") {
    console.error("Razorpay script not loaded");
    toast.error("Payment system not ready. Please try again.");
    return;
  }

  const razorpayOptions = {
    key: process.env.NEXT_PUBLIC_RAZORPAY_LIVE_KEY!,
    subscription_id: subscriptionId,
    name: "NextGenAI App Subscription",
    description: "Subscription for NextGenAI App",
    image: "/nextgenhelper_ai_logo.png",
    handler: async (response: any) => {
      console.log("Payment successful:", response);
      console.log("Payment ID:", response.razorpay_payment_id);
      console.log("Subscription ID:", response.razorpay_subscription_id);

      try {
        // Process the successful payment
        const paymentResult = await axios.post("/api/payment-success", {
          paymentId: response.razorpay_payment_id,
          subscriptionId: response.razorpay_subscription_id,
          orderId: response.razorpay_subscription_id, // Using subscription ID as order ID
          userId: options.userId,
        });

        if (paymentResult.data.success) {
          console.log("Payment processed successfully:", paymentResult.data);
          // Show success message
          toast.success(
            `Payment successful! You now have ${paymentResult.data.credits.toLocaleString()} tokens and Pro access!`
          );

          // Call success callback if provided
          if (options.onSuccess) {
            options.onSuccess();
          }

          // Refresh user data if refreshUser function provided
          if (options.refreshUser) {
            await options.refreshUser();
          } else {
            // Fallback to page reload if no refresh function provided
            setTimeout(() => {
              window.location.reload();
            }, 1000);
          }
        }
      } catch (error) {
        console.error("Error processing payment:", error);
        toast.error(
          "Payment successful but there was an error updating your account. Please contact support."
        );
      }
    },
    prefill: {
      name: options.userName,
      email: options.userEmail,
    },
    notes: {
      userId: options.userId,
    },
    theme: {
      color: "#3b82f6",
    },
    modal: {
      ondismiss: function () {
        console.log("Payment modal dismissed");
      },
      onclose: function () {
        console.log("Payment modal closed");
        if (options.onClose) {
          options.onClose();
        }
      },
    },
  };

  try {
    const rzp = new window.Razorpay(razorpayOptions);
    rzp.open();
  } catch (error) {
    console.error("Error opening Razorpay checkout:", error);
    toast.error("Failed to open payment window. Please try again.");
  }
};

// Main function to initiate payment flow
export const initiatePayment = async (options: PaymentOptions) => {
  try {
    // Set loading state
    if (options.onLoadingChange) {
      options.onLoadingChange(true);
    }

    // Load Razorpay script if not loaded
    await loadRazorpayScript();

    // Generate subscription ID
    const subscriptionId = await generateSubscriptionId();

    // Make payment
    await makePayment(subscriptionId, options);
  } catch (error) {
    console.error("Error initiating payment:", error);
    toast.error("Failed to initialize payment. Please try again.");
  } finally {
    // Clear loading state
    if (options.onLoadingChange) {
      options.onLoadingChange(false);
    }
  }
};

// Cancel subscription
export const cancelSubscription = async (
  userId: string,
  subscriptionId: string,
  refreshUser?: () => Promise<void>
) => {
  try {
    const response = await axios.post("/api/cancel-subscription", {
      userId,
      subscriptionId,
    });

    if (response.data.success) {
      toast.success(response.data.message);
      // Refresh user data if function provided, otherwise reload page
      if (refreshUser) {
        await refreshUser();
      } else {
        setTimeout(() => {
          window.location.reload();
        }, 1000);
      }
      return true;
    } else {
      toast.error("Failed to cancel subscription");
      return false;
    }
  } catch (error: any) {
    console.error("Error cancelling subscription:", error);
    console.error("Error response:", error.response?.data);
    const errorMessage =
      error.response?.data?.error ||
      error.response?.data?.details ||
      "Failed to cancel subscription. Please try again.";
    toast.error(errorMessage);
    return false;
  }
};
