"use client";

import { useState } from 'react';
import { Lead } from '@/types';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Phone, Mail, MapPin, Clock, User } from 'lucide-react';
import { format } from 'date-fns';

interface LeadsTableProps {
  leads: Lead[];
}

export default function LeadsTable({ leads: initialLeads }: LeadsTableProps) {
  const [leads, setLeads] = useState(initialLeads);

  const updateLeadStatus = async (leadId: string, status: string) => {
    try {
      const response = await fetch('/api/leads', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ leadId, status }),
      });

      if (response.ok) {
        const { lead } = await response.json();
        setLeads(prev => prev.map(l => l._id === leadId ? lead : l));
      }
    } catch (error) {
      console.error('Failed to update lead status:', error);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'contacted': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'closed': return 'bg-green-100 text-green-800 border-green-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  if (leads.length === 0) {
    return (
      <Card>
        <CardContent className="flex flex-col items-center justify-center py-12">
          <Phone className="h-12 w-12 text-gray-400 mb-4" />
          <p className="text-lg font-medium text-gray-900 mb-2">No leads yet</p>
          <p className="text-gray-500 text-center max-w-md">
            When customers call your AI assistant number, their information will appear here.
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="grid gap-4">
      {leads.map((lead) => (
        <Card key={lead._id} className="hover:shadow-md transition-shadow">
          <CardHeader className="pb-3">
            <div className="flex justify-between items-start">
              <div className="space-y-1">
                <CardTitle className="text-lg flex items-center gap-2">
                  <User className="h-4 w-4" />
                  {lead.name || 'Unknown Caller'}
                </CardTitle>
                <div className="flex items-center gap-2 text-sm text-gray-500">
                  <Clock className="h-3 w-3" />
                  {format(new Date(lead.createdAt), 'MMM dd, yyyy at h:mm a')}
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Badge className={getStatusColor(lead.status)}>
                  {lead.status.charAt(0).toUpperCase() + lead.status.slice(1)}
                </Badge>
                <Select
                  value={lead.status}
                  onValueChange={(value) => updateLeadStatus(lead._id, value)}
                >
                  <SelectTrigger className="w-32">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="pending">Pending</SelectItem>
                    <SelectItem value="contacted">Contacted</SelectItem>
                    <SelectItem value="closed">Closed</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              <div className="flex items-center gap-2">
                <Phone className="h-4 w-4 text-blue-500" />
                <span className="text-sm">
                  {lead.phone || 'No phone provided'}
                </span>
              </div>
              {lead.email && (
                <div className="flex items-center gap-2">
                  <Mail className="h-4 w-4 text-green-500" />
                  <span className="text-sm">{lead.email}</span>
                </div>
              )}
              {lead.address && (
                <div className="flex items-center gap-2">
                  <MapPin className="h-4 w-4 text-red-500" />
                  <span className="text-sm">{lead.address}</span>
                </div>
              )}
            </div>
            <div className="flex gap-2 pt-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => window.open(`tel:${lead.phone}`)}
                disabled={!lead.phone}
              >
                <Phone className="h-3 w-3 mr-1" />
                Call
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => window.open(`mailto:${lead.email}`)}
                disabled={!lead.email}
              >
                <Mail className="h-3 w-3 mr-1" />
                Email
              </Button>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}