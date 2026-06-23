"use client";

import React, { useEffect, useState, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Link from "next/link";
import { FiCheckCircle, FiAlertCircle, FiShoppingBag, FiArrowRight } from "react-icons/fi";
import { authClient } from "@/lib/auth-client";

function CheckoutSuccessContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const sessionId = searchParams.get("session_id");
  const { data: session, isPending, refetch } = authClient.useSession();

  const [status, setStatus] = useState("verifying"); // verifying, success, error
  const [transaction, setTransaction] = useState(null);
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    if (isPending) return;

    if (!session) {
      router.push("/signin");
      return;
    }

    if (!sessionId) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setStatus("error");
      setErrorMessage("No checkout session found. Please return to the gallery.");
      return;
    }

    const verifyCheckout = async () => {
      try {
        const res = await fetch(`${""}/api/checkout-success?session_id=${sessionId}`, {
          credentials: "include"
        });
        
        const data = await res.json();
        
        if (!res.ok) {
          throw new Error(data.msg || "Payment verification failed");
        }

        // Force BetterAuth to fetch and broadcast the updated user object
        await refetch();

        setTransaction(data.transaction);
        setStatus("success");
      } catch (error) {
        console.error("Verification error:", error);
        setStatus("error");
        setErrorMessage(error.message);
      }
    };

    verifyCheckout();
  }, [sessionId, session, isPending, router, refetch]);

  if (isPending || status === "verifying") {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center px-4">
        <div className="w-16 h-16 border-4 border-[#e8ddd1] border-t-[#b07c5b] rounded-full animate-spin mb-6"></div>
        <h1 className="text-2xl font-serif font-bold text-[#3d3029] mb-2">Verifying Payment...</h1>
        <p className="text-[#7a6e64]">Please wait while we confirm your transaction securely.</p>
      </div>
    );
  }

  if (status === "error") {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center px-4 text-center max-w-lg mx-auto">
        <div className="w-20 h-20 bg-red-50 text-red-500 rounded-full flex items-center justify-center mb-6 shadow-sm border border-red-100">
          <FiAlertCircle size={40} />
        </div>
        <h1 className="text-3xl font-serif font-bold text-[#3d3029] mb-4">Payment Verification Failed</h1>
        <p className="text-[#7a6e64] mb-8 leading-relaxed">
          {errorMessage || "We couldn't verify your payment. If you were charged, please contact support."}
        </p>
        <Link 
          href="/artworks" 
          className="px-8 py-3 bg-[#3d3029] text-white rounded-lg font-medium hover:bg-[#2d2522] transition-colors shadow-md"
        >
          Return to Gallery
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-[70vh] flex flex-col items-center justify-center px-4 py-12">
      <div className="max-w-2xl w-full bg-white rounded-2xl shadow-xl border border-[#e8ddd1] overflow-hidden text-center">
        
        {/* Success Header */}
        <div className="bg-linear-to-b from-[#faf5ef] to-white dark:from-[#292524] dark:to-[#1c1917] pt-12 pb-8 px-6">
          <div className="w-24 h-24 bg-green-50 text-green-500 dark:bg-green-950/30 dark:text-green-400 rounded-full flex items-center justify-center mx-auto mb-6 shadow-sm border border-green-100 dark:border-green-900/50 transition-hover:scale-105 duration-500">
            <FiCheckCircle size={48} />
          </div>
          <h1 className="text-4xl font-serif font-bold text-[#3d3029] mb-3">Order Confirmed!</h1>
          <p className="text-[#7a6e64] text-lg">Thank you for your purchase, {session?.user?.name || "Valued User"}.</p>
        </div>

        {/* Transaction Details */}
        <div className="px-8 py-8 text-left border-t border-[#e8ddd1]">
          <h3 className="font-bold text-[#3d3029] text-lg mb-6 flex items-center gap-2">
            <FiShoppingBag /> Order Summary
          </h3>
          
          <div className="bg-[#faf8f5] rounded-xl p-6 space-y-4 border border-[#e8ddd1]">
            <div className="flex justify-between items-center pb-4 border-b border-[#e8ddd1]">
              <span className="text-[#7a6e64]">Transaction ID</span>
              <span className="font-mono text-sm font-medium text-[#3d3029]">{transaction?.stripeSessionId?.slice(0, 14)}...</span>
            </div>
            <div className="flex justify-between items-center pb-4 border-b border-[#e8ddd1]">
              <span className="text-[#7a6e64]">Date</span>
              <span className="font-medium text-[#3d3029]">
                {transaction ? new Date(transaction.createdAt).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' }) : '-'}
              </span>
            </div>
            <div className="flex justify-between items-center pt-2">
              <span className="font-bold text-[#3d3029] text-lg">Total Amount</span>
              <span className="font-bold text-[#b07c5b] text-2xl">${transaction?.amount?.toLocaleString()}</span>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="px-8 pb-10 flex flex-col sm:flex-row justify-center gap-4">
          <Link 
            href="/dashboard/user" 
            className="flex-1 py-4 border-2 border-[#b07c5b] text-[#b07c5b] hover:bg-[#faf5ef] rounded-xl font-medium transition-colors flex items-center justify-center gap-2"
          >
            View Purchase History
          </Link>
          <Link 
            href="/artworks" 
            className="flex-1 py-4 bg-[#b07c5b] hover:bg-[#9e6c4d] text-white rounded-xl font-medium transition-colors shadow-md flex items-center justify-center gap-2"
          >
            Continue Exploring <FiArrowRight />
          </Link>
        </div>

      </div>
    </div>
  );
}

export default function CheckoutSuccessPage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center text-[#7a6e64]">Loading...</div>}>
      <CheckoutSuccessContent />
    </Suspense>
  );
}
