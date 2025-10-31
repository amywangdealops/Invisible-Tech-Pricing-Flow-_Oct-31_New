import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, RefreshCw, ExternalLink, Plus, ChevronRight, Clock, Building2, Truck, Globe, DollarSign, CalendarDays, BarChart3, Check, X, FileText, Headphones, Users, Settings, MessageSquare, AlertCircle, Trash2 } from 'lucide-react';
import { CompareDrawer } from './CompareDrawer';
// Sample quotes for FreightWave Logistics
const existingQuotes = [{
  id: 1,
  name: 'Annual Voice + Messaging',
  description: 'Standard voice minutes and messaging package',
  term: 12,
  totalValue: 145000,
  services: ['Voice Minutes', 'Messaging', 'Document Parsing'],
  deployment: 'Annual Commitment',
  createdAt: '3 days ago',
  status: 'Approved'
}, {
  id: 2,
  name: 'POC → Production Package',
  description: '2-month POC with full production rollout',
  term: 14,
  totalValue: 168000,
  services: ['Voice Minutes', 'Email', 'Messaging', 'Document Parsing', 'Engineer Support'],
  deployment: 'POC → Production',
  createdAt: '1 day ago',
  status: 'Pending Approval'
}, {
  id: 3,
  name: 'Multi-Year Premium',
  description: '3-year commitment with all services',
  term: 36,
  totalValue: 420000,
  services: ['Voice Minutes', 'Email', 'Messaging', 'Document Parsing', 'Engineer Support'],
  deployment: 'Multi-Year Contract',
  createdAt: '2 hours ago',
  status: 'Draft'
}];
export function OpportunityPage() {
  const [selectedQuotes, setSelectedQuotes] = useState<number[]>([]);
  const [showCompareDrawer, setShowCompareDrawer] = useState(false);
  const [compareViewMode, setCompareViewMode] = useState<'partner' | 'customer'>('partner');
  const [quotes, setQuotes] = useState(existingQuotes);
  const [deleteConfirmId, setDeleteConfirmId] = useState<number | null>(null);
  // Load saved quotes from localStorage on mount
  useEffect(() => {
    const savedQuotes = JSON.parse(localStorage.getItem('savedQuotes') || '[]');
    if (savedQuotes.length > 0) {
      // Merge saved quotes with existing quotes, avoiding duplicates
      const allQuotes = [...existingQuotes, ...savedQuotes];
      const uniqueQuotes = allQuotes.filter((quote, index, self) => index === self.findIndex(q => q.id === quote.id));
      setQuotes(uniqueQuotes);
      // Clear saved quotes from localStorage after loading
      localStorage.removeItem('savedQuotes');
    }
  }, []);
  const toggleQuoteSelection = (quoteId: number) => {
    if (selectedQuotes.includes(quoteId)) {
      setSelectedQuotes(selectedQuotes.filter(id => id !== quoteId));
    } else {
      setSelectedQuotes([...selectedQuotes, quoteId]);
    }
  };
  const handleDeleteQuote = (quoteId: number) => {
    setQuotes(quotes.filter(q => q.id !== quoteId));
    setSelectedQuotes(selectedQuotes.filter(id => id !== quoteId));
    setDeleteConfirmId(null);
  };
  // Add BDO Grotesk font styles
  const fontStyle = {
    fontFamily: '"BDO Grotesk", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif'
  };
  return <div className="w-full bg-white" style={fontStyle}>
      <div className="p-3 border-b border-gray-200">
        <div className="flex items-center gap-2 text-sm text-gray-500">
          <Link to="/" className="hover:text-gray-700">
            Opportunities
          </Link>
          <ArrowRight size={12} />
          <span className="font-medium text-black">FreightWave Logistics</span>
        </div>
      </div>
      <div className="p-5">
        <div className="flex justify-between items-center mb-5">
          <h1 className="text-2xl font-semibold">FreightWave Logistics</h1>
        </div>
        <div className="grid grid-cols-2 gap-5 mb-5">
          {/* Customer Info Card */}
          <div className="border border-gray-200 rounded-md overflow-hidden">
            <div className="flex justify-between items-center p-3 border-b border-gray-200 bg-gray-50">
              <h2 className="font-medium">Customer Information</h2>
              <button className="text-xs text-gray-500 hover:text-gray-700">
                Edit
              </button>
            </div>
            <div className="p-4">
              <div className="flex items-start gap-3 mb-4">
                <div className="w-10 h-10 bg-blue-100 rounded-md flex items-center justify-center text-blue-600">
                  <Building2 size={20} />
                </div>
                <div>
                  <h3 className="font-medium">RetailNova Inc.</h3>
                  <p className="text-sm text-gray-500">
                    Global Consumer Retailer
                  </p>
                </div>
              </div>
              <div className="space-y-2.5 mt-4">
                <div className="flex justify-between">
                  <span className="text-sm text-gray-500">Annual Revenue</span>
                  <span className="text-sm">$80M - $120M</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-500">Product Catalog</span>
                  <span className="text-sm">2M+ SKUs</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-500">Region</span>
                  <span className="text-sm">Global (North America HQ)</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-500">Target Use Case</span>
                  <span className="text-sm">
                    Product Data Enrichment & Workflow Automation
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-500">
                    Current Solution
                  </span>
                  <span className="text-sm">
                    In-house ML System + Manual QA
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-500">
                    Opportunity Owner
                  </span>
                  <span className="text-sm">Alex Ramirez</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-500">
                    Engagement Summary
                  </span>
                  <span className="text-sm">
                    Improving product discoverability and conversion
                  </span>
                </div>
              </div>
              <div className="mt-4 flex items-center gap-2">
                <button className="text-sm px-3 py-1.5 border border-gray-200 rounded-md flex items-center gap-1 hover:bg-gray-50">
                  <RefreshCw size={14} />
                  <span>Refresh</span>
                </button>
                <button className="text-sm px-3 py-1.5 border border-gray-200 rounded-md flex items-center gap-1 hover:bg-gray-50">
                  <ExternalLink size={14} />
                  <span>Open in Salesforce</span>
                </button>
              </div>
            </div>
          </div>
          {/* Quotes Section */}
          <div className="border border-gray-200 rounded-md overflow-hidden">
            <div className="flex justify-between items-center p-3 border-b border-gray-200 bg-gray-50">
              <h2 className="font-medium">Quotes</h2>
              <div className="flex gap-2">
                {selectedQuotes.length > 0 && <button className="text-xs border border-gray-200 rounded-md px-3 py-1.5 flex items-center gap-1" onClick={() => setShowCompareDrawer(true)}>
                    <BarChart3 size={14} />
                    <span>Compare ({selectedQuotes.length})</span>
                  </button>}
                <Link to="/configure" className="text-xs border border-gray-200 rounded-md px-3 py-1.5 flex items-center gap-1">
                  <Plus size={14} />
                  <span>Create New Quote</span>
                </Link>
              </div>
            </div>
            {quotes.length === 0 ? <div className="p-6 flex flex-col items-center justify-center text-center h-48">
                <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center mb-3">
                  <Clock size={20} className="text-gray-400" />
                </div>
                <h3 className="font-medium mb-2">No quotes yet</h3>
                <p className="text-sm text-gray-500 mb-4 max-w-sm">
                  Create your first quote to start configuring products and
                  pricing for FreightWave Logistics
                </p>
                <Link to="/configure" className="text-sm bg-black text-white rounded-md px-4 py-2 flex items-center gap-1">
                  <Plus size={14} />
                  <span>Create New Quote</span>
                </Link>
              </div> : <div className="p-4 space-y-3">
                {quotes.map(quote => <div key={quote.id} className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50 transition-colors">
                    <div className="flex items-start gap-3">
                      <div className={`w-5 h-5 rounded border flex items-center justify-center cursor-pointer mt-1 flex-shrink-0 ${selectedQuotes.includes(quote.id) ? 'bg-black border-black' : 'border-gray-300'}`} onClick={() => toggleQuoteSelection(quote.id)}>
                        {selectedQuotes.includes(quote.id) && <Check size={12} className="text-white" />}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between mb-2">
                          <div>
                            <h3 className="font-medium text-base">
                              {quote.industry && quote.useCases ? `${quote.industry} • ${Array.isArray(quote.useCases) ? quote.useCases.join(', ') : quote.useCases}` : quote.name}
                            </h3>
                            <p className="text-sm text-gray-500 mt-0.5">
                              {new Date().toLocaleDateString('en-US', {
                          year: 'numeric',
                          month: 'short',
                          day: 'numeric'
                        })}
                            </p>
                          </div>
                          <div className="flex items-center gap-2">
                            <button className="text-gray-400 hover:text-red-500 p-1" onClick={() => setDeleteConfirmId(quote.id)} title="Delete quote">
                              <Trash2 size={16} />
                            </button>
                            <button className="text-gray-400 hover:text-gray-600">
                              <ChevronRight size={16} />
                            </button>
                          </div>
                        </div>
                        <div className="grid grid-cols-3 gap-6 mt-3">
                          <div>
                            <div className="text-xs text-gray-500 mb-1">
                              Total Value
                            </div>
                            <div className="text-lg font-semibold">
                              $
                              {typeof quote.totalValue === 'number' ? quote.totalValue.toLocaleString(undefined, {
                          minimumFractionDigits: 2,
                          maximumFractionDigits: 2
                        }) : quote.totalValue}
                            </div>
                          </div>
                          <div>
                            <div className="text-xs text-gray-500 mb-1">
                              Contract Term
                            </div>
                            <div className="text-lg font-semibold">
                              {quote.term} months
                            </div>
                          </div>
                          <div>
                            <div className="text-xs text-gray-500 mb-1">
                              Monthly Value
                            </div>
                            <div className="text-lg font-semibold">
                              $
                              {Math.round((typeof quote.totalValue === 'number' ? quote.totalValue : 0) / quote.term).toLocaleString()}
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>)}
              </div>}
          </div>
        </div>
      </div>
      {/* Delete Confirmation Modal */}
      {deleteConfirmId && <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 bg-red-100 rounded-full flex items-center justify-center">
                <AlertCircle size={20} className="text-red-600" />
              </div>
              <h3 className="text-lg font-semibold">Delete Quote</h3>
            </div>
            <p className="text-gray-600 mb-6">
              Are you sure you want to delete "
              {quotes.find(q => q.id === deleteConfirmId)?.name}"? This action
              cannot be undone.
            </p>
            <div className="flex justify-end gap-3">
              <button className="px-4 py-2 border border-gray-200 rounded-md text-sm hover:bg-gray-50" onClick={() => setDeleteConfirmId(null)}>
                Cancel
              </button>
              <button className="px-4 py-2 bg-red-600 text-white rounded-md text-sm hover:bg-red-700" onClick={() => handleDeleteQuote(deleteConfirmId)}>
                Delete Quote
              </button>
            </div>
          </div>
        </div>}
      {/* Compare Drawer */}
      <CompareDrawer isOpen={showCompareDrawer} onClose={() => setShowCompareDrawer(false)} selectedQuotes={selectedQuotes} quotes={quotes} viewMode={compareViewMode} onViewModeChange={setCompareViewMode} />
    </div>;
}