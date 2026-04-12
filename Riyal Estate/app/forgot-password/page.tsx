'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Mail, ArrowLeft, CheckCircle2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { sendPasswordReset } from '@/lib/firebase/auth';
import toast from 'react-hot-toast';

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isSent, setIsSent] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    const { error } = await sendPasswordReset(email);

    if (error) {
      toast.error(error);
    } else {
      setIsSent(true);
      toast.success('Password reset email sent!');
    }

    setIsLoading(false);
  };

  if (isSent) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center py-12 px-4">
        <div className="max-w-md w-full space-y-8 bg-white p-8 rounded-2xl shadow-lg text-center">
          <div className="w-16 h-16 mx-auto bg-green-100 rounded-full flex items-center justify-center">
            <CheckCircle2 className="h-8 w-8 text-green-600" />
          </div>
          <h2 className="text-2xl font-bold">Check Your Email</h2>
          <p className="text-gray-600">
            We&apos;ve sent a password reset link to <strong>{email}</strong>.
            Please check your inbox and follow the instructions.
          </p>
          <Link href="/login">
            <Button variant="outline" className="w-full">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Login
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center py-12 px-4">
      <div className="max-w-md w-full space-y-8 bg-white p-8 rounded-2xl shadow-lg">
        {/* Header */}
        <div className="text-center">
          <h1 className="text-3xl font-bold text-gray-900">Forgot Password?</h1>
          <p className="mt-2 text-gray-600">
            Enter your email address and we&apos;ll send you a link to reset your password.
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
            <div className="relative">
              <Mail className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
              <Input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                placeholder="Enter your email"
                className="pl-12"
              />
            </div>
          </div>

          <Button
            type="submit"
            className="w-full py-3 h-auto"
            isLoading={isLoading}
          >
            Send Reset Link
          </Button>
        </form>

        {/* Back to Login */}
        <p className="text-center text-sm text-gray-600">
          Remember your password?{' '}
          <Link
            href="/login"
            className="font-medium text-brand-600 hover:text-brand-500"
          >
            Sign in
          </Link>
        </p>
      </div>
    </div>
  );
}
