import React, { useEffect, useState, Fragment } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Info, ChevronDown, ChevronRight, Check, AlertCircle, Phone, Mail, MessageSquare, FileText, Headphones, Settings, DollarSign, Shield, TrendingUp, BarChart3 } from 'lucide-react';
// HappyRobot products with pricing details
const products = [{
  id: 'voice',
  name: 'Voice Minutes',
  category: 'Communication',
  basePrice: 0.2,
  unit: 'per minute',
  volume: 500000,
  tiers: [{
    min: 0,
    max: 100000,
    price: 0.2
  }, {
    min: 100000,
    max: 500000,
    price: 0.18
  }, {
    min: 500000,
    max: Infinity,
    price: 0.16
  }],
  cost: 0.08 // internal cost for margin calculation
}, {
  id: 'email',
  name: 'Email',
  category: 'Communication',
  basePrice: 0.05,
  unit: 'per email',
  volume: 100000,
  tiers: [{
    min: 0,
    max: 50000,
    price: 0.05
  }, {
    min: 50000,
    max: 200000,
    price: 0.045
  }, {
    min: 200000,
    max: Infinity,
    price: 0.04
  }],
  cost: 0.02
}, {
  id: 'messaging',
  name: 'SMS & Messaging',
  category: 'Communication',
  basePrice: 0.03,
  unit: 'per message',
  volume: 200000,
  tiers: [{
    min: 0,
    max: 100000,
    price: 0.03
  }, {
    min: 100000,
    max: 500000,
    price: 0.025
  }, {
    min: 500000,
    max: Infinity,
    price: 0.02
  }],
  cost: 0.012
}, {
  id: 'documents',
  name: 'Document Parsing',
  category: 'Data Processing',
  basePrice: 0.5,
  unit: 'per document',
  volume: 50000,
  tiers: [{
    min: 0,
    max: 25000,
    price: 0.5
  }, {
    min: 25000,
    max: 100000,
    price: 0.45
  }, {
    min: 100000,
    max: Infinity,
    price: 0.4
  }],
  cost: 0.2
}, {
  id: 'engineer',
  name: 'Deployed Engineer',
  category: 'Support',
  basePrice: 5000,
  unit: 'per month',
  volume: 12,
  tiers: [{
    min: 0,
    max: 6,
    price: 5000
  }, {
    min: 6,
    max: 12,
    price: 4500
  }, {
    min: 12,
    max: Infinity,
    price: 4000
  }],
  cost: 2000
}];
// Pricing guardrails
const pricingGuardrails = {
  marginBands: [{
    min: 0,
    max: 100000,
    minMargin: 0.4
  }, {
    min: 100000,
    max: 250000,
    minMargin: 0.35
  }, {
    min: 250000,
    max: 500000,
    minMargin: 0.3
  }, {
    min: 500000,
    max: Infinity,
    minMargin: 0.25
  } // 25% margin minimum
  ],
  contractTerms: [{
    months: 12,
    marginAdjustment: 0
  }, {
    months: 24,
    marginAdjustment: -0.02
  }, {
    months: 36,
    marginAdjustment: -0.05
  } // Can reduce margin by 5%
  ],
  competitorAdjustments: {
    'Manual Processes': 0,
    'Legacy Systems': -0.02,
    'Competitor AI': -0.05 // Can reduce margin by 5%
  },
  approvalLevels: [{
    threshold: 0.25,
    level: 'VP of Sales',
    color: 'red'
  }, {
    threshold: 0.3,
    level: 'Director',
    color: 'amber'
  }, {
    threshold: 0.35,
    level: 'Manager',
    color: 'blue'
  }, {
    threshold: 0.4,
    level: 'None',
    color: 'green'
  }]
};
// Deployment models
const deploymentModels = [{
  id: 'poc-production',
  name: 'POC → Production',
  description: '2-month POC followed by full production rollout'
}, {
  id: 'annual-commitment',
  name: 'Annual Commitment',
  description: 'Standard 12-month contract with monthly billing'
}, {
  id: 'annual-drawdown',
  name: 'Annual Pool with Drawdown',
  description: 'Annual volume commitment with monthly drawdown'
}, {
  id: 'multi-year',
  name: 'Multi-Year Contract',
  description: '2-3 year commitment with additional discounts'
}];
export function PricingStep() {
  // State for pricing configuration
  const [contractTerm, setContractTerm] = useState(14);
  const [competitor, setCompetitor] = useState('Manual Processes');
  const [deploymentModel, setDeploymentModel] = useState('poc-production');
  const [billingCycle, setBillingCycle] = useState('monthly');
  // State for product pricing
  const [margins, setMargins] = useState<Record<string, number>>({});
  const [volumes, setVolumes] = useState<Record<string, number>>({});
  const [expandedProduct, setExpandedProduct] = useState<string | null>(null);
  // State for view mode
  const [viewMode, setViewMode] = useState<'sales' | 'customer'>('sales');
  // Initialize margins and volumes with default values
  useEffect(() => {
    const initialMargins: Record<string, number> = {};
    const initialVolumes: Record<string, number> = {};
    const minMargin = getMinMargin();
    products.forEach(product => {
      // Set margin to minimum margin + a small random amount to create variation
      initialMargins[product.id] = minMargin + Math.random() * 0.05;
      // Initialize volumes with default values
      initialVolumes[product.id] = product.volume;
    });
    // Ensure at least one product has a margin below minimum (for VP approval)
    const randomProductId = products[Math.floor(Math.random() * products.length)].id;
    initialMargins[randomProductId] = minMargin - 0.03;
    setMargins(initialMargins);
    setVolumes(initialVolumes);
  }, []);
  // Calculate min margin based on deal size and term
  const getMinMargin = () => {
    const totalValue = calculateTotalValue();
    // Find the appropriate margin band
    const band = pricingGuardrails.marginBands.find(band => totalValue >= band.min && totalValue < band.max) || pricingGuardrails.marginBands[0];
    // Apply contract term adjustment
    const termAdjustment = pricingGuardrails.contractTerms.find(term => term.months === contractTerm)?.marginAdjustment || 0;
    // Apply competitor adjustment
    const competitorAdjustment = pricingGuardrails.competitorAdjustments[competitor] || 0;
    return band.minMargin + termAdjustment + competitorAdjustment;
  };
  // Calculate total value of the deal
  const calculateTotalValue = () => {
    return products.reduce((total, product) => {
      const margin = margins[product.id] || 0;
      const volume = volumes[product.id] || product.volume;
      const discountedPrice = product.basePrice * (1 - margin);
      return total + discountedPrice * volume;
    }, 0);
  };
  // Calculate total margin
  const calculateTotalMargin = () => {
    let totalRevenue = 0;
    let totalCost = 0;
    products.forEach(product => {
      const margin = margins[product.id] || 0;
      const volume = volumes[product.id] || product.volume;
      const discountedPrice = product.basePrice * (1 - margin);
      totalRevenue += discountedPrice * volume;
      totalCost += product.cost * volume;
    });
    return totalRevenue - totalCost;
  };
  // Calculate average margin percentage
  const calculateAverageMarginPercentage = () => {
    const totalRevenue = calculateTotalValue();
    const totalMargin = calculateTotalMargin();
    return totalRevenue > 0 ? totalMargin / totalRevenue : 0;
  };
  // Update margin for a product
  const updateMargin = (productId: string, margin: number) => {
    setMargins({
      ...margins,
      [productId]: margin
    });
  };
  // Update volume for a product
  const updateVolume = (productId: string, volume: number) => {
    setVolumes({
      ...volumes,
      [productId]: volume
    });
  };
  // Toggle product expansion
  const toggleProductExpansion = (productId: string) => {
    if (expandedProduct === productId) {
      setExpandedProduct(null);
    } else {
      setExpandedProduct(productId);
    }
  };
  // Get approval level for a product
  const getApprovalLevel = (productId: string) => {
    const margin = margins[productId] || 0;
    const minMargin = getMinMargin();
    if (margin < minMargin) {
      // Find the appropriate approval level
      for (const level of pricingGuardrails.approvalLevels) {
        if (margin >= level.threshold) {
          return level;
        }
      }
      return pricingGuardrails.approvalLevels[0]; // VP of Sales (highest level)
    }
    return {
      threshold: 0,
      level: 'None',
      color: 'green'
    };
  };
  // Check if any product requires approval
  const requiresApproval = () => {
    const minMargin = getMinMargin();
    return Object.values(margins).some(margin => margin < minMargin);
  };
  // Get highest approval level needed
  const getHighestApprovalLevel = () => {
    if (!requiresApproval()) return null;
    let highestLevel = {
      threshold: 1,
      level: 'None',
      color: 'green'
    };
    products.forEach(product => {
      const level = getApprovalLevel(product.id);
      if (level.threshold < highestLevel.threshold) {
        highestLevel = level;
      }
    });
    return highestLevel;
  };
  // Calculate monthly value
  const calculateMonthlyValue = () => {
    return calculateTotalValue() / 12;
  };
  // Calculate effective price for a product
  const getEffectivePrice = (productId: string) => {
    const product = products.find(p => p.id === productId);
    if (!product) return 0;
    const margin = margins[productId] || 0;
    return product.basePrice * (1 - margin);
  };
  // Calculate total for a product
  const getProductTotal = (productId: string) => {
    const product = products.find(p => p.id === productId);
    if (!product) return 0;
    const volume = volumes[productId] || product.volume;
    return getEffectivePrice(productId) * volume;
  };
  // Get margin status color
  const getMarginStatusColor = (productId: string) => {
    const margin = margins[productId] || 0;
    const minMargin = getMinMargin();
    if (margin < minMargin) return 'red';
    if (margin < minMargin + 0.05) return 'amber';
    return 'green';
  };
  const totalValue = calculateTotalValue();
  const monthlyValue = calculateMonthlyValue();
  const totalMargin = calculateTotalMargin();
  const averageMarginPercentage = calculateAverageMarginPercentage();
  const minMargin = getMinMargin();
  const highestApprovalLevel = getHighestApprovalLevel();
  return <div className="w-full bg-white">
      <div className="p-4 border-b border-gray-200">
        <div className="flex items-center gap-2 text-sm text-gray-500">
          <Link to="/" className="hover:text-gray-700">
            FreightWave Logistics
          </Link>
          <ArrowRight size={12} />
          <Link to="/configure" className="hover:text-gray-700">
            Configure
          </Link>
          <ArrowRight size={12} />
          <Link to="/volume" className="hover:text-gray-700">
            Volume
          </Link>
          <ArrowRight size={12} />
          <span className="font-medium text-black">Pricing</span>
        </div>
      </div>
      <div className="max-w-5xl mx-auto p-6">
        <h1 className="text-2xl font-semibold mb-2">Pricing & Terms</h1>
        <p className="text-gray-500 mb-8">
          Configure pricing, discounts, and commercial terms for FreightWave
          Logistics
        </p>
        <div className="flex justify-end mb-4">
          <div className="flex items-center gap-2 p-1 bg-gray-100 rounded-md">
            <button className={`flex items-center gap-1 px-3 py-1.5 rounded-md text-sm transition-colors ${viewMode === 'sales' ? 'bg-white shadow-sm' : 'text-gray-600'}`} onClick={() => setViewMode('sales')}>
              <BarChart3 size={14} />
              <span>Sales View</span>
            </button>
            <button className={`flex items-center gap-1 px-3 py-1.5 rounded-md text-sm transition-colors ${viewMode === 'customer' ? 'bg-white shadow-sm' : 'text-gray-600'}`} onClick={() => setViewMode('customer')}>
              <TrendingUp size={14} />
              <span>Customer View</span>
            </button>
          </div>
        </div>
        <div className="space-y-8">
          {/* Commercial Terms */}
          <div className="border border-gray-200 rounded-lg p-6">
            <h2 className="text-lg font-medium mb-6">Commercial Terms</h2>
            <div className="grid grid-cols-2 gap-6 mb-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Contract Term
                </label>
                <select value={contractTerm} onChange={e => setContractTerm(parseInt(e.target.value))} className="w-full px-3 py-2 border border-gray-300 rounded-md">
                  <option value={14}>
                    14 months (2-month POC + 12-month Production)
                  </option>
                  <option value={12}>12 months</option>
                  <option value={24}>24 months</option>
                  <option value={36}>36 months</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Competitor
                </label>
                <select value={competitor} onChange={e => setCompetitor(e.target.value)} className="w-full px-3 py-2 border border-gray-300 rounded-md">
                  {Object.keys(pricingGuardrails.competitorAdjustments).map(comp => <option key={comp} value={comp}>
                        {comp}
                        {pricingGuardrails.competitorAdjustments[comp] !== 0 && ` (${pricingGuardrails.competitorAdjustments[comp] > 0 ? '+' : ''}${pricingGuardrails.competitorAdjustments[comp] * 100}% margin)`}
                      </option>)}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Deployment Model
                </label>
                <select value={deploymentModel} onChange={e => setDeploymentModel(e.target.value)} className="w-full px-3 py-2 border border-gray-300 rounded-md">
                  {deploymentModels.map(model => <option key={model.id} value={model.id}>
                      {model.name}
                    </option>)}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Billing Cycle
                </label>
                <select value={billingCycle} onChange={e => setBillingCycle(e.target.value)} className="w-full px-3 py-2 border border-gray-300 rounded-md">
                  <option value="monthly">Monthly</option>
                  <option value="quarterly">Quarterly</option>
                  <option value="annual">Annual</option>
                </select>
              </div>
            </div>
            <div className="p-4 bg-gray-50 border border-gray-200 rounded-lg">
              <div className="flex items-center justify-between mb-2">
                <h3 className="font-medium">Pricing Guardrails</h3>
                {viewMode === 'sales' && <div className="flex items-center gap-1 text-sm">
                    <Shield size={14} className="text-gray-500" />
                    <span>Min Margin: {(minMargin * 100).toFixed(0)}%</span>
                  </div>}
              </div>
              <p className="text-sm text-gray-600">
                {deploymentModels.find(model => model.id === deploymentModel)?.description}
                {deploymentModel === 'poc-production' && '. Free or heavily discounted POC followed by standard production pricing.'}
                {deploymentModel === 'annual-drawdown' && '. Pre-purchase annual volume at a discount with monthly consumption.'}
              </p>
            </div>
          </div>
          {/* Product Pricing Table */}
          <div className="border border-gray-200 rounded-lg overflow-hidden">
            <div className="p-4 border-b border-gray-200 bg-gray-50 flex justify-between items-center">
              <h2 className="font-medium">Product Pricing</h2>
              {viewMode === 'sales' && <button className="flex items-center gap-1 text-sm text-gray-500 hover:text-gray-700">
                  <Settings size={14} />
                  <span>Customize</span>
                </button>}
            </div>
            <table className="w-full">
              <thead className="bg-gray-50 text-left">
                <tr>
                  <th className="p-4 text-xs font-medium text-gray-500">
                    PRODUCT
                  </th>
                  <th className="p-4 text-xs font-medium text-gray-500">
                    CATEGORY
                  </th>
                  <th className="p-4 text-xs font-medium text-gray-500">
                    VOLUME
                  </th>
                  <th className="p-4 text-xs font-medium text-gray-500">
                    LIST PRICE
                  </th>
                  {viewMode === 'sales' ? <th className="p-4 text-xs font-medium text-gray-500">
                      MARGIN (%)
                    </th> : <th className="p-4 text-xs font-medium text-gray-500">
                      DISCOUNT (%)
                    </th>}
                  <th className="p-4 text-xs font-medium text-gray-500">
                    NET PRICE
                  </th>
                  <th className="p-4 text-xs font-medium text-gray-500">
                    TOTAL
                  </th>
                  {viewMode === 'sales' && <th className="p-4 text-xs font-medium text-gray-500">
                      APPROVAL
                    </th>}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {products.map(product => {
                const margin = margins[product.id] || 0;
                const volume = volumes[product.id] || product.volume;
                const effectivePrice = getEffectivePrice(product.id);
                const total = getProductTotal(product.id);
                const marginStatus = getMarginStatusColor(product.id);
                const approvalLevel = getApprovalLevel(product.id);
                return <Fragment key={product.id}>
                      <tr className="hover:bg-gray-50 cursor-pointer transition-colors" onClick={() => toggleProductExpansion(product.id)}>
                        <td className="p-4 font-medium flex items-center">
                          {expandedProduct === product.id ? <ChevronDown size={16} className="mr-2" /> : <ChevronRight size={16} className="mr-2" />}
                          {product.name}
                        </td>
                        <td className="p-4">{product.category}</td>
                        <td className="p-4">
                          <input type="number" min="0" step="1" value={volume} onChange={e => {
                        const value = e.target.valueAsNumber;
                        updateVolume(product.id, isNaN(value) ? 0 : value);
                      }} onClick={e => e.stopPropagation()} className="w-24 px-2 py-1 border border-gray-300 rounded-md" />
                          <span className="ml-1 text-sm text-gray-500">
                            {product.unit.split(' ')[1]}
                          </span>
                        </td>
                        <td className="p-4">
                          ${product.basePrice.toFixed(2)} {product.unit}
                        </td>
                        <td className="p-4">
                          {viewMode === 'sales' ? <div className="flex items-center gap-2">
                              <input type="number" min="0" max="100" step="1" value={Math.round(margin * 100)} onChange={e => {
                          const value = e.target.valueAsNumber;
                          updateMargin(product.id, isNaN(value) ? 0 : value / 100);
                        }} onClick={e => e.stopPropagation()} className={`w-16 px-2 py-1 border rounded-md ${marginStatus === 'red' ? 'border-red-300' : marginStatus === 'amber' ? 'border-amber-300' : 'border-gray-300'}`} />
                              %
                              <div className={`w-3 h-3 rounded-full ${marginStatus === 'red' ? 'bg-red-500' : marginStatus === 'amber' ? 'bg-amber-500' : 'bg-green-500'}`}></div>
                            </div> : <span>{Math.round(margin * 100)}%</span>}
                        </td>
                        <td className="p-4">
                          ${effectivePrice.toFixed(2)} {product.unit}
                        </td>
                        <td className="p-4">
                          $
                          {total.toLocaleString(undefined, {
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 2
                      })}
                        </td>
                        {viewMode === 'sales' && <td className="p-4">
                            {approvalLevel.level !== 'None' ? <span className={`px-2 py-1 text-xs font-medium rounded-full ${approvalLevel.color === 'red' ? 'bg-red-100 text-red-700' : approvalLevel.color === 'amber' ? 'bg-amber-100 text-amber-700' : 'bg-blue-100 text-blue-700'}`}>
                                {approvalLevel.level}
                              </span> : '—'}
                          </td>}
                      </tr>
                      {expandedProduct === product.id && <tr className="bg-gray-50">
                          <td colSpan={viewMode === 'sales' ? 8 : 7} className="p-4">
                            <div className="grid grid-cols-2 gap-6">
                              <div>
                                <h3 className="text-sm font-medium mb-2">
                                  Volume Tiers
                                </h3>
                                <div className="space-y-2">
                                  {product.tiers.map((tier, index) => <div key={index} className="p-3 bg-white rounded-md border border-gray-200">
                                      <div className="flex justify-between items-center">
                                        <div>
                                          <span className="text-sm">
                                            {tier.min.toLocaleString()} -{' '}
                                            {tier.max === Infinity ? '∞' : tier.max.toLocaleString()}{' '}
                                            {product.unit.split(' ')[1]}
                                          </span>
                                        </div>
                                        <div className="font-medium">
                                          ${tier.price.toFixed(2)}{' '}
                                          {product.unit}
                                        </div>
                                      </div>
                                    </div>)}
                                </div>
                              </div>
                              {viewMode === 'sales' && <div>
                                  <h3 className="text-sm font-medium mb-2">
                                    Margin Analysis
                                  </h3>
                                  <div className="p-4 bg-white rounded-md border border-gray-200">
                                    <div className="space-y-3">
                                      <div className="flex justify-between items-center">
                                        <span className="text-sm text-gray-600">
                                          Annual Volume
                                        </span>
                                        <span className="font-medium">
                                          {volume.toLocaleString()}{' '}
                                          {product.unit.split(' ')[1]}
                                        </span>
                                      </div>
                                      <div className="flex justify-between items-center">
                                        <span className="text-sm text-gray-600">
                                          List Price
                                        </span>
                                        <span className="font-medium">
                                          ${product.basePrice.toFixed(2)}{' '}
                                          {product.unit}
                                        </span>
                                      </div>
                                      <div className="flex justify-between items-center">
                                        <span className="text-sm text-gray-600">
                                          Discount
                                        </span>
                                        <span className="font-medium">
                                          {Math.round(margin * 100)}%
                                        </span>
                                      </div>
                                      <div className="flex justify-between items-center">
                                        <span className="text-sm text-gray-600">
                                          Net Price
                                        </span>
                                        <span className="font-medium">
                                          ${effectivePrice.toFixed(2)}{' '}
                                          {product.unit}
                                        </span>
                                      </div>
                                      <div className="border-t border-gray-200 pt-2 flex justify-between items-center">
                                        <span className="text-sm text-gray-600">
                                          Contribution Margin
                                        </span>
                                        <span className={`font-medium ${marginStatus === 'red' ? 'text-red-600' : marginStatus === 'amber' ? 'text-amber-600' : 'text-green-600'}`}>
                                          {Math.round((1 - product.cost / effectivePrice) * 100)}
                                          %
                                        </span>
                                      </div>
                                    </div>
                                  </div>
                                </div>}
                              {viewMode === 'customer' && <div>
                                  <h3 className="text-sm font-medium mb-2">
                                    Volume Forecast
                                  </h3>
                                  <div className="p-4 bg-white rounded-md border border-gray-200">
                                    <div className="space-y-3">
                                      <div className="flex justify-between items-center">
                                        <span className="text-sm text-gray-600">
                                          Annual Volume
                                        </span>
                                        <span className="font-medium">
                                          {volume.toLocaleString()}{' '}
                                          {product.unit.split(' ')[1]}
                                        </span>
                                      </div>
                                      <div className="flex justify-between items-center">
                                        <span className="text-sm text-gray-600">
                                          Monthly Average
                                        </span>
                                        <span className="font-medium">
                                          {Math.round(volume / 12).toLocaleString()}{' '}
                                          {product.unit.split(' ')[1]}
                                        </span>
                                      </div>
                                      <div className="flex justify-between items-center">
                                        <span className="text-sm text-gray-600">
                                          Net Price
                                        </span>
                                        <span className="font-medium">
                                          ${effectivePrice.toFixed(2)}{' '}
                                          {product.unit}
                                        </span>
                                      </div>
                                      <div className="border-t border-gray-200 pt-2 flex justify-between items-center">
                                        <span className="text-sm text-gray-600">
                                          Annual Total
                                        </span>
                                        <span className="font-medium">
                                          $
                                          {total.toLocaleString(undefined, {
                                    minimumFractionDigits: 2,
                                    maximumFractionDigits: 2
                                  })}
                                        </span>
                                      </div>
                                    </div>
                                  </div>
                                </div>}
                            </div>
                          </td>
                        </tr>}
                    </Fragment>;
              })}
              </tbody>
              <tfoot className="bg-gray-100 font-medium">
                <tr>
                  <td className="p-4" colSpan={6}>
                    Total Contract Value
                  </td>
                  <td className="p-4">
                    $
                    {totalValue.toLocaleString(undefined, {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2
                  })}
                  </td>
                  {viewMode === 'sales' && <td className="p-4"></td>}
                </tr>
              </tfoot>
            </table>
          </div>
          {/* Summary Cards */}
          <div className="grid grid-cols-4 gap-4">
            <div className="border border-gray-200 rounded-lg p-4">
              <div className="text-sm text-gray-500 mb-1">
                Annual Contract Value
              </div>
              <div className="text-xl font-semibold">
                $
                {totalValue.toLocaleString(undefined, {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2
              })}
              </div>
              <div className="text-xs text-gray-500 mt-1">
                Total contract value
              </div>
            </div>
            <div className="border border-gray-200 rounded-lg p-4">
              <div className="text-sm text-gray-500 mb-1">Monthly Value</div>
              <div className="text-xl font-semibold">
                $
                {monthlyValue.toLocaleString(undefined, {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2
              })}
                /mo
              </div>
              <div className="text-xs text-gray-500 mt-1">
                Average monthly billing
              </div>
            </div>
            {viewMode === 'sales' ? <>
                <div className="border border-gray-200 rounded-lg p-4">
                  <div className="text-sm text-gray-500 mb-1">Total Margin</div>
                  <div className="text-xl font-semibold">
                    $
                    {totalMargin.toLocaleString(undefined, {
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 2
                })}
                  </div>
                  <div className="text-xs text-gray-500 mt-1">
                    Revenue minus costs
                  </div>
                </div>
                <div className="border border-gray-200 rounded-lg p-4">
                  <div className="text-sm text-gray-500 mb-1">
                    Margin Percentage
                  </div>
                  <div className={`text-xl font-semibold ${averageMarginPercentage < minMargin ? 'text-red-600' : averageMarginPercentage < minMargin + 0.05 ? 'text-amber-600' : 'text-green-600'}`}>
                    {Math.round(averageMarginPercentage * 100)}%
                  </div>
                  <div className="text-xs text-gray-500 mt-1">
                    Minimum: {Math.round(minMargin * 100)}%
                  </div>
                </div>
              </> : <>
                <div className="border border-gray-200 rounded-lg p-4">
                  <div className="text-sm text-gray-500 mb-1">
                    Contract Term
                  </div>
                  <div className="text-xl font-semibold">
                    {contractTerm} months
                  </div>
                  <div className="text-xs text-gray-500 mt-1">
                    {deploymentModels.find(model => model.id === deploymentModel)?.name}
                  </div>
                </div>
                <div className="border border-gray-200 rounded-lg p-4">
                  <div className="text-sm text-gray-500 mb-1">
                    Billing Cycle
                  </div>
                  <div className="text-xl font-semibold capitalize">
                    {billingCycle}
                  </div>
                  <div className="text-xs text-gray-500 mt-1">
                    Payment frequency
                  </div>
                </div>
              </>}
          </div>
          {/* Approval Warning */}
          {requiresApproval() && viewMode === 'sales' && <div className="p-4 bg-amber-50 border border-amber-200 rounded-lg flex items-center justify-between">
              <div className="flex items-center gap-3">
                <AlertCircle size={20} className="text-amber-500" />
                <div>
                  <h3 className="font-medium text-amber-800">
                    Approval Required
                  </h3>
                  <p className="text-sm text-amber-700">
                    This quote requires {highestApprovalLevel?.level} approval
                    due to margins below minimum threshold.
                  </p>
                </div>
              </div>
              <button className="px-4 py-2 bg-amber-500 text-white rounded-md text-sm">
                Request Approval
              </button>
            </div>}
        </div>
        <div className="mt-8 flex justify-between">
          <Link to="/volume" className="px-4 py-2 border border-gray-200 rounded-md text-sm font-medium transition-colors hover:bg-gray-50">
            Back
          </Link>
          <Link to="/quote" className="px-4 py-2 bg-black text-white rounded-md text-sm font-medium transition-colors hover:bg-gray-800">
            Next
          </Link>
        </div>
      </div>
    </div>;
}