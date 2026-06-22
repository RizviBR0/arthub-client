import { subscription } from '@/lib/action/payment';
import { stripe } from '@/lib/stripe';
import { redirect } from 'next/navigation';
import Link from 'next/link';
import { FiCheckCircle } from 'react-icons/fi';

export default async function Success({ searchParams }) {
  const params = await searchParams;
  const session_id = params.session_id;

  if (!session_id) {
    throw new Error('Please provide a valid session_id (`cs_test_...`)');
  }

  const {
    status,
    metadata,
    customer_details: { email: customerEmail }
  } = await stripe.checkout.sessions.retrieve(session_id, {
    expand: ['line_items', 'payment_intent']
  });

  if (status === 'open') {
    return redirect('/pricing');
  }

  if (status === 'complete') {
    // Notify the Express backend to update the database
    await subscription({ ...metadata, session_id: session_id });

    return (
      <div className="min-h-screen bg-[#faf8f5] py-20 px-4 sm:px-6 flex items-center justify-center">
        <div className="bg-white rounded-2xl border border-[#e8ddd1] p-10 max-w-lg w-full text-center shadow-xl">
          <FiCheckCircle className="text-green-500 dark:text-green-400 w-20 h-20 mx-auto mb-6 animate-pulse" />
          <h1 className="text-3xl font-serif font-bold text-[#3d3029] mb-4">
            Payment Successful!
          </h1>
          <p className="text-lg text-[#7a6e64] mb-8">
            Thank you for upgrading your account! A receipt has been sent to{' '}
            <span className="font-semibold text-[#5a4d42] dark:text-[#d6d3d1]">{customerEmail}</span>.
          </p>
          
          <div className="bg-[#faf8f5] dark:bg-[#1c1917] p-4 rounded-lg mb-8 text-left border border-[#e8ddd1]">
            <h3 className="font-bold text-[#3d3029] mb-2">Next Steps:</h3>
            <ul className="text-sm text-[#5a4d42] dark:text-[#d6d3d1] space-y-2 list-disc list-inside">
              <li>Your subscription tier has been upgraded to <span className="capitalize font-semibold">{metadata?.tier || 'Pro'}</span>.</li>
              <li>You now have access to premium artist features.</li>
              <li>Go to your dashboard to manage your new portfolio settings.</li>
            </ul>
          </div>

          <a
            href="/dashboard/user"
            className="inline-block w-full py-3 px-6 bg-[#b07c5b] text-white font-medium rounded-lg hover:bg-[#9e6c4d] transition-colors shadow-md text-center"
          >
            Go to Dashboard
          </a>
        </div>
      </div>
    );
  }
}
