'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Phone, Mail, Calendar, MessageSquare, User, CheckCircle2 } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useAuth } from '@/hooks/useAuth';
import { ILead } from '@/types';
import { formatDate } from '@/lib/utils';

export default function LeadsPage() {
  const router = useRouter();
  const { user, isAuthenticated, isLoading } = useAuth();
  const [leads, setLeads] = useState<ILead[]>([]);
  const [isLoadingData, setIsLoadingData] = useState(true);

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push('/login');
    }
  }, [isLoading, isAuthenticated, router]);

  useEffect(() => {
    if (isAuthenticated && user) {
      fetchLeads();
    }
  }, [isAuthenticated, user]);

  const fetchLeads = async () => {
    try {
      const token = await user?.getIdToken();
      const response = await fetch('/api/leads?type=received', {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        setLeads(data.data);
      }
    } catch (error) {
      console.error('Error fetching leads:', error);
    } finally {
      setIsLoadingData(false);
    }
  };

  const updateLeadStatus = async (leadId: string, status: string) => {
    try {
      const token = await user?.getIdToken();
      const response = await fetch('/api/leads', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({ leadId, status }),
      });

      if (response.ok) {
        fetchLeads();
      }
    } catch (error) {
      console.error('Error updating lead:', error);
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
          <h1 className="text-2xl font-bold">My Leads</h1>
          <p className="text-gray-500">Inquiries from potential buyers/tenants</p>
        </div>

        {/* Leads List */}
        {isLoadingData ? (
          <div className="space-y-4">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="bg-gray-200 rounded-xl h-32 animate-pulse" />
            ))}
          </div>
        ) : leads.length > 0 ? (
          <div className="space-y-4">
            {leads.map((lead) => (
              <Card key={lead._id}>
                <CardContent className="p-6">
                  <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <Badge className={getStatusBadge(lead.status)}>
                          {lead.status.charAt(0).toUpperCase() + lead.status.slice(1)}
                        </Badge>
                      </div>
                      <h3 className="text-lg font-semibold mb-1">{lead.propertyTitle}</h3>
                      <div className="flex items-center gap-2 text-sm text-gray-500 mb-3">
                        <User className="h-4 w-4" />
                        <span>{lead.buyerName}</span>
                        <span>•</span>
                        <Calendar className="h-4 w-4" />
                        <span>{formatDate(lead.createdAt)}</span>
                      </div>
                      <p className="text-gray-600 mb-4">{lead.message}</p>

                      {/* Contact Info */}
                      <div className="flex flex-wrap gap-4">
                        <a
                          href={`tel:${lead.buyerPhone}`}
                          className="flex items-center gap-2 text-sm text-holy-600"
                        >
                          <Phone className="h-4 w-4" />
                          {lead.buyerPhone}
                        </a>
                        <a
                          href={`mailto:${lead.buyerEmail}`}
                          className="flex items-center gap-2 text-sm text-holy-600"
                        >
                          <Mail className="h-4 w-4" />
                          {lead.buyerEmail}
                        </a>
                      </div>
                    </div>

                    {/* Status Actions */}
                    <div className="flex flex-wrap gap-2">
                      {lead.status === 'new' && (
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => updateLeadStatus(lead._id, 'contacted')}
                        >
                          <CheckCircle2 className="h-4 w-4 mr-1" />
                          Mark Contacted
                        </Button>
                      )}
                      {lead.status === 'contacted' && (
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => updateLeadStatus(lead._id, 'visited')}
                        >
                          <CheckCircle2 className="h-4 w-4 mr-1" />
                          Mark Visited
                        </Button>
                      )}
                      {lead.status !== 'closed' && lead.status !== 'rejected' && (
                        <>
                          <Button
                            size="sm"
                            onClick={() => updateLeadStatus(lead._id, 'closed')}
                          >
                            Close Deal
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            className="text-red-600"
                            onClick={() => updateLeadStatus(lead._id, 'rejected')}
                          >
                            Reject
                          </Button>
                        </>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <div className="text-center py-16">
            <MessageSquare className="h-16 w-16 mx-auto text-gray-300 mb-4" />
            <h2 className="text-xl font-semibold mb-2">No leads yet</h2>
            <p className="text-gray-500 mb-6">Inquiries from potential buyers will appear here</p>
            <a href="/add-property">
              <Button>Post a Property</Button>
            </a>
          </div>
        )}
      </div>
    </div>
  );
}
