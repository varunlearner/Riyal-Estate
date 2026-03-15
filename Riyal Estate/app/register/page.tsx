'use client';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { signInWithGoogle, signUpWithEmail } from '@/lib/firebase/auth';
import { ArrowRight, Building2, Chrome, Eye, EyeOff, Lock, Mail, Phone, User } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import toast from 'react-hot-toast';

export default function RegisterPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    displayName: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
    role: 'user',
  });
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleEmailRegister = async (e: React.FormEvent) => {
    e.preventDefault();

    if (formData.password !== formData.confirmPassword) {
      toast.error('Passwords do not match');
      return;
    }

    if (formData.password.length < 6) {
      toast.error('Password must be at least 6 characters');
      return;
    }

    setIsLoading(true);

    try {
      const { user, error } = await signUpWithEmail(
        formData.email,
        formData.password,
        formData.displayName
      );

      if (error) {
        toast.error(error);
        return;
      }

      if (user) {
        // Create user in our database
        const idToken = await user.getIdToken();
        const response = await fetch('/api/users/sync', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${idToken}`,
          },
          body: JSON.stringify({
            firebaseUid: user.uid,
            email: user.email,
            displayName: formData.displayName,
            photoURL: user.photoURL,
            phone: formData.phone,
            role: formData.role,
          }),
        });

        if (response.ok) {
          toast.success('Registration successful!');
          router.push('/dashboard');
        }
      }
    } catch (error) {
      toast.error('Something went wrong');
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleRegister = async () => {
    setIsLoading(true);

    try {
      const { user, error } = await signInWithGoogle();

      if (error) {
        toast.error(error);
        return;
      }

      if (user) {
        // Create or update user in our database
        const idToken = await user.getIdToken();
        const response = await fetch('/api/users/sync', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${idToken}`,
          },
          body: JSON.stringify({
            firebaseUid: user.uid,
            email: user.email,
            displayName: user.displayName,
            photoURL: user.photoURL,
            phone: user.phoneNumber,
            role: formData.role,
          }),
        });

        if (response.ok) {
          toast.success('Registration successful!');
          router.push('/dashboard');
        }
      }
    } catch (error) {
      toast.error('Something went wrong');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8 bg-white p-8 rounded-2xl shadow-lg">
        {/* Header */}
        <div className="text-center">
          <h1 className="text-3xl font-bold text-gray-900">Create Account</h1>
          <p className="mt-2 text-gray-600">
            Join HolyEstates and find your dream home
          </p>
        </div>

        {/* Google Register */}
        <Button
          type="button"
          variant="outline"
          className="w-full py-3 h-auto"
          onClick={handleGoogleRegister}
          isLoading={isLoading}
        >
          <Chrome className="mr-2 h-5 w-5" />
          Continue with Google
        </Button>

        {/* Divider */}
        <div className="relative">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-gray-200" />
          </div>
          <div className="relative flex justify-center text-sm">
            <span className="px-2 bg-white text-gray-500">Or register with email</span>
          </div>
        </div>

        {/* Registration Form */}
        <form onSubmit={handleEmailRegister} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
            <div className="relative">
              <User className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
              <Input
                type="text"
                name="displayName"
                value={formData.displayName}
                onChange={handleChange}
                required
                placeholder="Enter your full name"
                className="pl-12"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
            <div className="relative">
              <Mail className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
              <Input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
                placeholder="Enter your email"
                className="pl-12"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Phone Number</label>
            <div className="relative">
              <Phone className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
              <Input
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                placeholder="Enter your phone number"
                className="pl-12"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              I am a
            </label>
            <div className="grid grid-cols-3 gap-2">
              {[
                { value: 'user', label: 'Buyer/Tenant', icon: User },
                { value: 'owner', label: 'Owner', icon: Building2 },
                { value: 'agent', label: 'Agent', icon: Building2 },
              ].map((option) => (
                <button
                  key={option.value}
                  type="button"
                  onClick={() => setFormData({ ...formData, role: option.value })}
                  className={`flex flex-col items-center gap-1 p-3 rounded-lg border transition-all ${formData.role === option.value
                    ? 'border-holy-500 bg-holy-50 text-holy-700'
                    : 'border-gray-200 hover:border-gray-300'
                    }`}
                >
                  <option.icon className="h-5 w-5" />
                  <span className="text-xs">{option.label}</span>
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
            <div className="relative">
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
              <Input
                type={showPassword ? 'text' : 'password'}
                name="password"
                value={formData.password}
                onChange={handleChange}
                required
                placeholder="Create a password"
                className="pl-12"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                {showPassword ? (
                  <EyeOff className="h-5 w-5" />
                ) : (
                  <Eye className="h-5 w-5" />
                )}
              </button>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Confirm Password</label>
            <div className="relative">
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
              <Input
                type={showPassword ? 'text' : 'password'}
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                required
                placeholder="Confirm your password"
                className="pl-12"
              />
            </div>
          </div>

          <div className="flex items-center">
            <input
              id="terms"
              name="terms"
              type="checkbox"
              required
              className="h-4 w-4 text-holy-600 focus:ring-holy-500 border-gray-300 rounded"
            />
            <label htmlFor="terms" className="ml-2 block text-sm text-gray-900">
              I agree to the{' '}
              <Link href="/terms" className="text-holy-600 hover:text-holy-500">
                Terms of Service
              </Link>{' '}
              and{' '}
              <Link href="/privacy" className="text-holy-600 hover:text-holy-500">
                Privacy Policy
              </Link>
            </label>
          </div>

          <Button
            type="submit"
            className="w-full py-3 h-auto"
            isLoading={isLoading}
          >
            Create Account
            <ArrowRight className="ml-2 h-5 w-5" />
          </Button>
        </form>

        {/* Login Link */}
        <p className="text-center text-sm text-gray-600">
          Already have an account?{' '}
          <Link
            href="/login"
            className="font-medium text-holy-600 hover:text-holy-500"
          >
            Sign in
          </Link>
        </p>
      </div>
    </div>
  );
}
