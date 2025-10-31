import React, { useState } from 'react';
import { X, Check, ChevronRight, Download, Copy, Phone, Mail, MessageSquare, FileText, Headphones, Truck, Calendar, MapPin, BarChart3, TrendingUp } from 'lucide-react';
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
interface Quote {
  id: number;
  name: string;
  description: string;
  term: number;
  totalValue: number;
  services: string[];
  deployment: string;
  createdAt: string;
  status: string;
}
interface CompareDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  selectedQuotes: number[];
  quotes: Quote[];
  viewMode: 'partner' | 'customer';
  onViewModeChange: (mode: 'partner' | 'customer') => void;
}
export function CompareDrawer({
  isOpen,
  onClose,
  selectedQuotes,
  quotes,
  viewMode,
  onViewModeChange
}: CompareDrawerProps) {
  if (!isOpen) return null;
  const [chartType, setChartType] = useState<'value' | 'monthly'>('value');
  const [chartView, setChartView] = useState<'bar' | 'line'>('bar');
  const selectedQuotesData = quotes.filter(quote => selectedQuotes.includes(quote.id));
  // Generate chart data
  const generateChartData = () => {
    if (chartType === 'value') {
      return selectedQuotesData.map(quote => ({
        name: quote.name,
        value: quote.totalValue,
        monthly: Math.round(quote.totalValue / quote.term)
      }));
    } else {
      // Monthly comparison
      return selectedQuotesData.map(quote => ({
        name: quote.name,
        monthly: Math.round(quote.totalValue / quote.term),
        annual: Math.round(quote.totalValue / quote.term * 12)
      }));
    }
  };
  const chartData = generateChartData();
  // Font styles for BDO Grotesk
  const fontStyle = {
    fontFamily: '"BDO Grotesk", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif'
  };
  return <div className="fixed inset-0 z-50 overflow-hidden" style={fontStyle}>
      <div className="absolute inset-0 bg-black bg-opacity-30" onClick={onClose}></div>
      <div className="absolute inset-y-0 right-0 max-w-full flex">
        <div className="relative w-screen max-w-4xl">
          <div className="h-full flex flex-col bg-white shadow-xl">
            <div className="flex items-center justify-between p-3 border-b border-gray-200">
              <h2 className="text-lg font-medium">Compare Quotes</h2>
              <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
                <X size={20} />
              </button>
            </div>
            <div className="p-3 border-b border-gray-200 bg-gray-50">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="text-sm font-medium">Viewing as:</span>
                  <div className="flex items-center gap-1 p-1 bg-white rounded-md border border-gray-200">
                    <button className={`flex items-center gap-1 px-3 py-1.5 rounded-md text-sm transition-colors ${viewMode === 'partner' ? 'bg-gray-100 shadow-sm' : 'text-gray-600'}`} onClick={() => onViewModeChange('partner')}>
                      <span>Partner</span>
                    </button>
                    <button className={`flex items-center gap-1 px-3 py-1.5 rounded-md text-sm transition-colors ${viewMode === 'customer' ? 'bg-gray-100 shadow-sm' : 'text-gray-600'}`} onClick={() => onViewModeChange('customer')}>
                      <span>Customer</span>
                    </button>
                  </div>
                </div>
                <div className="flex gap-2">
                  <button className="flex items-center gap-1 px-3 py-1.5 border border-gray-200 bg-white rounded-md text-sm">
                    <Copy size={14} />
                    <span>Copy</span>
                  </button>
                  <button className="flex items-center gap-1 px-3 py-1.5 border border-gray-200 bg-white rounded-md text-sm">
                    <Download size={14} />
                    <span>Export</span>
                  </button>
                </div>
              </div>
            </div>
            <div className="flex-1 overflow-y-auto">
              <div className="p-5">
                {/* Chart Section */}
                <div className="mb-6 border border-gray-200 rounded-lg p-4">
                  <div className="flex justify-between items-center mb-3">
                    <h3 className="font-medium">Quote Comparison</h3>
                    <div className="flex gap-2">
                      <div className="flex items-center gap-1 p-1 bg-gray-100 rounded-md">
                        <button className={`flex items-center gap-1 px-2 py-1 rounded-md text-xs ${chartType === 'value' ? 'bg-white shadow-sm' : 'text-gray-600'}`} onClick={() => setChartType('value')}>
                          <span>Total Value</span>
                        </button>
                        <button className={`flex items-center gap-1 px-2 py-1 rounded-md text-xs ${chartType === 'monthly' ? 'bg-white shadow-sm' : 'text-gray-600'}`} onClick={() => setChartType('monthly')}>
                          <span>Monthly Cost</span>
                        </button>
                      </div>
                      <div className="flex items-center gap-1 p-1 bg-gray-100 rounded-md">
                        <button className={`flex items-center gap-1 px-2 py-1 rounded-md text-xs ${chartView === 'bar' ? 'bg-white shadow-sm' : 'text-gray-600'}`} onClick={() => setChartView('bar')}>
                          <BarChart3 size={12} />
                        </button>
                        <button className={`flex items-center gap-1 px-2 py-1 rounded-md text-xs ${chartView === 'line' ? 'bg-white shadow-sm' : 'text-gray-600'}`} onClick={() => setChartView('line')}>
                          <TrendingUp size={12} />
                        </button>
                      </div>
                    </div>
                  </div>
                  <div className="h-64">
                    <ResponsiveContainer width="100%" height="100%">
                      {chartView === 'bar' ? <BarChart data={chartData}>
                          <CartesianGrid strokeDasharray="3 3" />
                          <XAxis dataKey="name" />
                          <YAxis />
                          <Tooltip />
                          <Legend />
                          {chartType === 'value' ? <>
                              <Bar dataKey="value" name="Total Value" fill="#000" />
                              <Bar dataKey="monthly" name="Monthly Cost" fill="#888" />
                            </> : <>
                              <Bar dataKey="monthly" name="Monthly Cost" fill="#000" />
                              <Bar dataKey="annual" name="Annual Cost" fill="#888" />
                            </>}
                        </BarChart> : <LineChart data={chartData}>
                          <CartesianGrid strokeDasharray="3 3" />
                          <XAxis dataKey="name" />
                          <YAxis />
                          <Tooltip />
                          <Legend />
                          {chartType === 'value' ? <>
                              <Line type="monotone" dataKey="value" name="Total Value" stroke="#000" />
                              <Line type="monotone" dataKey="monthly" name="Monthly Cost" stroke="#888" />
                            </> : <>
                              <Line type="monotone" dataKey="monthly" name="Monthly Cost" stroke="#000" />
                              <Line type="monotone" dataKey="annual" name="Annual Cost" stroke="#888" />
                            </>}
                        </LineChart>}
                    </ResponsiveContainer>
                  </div>
                </div>
                {/* Table Comparison */}
                <div className="grid grid-cols-1 gap-5">
                  {/* Quote Names */}
                  <div className="grid grid-cols-4 gap-4">
                    <div className="col-span-1">
                      <div className="text-sm font-medium text-gray-500">
                        QUOTE OPTIONS
                      </div>
                    </div>
                    {selectedQuotesData.map(quote => <div key={quote.id} className="col-span-1">
                        <div className="font-medium">{quote.name}</div>
                        <div className="text-sm text-gray-500">
                          {quote.deployment}
                        </div>
                      </div>)}
                  </div>
                  {/* Contract Term */}
                  <div className="grid grid-cols-4 gap-4 pt-3 border-t border-gray-200">
                    <div className="col-span-1">
                      <div className="text-sm font-medium text-gray-500">
                        CONTRACT TERM
                      </div>
                    </div>
                    {selectedQuotesData.map(quote => <div key={quote.id} className="col-span-1">
                        <div className="font-medium">{quote.term} months</div>
                      </div>)}
                  </div>
                  {/* Total Value */}
                  <div className="grid grid-cols-4 gap-4 pt-3 border-t border-gray-200">
                    <div className="col-span-1">
                      <div className="text-sm font-medium text-gray-500">
                        TOTAL VALUE
                      </div>
                    </div>
                    {selectedQuotesData.map(quote => <div key={quote.id} className="col-span-1">
                        <div className="font-medium">
                          ${quote.totalValue.toLocaleString()}
                        </div>
                        <div className="text-sm text-gray-500">
                          $
                          {Math.round(quote.totalValue / quote.term).toLocaleString()}
                          /month
                        </div>
                      </div>)}
                  </div>
                  {/* Services */}
                  <div className="grid grid-cols-4 gap-4 pt-3 border-t border-gray-200">
                    <div className="col-span-1">
                      <div className="text-sm font-medium text-gray-500">
                        INCLUDED SERVICES
                      </div>
                    </div>
                    {selectedQuotesData.map(quote => <div key={quote.id} className="col-span-1">
                        <div className="space-y-1.5">
                          {quote.services.map(service => <div key={service} className="flex items-center gap-2">
                              <div className="w-5 h-5 bg-gray-100 rounded-full flex items-center justify-center">
                                {service === 'Voice Minutes' && <Phone size={12} className="text-gray-600" />}
                                {service === 'Email' && <Mail size={12} className="text-gray-600" />}
                                {service === 'Messaging' && <MessageSquare size={12} className="text-gray-600" />}
                                {service === 'Document Parsing' && <FileText size={12} className="text-gray-600" />}
                                {service === 'Engineer Support' && <Headphones size={12} className="text-gray-600" />}
                                {service === 'Carrier Sales' && <Truck size={12} className="text-gray-600" />}
                                {service === 'Appointment Scheduling' && <Calendar size={12} className="text-gray-600" />}
                                {service === 'Track-and-Trace' && <MapPin size={12} className="text-gray-600" />}
                              </div>
                              <span className="text-xs">{service}</span>
                            </div>)}
                        </div>
                      </div>)}
                  </div>
                  {/* Deployment */}
                  <div className="grid grid-cols-4 gap-4 pt-3 border-t border-gray-200">
                    <div className="col-span-1">
                      <div className="text-sm font-medium text-gray-500">
                        DEPLOYMENT MODEL
                      </div>
                    </div>
                    {selectedQuotesData.map(quote => <div key={quote.id} className="col-span-1">
                        <div className="font-medium">{quote.deployment}</div>
                      </div>)}
                  </div>
                  {/* Pricing Structure */}
                  <div className="grid grid-cols-4 gap-4 pt-3 border-t border-gray-200">
                    <div className="col-span-1">
                      <div className="text-sm font-medium text-gray-500">
                        PRICING STRUCTURE
                      </div>
                    </div>
                    {selectedQuotesData.map(quote => <div key={quote.id} className="col-span-1">
                        <div className="font-medium">
                          {quote.deployment === 'POC → Production' ? 'Free POC + Standard Production' : quote.deployment === 'Annual Commitment with Drawdown' ? 'Annual Pool with Monthly Drawdown' : 'Standard Usage-Based'}
                        </div>
                      </div>)}
                  </div>
                </div>
              </div>
            </div>
            <div className="p-3 border-t border-gray-200 flex justify-between">
              <button onClick={onClose} className="px-4 py-2 border border-gray-200 rounded-md text-sm">
                Close
              </button>
              <div className="flex gap-2">
                <button className="px-4 py-2 border border-gray-200 rounded-md text-sm">
                  Generate Side-by-Side PDF
                </button>
                <button className="px-4 py-2 bg-black text-white rounded-md text-sm">
                  Send to Customer
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>;
}