import React, { useEffect, useState, Fragment } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { ArrowRight, ChevronDown, ChevronRight, FileText, Download } from 'lucide-react';
interface CostItem {
  id: string;
  locale: string;
  difficulty: string;
  promptGenMin: number;
  reviewMin: number;
  rejectionRate: number;
  hourlyRate: number;
  taskVolume: number;
}
interface PlatformFeeItem {
  id: string;
  feeType: string;
  unit: string;
  quantity: number;
  ratePerUnit: number;
  durationMonths: number;
}
interface ResourceSection {
  id: string;
  name: string;
  type: 'resource' | 'platform-fee';
  items: CostItem[] | PlatformFeeItem[];
  expanded: boolean;
}
const milestones = [{
  id: 'benchmarking',
  name: 'Benchmarking'
}, {
  id: 'prototype',
  name: 'Prototype'
}, {
  id: 'systems-integration',
  name: 'Systems Integration'
}, {
  id: 'qa',
  name: 'QA'
}, {
  id: 'full-scale-rollout',
  name: 'Full Scale Rollout'
}];
export function PricingReviewStep() {
  const navigate = useNavigate();
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const [costData, setCostData] = useState<Record<string, ResourceSection[]>>({});
  // Add missing state for expanded milestones
  const [expandedMilestones, setExpandedMilestones] = useState<Record<string, boolean>>({});
  // Pricing calculator state
  const [subscriptionStart, setSubscriptionStart] = useState('10/30/2025');
  const [duration, setDuration] = useState('12');
  const [billingFrequency, setBillingFrequency] = useState('annual-upfront');
  const [paymentTerms, setPaymentTerms] = useState('net-30');
  // Add state for discounts
  const [discounts, setDiscounts] = useState<Record<string, number>>({});
  useEffect(() => {
    const savedData = localStorage.getItem('volumeAndPricingData');
    if (savedData) {
      const parsed = JSON.parse(savedData);
      setCostData(parsed);
      // Initialize all milestones as expanded
      const expanded: Record<string, boolean> = {};
      Object.keys(parsed).forEach(key => {
        expanded[key] = true;
      });
      setExpandedMilestones(expanded);
    }
  }, []);
  const toggleMilestone = (milestoneId: string) => {
    setExpandedMilestones(prev => ({
      ...prev,
      [milestoneId]: !prev[milestoneId]
    }));
  };
  const calculateCostPerTask = (item: CostItem) => {
    const totalMinutes = item.promptGenMin + item.reviewMin;
    const hourlyFraction = totalMinutes / 60;
    const baseCost = item.hourlyRate * hourlyFraction;
    const costWithRejection = baseCost * (1 + item.rejectionRate / 100);
    return costWithRejection;
  };
  const calculateTotal = (item: CostItem) => {
    return calculateCostPerTask(item) * item.taskVolume;
  };
  const calculatePlatformFeeTotal = (item: PlatformFeeItem) => {
    return item.quantity * item.ratePerUnit * item.durationMonths;
  };
  const calculateSectionTotal = (milestoneId: string, sectionId: string) => {
    const section = costData[milestoneId]?.find(s => s.id === sectionId);
    if (!section) return 0;
    if (section.type === 'platform-fee') {
      return (section.items as PlatformFeeItem[]).reduce((sum, item) => sum + calculatePlatformFeeTotal(item), 0);
    } else {
      return (section.items as CostItem[]).reduce((sum, item) => sum + calculateTotal(item), 0);
    }
  };
  const calculateMilestoneTotal = (milestoneId: string) => {
    const sections = costData[milestoneId] || [];
    return sections.reduce((sum, section) => {
      return sum + calculateSectionTotal(milestoneId, section.id);
    }, 0);
  };
  const calculateGrandTotal = () => {
    return Object.keys(costData).reduce((sum, milestoneId) => {
      return sum + calculateMilestoneTotal(milestoneId);
    }, 0);
  };
  const milestonesWithData = milestones.filter(m => costData[m.id]);
  // Add helper function to calculate section revenue (matching VolumeAndPricingStep logic)
  const calculateSectionRevenue = (milestoneId: string, sectionId: string) => {
    const section = costData[milestoneId]?.find(s => s.id === sectionId);
    if (!section) return 0;
    if (section.type === 'platform-fee') {
      return (section.items as PlatformFeeItem[]).reduce((sum, item) => {
        const suggestedRate = item.suggestedPrice ?? item.ratePerUnit;
        const quoteRate = item.quotePrice ?? suggestedRate;
        const estRevenue = quoteRate * item.quantity * (item.durationMonths || 1);
        return sum + estRevenue;
      }, 0);
    } else if (sectionId === 'forward-deployed') {
      // For FDE, calculate revenue based on quote rate * hours
      const fdeItems = section.items as CostItem[];
      if (fdeItems.length === 0) return 0;
      const avgHourlyRate = fdeItems.reduce((sum, item) => sum + (item.hourlyRate || 50), 0) / fdeItems.length;
      const hourlyRate = fdeItems[0]?.hourlyRate || avgHourlyRate || 50;
      const totalHours = fdeItems.length > 0 ? fdeItems[0]?.taskVolume || 10 : 10;
      const suggestedRate = hourlyRate * 1.4;
      const quoteRate = fdeItems[0]?.quotePrice ?? suggestedRate;
      const estRevenue = quoteRate * totalHours;
      return estRevenue;
    } else {
      // For other resource sections, calculate based on quote price * task volume
      return (section.items as CostItem[]).reduce((sum, item) => {
        const costPerTask = calculateCostPerTask(item);
        const suggestedRate = costPerTask * 1.4;
        const quoteRate = item.quotePrice ?? suggestedRate;
        const estRevenue = quoteRate * item.taskVolume;
        return sum + estRevenue;
      }, 0);
    }
  };
  // Function to get approval level based on discount percentage
  const getApprovalLevel = (discountPercent: number) => {
    if (discountPercent >= 30) {
      return {
        level: 'CEO',
        color: 'bg-red-100 text-red-700'
      };
    } else if (discountPercent >= 15) {
      return {
        level: 'VP of Sales',
        color: 'bg-amber-100 text-amber-700'
      };
    } else if (discountPercent >= 2) {
      return {
        level: 'Manager',
        color: 'bg-green-100 text-green-700'
      };
    } else {
      return {
        level: 'None',
        color: 'bg-gray-100 text-gray-700'
      };
    }
  };
  // Function to update discount for a milestone
  const updateDiscount = (milestoneId: string, discount: number) => {
    setDiscounts(prev => ({
      ...prev,
      [milestoneId]: discount
    }));
  };
  // Function to calculate quote price based on discount
  const calculateQuotePrice = (suggestedPrice: number, discountPercent: number) => {
    return suggestedPrice * (1 - discountPercent / 100);
  };
  // Function to calculate gross margin
  const calculateGrossMargin = (cost: number, quotePrice: number) => {
    if (quotePrice === 0) return 0;
    return (quotePrice - cost) / quotePrice * 100;
  };
  // Function to calculate grand revenue (sum of all section revenues)
  const calculateGrandRevenue = () => {
    return Object.keys(costData).reduce((sum, milestoneId) => {
      const sections = costData[milestoneId] || [];
      const milestoneRevenue = sections.reduce((sectionSum, section) => {
        return sectionSum + calculateSectionRevenue(milestoneId, section.id);
      }, 0);
      return sum + milestoneRevenue;
    }, 0);
  };
  return <div className="min-h-screen bg-white">
      {/* Breadcrumb */}
      <div className="border-b border-gray-200 px-8 py-3">
        <div className="flex items-center gap-2 text-xs text-gray-600">
          <Link to="/" className="hover:text-gray-900">
            Invisible
          </Link>
          <ArrowRight size={12} />
          <Link to="/configure" className="hover:text-gray-900">
            Configure
          </Link>
          <ArrowRight size={12} />
          <Link to="/volume" className="hover:text-gray-900">
            Volume & Pricing
          </Link>
          <ArrowRight size={12} />
          <span className="font-medium text-gray-900">Review Pricing</span>
        </div>
      </div>
      {/* Header */}
      <div className="border-b border-gray-200 px-8 py-6">
        <div className="flex items-start justify-between">
          <div>
            <h1 className="text-3xl font-semibold mb-1">Pricing Review</h1>
            <p className="text-gray-600 text-sm">
              Review your complete pricing breakdown
            </p>
          </div>
          <button className="flex items-center gap-2 px-3 py-1.5 border border-gray-300 rounded-lg text-xs font-medium hover:bg-gray-50">
            <Download size={14} />
            Export Quote
          </button>
        </div>
      </div>
      {/* Content */}
      <div className="px-8 py-6 max-w-7xl mx-auto">
        {/* Compact Milestone Breakdown */}
        <div className="mb-8"></div>
        {/* Pricing Calculator */}
        <div className="border border-gray-200 rounded-lg p-6 mb-8">
          <h2 className="text-xl font-semibold mb-6">Terms & Pricing</h2>
          {/* Date and Duration */}
          <div className="grid grid-cols-2 gap-6 mb-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Subscription start date
              </label>
              <input type="date" value={subscriptionStart} onChange={e => setSubscriptionStart(e.target.value)} className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Duration
              </label>
              <select value={duration} onChange={e => setDuration(e.target.value)} className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm">
                <option value="12">12 months</option>
                <option value="24">24 months</option>
                <option value="36">36 months</option>
              </select>
            </div>
          </div>
          {/* Billing and Payment */}
          <div className="grid grid-cols-2 gap-6 mb-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Billing frequency
              </label>
              <select value={billingFrequency} onChange={e => setBillingFrequency(e.target.value)} className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm">
                <option value="annual-upfront">Annual upfront</option>
                <option value="monthly">Monthly</option>
                <option value="quarterly">Quarterly</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Payment terms
              </label>
              <select value={paymentTerms} onChange={e => setPaymentTerms(e.target.value)} className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm">
                <option value="net-30">Net 30</option>
                <option value="net-60">Net 60</option>
                <option value="net-90">Net 90</option>
              </select>
            </div>
          </div>
          {/* Milestones Table */}
          <div className="mb-6">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-base font-semibold">Milestones</h3>
              <button className="text-xs text-blue-600 hover:text-blue-700 font-medium">
                Edit Calculator
              </button>
            </div>
            <div className="border border-gray-200 rounded-lg overflow-hidden">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-3 py-2 text-left text-xs font-medium text-gray-500">
                      Milestones
                    </th>
                    <th className="px-3 py-2 text-right text-xs font-medium text-gray-500">
                      Annual Contract Value
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {milestonesWithData.map(milestone => {
                  const sections = costData[milestone.id] || [];
                  // Calculate milestone total as sum of all section revenues
                  const milestoneRevenue = sections.reduce((sum, section) => {
                    return sum + calculateSectionRevenue(milestone.id, section.id);
                  }, 0);
                  const isExpanded = expandedMilestones[milestone.id];
                  return <Fragment key={milestone.id}>
                        {/* Main Milestone Row */}
                        <tr className="hover:bg-gray-50 cursor-pointer" onClick={() => toggleMilestone(milestone.id)}>
                          <td className="px-3 py-2 text-sm">
                            <div className="flex items-center gap-2">
                              {isExpanded ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
                              <span className="font-medium">
                                {milestone.name}
                              </span>
                            </div>
                          </td>
                          <td className="px-3 py-2 text-sm font-semibold text-right">
                            $
                            {milestoneRevenue.toLocaleString('en-US', {
                          minimumFractionDigits: 2
                        })}
                          </td>
                        </tr>
                        {/* Expanded Section Rows */}
                        {isExpanded && sections.map(section => {
                      // Skip platform-fee section if it's being merged with forward-deployed
                      if (section.id === 'platform-fee' && sections.some(s => s.id === 'forward-deployed')) {
                        return null;
                      }
                      // Calculate section revenue
                      let sectionRevenue = calculateSectionRevenue(milestone.id, section.id);
                      // For forward-deployed, include platform-fee in the display
                      if (section.id === 'forward-deployed') {
                        const platformFeeSection = sections.find(s => s.id === 'platform-fee');
                        if (platformFeeSection) {
                          sectionRevenue += calculateSectionRevenue(milestone.id, 'platform-fee');
                        }
                      }
                      // Determine section display name
                      let sectionName = section.name;
                      if (section.id === 'expert-network') {
                        sectionName = 'Expert Network';
                      } else if (section.id === 'forward-deployed') {
                        sectionName = 'Product Services';
                      } else if (section.id === 'platform-fee') {
                        sectionName = 'Platform Fee';
                      }
                      return <tr key={`${milestone.id}-${section.id}`} className="bg-gray-50">
                                <td className="px-3 py-2 text-xs pl-10">
                                  <span className="text-gray-600">
                                    ↳ {sectionName}
                                  </span>
                                </td>
                                <td className="px-3 py-2 text-xs text-right text-gray-600">
                                  $
                                  {sectionRevenue.toLocaleString('en-US', {
                            minimumFractionDigits: 2
                          })}
                                </td>
                              </tr>;
                    })}
                      </Fragment>;
                })}
                  <tr className="bg-gray-50 font-semibold">
                    <td className="px-3 py-2 text-sm text-right">Total</td>
                    <td className="px-3 py-2 text-sm text-right">
                      $
                      {milestonesWithData.reduce((sum, milestone) => {
                      const sections = costData[milestone.id] || [];
                      const milestoneRevenue = sections.reduce((sectionSum, section) => {
                        return sectionSum + calculateSectionRevenue(milestone.id, section.id);
                      }, 0);
                      return sum + milestoneRevenue;
                    }, 0).toLocaleString('en-US', {
                      minimumFractionDigits: 2
                    })}
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
        {/* Bottom Summary */}
        <div className="flex items-center justify-between border-t border-gray-200 pt-6">
          <div className="flex items-center gap-12">
            <div></div>
            <div>
              <div className="text-xs text-gray-600 mb-1">TCV</div>
              <div className="text-2xl font-bold">
                $
                {calculateGrandRevenue().toLocaleString('en-US', {
                minimumFractionDigits: 2
              })}
              </div>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <Link to="/volume" className="px-6 py-2.5 border border-gray-300 rounded-lg text-sm font-medium hover:bg-gray-50">
              Back
            </Link>
            <button onClick={() => {
            const tcv = calculateGrandRevenue(); // Use revenue calculation for TCV
            const params = new URLSearchParams();
            params.set('tcv', tcv.toString());
            params.set('term', '12');
            params.set('dealTypes', 'enterprise-transformation');
            // Use actual industry and use case from URL parameters
            const industry = queryParams.get('type') || queryParams.get('industry') || 'AI & Machine Learning';
            const useCase = queryParams.get('useCase') || '';
            params.set('industry', industry);
            if (useCase) {
              params.set('useCase', useCase);
            }
            navigate(`/quote?${params.toString()}`);
          }} className="px-6 py-2.5 bg-green-600 text-white rounded-lg text-sm font-medium hover:bg-green-700">
              Finish
            </button>
          </div>
        </div>
      </div>
    </div>;
}