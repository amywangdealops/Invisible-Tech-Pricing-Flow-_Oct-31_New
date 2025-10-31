import React, { useEffect, useState, Fragment } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Info, Settings, ChevronDown, ChevronRight, Plus, Trash2, BarChart3, PieChart, Building2, Calendar, Check, X, Share2, Link as LinkIcon, Copy, Layers, Clock, AlertCircle, Shield, Phone, Mail, MessageSquare, FileText, Headphones, DollarSign } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area, BarChart, Bar, Legend, PieChart as RechartsPieChart, Pie, Cell } from 'recharts';
import { RampDrawer } from './RampDrawer';
// Sample product data
const products = [{
  id: 1,
  name: 'Voice Minutes',
  category: 'Communication',
  basePrice: 0.2,
  unit: 'per minute',
  bundle: 'Core Communication'
}, {
  id: 2,
  name: 'Email',
  category: 'Communication',
  basePrice: 0.05,
  unit: 'per email',
  bundle: 'Core Communication'
}, {
  id: 3,
  name: 'Messaging',
  category: 'Communication',
  basePrice: 0.03,
  unit: 'per message',
  bundle: 'Core Communication'
}, {
  id: 4,
  name: 'Documents Parsed',
  category: 'Data Processing',
  basePrice: 0.5,
  unit: 'per document',
  bundle: 'Data Processing'
}, {
  id: 5,
  name: 'Deployed Engineer Support',
  category: 'Support',
  basePrice: 5000,
  unit: 'per month',
  bundle: 'Support'
}];
// Sample guardrails
const guardrails = {
  marginBands: [{
    min: 0,
    max: 100000,
    minMargin: 0.4 // 40% margin
  }, {
    min: 100000,
    max: 250000,
    minMargin: 0.35 // 35% margin
  }, {
    min: 250000,
    max: 500000,
    minMargin: 0.3 // 30% margin
  }, {
    min: 500000,
    max: Infinity,
    minMargin: 0.25 // 25% margin
  }],
  contractTerms: [{
    months: 12,
    additionalMargin: 0
  }, {
    months: 36,
    additionalMargin: 0.02 // +2% margin
  }, {
    months: 60,
    additionalMargin: 0.04 // +4% margin
  }],
  competitorAdjustments: {
    'Manual Processes': 0,
    'Legacy Systems': -0.02,
    'Competitor AI': -0.05 // -5% margin against Competitor AI
  }
};
// Sample deployment scenarios
const deploymentScenarios = [{
  id: 1,
  name: 'POC → Production',
  description: '2-month POC followed by production'
}, {
  id: 2,
  name: 'Annual Commitment',
  description: 'Annual pool with monthly drawdown'
}, {
  id: 3,
  name: 'Multi-Year Contract',
  description: '3-year term with discounted rates'
}];
export function CombinedPricingVolumePage() {
  // Volume and ramp state
  const [selectedScenario, setSelectedScenario] = useState(1);
  const [annualVolume, setAnnualVolume] = useState({
    1: 500000,
    2: 100000,
    3: 200000,
    4: 50000,
    5: 12 // Engineer months
  });
  const [showRampDrawer, setShowRampDrawer] = useState(false);
  const [activeProductForRamp, setActiveProductForRamp] = useState<number | null>(null);
  // Add the missing compareScenarios state
  const [compareScenarios, setCompareScenarios] = useState(false);
  // Ramp data state
  const [phaseData, setPhaseData] = useState({
    1: {
      phaseType: 'poc',
      phases: [{
        name: 'POC',
        months: 2,
        discountPercentage: 100
      }, {
        name: 'Production',
        months: 12,
        discountPercentage: 0
      }],
      timeUnit: 'monthly',
      distribution: [10000, 20000, 40000, 50000]
    },
    2: {
      phaseType: 'production',
      phases: [{
        name: 'Production',
        months: 12,
        discountPercentage: 0
      }],
      timeUnit: 'monthly',
      distribution: [40000, 40000, 40000, 40000]
    },
    3: {
      phaseType: 'custom',
      phases: [{
        name: 'Year 1',
        months: 12,
        discountPercentage: 0
      }, {
        name: 'Year 2',
        months: 12,
        discountPercentage: 5
      }, {
        name: 'Year 3',
        months: 12,
        discountPercentage: 10
      }],
      timeUnit: 'annual',
      distribution: [150000, 175000, 200000, 0]
    }
  });
  // Add product ramp data
  const [productRampData, setProductRampData] = useState<Record<number, any>>({});
  // Pricing state
  const [contractTerm, setContractTerm] = useState(14);
  const [competitor, setCompetitor] = useState('Manual Processes');
  const [margins, setMargins] = useState<Record<number, number>>({});
  const [expandedProduct, setExpandedProduct] = useState<number | null>(null);
  // View state
  const [viewMode, setViewMode] = useState<'sales' | 'client'>('sales');
  const [compareView, setCompareView] = useState<'partner' | 'customer'>('customer');
  const [showShareLink, setShowShareLink] = useState(false);
  // Initialize volumes
  useEffect(() => {
    // This is handled by the annualVolume state initialization
  }, []);
  // Update margins when competitor or contract term changes
  useEffect(() => {
    const minMargin = getMinMargin();
    const updatedMargins: Record<number, number> = {};
    products.forEach(product => {
      // Set margin to minimum margin + a small random amount to create variation
      updatedMargins[product.id] = minMargin + Math.random() * 0.05;
    });
    // Ensure at least one product has a margin below minimum (for VP approval)
    const randomProductId = products[Math.floor(Math.random() * products.length)].id;
    updatedMargins[randomProductId] = minMargin - 0.03;
    setMargins(updatedMargins);
  }, [competitor, contractTerm]);
  // Calculate total deal value
  const calculateTotalDealValue = () => {
    return products.reduce((total, product) => {
      const volume = annualVolume[product.id] || 0;
      const margin = margins[product.id] || 0;
      const listPrice = product.basePrice;
      const discountedPrice = listPrice * (1 - margin);
      return total + discountedPrice * volume;
    }, 0);
  };
  const totalDealValue = calculateTotalDealValue();
  // Calculate Verkada margin
  const calculateHappyRobotMargin = () => {
    return products.reduce((total, product) => {
      const volume = annualVolume[product.id] || 0;
      const margin = margins[product.id] || 0;
      const listPrice = product.basePrice;
      const cost = listPrice * 0.4; // Assume 40% COGS
      const discountedPrice = listPrice * (1 - margin);
      return total + (discountedPrice - cost) * volume;
    }, 0);
  };
  const happyRobotMargin = calculateHappyRobotMargin();
  // Determine min margin based on deal size and term
  const getMinMargin = () => {
    const dealSizeBand = guardrails.marginBands.find(band => totalDealValue >= band.min && totalDealValue < band.max);
    const termAdjustment = guardrails.contractTerms.find(term => term.months === contractTerm)?.additionalMargin || 0;
    const competitorAdjustment = guardrails.competitorAdjustments[competitor] || 0;
    return (dealSizeBand?.minMargin || 0.35) + termAdjustment + competitorAdjustment;
  };
  const minMargin = getMinMargin();
  // Apply margin to a product
  const applyMargin = (productId: number, margin: number) => {
    setMargins({
      ...margins,
      [productId]: margin
    });
  };
  // Toggle product expansion
  const toggleProduct = (productId: number) => {
    if (expandedProduct === productId) {
      setExpandedProduct(null);
    } else {
      setExpandedProduct(productId);
    }
  };
  // Open ramp drawer for site deployment
  const openPhaseRampDrawer = () => {
    setActiveProductForRamp(null);
    setShowRampDrawer(true);
  };
  // Open ramp drawer for product
  const openProductRampDrawer = (productId: number) => {
    setActiveProductForRamp(productId);
    setShowRampDrawer(true);
  };
  // Handle saving ramp configuration
  const handleSaveRamp = (data: any) => {
    // Update phase data for the selected scenario
    setPhaseData({
      ...phaseData,
      [selectedScenario]: {
        ...data
      }
    });
    setShowRampDrawer(false);
  };
  // Handle saving product ramp configuration
  const handleSaveProductRamp = (data: any) => {
    if (activeProductForRamp) {
      setProductRampData({
        ...productRampData,
        [activeProductForRamp]: {
          ...data
        }
      });
    }
    setShowRampDrawer(false);
    setActiveProductForRamp(null);
  };
  // Generate forecast data for charts
  const generateForecastData = () => {
    const data = [];
    const periods = phaseData[selectedScenario].timeUnit === 'annual' ? ['Year 1', 'Year 2', 'Year 3'] : phaseData[selectedScenario].timeUnit === 'monthly' ? Array(12).fill(0).map((_, i) => `M${i + 1}`) : ['Q1', 'Q2', 'Q3', 'Q4'];
    // Get the distribution for the selected scenario
    const distribution = phaseData[selectedScenario].distribution;
    for (let i = 0; i < distribution.length; i++) {
      const periodData: any = {
        name: periods[i] || `Period ${i + 1}`,
        period: i + 1,
        volume: distribution[i]
      };
      // Calculate revenue for this period
      const periodVolume = distribution[i];
      let periodRevenue = 0;
      // Voice minutes - assuming product id 1
      const voicePrice = products[0].basePrice * (1 - (margins[1] || 0));
      periodRevenue += voicePrice * periodVolume;
      periodData.revenue = periodRevenue;
      data.push(periodData);
    }
    return data;
  };
  const forecastData = generateForecastData();
  // Generate revenue by product data for pie chart
  const generateRevenueByProductData = () => {
    return products.map(product => {
      const margin = margins[product.id] || 0;
      const discountedPrice = product.basePrice * (1 - margin);
      const volume = annualVolume[product.id] || 0;
      const revenue = discountedPrice * volume;
      return {
        name: product.name,
        value: revenue,
        id: product.id
      };
    });
  };
  const revenueByProductData = generateRevenueByProductData();
  // Calculate total revenue
  const calculateTotalRevenue = () => {
    return revenueByProductData.reduce((sum, item) => sum + item.value, 0);
  };
  const totalRevenue = calculateTotalRevenue();
  // Check if any margin is below minimum
  const hasMarginBelowMin = () => {
    return Object.values(margins).some(margin => margin < minMargin);
  };
  // Toggle share link popup
  const toggleShareLink = () => {
    setShowShareLink(!showShareLink);
  };
  // Get approval level for a product
  const getApprovalLevel = (productId: number) => {
    const margin = margins[productId] || 0;
    const discountPercentage = Math.round(margin * 100);
    if (discountPercentage > 40) {
      return 'VP of Sales';
    } else if (discountPercentage > 20) {
      return 'Director';
    } else {
      return 'Manager';
    }
  };
  // Get approval level color
  const getApprovalLevelColor = (level: string) => {
    switch (level) {
      case 'VP of Sales':
        return 'text-red-600';
      case 'Director':
        return 'text-amber-600';
      case 'Manager':
        return 'text-blue-600';
      default:
        return 'text-green-600';
    }
  };
  // Toggle scenario comparison
  const toggleCompareScenarios = () => {
    setCompareScenarios(!compareScenarios);
  };
  // Generate comparison data for all scenarios
  const generateComparisonData = () => {
    return Object.keys(phaseData).map(scenarioId => {
      const scenario = deploymentScenarios.find(s => s.id === parseInt(scenarioId));
      const distribution = phaseData[parseInt(scenarioId)].distribution;
      const totalVolume = distribution.reduce((sum, count) => sum + count, 0);
      // Calculate total revenue for this scenario
      let scenarioRevenue = 0;
      products.forEach(product => {
        const margin = margins[product.id] || 0;
        const discountedPrice = product.basePrice * (1 - margin);
        // For simplicity, we'll just use the first product (voice minutes) to calculate revenue
        if (product.id === 1) {
          scenarioRevenue += discountedPrice * totalVolume;
        } else {
          // For other products, use their annual volume
          scenarioRevenue += discountedPrice * (annualVolume[product.id] || 0);
        }
      });
      return {
        id: parseInt(scenarioId),
        name: scenario?.name || `Scenario ${scenarioId}`,
        volume: totalVolume,
        revenue: scenarioRevenue,
        distribution: distribution,
        phases: phaseData[parseInt(scenarioId)].phases,
        selected: parseInt(scenarioId) === selectedScenario
      };
    });
  };
  const comparisonData = generateComparisonData();
  // Generate product-specific revenue data for charts
  const generateProductRevenueData = (productId: number) => {
    const data = [];
    const periods = phaseData[selectedScenario].timeUnit === 'annual' ? ['Year 1', 'Year 2', 'Year 3'] : phaseData[selectedScenario].timeUnit === 'monthly' ? Array(12).fill(0).map((_, i) => `M${i + 1}`) : ['Q1', 'Q2', 'Q3', 'Q4'];
    const product = products.find(p => p.id === productId);
    if (!product) return [];
    // Get the distribution for the selected scenario
    const distribution = phaseData[selectedScenario].distribution;
    const margin = margins[productId] || 0;
    const discountedPrice = product.basePrice * (1 - margin);
    const annualProductVolume = annualVolume[productId] || 0;
    // Calculate the proportion of the product's volume to distribute
    // This is a simplification - in a real app, you'd have specific distributions per product
    const totalScenarioVolume = distribution.reduce((sum, vol) => sum + vol, 0);
    const volumeRatio = totalScenarioVolume > 0 ? annualProductVolume / totalScenarioVolume : 0;
    for (let i = 0; i < distribution.length; i++) {
      const periodData: any = {
        name: periods[i] || `Period ${i + 1}`,
        period: i + 1,
        volume: Math.round(distribution[i] * volumeRatio)
      };
      // Calculate revenue for this period
      const periodRevenue = discountedPrice * periodData.volume;
      periodData.revenue = periodRevenue;
      data.push(periodData);
    }
    return data;
  };
  // Calculate annual contract value
  const calculateAnnualContractValue = () => {
    return products.reduce((total, product) => {
      const margin = margins[product.id] || 0;
      const discountedPrice = product.basePrice * (1 - margin);
      const volume = annualVolume[product.id] || 0;
      return total + discountedPrice * volume;
    }, 0);
  };
  const annualContractValue = calculateAnnualContractValue();
  // Function to update annual volume for a product
  const updateAnnualVolume = (productId: number, volume: number) => {
    setAnnualVolume({
      ...annualVolume,
      [productId]: volume
    });
  };
  return <Fragment>
      <div className="w-full pb-20">
        <div className="p-4 border-b border-gray-200">
          <div className="flex items-center gap-2">
            <Link to="/" className="text-sm text-gray-500 hover:text-gray-700">
              FreightWave Logistics
            </Link>
            <ArrowRight size={12} className="text-gray-500" />
            <Link to="/configure" className="text-sm text-gray-500 hover:text-gray-700">
              Configure
            </Link>
            <ArrowRight size={12} className="text-gray-500" />
            <span className="text-sm font-medium">Volume & Pricing</span>
          </div>
        </div>
        <div className="max-w-6xl mx-auto p-6">
          <div className="flex justify-between items-center mb-6">
            <div>
              <h1 className="text-2xl font-semibold mb-1">Volume & Pricing</h1>
              <p className="text-gray-500">
                Configure deployment phases, volume, and pricing structure
              </p>
            </div>
            <div className="flex items-center gap-2 p-1 bg-gray-100 rounded-md">
              <button className={`flex items-center gap-1 px-3 py-1.5 rounded-md text-sm transition-colors ${viewMode === 'sales' ? 'bg-white shadow-sm' : 'text-gray-600'}`} onClick={() => setViewMode('sales')}>
                <BarChart3 size={14} />
                <span>Sales View</span>
              </button>
              <button className={`flex items-center gap-1 px-3 py-1.5 rounded-md text-sm transition-colors ${viewMode === 'client' ? 'bg-white shadow-sm' : 'text-gray-600'}`} onClick={() => setViewMode('client')}>
                <PieChart size={14} />
                <span>Customer View</span>
              </button>
            </div>
          </div>
          {/* Customer View */}
          {viewMode === 'client' && <div className="mb-8 border border-gray-200 rounded-md p-6 bg-white shadow-sm">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-lg font-medium">Customer Summary</h2>
                <button onClick={toggleShareLink} className="flex items-center gap-1 px-3 py-1.5 bg-gray-100 hover:bg-gray-200 rounded-md text-sm">
                  <Share2 size={14} />
                  <span>Share Link</span>
                </button>
              </div>
              {showShareLink && <div className="mb-6 p-4 bg-gray-50 border border-gray-200 rounded-md flex items-center justify-between">
                  <div className="flex items-center gap-2 flex-1">
                    <LinkIcon size={16} className="text-gray-500" />
                    <input type="text" value="https://dealops.happyrobot.ai/share/quote/8f72bd3a" readOnly className="flex-1 bg-transparent border-none text-sm focus:outline-none" />
                  </div>
                  <div className="flex items-center gap-2">
                    <button className="text-sm text-gray-600 px-3 py-1 border border-gray-200 rounded-md">
                      <Copy size={14} className="inline mr-1" />
                      <span>Copy</span>
                    </button>
                    <button className="text-sm text-white px-3 py-1 bg-black rounded-md">
                      Send
                    </button>
                  </div>
                </div>}
              <div className="grid grid-cols-2 gap-8">
                {/* Volume Visualization */}
                <div>
                  <h3 className="text-sm font-medium text-gray-500 mb-3">
                    Volume Forecast
                  </h3>
                  <div className="h-64">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={forecastData}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="name" />
                        <YAxis orientation="left" label={{
                      value: 'Volume',
                      angle: -90,
                      position: 'insideLeft'
                    }} />
                        <Tooltip />
                        <Bar dataKey="volume" fill="#000" name="Voice Minutes" />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </div>
                {/* Revenue Forecast */}
                <div>
                  <h3 className="text-sm font-medium text-gray-500 mb-3">
                    Revenue by Product
                  </h3>
                  <div className="h-64 flex items-center">
                    <ResponsiveContainer width="100%" height="100%">
                      <RechartsPieChart>
                        <Pie data={revenueByProductData} cx="50%" cy="50%" outerRadius={80} fill="#8884d8" dataKey="value" label={({
                      name,
                      percent
                    }) => `${name}: ${(percent * 100).toFixed(0)}%`}>
                          {revenueByProductData.map((entry, index) => <Cell key={`cell-${index}`} fill={`rgb(${70 + index * 30}, ${70 + index * 30}, ${70 + index * 30})`} />)}
                        </Pie>
                        <Tooltip formatter={value => [`$${Number(value).toLocaleString()}`, 'Revenue']} />
                      </RechartsPieChart>
                    </ResponsiveContainer>
                  </div>
                </div>
              </div>
              <div className="mt-8 grid grid-cols-4 gap-4">
                <div className="p-4 border border-gray-100 rounded-md bg-gray-50">
                  <div className="text-sm text-gray-500 mb-1">
                    Annual Contract Value
                  </div>
                  <div className="text-2xl font-semibold">
                    ${annualContractValue.toLocaleString()}
                  </div>
                </div>
                <div className="p-4 border border-gray-100 rounded-md bg-gray-50">
                  <div className="text-sm text-gray-500 mb-1">
                    Contract Term
                  </div>
                  <div className="text-2xl font-semibold">
                    {contractTerm} months
                  </div>
                </div>
                <div className="p-4 border border-gray-100 rounded-md bg-gray-50">
                  <div className="text-sm text-gray-500 mb-1">
                    Voice Minutes
                  </div>
                  <div className="text-2xl font-semibold">
                    {annualVolume[1].toLocaleString()}
                  </div>
                </div>
                <div className="p-4 border border-gray-100 rounded-md bg-gray-50">
                  <div className="text-sm text-gray-500 mb-1">
                    Avg. Monthly Cost
                  </div>
                  <div className="text-2xl font-semibold">
                    ${Math.round(annualContractValue / 12).toLocaleString()}
                  </div>
                </div>
              </div>
              <div className="mt-4 p-4 bg-gray-50 border border-gray-100 rounded-md">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-medium">Deployment Schedule</h3>
                    <p className="text-sm text-gray-500 mt-1">
                      {deploymentScenarios.find(s => s.id === selectedScenario)?.description}
                      :{' '}
                      {phaseData[selectedScenario].phases.map(phase => phase.name).join(' → ')}
                    </p>
                  </div>
                  <div className="text-sm font-medium">
                    {deploymentScenarios.find(s => s.id === selectedScenario)?.name}
                  </div>
                </div>
              </div>
            </div>}
        </div>
        <div className="space-y-8">
          {/* Deployment Scenario Selection */}
          <div className="border border-gray-200 rounded-md p-6 bg-white shadow-sm">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-medium">Deployment Scenario</h2>
              <button className="text-sm text-gray-600 flex items-center gap-1" onClick={toggleCompareScenarios}>
                {compareScenarios ? 'Hide Comparison' : 'Compare Scenarios'}
              </button>
            </div>
            {!compareScenarios ? <div className="grid grid-cols-3 gap-4 mb-6">
                {deploymentScenarios.map(scenario => <button key={scenario.id} className={`p-4 border rounded-md text-left transition-all ${selectedScenario === scenario.id ? 'border-black bg-gray-50 shadow-sm' : 'border-gray-200 hover:border-gray-300'}`} onClick={() => setSelectedScenario(scenario.id)}>
                    <div className="flex justify-between items-start">
                      <div>
                        <span className="font-medium block">
                          {scenario.name}
                        </span>
                        <span className="text-sm text-gray-500">
                          {scenario.description}
                        </span>
                      </div>
                      {selectedScenario === scenario.id && <span className="bg-black text-white p-1 rounded-full">
                          <Check size={12} />
                        </span>}
                    </div>
                  </button>)}
              </div> : <div className="mb-6 overflow-x-auto">
                <table className="w-full border-collapse">
                  <thead>
                    <tr className="bg-gray-50">
                      <th className="p-3 text-left text-xs font-medium text-gray-500 border border-gray-200">
                        SCENARIO
                      </th>
                      <th className="p-3 text-left text-xs font-medium text-gray-500 border border-gray-200">
                        DESCRIPTION
                      </th>
                      <th className="p-3 text-left text-xs font-medium text-gray-500 border border-gray-200">
                        PHASES
                      </th>
                      <th className="p-3 text-left text-xs font-medium text-gray-500 border border-gray-200">
                        REVENUE
                      </th>
                      <th className="p-3 text-left text-xs font-medium text-gray-500 border border-gray-200">
                        VOLUME DISTRIBUTION
                      </th>
                      <th className="p-3 text-center text-xs font-medium text-gray-500 border border-gray-200">
                        SELECT
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {comparisonData.map(scenario => <tr key={scenario.id} className={scenario.selected ? 'bg-gray-50' : ''}>
                        <td className="p-3 border border-gray-200 font-medium">
                          {scenario.name}
                        </td>
                        <td className="p-3 border border-gray-200 text-sm">
                          {deploymentScenarios.find(s => s.id === scenario.id)?.description}
                        </td>
                        <td className="p-3 border border-gray-200">
                          {scenario.phases.map(phase => phase.name).join(' → ')}
                        </td>
                        <td className="p-3 border border-gray-200">
                          ${Math.round(scenario.revenue).toLocaleString()}
                        </td>
                        <td className="p-3 border border-gray-200">
                          <div className="flex items-center gap-1">
                            {scenario.distribution.map((count, index) => <div key={index} className="text-xs px-2 py-0.5 bg-gray-100 rounded">
                                {phaseData[scenario.id].timeUnit === 'quarterly' ? `Q${index + 1}` : phaseData[scenario.id].timeUnit === 'monthly' ? `M${index + 1}` : `Y${index + 1}`}
                                : {count.toLocaleString()}
                              </div>)}
                          </div>
                        </td>
                        <td className="p-3 border border-gray-200 text-center">
                          <button className={`w-6 h-6 rounded-full border ${scenario.selected ? 'bg-black border-black' : 'border-gray-300'} flex items-center justify-center`} onClick={() => setSelectedScenario(scenario.id)}>
                            {scenario.selected && <Check size={12} className="text-white" />}
                          </button>
                        </td>
                      </tr>)}
                  </tbody>
                </table>
              </div>}
            <div className="grid grid-cols-3 gap-6">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="block text-sm font-medium text-gray-700">
                    Contract Term
                  </label>
                  <div className="flex items-center gap-1">
                    <Calendar size={14} className="text-gray-500" />
                    <span className="text-sm text-gray-500">
                      {contractTerm} months
                    </span>
                  </div>
                </div>
                <select value={contractTerm} onChange={e => setContractTerm(Number(e.target.value))} className="w-full px-3 py-2 border border-gray-300 rounded-md">
                  <option value={14}>
                    14 months (2-month POC + 12-month Production)
                  </option>
                  <option value={12}>12 months</option>
                  <option value={36}>36 months (3 years)</option>
                  <option value={60}>60 months (5 years)</option>
                </select>
              </div>
              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="block text-sm font-medium text-gray-700">
                    Competitor
                  </label>
                  <div className="flex items-center gap-1">
                    <AlertCircle size={14} className="text-amber-500" />
                    <span className="text-sm text-amber-500">
                      Affects discount thresholds
                    </span>
                  </div>
                </div>
                <select value={competitor} onChange={e => setCompetitor(e.target.value)} className="w-full px-3 py-2 border border-gray-300 rounded-md">
                  {Object.keys(guardrails.competitorAdjustments).map(comp => <option key={comp} value={comp}>
                      {comp}
                      {guardrails.competitorAdjustments[comp] !== 0 ? ` (${guardrails.competitorAdjustments[comp] > 0 ? '+' : ''}${Math.abs(guardrails.competitorAdjustments[comp] * 100)}% allowance)` : ''}
                    </option>)}
                </select>
              </div>
              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="block text-sm font-medium text-gray-700">
                    Pricing Structure
                  </label>
                  <div className="flex items-center gap-1">
                    <DollarSign size={14} className="text-gray-500" />
                    <span className="text-sm text-gray-500">
                      {selectedScenario === 1 ? 'POC → Production' : selectedScenario === 2 ? 'Annual Commitment' : 'Multi-Year Contract'}
                    </span>
                  </div>
                </div>
                <div className="px-3 py-2 border border-gray-300 rounded-md bg-gray-50 text-sm">
                  {selectedScenario === 1 && 'Free POC followed by standard production pricing'}
                  {selectedScenario === 2 && 'Annual pool of minutes/emails with monthly drawdown'}
                  {selectedScenario === 3 && 'Multi-year contract with increasing discounts over time'}
                </div>
              </div>
            </div>
            <div className="mt-6">
              <div className="flex items-center justify-between mb-2">
                <label className="block text-sm font-medium text-gray-700">
                  Deployment Phases
                </label>
                <div className="flex items-center gap-2">
                  <select value={phaseData[selectedScenario].timeUnit} onChange={e => {
                  const newTimeUnit = e.target.value as 'monthly' | 'quarterly' | 'annual';
                  setPhaseData({
                    ...phaseData,
                    [selectedScenario]: {
                      ...phaseData[selectedScenario],
                      timeUnit: newTimeUnit
                    }
                  });
                }} className="px-2 py-1 text-sm border border-gray-200 rounded-md mr-2">
                    <option value="monthly">Monthly</option>
                    <option value="quarterly">Quarterly</option>
                    <option value="annual">Annual</option>
                  </select>
                  <button onClick={openPhaseRampDrawer} className="text-sm text-gray-600 flex items-center gap-1">
                    <Settings size={14} />
                    <span>Customize</span>
                  </button>
                </div>
              </div>
              <div className="h-20">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={forecastData}>
                    <XAxis dataKey="name" axisLine={false} tickLine={false} />
                    <Tooltip />
                    <Bar dataKey="volume" fill="#000" radius={[4, 4, 0, 0]}>
                      {forecastData.map((entry, index) => <Cell key={`cell-${index}`} fill={entry.volume > 0 ? '#000' : '#f3f4f6'} />)}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>
              <div className="flex justify-between text-xs text-gray-500 mt-1">
                {phaseData[selectedScenario].timeUnit === 'quarterly' ? <>
                    <span>
                      Q1: {forecastData[0]?.volume.toLocaleString() || 0}{' '}
                      minutes
                    </span>
                    <span>
                      Q2: {forecastData[1]?.volume.toLocaleString() || 0}{' '}
                      minutes
                    </span>
                    <span>
                      Q3: {forecastData[2]?.volume.toLocaleString() || 0}{' '}
                      minutes
                    </span>
                    <span>
                      Q4: {forecastData[3]?.volume.toLocaleString() || 0}{' '}
                      minutes
                    </span>
                  </> : phaseData[selectedScenario].timeUnit === 'monthly' ? <span>Monthly distribution (hover chart for details)</span> : <>
                    <span>
                      Year 1: {forecastData[0]?.volume.toLocaleString() || 0}{' '}
                      minutes
                    </span>
                    <span>
                      Year 2: {forecastData[1]?.volume.toLocaleString() || 0}{' '}
                      minutes
                    </span>
                    <span>
                      Year 3: {forecastData[2]?.volume.toLocaleString() || 0}{' '}
                      minutes
                    </span>
                  </>}
              </div>
            </div>
          </div>
          {/* Product Volume & Pricing Table */}
          <div className="border border-gray-200 rounded-md overflow-hidden bg-white shadow-sm">
            <div className="p-4 border-b border-gray-200 bg-gray-50 flex justify-between items-center">
              <h2 className="font-medium">Products & Pricing</h2>
              <div className="flex gap-2">
                <button className="flex items-center gap-1 text-sm text-gray-500 px-2 py-1 hover:bg-gray-100 rounded">
                  <Plus size={14} />
                  <span>Add Product</span>
                </button>
                <button className="flex items-center gap-1 text-sm text-gray-500 px-2 py-1 hover:bg-gray-100 rounded">
                  <Settings size={14} />
                  <span>Customize</span>
                </button>
              </div>
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
                    ANNUAL VOLUME
                  </th>
                  <th className="p-4 text-xs font-medium text-gray-500">
                    LIST PRICE
                  </th>
                  <th className="p-4 text-xs font-medium text-gray-500">
                    DISCOUNT (%)
                  </th>
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
                const volume = annualVolume[product.id] || 0;
                const discountedPrice = product.basePrice * (1 - margin);
                // Determine margin status
                let marginStatus = 'green';
                if (margin < minMargin) {
                  marginStatus = 'red';
                } else if (margin < minMargin + 0.05) {
                  marginStatus = 'amber';
                }
                const approvalLevel = getApprovalLevel(product.id);
                const approvalColor = getApprovalLevelColor(approvalLevel);
                return <Fragment key={product.id}>
                      <tr className="hover:bg-gray-50 cursor-pointer transition-colors" onClick={() => toggleProduct(product.id)}>
                        <td className="p-4 font-medium flex items-center">
                          {expandedProduct === product.id ? <ChevronDown size={16} className="mr-2" /> : <ChevronRight size={16} className="mr-2" />}
                          {product.name}
                        </td>
                        <td className="p-4">{product.category}</td>
                        <td className="p-4">
                          <div className="flex items-center gap-2">
                            <input type="text" value={volume} onChange={e => {
                          const newValue = e.target.value === '' ? '' : Number(e.target.value);
                          updateAnnualVolume(product.id, newValue === '' ? 0 : newValue);
                        }} className="w-24 px-2 py-1 border border-gray-300 rounded-md" onClick={e => e.stopPropagation()} />
                            {viewMode === 'sales' && <button onClick={e => {
                          e.stopPropagation();
                          openProductRampDrawer(product.id);
                        }} className="text-gray-500 hover:text-gray-700" title="Configure volume ramp">
                                <Settings size={14} />
                              </button>}
                          </div>
                        </td>
                        <td className="p-4">
                          ${product.basePrice.toFixed(2)} {product.unit}
                        </td>
                        <td className="p-4">
                          {viewMode === 'sales' ? <div className="flex items-center gap-2">
                              <input type="text" value={Math.round(margin * 100)} onChange={e => {
                          const newValue = e.target.value === '' ? '' : Number(e.target.value);
                          applyMargin(product.id, newValue === '' ? 0 : newValue / 100);
                        }} className={`w-16 px-2 py-1 border rounded-md ${marginStatus === 'red' ? 'border-red-300' : marginStatus === 'amber' ? 'border-amber-300' : 'border-gray-300'}`} onClick={e => e.stopPropagation()} />
                              %
                              <div className={`w-3 h-3 rounded-full ${marginStatus === 'red' ? 'bg-red-500' : marginStatus === 'amber' ? 'bg-amber-500' : 'bg-green-500'}`}></div>
                            </div> : <span>{Math.round(margin * 100)}%</span>}
                        </td>
                        <td className="p-4">
                          ${discountedPrice.toFixed(2)} {product.unit}
                        </td>
                        <td className="p-4">
                          $
                          {(discountedPrice * volume).toLocaleString(undefined, {
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 2
                      })}
                        </td>
                        {viewMode === 'sales' && <td className="p-4">
                            {approvalLevel !== 'None' ? <span className={`px-2 py-1 text-xs font-medium rounded-full ${approvalLevel === 'VP of Sales' ? 'bg-red-100 text-red-700' : approvalLevel === 'Director' ? 'bg-amber-100 text-amber-700' : 'bg-blue-100 text-blue-700'}`}>
                                {approvalLevel}
                              </span> : '—'}
                          </td>}
                      </tr>
                      {expandedProduct === product.id && <tr className="bg-gray-50/50">
                          <td colSpan={viewMode === 'sales' ? 8 : 7} className="p-4">
                            <div className="grid grid-cols-2 gap-6">
                              <div>
                                <h3 className="text-sm font-medium mb-2">
                                  Volume & Revenue Forecast
                                </h3>
                                <div className="h-48 mb-4">
                                  <ResponsiveContainer width="100%" height="100%">
                                    <BarChart data={generateProductRevenueData(product.id)}>
                                      <CartesianGrid strokeDasharray="3 3" />
                                      <XAxis dataKey="name" />
                                      <YAxis />
                                      <Tooltip formatter={value => [`$${Math.round(Number(value)).toLocaleString()}`, 'Revenue']} />
                                      <Bar dataKey="revenue" fill="#000" />
                                    </BarChart>
                                  </ResponsiveContainer>
                                </div>
                                {productRampData[product.id] && <div className="flex justify-end">
                                    <button className="text-sm text-gray-600 flex items-center gap-1" onClick={e => {
                              e.stopPropagation();
                              openProductRampDrawer(product.id);
                            }}>
                                      <Settings size={14} />
                                      <span>Edit Volume Ramp</span>
                                    </button>
                                  </div>}
                              </div>
                              <div>
                                <h3 className="text-sm font-medium mb-2">
                                  Pricing Tiers
                                </h3>
                                <div className="p-3 bg-gray-100 rounded-md text-sm space-y-3">
                                  <div className="flex justify-between items-center">
                                    <span>
                                      First 100,000 {product.unit.split(' ')[1]}
                                    </span>
                                    <span className="font-medium">
                                      ${product.basePrice.toFixed(2)}{' '}
                                      {product.unit}
                                    </span>
                                  </div>
                                  <div className="flex justify-between items-center">
                                    <span>
                                      100,001 - 500,000{' '}
                                      {product.unit.split(' ')[1]}
                                    </span>
                                    <span className="font-medium">
                                      ${(product.basePrice * 0.9).toFixed(2)}{' '}
                                      {product.unit}
                                    </span>
                                  </div>
                                  <div className="flex justify-between items-center">
                                    <span>
                                      500,001+ {product.unit.split(' ')[1]}
                                    </span>
                                    <span className="font-medium">
                                      ${(product.basePrice * 0.8).toFixed(2)}{' '}
                                      {product.unit}
                                    </span>
                                  </div>
                                </div>
                                {viewMode === 'sales' && <div className="mt-4">
                                    <h3 className="text-sm font-medium mb-2">
                                      Margin Analysis
                                    </h3>
                                    <div className="p-3 bg-gray-100 rounded-md text-sm space-y-2">
                                      <div className="flex justify-between items-center">
                                        <span>Cost</span>
                                        <span className="font-medium">
                                          $
                                          {(product.basePrice * 0.4).toFixed(2)}{' '}
                                          {product.unit}
                                        </span>
                                      </div>
                                      <div className="flex justify-between items-center">
                                        <span>Net Price</span>
                                        <span className="font-medium">
                                          ${discountedPrice.toFixed(2)}{' '}
                                          {product.unit}
                                        </span>
                                      </div>
                                      <div className="flex justify-between items-center">
                                        <span>Contribution Margin</span>
                                        <span className={`font-medium ${marginStatus === 'red' ? 'text-red-600' : marginStatus === 'amber' ? 'text-amber-600' : 'text-green-600'}`}>
                                          {Math.round((1 - product.basePrice * 0.4 / discountedPrice) * 100)}
                                          %
                                        </span>
                                      </div>
                                    </div>
                                  </div>}
                              </div>
                            </div>
                          </td>
                        </tr>}
                    </Fragment>;
              })}
              </tbody>
              <tfoot className="bg-gray-100 font-medium">
                <tr>
                  <td className="p-4" colSpan={6}>
                    Total Annual Contract Value
                  </td>
                  <td className="p-4">
                    $
                    {annualContractValue.toLocaleString(undefined, {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2
                  })}
                  </td>
                  {viewMode === 'sales' && <td className="p-4"></td>}
                </tr>
              </tfoot>
            </table>
          </div>
        </div>
        <div className="mt-8 flex justify-end gap-3">
          <Link to="/configure" className="px-4 py-2 border border-gray-200 rounded-md text-sm font-medium transition-colors hover:bg-gray-50">
            Back
          </Link>
          <Link to="/quote" className="px-4 py-2 bg-black text-white rounded-md text-sm font-medium transition-colors hover:bg-gray-800">
            Next
          </Link>
        </div>
      </div>
      {/* Persistent Bottom Bar */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 shadow-md z-20">
        <div className="max-w-6xl mx-auto px-6 py-3 flex justify-between items-center">
          <div className="flex items-start gap-8">
            <div>
              <div className="text-sm text-gray-500">Annual Contract Value</div>
              <div className="text-xl font-semibold">
                $
                {annualContractValue.toLocaleString(undefined, {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2
              })}
              </div>
            </div>
            <div>
              <div className="text-sm text-gray-500">Monthly Average</div>
              <div className="text-xl font-semibold">
                ${Math.round(annualContractValue / 12).toLocaleString()}/mo
              </div>
            </div>
            <div>
              <div className="text-sm text-gray-500">HappyRobot Margin</div>
              <div className="text-xl font-semibold">
                $
                {happyRobotMargin.toLocaleString(undefined, {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2
              })}
              </div>
            </div>
            <div>
              <div className="text-sm text-gray-500">Contract Term</div>
              <div className="text-xl font-semibold">{contractTerm} months</div>
            </div>
            {hasMarginBelowMin() && <div className="flex items-center">
                <span className="bg-black text-white text-xs font-medium px-2 py-1 rounded mr-2">
                  VP of Sales
                </span>
                <span className="text-sm">approval required</span>
              </div>}
          </div>
          <div className="flex gap-3">
            <button className="px-4 py-2 border border-gray-200 rounded-md text-sm font-medium">
              Save
            </button>
            <button className="px-4 py-2 bg-black text-white rounded-md text-sm font-medium">
              Generate Quote
            </button>
          </div>
        </div>
      </div>
      {/* Ramp Configuration Drawer */}
      <RampDrawer isOpen={showRampDrawer} onClose={() => {
      setShowRampDrawer(false);
      setActiveProductForRamp(null);
    }} onSave={activeProductForRamp ? handleSaveProductRamp : handleSaveRamp} initialValues={activeProductForRamp ? productRampData[activeProductForRamp] || {
      phaseType: phaseData[selectedScenario].phaseType,
      phases: phaseData[selectedScenario].phases,
      timeUnit: phaseData[selectedScenario].timeUnit,
      distribution: phaseData[selectedScenario].distribution
    } : {
      phaseType: phaseData[selectedScenario].phaseType,
      phases: phaseData[selectedScenario].phases,
      timeUnit: phaseData[selectedScenario].timeUnit,
      distribution: phaseData[selectedScenario].distribution
    }} isProductRamp={activeProductForRamp !== null} productName={activeProductForRamp ? products.find(p => p.id === activeProductForRamp)?.name : undefined} />
    </Fragment>;
}