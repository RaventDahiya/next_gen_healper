import React, { useContext, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { AuthContext } from "@/contex/AuthContext";
import { useTokenContext } from "@/contex/TokenContext";
import Image from "next/image";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { Crown, Zap, Loader2Icon, X } from "lucide-react";
import { initiatePayment, cancelSubscription } from "@/lib/paymentUtils";
import { toast } from "sonner";
import { useConvex } from "convex/react";
import { api } from "@/convex/_generated/api";
function Profile({ openDialog, onClose }: any) {
  const { user, refreshUser } = useContext(AuthContext);
  const { userCredits, maxCredits, getUsagePercentage, isLoading } =
    useTokenContext();
  const [loading, setLoading] = React.useState(false);
  const [cancelLoading, setCancelLoading] = React.useState(false);
  const [fullUserData, setFullUserData] = React.useState<any>(null);
  const convex = useConvex();

  // Fetch full user data including subscriptionId
  useEffect(() => {
    const fetchUserData = async () => {
      if (!user?._id) return;

      try {
        const userData = await convex.query(api.users.GetUserById, {
          userId: user._id,
        });
        setFullUserData(userData);
      } catch (error) {
        console.error("Error fetching full user data:", error);
      }
    };

    if (openDialog) {
      fetchUserData();
    }
  }, [user?._id, openDialog, convex]);

  return (
    <Dialog open={openDialog} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl p-0 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700">
        <DialogHeader className="p-6 pb-4">
          <DialogTitle className="text-xl font-bold text-gray-900 dark:text-gray-100">
            Profile Settings
          </DialogTitle>
        </DialogHeader>
        <DialogDescription asChild>
          <div className="px-6 pb-6">
            {/* User Info Section */}
            <div className="flex items-center gap-4 mb-6">
              {user?.picture ? (
                <Image
                  src={user.picture}
                  alt="Profile Picture"
                  width={80}
                  height={80}
                  className="rounded-full w-20 h-20 object-cover border-2 border-gray-200 dark:border-gray-600"
                />
              ) : (
                <div className="rounded-full w-20 h-20 bg-gradient-to-br from-blue-400 to-purple-500 flex items-center justify-center border-2 border-gray-200 dark:border-gray-600">
                  <span className="text-white text-2xl font-bold">
                    {user?.name?.charAt(0).toUpperCase() || "?"}
                  </span>
                </div>
              )}
              <div className="flex-1">
                <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100">
                  {user?.name}
                </h2>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  {user?.email}
                </p>
                <div className="flex items-center gap-2 mt-1">
                  <span
                    className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${
                      user?.orderId
                        ? "bg-gradient-to-r from-yellow-400 to-orange-500 text-white"
                        : "bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300"
                    }`}
                  >
                    {user?.orderId ? (
                      <>
                        <Crown className="h-3 w-3" />
                        Pro Plan
                      </>
                    ) : (
                      "Free Plan"
                    )}
                  </span>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Token Usage Section */}
              <div className="space-y-4">
                <div className="bg-gray-50 dark:bg-gray-800 rounded-xl p-4 border border-gray-200 dark:border-gray-700">
                  <h3 className="font-semibold text-gray-900 dark:text-gray-100 mb-3 flex items-center gap-2">
                    <Zap className="h-4 w-4 text-blue-500" />
                    Token Usage
                  </h3>
                  <div className="space-y-3">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600 dark:text-gray-400">
                        Remaining
                      </span>
                      <span className="font-medium text-gray-900 dark:text-gray-100">
                        {isLoading
                          ? "Loading..."
                          : `${userCredits.toLocaleString()} / ${maxCredits.toLocaleString()}`}
                      </span>
                    </div>
                    <Progress
                      value={isLoading ? 0 : getUsagePercentage()}
                      className="h-2 bg-gray-200 dark:bg-gray-700"
                    />
                    <div className="flex justify-between text-xs">
                      <span className="text-gray-500 dark:text-gray-400">
                        Used:{" "}
                        {isLoading
                          ? "0"
                          : (maxCredits - userCredits).toLocaleString()}{" "}
                        tokens
                      </span>
                      <span className="text-gray-500 dark:text-gray-400">
                        {isLoading ? "0" : Math.round(getUsagePercentage())}%
                        used
                      </span>
                    </div>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      {user?.orderId
                        ? "Pro plan tokens reset monthly"
                        : "Free plan tokens reset monthly"}
                    </p>
                  </div>
                </div>
              </div>

              {/* Plan Information Section */}
              <div className="space-y-4">
                {!user?.orderId ? (
                  <div className="bg-gradient-to-br from-blue-50 to-purple-50 dark:from-gray-800 dark:to-gray-700 rounded-xl p-4 border border-blue-200 dark:border-gray-600">
                    <div className="flex items-center gap-2 mb-3">
                      <Crown className="h-5 w-5 text-yellow-500" />
                      <h3 className="font-bold text-lg text-gray-900 dark:text-gray-100">
                        Upgrade to Pro
                      </h3>
                    </div>

                    <div className="space-y-3">
                      <div className="bg-white dark:bg-gray-800 rounded-lg p-3 border border-gray-200 dark:border-gray-600">
                        <div className="flex items-center justify-between mb-2">
                          <span className="font-semibold text-gray-900 dark:text-gray-100">
                            Pro Plan
                          </span>
                          <span className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                            $20
                          </span>
                        </div>
                        <div className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                          500,000 tokens/month
                        </div>
                        <div className="text-xs text-blue-600 dark:text-blue-400 font-medium">
                          Annual billing: 20% discount
                        </div>
                      </div>

                      <Button
                        className="w-full bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white font-semibold py-2 px-4 rounded-lg shadow-lg hover:shadow-xl transition-all duration-200 cursor-pointer"
                        onClick={async () => {
                          if (!user?._id || !user?.name || !user?.email) {
                            console.error("User information missing");
                            return;
                          }

                          await initiatePayment({
                            userId: user._id,
                            userName: user.name,
                            userEmail: user.email,
                            onSuccess: () => {
                              onClose();
                            },
                            onClose: () => {
                              console.log("Payment modal closed");
                            },
                            onLoadingChange: (loadingState) => {
                              setLoading(loadingState);
                            },
                          });
                        }}
                        disabled={loading}
                      >
                        {loading ? (
                          <Loader2Icon className="animate-spin" />
                        ) : (
                          <Crown className="h-4 w-4 mr-2" />
                        )}
                        Upgrade ($20)
                      </Button>
                    </div>
                  </div>
                ) : (
                  <div className="bg-gradient-to-br from-yellow-50 to-orange-50 dark:from-gray-800 dark:to-gray-700 rounded-xl p-4 border border-yellow-200 dark:border-gray-600">
                    <div className="flex items-center gap-2 mb-3">
                      <Crown className="h-5 w-5 text-yellow-500" />
                      <h3 className="font-bold text-lg text-gray-900 dark:text-gray-100">
                        Pro Subscription
                      </h3>
                    </div>

                    <div className="space-y-3">
                      <div className="bg-white dark:bg-gray-800 rounded-lg p-3 border border-gray-200 dark:border-gray-600">
                        <div className="flex items-center justify-between mb-2">
                          <span className="font-semibold text-gray-900 dark:text-gray-100">
                            Active Pro Plan
                          </span>
                          <span className="text-green-600 dark:text-green-400 font-medium">
                            ✓ Subscribed
                          </span>
                        </div>
                        <div className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                          500,000 tokens/month
                        </div>
                        <div className="text-xs text-gray-500 dark:text-gray-400">
                          Subscription ID:{" "}
                          {fullUserData?.subscriptionId ||
                            fullUserData?.orderId ||
                            "N/A"}
                        </div>
                      </div>

                      <Button
                        variant="outline"
                        className="w-full border-red-200 text-red-600 hover:bg-red-50 hover:text-red-700 hover:border-red-300 dark:border-red-800 dark:text-red-400 dark:hover:bg-red-900/20 dark:hover:text-red-300"
                        onClick={async () => {
                          if (!user?._id) {
                            console.error("User ID missing");
                            return;
                          }

                          const subscriptionId =
                            fullUserData?.subscriptionId ||
                            fullUserData?.orderId;
                          if (!subscriptionId) {
                            toast.error("No subscription found to cancel");
                            return;
                          }

                          setCancelLoading(true);
                          const success = await cancelSubscription(
                            user._id,
                            subscriptionId,
                            refreshUser
                          );
                          setCancelLoading(false);

                          if (success) {
                            onClose();
                          }
                        }}
                        disabled={cancelLoading}
                      >
                        {cancelLoading ? (
                          <Loader2Icon className="animate-spin h-4 w-4 mr-2" />
                        ) : (
                          <X className="h-4 w-4 mr-2" />
                        )}
                        Cancel Subscription
                      </Button>
                      <p className="text-xs text-gray-500 dark:text-gray-400 text-center">
                        You'll continue to have Pro access until the end of your
                        billing cycle
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </DialogDescription>
      </DialogContent>
    </Dialog>
  );
}

export default Profile;
