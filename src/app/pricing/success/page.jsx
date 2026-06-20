"use client";

import React, { useEffect, useState, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Link from "next/link";
import { FiCheckCircle, FiAlertCircle, FiArrowRight, FiStar } from "react-icons/fi";
import { authClient } from "@/lib/auth-client";

function PricingSuccessContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const sessionId = searchParams.get("session_id");
  const { data: session, isPending } = authClient.useSession();

  const [status, setStatus] = useState("verifying");
  const [tier, setTier] = useState(null);
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    if (isPending) return;

    if (!session) {
      router.push("/signin");
      return;
    }

    if (!sessionId) {
      setStatus("error");
      setErrorMessage("No subscription session found.");
      return;
    }

    const verifySubscription = async () => {
      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_SERVER_URL || "http://localhost:5000"}/api/subscription-success?session_id=${sessionId}`, {
          credentials: "include"
        });
        
        const data = await res.json();
        
        if (!res.ok) {
          throw new Error(data.msg || "Subscription verification failed");
        }

        setTier(data.tier);
        setStatus("success");
      } catch (error) {
        console.error("Verification error:", error);
        setStatus("error");
        setErrorMessage(error.message);
      }
    };

    verifySubscription();
  }, [sessionId, session, isPending, router]);

  if (isPending || status === "verifying") {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center px-4">
        <div className="w-16 h-16 border-4 border-[#e8ddd1] border-t-[#b07c5b] rounded-full animate-spin mb-6"></div>
        <h1 className="text-2xl font-serif font-bold text-[#3d3029] mb-2">Upgrading Account...</h1>
        <p className="text-[#7a6e64]">Please wait while we activate your new benefits.</p>
      </div>
    );
  }

  if (status === "error") {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center px-4 text-center max-w-lg mx-auto">
        <div className="w-20 h-20 bg-red-50 text-red-500 rounded-full flex items-center justify-center mb-6 shadow-sm border border-red-100">
          <FiAlertCircle size={40} />
        </div>
        <h1 className="text-3xl font-serif font-bold text-[#3d3029] mb-4">Upgrade Failed</h1>
        <p className="text-[#7a6e64] mb-8 leading-relaxed">
          {errorMessage || "We couldn't verify your subscription. If you were charged, please contact support."}
        </p>
        <Link 
          href="/pricing" 
          className="px-8 py-3 bg-[#3d3029] text-white rounded-lg font-medium hover:bg-[#2d2522] transition-colors shadow-md"
        >
          Return to Pricing
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-[70vh] flex flex-col items-center justify-center px-4 py-12">
      <div className="max-w-2xl w-full bg-white rounded-2xl shadow-xl border border-[#e8ddd1] overflow-hidden text-center">
        
        <div className="bg-gradient-to-b from-[#faf5ef] to-white pt-12 pb-8 px-6">
          <div className="w-24 h-24 bg-[#b07c5b] text-white rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg border-4 border-white transform transition-transform hover:scale-105 duration-500">
            <FiStar size={40} />
          </div>
          <h1 className="text-4xl font-serif font-bold text-[#3d3029] mb-3">Welcome to {tier === 'pro' ? 'Pro' : 'Premium'}!</h1>
          <p className="text-[#7a6e64] text-lg">Your account has been successfully upgraded, {session.user.name}.</p>
        </div>

        <div className="px-8 py-8 text-left border-t border-[#e8ddd1] bg-[#faf8f5]">
          <h3 className="font-bold text-[#3d3029] text-lg mb-4 text-center">
            Your New Benefits Are Active:
          </h3>
          <ul className="space-y-3 max-w-sm mx-auto">
            <li className="flex items-center gap-3 text-[#5a4d42]">
              <FiCheckCircle className="text-green-500 shrink-0" />
              Exclusive Profile Badge
            </li>
            <li className="flex items-center gap-3 text-[#5a4d42]">
              <FiCheckCircle className="text-green-500 shrink-0" />
              Priority gallery placement
            </li>
            {tier === 'pro' && (
              <li className="flex items-center gap-3 font-semibold text-[#b07c5b]">
                <FiCheckCircle className="text-green-500 shrink-0" />
                0% Transaction Fees
              </li>
            )}
          </ul>
        </div>

        <div className="px-8 pb-10 pt-6 flex flex-col justify-center">
          <Link 
            href="/dashboard/artist" 
            className="w-full sm:w-auto mx-auto py-4 px-10 bg-[#b07c5b] hover:bg-[#9e6c4d] text-white rounded-xl font-medium transition-colors shadow-md flex items-center justify-center gap-2"
          >
            Go to Dashboard <FiArrowRight />
          </Link>
        </div>

      </div>
    </div>
  );
}

export default function PricingSuccessPage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center text-[#7a6e64]">Loading...</div>}>
      <PricingSuccessContent />
    </Suspense>
  );
}
