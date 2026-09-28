'use client';

import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Store, Server, ShieldCheck } from 'lucide-react';

export default function SettingsPage() {
  return (
    <div className="space-y-6 max-w-4xl">
      <div>
        <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Store Settings</h1>
        <p className="text-sm text-slate-500 mt-1">
          Configure store profile, currency, and headless backend API connection settings.
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Store className="w-5 h-5 text-sky-600" />
            General Information
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <Input label="Store Name" defaultValue="Syntellite E-commerce Store" />
            <Input label="Admin Email" defaultValue="admin@ecomm.com" />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <Input label="Default Currency" defaultValue="USD ($)" />
            <Input label="Support Phone" defaultValue="+1 (555) 019-2831" />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Server className="w-5 h-5 text-sky-600" />
            Headless Backend API Integration
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <Input
            label="Backend Base URL"
            defaultValue={process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000/api/v1'}
          />
          <div className="p-3 bg-emerald-50 rounded-xl border border-emerald-200 text-emerald-800 text-xs flex items-center gap-2 font-medium">
            <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
            Connected to Headless Express API backend at C:\Users\Ritik\syntellite-headless-ecomm
          </div>
          <Button>Save Settings</Button>
        </CardContent>
      </Card>
    </div>
  );
}
