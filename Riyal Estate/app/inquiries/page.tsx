'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { MessageSquare, Phone, Mail, Calendar, CheckCircle2, Clock } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useAuth } from '@/hooks/useAuth';
import { ILead } from '@/types';
import { formatDate } from '@/lib/utils';
import toast from 'react-hot-toast';

export default function InquiriesPage() {
  const router = useRouter();
  const { user, isAuthenticated, isLoading } = useAuth();
  const [inquiries, setInquiries] = useState<ILead[]>([]);
  const [isLoadingData, setIsLoadingData] = useState(true);

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push('/login');
    }
  }, [isLoading, isAuthenticated, router]);

  useEffect(() => {
    if (isAuthenticated && user) {
      fetchInquiries();
    }
  }, [isAuthenticated, user]);

  const fetchInquiries = async () => {
    try {
      const token = await user?.getIdToken();
      const response = await fetch('/api/leads?type=sent', {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        setInquiries(data.data);
      }
    } catch (error) {
      console.error('Error fetching inquiries:', error);
    } finally {
      setIsLoadingData(false);
    }
  };

  const getStatusBadge = (status: string) => {
    const colors: { [key: string]: string } = {
      new: 'bg-blue-500',
      contacted: 'bg-yellow-500',
      visited: 'bg-purple-500',
      negotiating: 'bg-orange-500',
      closed: 'bg-green-500',
      rejected: 'bg-red-500',
    };
    return colors[status] || 'bg-gray-500';
  };

  if (isLoading || !isAuthenticated) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-holy-600" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container-custom">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-2xl font-bold">My Inquiries</h1>
          <p className="text-gray-500">Track your property inquiries</p>
        </div>

        {/* Inquiries List */}
        {isLoadingData ? (
          <div className="space-y-4">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="bg-gray-200 rounded-xl h-32 animate-pulse" />
            ))}
          </div>
        ) : inquiries.length > 0 ? (
          <div className="space-y-4">
            {inquiries.map((inquiry) => (
              <Card key={inquiry._id}>
                <CardContent className="p-6">
                  <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
                    <div>
                      <div className="flex items-center gap-2 mb-2">
                        <Badge className={getStatusBadge(inquiry.status)}>
                          {inquiry.status.charAt(0).toUpperCase() + inquiry.status.slice(1)}
                        </Badge>
                      </div>
                      <h3 className="text-lg font-semibold mb-1">{inquiry.propertyTitle}</h3>
                      <p className="text-gray-500 text-sm mb-3">
                        <Calendar className="h-4 w-4 inline mr-1" />
                        Sent on {formatDate(inquiry.createdAt)}
                      </p>
                      <p className="text-gray-600">{inquiry.message}</p>
                    </div>

                    <div className="flex flex-col gap-2">
                      <div className="flex items-center gap-2 text-sm">
                        <MessageSquare className="h-4 w-4 text-gray-400" />
                        <span>To: {inquiry.sellerName}</span>
                      </div>
                      <a
                        href={`tel:${inquiry.sellerPhone}`}
                        className="flex items-center gap-2 text-sm text-holy-600"
                      >
                        <Phone className="h-4 w-4" />
                        {inquiry.sellerPhone}
                      </a>
                      <a
                        href={`mailto:${inquiry.sellerEmail}`}
                        className="flex items-center gap-2 text-sm text-holy-600"
                      >
                        <Mail className="h-4 w-4" />
                        {inquiry.sellerEmail}
                      </a>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <div className="text-center py-16">
            <MessageSquare className="h-16 w-16 mx-auto text-gray-300 mb-4" />
            <h2 className="text-xl font-semibold mb-2">No inquiries yet</h2>
            <p className="text-gray-500 mb-6">Start browsing and contact property owners</p>
            <a href="/search">
              <Button>Browse Properties</Button>
            </a>
          </div>
        )}
      </div>
    </div>
  );
}
