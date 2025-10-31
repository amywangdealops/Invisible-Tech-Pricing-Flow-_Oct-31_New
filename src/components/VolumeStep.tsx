import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Info, Settings, Calendar, ChevronDown, Plus, Minus, BarChart3, TrendingUp, Clock, AlertCircle } from 'lucide-react';
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
// Deployment phase types
const phaseTypes = [{
  id: 'poc-production',
  name: 'POC → Production',
  description: '2-month POC followed by production',
  phases: [{
    name: 'POC',
    months: 2,
    discount: 100
  }, {
    name: 'Production',
    months: 12,
    discount: 0
  }]
}, {
  id: 'annual-commitment',
  name: 'Annual Commitment',
  description: 'Standard 12-month contract',
  phases: [{
    name: 'Production',
    months: 12,
    discount: 0
  }]
}, {
  id: 'multi-year',
  name: 'Multi-Year Contract',
  description: '36-month contract with volume tiers',
  phases: [{
    name: 'Year 1',
    months: 12,
    discount: 0
  }, {
    name: 'Year 2',
    months: 12,
    discount: 5
  }, {
    name: 'Year 3',
    months: 12,
    discount: 10
  }]
}];
// Freight industry seasonality patterns
const seasonalityPatterns = [{
  id: 'standard',
  name: 'Standard Distribution',
  distribution: [25, 25, 25, 25]
}, {
  id: 'produce-season',
  name: 'Produce Season',
  distribution: [15, 35, 35, 15]
}, {
  id: 'retail-peak',
  name: 'Retail Peak',
  distribution: [20, 20, 25, 35]
}, {
  id: 'manufacturing',
  name: 'Manufacturing',
  distribution: [22, 28, 28, 22]
}, {
  id: 'custom',
  name: 'Custom',
  distribution: [25, 25, 25, 25]
}];
// HappyRobot products
const products = [{
  id: 'voice',
  name: 'Voice Minutes',
  unit: 'minutes',
  baseVolume: 500000
}, {
  id: 'email',
  name: 'Email',
  unit: 'emails',
  baseVolume: 100000
}, {
  id: 'messaging',
  name: 'SMS & Messaging',
  unit: 'messages',
  baseVolume: 200000
}, {
  id: 'documents',
  name: 'Document Parsing',
  unit: 'documents',
  baseVolume: 50000
}, {
  id: 'engineer',
  name: 'Deployed Engineer',
  unit: 'months',
  baseVolume: 12
}];
export function VolumeStep() {
  // State for phase configuration
  const [selectedPhaseType, setSelectedPhaseType] = useState('poc-production');
  const [phases, setPhases] = useState(phaseTypes[0].phases);
  const [phaseCustomized, setPhaseCustomized] = useState(false);
  // State for seasonality
  const [selectedSeasonality, setSelectedSeasonality] = useState('standard');
  const [quarterDistribution, setQuarterDistribution] = useState([25, 25, 25, 25]);
  const [showSeasonalityDropdown, setShowSeasonalityDropdown] = useState(false);
  // State for product volumes
  const [productVolumes, setProductVolumes] = useState<Record<string, number>>({});
  const [expandedProduct, setExpandedProduct] = useState<string | null>(null);
  // State for visualization options
  const [timeUnit, setTimeUnit] = useState<'monthly' | 'quarterly'>('monthly');
  const [viewMode, setViewMode] = useState<'volume' | 'forecast'>('volume');
  // Initialize product volumes
  useEffect(() => {
    const initialVolumes: Record<string, number> = {};
    products.forEach(product => {
      initialVolumes[product.id] = product.baseVolume;
    });
    setProductVolumes(initialVolumes);
  }, []);
  // Update phases when phase type changes
  useEffect(() => {
    if (!phaseCustomized) {
      const phaseType = phaseTypes.find(type => type.id === selectedPhaseType);
      if (phaseType) {
        setPhases([...phaseType.phases]);
      }
    }
  }, [selectedPhaseType, phaseCustomized]);
  // Update distribution when seasonality changes
  useEffect(() => {
    const pattern = seasonalityPatterns.find(pattern => pattern.id === selectedSeasonality);
    if (pattern) {
      setQuarterDistribution([...pattern.distribution]);
    }
  }, [selectedSeasonality]);
  // Calculate total months
  const totalMonths = phases.reduce((sum, phase) => sum + phase.months, 0);
  // Generate forecast data
  const generateForecastData = () => {
    const data = [];
    // Determine periods based on time unit
    const periods = timeUnit === 'monthly' ? totalMonths : Math.ceil(totalMonths / 3);
    // Calculate total volume across all products
    const totalVoiceVolume = productVolumes['voice'] || 0;
    // Distribute across periods
    let currentMonth = 0;
    let remainingVolume = totalVoiceVolume;
    for (let i = 0; i < periods; i++) {
      let periodVolume = 0;
      if (timeUnit === 'monthly') {
        // Find which phase this month belongs to
        let phaseIndex = 0;
        let monthInPhase = currentMonth;
        for (let j = 0; j < phases.length; j++) {
          if (monthInPhase < phases[j].months) {
            phaseIndex = j;
            break;
          }
          monthInPhase -= phases[j].months;
        }
        // Calculate volume for this month
        const phase = phases[phaseIndex];
        const quarterIndex = Math.floor(currentMonth % 12 / 3);
        const quarterFactor = quarterDistribution[quarterIndex] / 25; // Normalize to 1.0
        // For POC, use minimal volume
        if (phase.name === 'POC') {
          periodVolume = 10000 * quarterFactor;
        } else {
          // For production, distribute remaining volume
          const monthsLeft = totalMonths - currentMonth;
          periodVolume = remainingVolume / monthsLeft * quarterFactor;
        }
        currentMonth++;
      } else {
        // Quarterly
        // Sum up the three months in this quarter
        for (let j = 0; j < 3 && currentMonth < totalMonths; j++) {
          // Find which phase this month belongs to
          let phaseIndex = 0;
          let monthInPhase = currentMonth;
          for (let k = 0; k < phases.length; k++) {
            if (monthInPhase < phases[k].months) {
              phaseIndex = k;
              break;
            }
            monthInPhase -= phases[k].months;
          }
          // Calculate volume for this month
          const phase = phases[phaseIndex];
          const quarterIndex = Math.floor(currentMonth % 12 / 3);
          const quarterFactor = quarterDistribution[quarterIndex] / 25; // Normalize to 1.0
          // For POC, use minimal volume
          if (phase.name === 'POC') {
            periodVolume += 10000 * quarterFactor;
          } else {
            // For production, distribute remaining volume
            const monthsLeft = totalMonths - currentMonth;
            periodVolume += remainingVolume / monthsLeft * quarterFactor;
          }
          currentMonth++;
        }
      }
      remainingVolume -= periodVolume;
      data.push({
        period: timeUnit === 'monthly' ? `M${i + 1}` : `Q${i + 1}`,
        volume: Math.round(periodVolume),
        phase: getPhaseName(i)
      });
    }
    return data;
  };
  // Get phase name for a specific period
  const getPhaseName = (periodIndex: number) => {
    let month = timeUnit === 'monthly' ? periodIndex : periodIndex * 3;
    let phaseIndex = 0;
    let monthCount = 0;
    for (let i = 0; i < phases.length; i++) {
      monthCount += phases[i].months;
      if (month < monthCount) {
        phaseIndex = i;
        break;
      }
    }
    return phases[phaseIndex].name;
  };
  // Calculate annual volume for a product
  const getAnnualVolume = (productId: string) => {
    return productVolumes[productId] || 0;
  };
  // Update product volume
  const updateProductVolume = (productId: string, volume: number) => {
    setProductVolumes({
      ...productVolumes,
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
  // Handle phase change
  const handlePhaseChange = (index: number, field: string, value: any) => {
    const newPhases = [...phases];
    newPhases[index] = {
      ...newPhases[index],
      [field]: value
    };
    setPhases(newPhases);
    setPhaseCustomized(true);
  };
  // Add a new phase
  const addPhase = () => {
    setPhases([...phases, {
      name: `Phase ${phases.length + 1}`,
      months: 3,
      discount: 0
    }]);
    setPhaseCustomized(true);
  };
  // Remove a phase
  const removePhase = (index: number) => {
    if (phases.length > 1) {
      const newPhases = [...phases];
      newPhases.splice(index, 1);
      setPhases(newPhases);
      setPhaseCustomized(true);
    }
  };
  // Check if distribution adds up to 100%
  const isDistributionValid = quarterDistribution.reduce((sum, value) => sum + value, 0) === 100;
  // Generate forecast data
  const forecastData = generateForecastData();
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
          <span className="font-medium text-black">Volume</span>
        </div>
      </div>
      <div className="max-w-5xl mx-auto p-6">
        <h1 className="text-2xl font-semibold mb-2">Volume & Deployment</h1>
        <p className="text-gray-500 mb-8">
          Configure deployment phases and volume forecasts for FreightWave
          Logistics
        </p>
        <div className="space-y-8">
          {/* Deployment Phase Configuration */}
          <div className="border border-gray-200 rounded-lg p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-medium">Deployment Phases</h2>
              <div className="flex items-center gap-2">
                <div className="text-sm text-gray-500 flex items-center gap-1">
                  <Calendar size={14} />
                  <span>Total: {totalMonths} months</span>
                </div>
                <select value={selectedPhaseType} onChange={e => {
                setSelectedPhaseType(e.target.value);
                setPhaseCustomized(false);
              }} className="text-sm border border-gray-200 rounded-md px-2 py-1">
                  {phaseTypes.map(type => <option key={type.id} value={type.id}>
                      {type.name}
                    </option>)}
                </select>
              </div>
            </div>
            <div className="space-y-4 mb-6">
              {phases.map((phase, index) => <div key={index} className="p-4 border border-gray-200 rounded-lg">
                  <div className="flex justify-between items-center mb-3">
                    <div className="flex items-center gap-2">
                      <input type="text" value={phase.name} onChange={e => handlePhaseChange(index, 'name', e.target.value)} className="font-medium border-none focus:outline-none focus:ring-0 p-0" />
                    </div>
                    {phases.length > 1 && <button onClick={() => removePhase(index)} className="text-gray-400 hover:text-red-500">
                        <Minus size={16} />
                      </button>}
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs text-gray-500 mb-1">
                        Duration (months)
                      </label>
                      <input type="number" min="1" max="36" value={phase.months} onChange={e => {
                    const value = e.target.valueAsNumber;
                    handlePhaseChange(index, 'months', isNaN(value) ? 1 : value);
                  }} className="w-full px-3 py-1.5 border border-gray-300 rounded-md text-sm" />
                    </div>
                    <div>
                      <label className="block text-xs text-gray-500 mb-1">
                        Discount (%)
                      </label>
                      <input type="number" min="0" max="100" value={phase.discount} onChange={e => {
                    const value = e.target.valueAsNumber;
                    handlePhaseChange(index, 'discount', isNaN(value) ? 0 : value);
                  }} className="w-full px-3 py-1.5 border border-gray-300 rounded-md text-sm" />
                    </div>
                  </div>
                </div>)}
              <button onClick={addPhase} className="w-full p-2 border border-dashed border-gray-300 rounded-lg text-sm text-gray-500 hover:text-gray-700 flex items-center justify-center gap-1">
                <Plus size={14} />
                <span>Add Phase</span>
              </button>
            </div>
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-sm font-medium">Volume Distribution</h3>
              <div className="flex items-center gap-2">
                <button className={`px-2 py-1 text-xs rounded-md ${viewMode === 'volume' ? 'bg-black text-white' : 'bg-gray-100 text-gray-600'}`} onClick={() => setViewMode('volume')}>
                  Volume
                </button>
                <button className={`px-2 py-1 text-xs rounded-md ${viewMode === 'forecast' ? 'bg-black text-white' : 'bg-gray-100 text-gray-600'}`} onClick={() => setViewMode('forecast')}>
                  Forecast
                </button>
                <select value={timeUnit} onChange={e => setTimeUnit(e.target.value as 'monthly' | 'quarterly')} className="text-xs border border-gray-200 rounded-md px-2 py-1">
                  <option value="monthly">Monthly</option>
                  <option value="quarterly">Quarterly</option>
                </select>
              </div>
            </div>
            <div className="h-64 mb-2">
              <ResponsiveContainer width="100%" height="100%">
                {viewMode === 'volume' ? <BarChart data={forecastData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="period" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="volume" name="Volume" fill="#000" />
                  </BarChart> : <LineChart data={forecastData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="period" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Line type="monotone" dataKey="volume" name="Volume" stroke="#000" />
                  </LineChart>}
              </ResponsiveContainer>
            </div>
            <div className="grid grid-cols-4 gap-2 text-xs text-gray-500">
              {forecastData.slice(0, 4).map((item, index) => <div key={index} className="flex justify-between">
                  <span>{item.period}:</span>
                  <span>{item.volume.toLocaleString()} units</span>
                </div>)}
            </div>
          </div>
          {/* Seasonality Configuration */}
          <div className="border border-gray-200 rounded-lg p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-medium">Seasonality Pattern</h2>
              <div className="relative">
                <button className="flex items-center gap-1 px-2 py-1 border border-gray-200 rounded-md text-sm" onClick={() => setShowSeasonalityDropdown(!showSeasonalityDropdown)}>
                  <span>
                    {seasonalityPatterns.find(pattern => pattern.id === selectedSeasonality)?.name || 'Custom'}
                  </span>
                  <ChevronDown size={14} />
                </button>
                {showSeasonalityDropdown && <div className="absolute right-0 mt-1 w-48 bg-white border border-gray-200 rounded-md shadow-lg z-10">
                    {seasonalityPatterns.map(pattern => <button key={pattern.id} className="w-full text-left px-3 py-2 hover:bg-gray-50 text-sm" onClick={() => {
                  setSelectedSeasonality(pattern.id);
                  setShowSeasonalityDropdown(false);
                }}>
                        {pattern.name}
                      </button>)}
                  </div>}
              </div>
            </div>
            <div className="grid grid-cols-4 gap-4 mb-4">
              {quarterDistribution.map((value, index) => <div key={index}>
                  <label className="block text-xs text-gray-500 mb-1">
                    Q{index + 1} Distribution (%)
                  </label>
                  <input type="number" min="0" max="100" value={value} onChange={e => {
                const newValue = e.target.valueAsNumber;
                const validValue = isNaN(newValue) ? 0 : newValue;
                const newDistribution = [...quarterDistribution];
                newDistribution[index] = validValue;
                setQuarterDistribution(newDistribution);
                setSelectedSeasonality('custom');
              }} className="w-full px-3 py-1.5 border border-gray-300 rounded-md text-sm" />
                </div>)}
            </div>
            <div className={`p-3 rounded-md flex items-center justify-between ${isDistributionValid ? 'bg-green-50 border border-green-100' : 'bg-amber-50 border border-amber-100'}`}>
              <div className="flex items-center gap-1">
                {isDistributionValid ? <Info size={14} className="text-green-500" /> : <AlertCircle size={14} className="text-amber-500" />}
                <span className="text-sm">
                  Total:{' '}
                  {quarterDistribution.reduce((sum, value) => sum + value, 0)}%
                  {!isDistributionValid && ' (should be 100%)'}
                </span>
              </div>
              {!isDistributionValid && <button className="text-xs px-2 py-1 bg-amber-500 text-white rounded-md" onClick={() => {
              // Normalize to 100%
              const total = quarterDistribution.reduce((sum, value) => sum + value, 0);
              if (total > 0) {
                const normalizedDistribution = quarterDistribution.map(value => Math.round(value / total * 100));
                // Adjust to ensure exactly 100%
                let sum = normalizedDistribution.reduce((sum, value) => sum + value, 0);
                let index = 0;
                while (sum !== 100) {
                  normalizedDistribution[index] += sum < 100 ? 1 : -1;
                  sum = normalizedDistribution.reduce((sum, value) => sum + value, 0);
                  index = (index + 1) % 4;
                }
                setQuarterDistribution(normalizedDistribution);
              }
            }}>
                  Normalize
                </button>}
            </div>
          </div>
          {/* Product Volume Configuration */}
          <div className="border border-gray-200 rounded-lg overflow-hidden">
            <div className="p-4 border-b border-gray-200 bg-gray-50 flex justify-between items-center">
              <h2 className="font-medium">Product Volumes</h2>
              <div className="text-sm text-gray-500 flex items-center gap-1">
                <TrendingUp size={14} />
                <span>Annual volumes</span>
              </div>
            </div>
            <div className="divide-y divide-gray-200">
              {products.map(product => <div key={product.id}>
                  <div className="p-4 hover:bg-gray-50 cursor-pointer flex items-center justify-between" onClick={() => toggleProductExpansion(product.id)}>
                    <div className="flex items-center gap-2">
                      <ChevronDown size={16} className={`transition-transform ${expandedProduct === product.id ? 'transform rotate-180' : ''}`} />
                      <span className="font-medium">{product.name}</span>
                    </div>
                    <div className="flex items-center gap-4">
                      <div className="w-48 flex items-center gap-2">
                        <input type="number" value={getAnnualVolume(product.id)} onChange={e => {
                      const value = e.target.valueAsNumber;
                      updateProductVolume(product.id, isNaN(value) ? 0 : value);
                    }} onClick={e => e.stopPropagation()} className="w-full px-3 py-1.5 border border-gray-300 rounded-md text-sm" />
                        <span className="text-sm text-gray-500">
                          {product.unit}
                        </span>
                      </div>
                      <Settings size={16} className="text-gray-400" />
                    </div>
                  </div>
                  {expandedProduct === product.id && <div className="p-4 bg-gray-50 border-t border-gray-200">
                      <h3 className="text-sm font-medium mb-3">
                        Volume Distribution by Phase
                      </h3>
                      <div className="grid grid-cols-4 gap-4 mb-4">
                        {phases.map((phase, index) => <div key={index} className="p-3 bg-white rounded-md border border-gray-200">
                            <div className="text-xs text-gray-500 mb-1">
                              {phase.name}
                            </div>
                            <div className="font-medium">
                              {Math.round(getAnnualVolume(product.id) * (phase.months / totalMonths)).toLocaleString()}{' '}
                              {product.unit}
                            </div>
                            <div className="text-xs text-gray-500 mt-1">
                              {phase.months} months • {phase.discount}% discount
                            </div>
                          </div>)}
                      </div>
                      <div className="flex items-center justify-between">
                        <div>
                          <h4 className="text-sm font-medium">Annual Volume</h4>
                          <p className="text-xs text-gray-500">
                            Total volume across all phases
                          </p>
                        </div>
                        <div className="text-lg font-semibold">
                          {getAnnualVolume(product.id).toLocaleString()}{' '}
                          {product.unit}
                        </div>
                      </div>
                    </div>}
                </div>)}
            </div>
          </div>
          {/* Volume Summary */}
          <div className="grid grid-cols-3 gap-4">
            <div className="border border-gray-200 rounded-lg p-4">
              <div className="text-sm text-gray-500 mb-1">
                Total Voice Minutes
              </div>
              <div className="text-xl font-semibold">
                {getAnnualVolume('voice').toLocaleString()}
              </div>
              <div className="text-xs text-gray-500 mt-1">
                Over {totalMonths} months
              </div>
            </div>
            <div className="border border-gray-200 rounded-lg p-4">
              <div className="text-sm text-gray-500 mb-1">Monthly Average</div>
              <div className="text-xl font-semibold">
                {Math.round(getAnnualVolume('voice') / 12).toLocaleString()}
              </div>
              <div className="text-xs text-gray-500 mt-1">
                Voice minutes per month
              </div>
            </div>
            <div className="border border-gray-200 rounded-lg p-4">
              <div className="text-sm text-gray-500 mb-1">
                Total Contract Duration
              </div>
              <div className="text-xl font-semibold">{totalMonths} months</div>
              <div className="text-xs text-gray-500 mt-1">
                {phases.map(phase => phase.name).join(' → ')}
              </div>
            </div>
          </div>
        </div>
        <div className="mt-8 flex justify-between">
          <Link to="/configure" className="px-4 py-2 border border-gray-200 rounded-md text-sm font-medium transition-colors hover:bg-gray-50">
            Back
          </Link>
          <Link to="/pricing" className="px-4 py-2 bg-black text-white rounded-md text-sm font-medium transition-colors hover:bg-gray-800">
            Next
          </Link>
        </div>
      </div>
    </div>;
}