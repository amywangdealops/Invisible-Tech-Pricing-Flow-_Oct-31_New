import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Plus, Search, Filter, MoreVertical, TrendingUp, DollarSign, Clock, CheckCircle } from 'lucide-react';
const opportunities = [{
  id: '1',
  company: 'Waymo',
  industry: 'Autonomous Vehicles & Robotics',
  useCase: 'Autonomous Vehicle Training',
  stage: 'Proposal',
  value: 2500000,
  probability: 75,
  closeDate: '2025-03-15',
  owner: 'Sarah Chen'
}, {
  id: '2',
  company: 'Anthropic',
  industry: 'Generative AI / Foundation Models',
  useCase: 'Foundation Model Development',
  stage: 'Negotiation',
  value: 5000000,
  probability: 90,
  closeDate: '2025-02-28',
  owner: 'Michael Torres'
}, {
  id: '3',
  company: 'US Department of Defense',
  industry: 'Government & Defense',
  useCase: 'Defense & Intelligence Operations',
  stage: 'Discovery',
  value: 10000000,
  probability: 40,
  closeDate: '2025-06-30',
  owner: 'David Kim'
}, {
  id: '4',
  company: 'JPMorgan Chase',
  industry: 'Enterprise - Financial Services',
  useCase: 'Investment Due Diligence',
  stage: 'Qualification',
  value: 1200000,
  probability: 60,
  closeDate: '2025-04-15',
  owner: 'Sarah Chen'
}];
const stages = ['Discovery', 'Qualification', 'Proposal', 'Negotiation', 'Closed Won'];
export function OpportunityPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedStage, setSelectedStage] = useState<string | null>(null);
  const filteredOpportunities = opportunities.filter(opp => {
    const matchesSearch = opp.company.toLowerCase().includes(searchQuery.toLowerCase()) || opp.useCase.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStage = !selectedStage || opp.stage === selectedStage;
    return matchesSearch && matchesStage;
  });
  const totalValue = filteredOpportunities.reduce((sum, opp) => sum + opp.value, 0);
  const weightedValue = filteredOpportunities.reduce((sum, opp) => sum + opp.value * (opp.probability / 100), 0);
  return <div className="w-full bg-white min-h-screen">
      {/* Header */}
      <div className="border-b border-gray-200 bg-white sticky top-0 z-10">
        <div className="px-8 py-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-3xl font-semibold mb-2">Opportunities</h1>
              <p className="text-gray-500">
                Manage and track your sales pipeline
              </p>
            </div>
            <Link to="/deal-context" className="flex items-center gap-2 px-4 py-2 bg-black text-white rounded-lg hover:bg-gray-800 transition-colors">
              <Plus size={20} />
              <span>New Quote</span>
            </Link>
          </div>
          {/* Stats */}
          <div className="grid grid-cols-4 gap-4 mb-6">
            <div className="p-4 border border-gray-200 rounded-lg">
              <div className="flex items-center gap-2 text-sm text-gray-500 mb-1">
                <DollarSign size={16} />
                <span>Total Pipeline</span>
              </div>
              <div className="text-2xl font-semibold">
                $
                {(totalValue / 1000000).toLocaleString(undefined, {
                minimumFractionDigits: 1,
                maximumFractionDigits: 1
              })}
                M
              </div>
            </div>
            <div className="p-4 border border-gray-200 rounded-lg">
              <div className="flex items-center gap-2 text-sm text-gray-500 mb-1">
                <TrendingUp size={16} />
                <span>Weighted Pipeline</span>
              </div>
              <div className="text-2xl font-semibold">
                $
                {(weightedValue / 1000000).toLocaleString(undefined, {
                minimumFractionDigits: 1,
                maximumFractionDigits: 1
              })}
                M
              </div>
            </div>
            <div className="p-4 border border-gray-200 rounded-lg">
              <div className="flex items-center gap-2 text-sm text-gray-500 mb-1">
                <CheckCircle size={16} />
                <span>Active Deals</span>
              </div>
              <div className="text-2xl font-semibold">
                {filteredOpportunities.length}
              </div>
            </div>
            <div className="p-4 border border-gray-200 rounded-lg">
              <div className="flex items-center gap-2 text-sm text-gray-500 mb-1">
                <Clock size={16} />
                <span>Avg Close Time</span>
              </div>
              <div className="text-2xl font-semibold">4.2 mo</div>
            </div>
          </div>
          {/* Search and Filters */}
          <div className="flex gap-3">
            <div className="flex-1 relative">
              <Search size={20} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input type="text" placeholder="Search opportunities..." value={searchQuery} onChange={e => setSearchQuery(e.target.value)} className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black" />
            </div>
            <button className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50">
              <Filter size={20} />
              <span>Filters</span>
            </button>
          </div>
        </div>
        {/* Stage Tabs */}
        <div className="px-8 flex gap-1 border-t border-gray-200">
          <button className={`px-4 py-3 text-sm font-medium border-b-2 transition-colors ${!selectedStage ? 'border-black text-black' : 'border-transparent text-gray-500 hover:text-gray-700'}`} onClick={() => setSelectedStage(null)}>
            All Stages
          </button>
          {stages.map(stage => <button key={stage} className={`px-4 py-3 text-sm font-medium border-b-2 transition-colors ${selectedStage === stage ? 'border-black text-black' : 'border-transparent text-gray-500 hover:text-gray-700'}`} onClick={() => setSelectedStage(stage)}>
              {stage}
            </button>)}
        </div>
      </div>
      {/* Opportunities Table */}
      <div className="px-8 py-6">
        <div className="border border-gray-200 rounded-lg overflow-hidden">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Company
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Use Case
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Stage
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Value
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Probability
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Close Date
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Owner
                </th>
                <th className="px-6 py-3"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 bg-white">
              {filteredOpportunities.map(opp => <tr key={opp.id} className="hover:bg-gray-50 cursor-pointer">
                  <td className="px-6 py-4">
                    <div>
                      <div className="font-medium">{opp.company}</div>
                      <div className="text-sm text-gray-500">
                        {opp.industry}
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm">{opp.useCase}</td>
                  <td className="px-6 py-4">
                    <span className="px-2 py-1 text-xs font-medium rounded-full bg-blue-100 text-blue-800">
                      {opp.stage}
                    </span>
                  </td>
                  <td className="px-6 py-4 font-medium">
                    $
                    {(opp.value / 1000000).toLocaleString(undefined, {
                  minimumFractionDigits: 1,
                  maximumFractionDigits: 1
                })}
                    M
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <div className="flex-1 h-2 bg-gray-200 rounded-full overflow-hidden">
                        <div className="h-full bg-green-500" style={{
                      width: `${opp.probability}%`
                    }}></div>
                      </div>
                      <span className="text-sm font-medium">
                        {opp.probability}%
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm">
                    {new Date(opp.closeDate).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4 text-sm">{opp.owner}</td>
                  <td className="px-6 py-4">
                    <button className="p-1 hover:bg-gray-100 rounded">
                      <MoreVertical size={16} className="text-gray-400" />
                    </button>
                  </td>
                </tr>)}
            </tbody>
          </table>
        </div>
      </div>
    </div>;
}