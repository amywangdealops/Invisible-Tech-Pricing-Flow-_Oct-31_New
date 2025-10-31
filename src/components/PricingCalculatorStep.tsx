import React, { useEffect, useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { ArrowRight, Plus, Trash2, Info, ChevronDown, ChevronRight } from 'lucide-react';
interface PricingRow {
  id: string;
  resourceType: 'expert-network' | 'forward-deployed';
  locale: string;
  difficulty: string;
  promptGenMin: number;
  reviewMin: number;
  rejectionRate: number;
  hourlyRate: number;
  taskVolume: number;
}
const localeOptions = ['en-US', 'zh-CN', 'es-US', 'es-ES', 'es-MX', 'es-CL', 'zh-US'];
const difficultyOptions = ['Easy', 'Hard'];
export function PricingCalculatorStep() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [defaultVolume, setDefaultVolume] = useState(0);

  // Get deal types from URL parameters to determine if we should show FDE
  const dealTypesParam = searchParams.get('dealTypes') || '';
  const dealTypes = dealTypesParam.split(',').filter(Boolean);
  const hasDataLabeling = dealTypes.includes('data-labeling');
  const hasEnterpriseTransformation = dealTypes.includes('enterprise-transformation');
  const isDataLabelingOnly = hasDataLabeling && !hasEnterpriseTransformation;
  const [expandedSections, setExpandedSections] = useState<Record<string, boolean>>({
    'expert-network': true,
    'forward-deployed': !isDataLabelingOnly // Hide FDE section when only Data Labeling is selected
  });
  // Initialize rows based on deal type selection
  const getInitialRows = () => {
    const expertNetworkRows = [{
      id: '1',
      resourceType: 'expert-network',
      locale: 'en-US',
      difficulty: 'Easy',
      promptGenMin: 2,
      reviewMin: 1,
      rejectionRate: 5,
      hourlyRate: 40,
      taskVolume: 300
    }, {
      id: '2',
      resourceType: 'expert-network',
      locale: 'en-US',
      difficulty: 'Hard',
      promptGenMin: 2,
      reviewMin: 1,
      rejectionRate: 5,
      hourlyRate: 45,
      taskVolume: 300
    }, {
      id: '3',
      resourceType: 'expert-network',
      locale: 'zh-CN',
      difficulty: 'Easy',
      promptGenMin: 2,
      reviewMin: 1,
      rejectionRate: 5,
      hourlyRate: 30,
      taskVolume: 300
    }, {
      id: '4',
      resourceType: 'expert-network',
      locale: 'zh-CN',
      difficulty: 'Hard',
      promptGenMin: 2,
      reviewMin: 1,
      rejectionRate: 5,
      hourlyRate: 35,
      taskVolume: 300
    }, {
      id: '5',
      resourceType: 'expert-network',
      locale: 'es-US',
      difficulty: 'Easy',
      promptGenMin: 2,
      reviewMin: 1,
      rejectionRate: 5,
      hourlyRate: 32,
      taskVolume: 300
    }, {
      id: '6',
      resourceType: 'expert-network',
      locale: 'es-US',
      difficulty: 'Hard',
      promptGenMin: 2,
      reviewMin: 1,
      rejectionRate: 5,
      hourlyRate: 37,
      taskVolume: 300
    }, {
      id: '7',
      resourceType: 'expert-network',
      locale: 'es-ES',
      difficulty: 'Easy',
      promptGenMin: 2,
      reviewMin: 1,
      rejectionRate: 5,
      hourlyRate: 32,
      taskVolume: 300
    }, {
      id: '8',
      resourceType: 'expert-network',
      locale: 'es-ES',
      difficulty: 'Hard',
      promptGenMin: 2,
      reviewMin: 1,
      rejectionRate: 5,
      hourlyRate: 37,
      taskVolume: 300
    }];

    // Only add Forward Deployed Engineers if not Data Labeling only
    if (!isDataLabelingOnly) {
      return [...expertNetworkRows, {
        id: '9',
        resourceType: 'forward-deployed',
        locale: 'en-US',
        difficulty: 'Easy',
        promptGenMin: 3,
        reviewMin: 2,
        rejectionRate: 5,
        hourlyRate: 50,
        taskVolume: 300
      }, {
        id: '10',
        resourceType: 'forward-deployed',
        locale: 'en-US',
        difficulty: 'Hard',
        promptGenMin: 3,
        reviewMin: 2,
        rejectionRate: 5,
        hourlyRate: 55,
        taskVolume: 300
      }];
    }
    return expertNetworkRows;
  };
  const [rows, setRows] = useState<PricingRow[]>(getInitialRows());
  const toggleSection = (sectionId: string) => {
    setExpandedSections(prev => ({
      ...prev,
      [sectionId]: !prev[sectionId]
    }));
  };
  const getResourceName = (resourceType: string) => {
    return resourceType === 'expert-network' ? 'Expert Network' : 'Forward Deployed Engineers';
  };
  const getRowsByResource = (resourceType: 'expert-network' | 'forward-deployed') => {
    return rows.filter(r => r.resourceType === resourceType);
  };
  const calculateCostPerTask = (row: PricingRow) => {
    const totalMinutes = row.promptGenMin + row.reviewMin;
    const hourlyFraction = totalMinutes / 60;
    const baseCost = row.hourlyRate * hourlyFraction;
    const costWithRejection = baseCost * (1 + row.rejectionRate / 100);
    return costWithRejection;
  };
  const calculateTotal = (row: PricingRow) => {
    return calculateCostPerTask(row) * row.taskVolume;
  };
  const calculateResourceTotal = (resourceType: 'expert-network' | 'forward-deployed') => {
    return getRowsByResource(resourceType).reduce((sum, row) => sum + calculateTotal(row), 0);
  };
  const calculateGrandTotal = () => {
    return rows.reduce((sum, row) => sum + calculateTotal(row), 0);
  };
  const calculateTotalTasks = () => {
    return rows.reduce((sum, row) => sum + row.taskVolume, 0);
  };
  const calculateAvgCost = () => {
    const total = calculateGrandTotal();
    const tasks = calculateTotalTasks();
    return tasks > 0 ? total / tasks : 0;
  };
  useEffect(() => {
    const pricingData = {
      rows: rows,
      totals: {
        grandTotal: calculateGrandTotal(),
        totalTasks: calculateTotalTasks(),
        avgCost: calculateAvgCost()
      }
    };
    localStorage.setItem('pricingCalculatorData', JSON.stringify(pricingData));
  }, [rows]);
  const addRow = (resourceType: 'expert-network' | 'forward-deployed') => {
    const newRow: PricingRow = {
      id: Date.now().toString(),
      resourceType,
      locale: 'en-US',
      difficulty: 'Easy',
      promptGenMin: 2,
      reviewMin: 1,
      rejectionRate: 5,
      hourlyRate: resourceType === 'expert-network' ? 40 : 50,
      taskVolume: defaultVolume || 300
    };
    setRows([...rows, newRow]);
  };
  const deleteRow = (rowId: string) => {
    setRows(rows.filter(r => r.id !== rowId));
  };
  const updateRow = (rowId: string, field: keyof PricingRow, value: any) => {
    setRows(rows.map(r => r.id === rowId ? {
      ...r,
      [field]: value
    } : r));
  };
  const updateDefaultVolume = (value: number) => {
    setDefaultVolume(value);
    setRows(rows.map(r => ({
      ...r,
      taskVolume: value
    })));
  };
  const handleNext = () => {
    const useCaseParam = searchParams.get('useCase') || '';
    const typeParam = searchParams.get('type') || '';
    navigate(`/pricing-review?useCase=${useCaseParam}&type=${typeParam}`);
  };
  return <div className="w-full bg-white min-h-screen">
      <div className="p-3 border-b border-gray-200">
        <div className="flex items-center gap-2 text-sm text-gray-500">
          <Link to="/" className="hover:text-gray-700">
            Acme Corp
          </Link>
          <ArrowRight size={12} />
          <Link to="/" className="hover:text-gray-700">
            Opportunity
          </Link>
          <ArrowRight size={12} />
          <Link to="/configure" className="hover:text-gray-700">
            Use Case Selection
          </Link>
          <ArrowRight size={12} />
          <span className="font-medium text-black">Pricing Calculator</span>
        </div>
      </div>
      <div className="max-w-7xl mx-auto p-6">
        <div className="mb-6">
          <h1 className="text-2xl font-semibold mb-1">Pricing Calculator</h1>
          <p className="text-gray-500">
            Configure pricing based on locale, difficulty, and volume
          </p>
        </div>
        {/* Default Task Volume */}
        <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 mb-6">
          <label className="block text-sm font-medium mb-2">
            Default Task Volume
          </label>
          <input type="number" value={defaultVolume} onChange={e => updateDefaultVolume(parseInt(e.target.value) || 0)} className="w-64 px-3 py-2 border border-gray-300 rounded-md" placeholder="0" />
          <p className="text-sm text-gray-500 mt-2">
            This will update the task volume for all rows
          </p>
        </div>
        {/* Expert Network Section */}
        <div className="border border-gray-200 rounded-lg overflow-hidden mb-4">
          <div className="bg-gray-50 px-4 py-3 flex items-center justify-between cursor-pointer hover:bg-gray-100" onClick={() => toggleSection('expert-network')}>
            <div className="flex items-center gap-2">
              {expandedSections['expert-network'] ? <ChevronDown size={20} /> : <ChevronRight size={20} />}
              <h3 className="font-medium">Expert Network</h3>
              <span className="text-sm text-gray-500">
                ({getRowsByResource('expert-network').length} configurations)
              </span>
            </div>
            <div className="flex items-center gap-4">
              <span className="text-sm font-medium">
                ${calculateResourceTotal('expert-network').toFixed(2)}
              </span>
              <button onClick={e => {
              e.stopPropagation();
              addRow('expert-network');
            }} className="px-3 py-1 bg-black text-white rounded-md text-sm font-medium flex items-center gap-1 hover:bg-gray-800">
                <Plus size={14} />
                Add Row
              </button>
            </div>
          </div>
          {expandedSections['expert-network'] && <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    <div className="flex items-center gap-1">
                      Locale
                      <Info size={14} className="text-gray-400" />
                    </div>
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Difficulty
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    <div className="flex items-center gap-1">
                      Prompt Gen (Min)
                      <Info size={14} className="text-gray-400" />
                    </div>
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    <div className="flex items-center gap-1">
                      Review (Min)
                      <Info size={14} className="text-gray-400" />
                    </div>
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    <div className="flex items-center gap-1">
                      Rejection Rate (%)
                      <Info size={14} className="text-gray-400" />
                    </div>
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    <div className="flex items-center gap-1">
                      Rate ($/HR)
                      <Info size={14} className="text-gray-400" />
                    </div>
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    <div className="flex items-center gap-1">
                      Task Volume
                      <Info size={14} className="text-gray-400" />
                    </div>
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    <div className="flex items-center gap-1">
                      Cost/Task
                      <Info size={14} className="text-gray-400" />
                    </div>
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    <div className="flex items-center gap-1">
                      Total
                      <Info size={14} className="text-gray-400" />
                    </div>
                  </th>
                  <th className="px-4 py-3"></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {getRowsByResource('expert-network').map(row => <tr key={row.id} className="hover:bg-gray-50">
                    <td className="px-4 py-3">
                      <select value={row.locale} onChange={e => updateRow(row.id, 'locale', e.target.value)} className="w-full px-2 py-1 border border-gray-300 rounded-md text-sm">
                        {localeOptions.map(locale => <option key={locale} value={locale}>
                            {locale}
                          </option>)}
                      </select>
                    </td>
                    <td className="px-4 py-3">
                      <select value={row.difficulty} onChange={e => updateRow(row.id, 'difficulty', e.target.value)} className="w-full px-2 py-1 border border-gray-300 rounded-md text-sm">
                        {difficultyOptions.map(diff => <option key={diff} value={diff}>
                            {diff}
                          </option>)}
                      </select>
                    </td>
                    <td className="px-4 py-3">
                      <input type="number" value={row.promptGenMin} onChange={e => updateRow(row.id, 'promptGenMin', parseInt(e.target.value) || 0)} className="w-20 px-2 py-1 border border-gray-300 rounded-md text-sm" />
                    </td>
                    <td className="px-4 py-3">
                      <input type="number" value={row.reviewMin} onChange={e => updateRow(row.id, 'reviewMin', parseInt(e.target.value) || 0)} className="w-20 px-2 py-1 border border-gray-300 rounded-md text-sm" />
                    </td>
                    <td className="px-4 py-3">
                      <input type="number" value={row.rejectionRate} onChange={e => updateRow(row.id, 'rejectionRate', parseInt(e.target.value) || 0)} className="w-20 px-2 py-1 border border-gray-300 rounded-md text-sm" />
                    </td>
                    <td className="px-4 py-3">
                      <input type="number" value={row.hourlyRate} onChange={e => updateRow(row.id, 'hourlyRate', parseInt(e.target.value) || 0)} className="w-20 px-2 py-1 border border-gray-300 rounded-md text-sm" />
                    </td>
                    <td className="px-4 py-3">
                      <input type="number" value={row.taskVolume} onChange={e => updateRow(row.id, 'taskVolume', parseInt(e.target.value) || 0)} className="w-24 px-2 py-1 border border-gray-300 rounded-md text-sm" />
                    </td>
                    <td className="px-4 py-3 text-sm">
                      ${calculateCostPerTask(row).toFixed(2)}
                    </td>
                    <td className="px-4 py-3 text-sm font-medium">
                      ${calculateTotal(row).toFixed(2)}
                    </td>
                    <td className="px-4 py-3">
                      <button onClick={() => deleteRow(row.id)} className="text-gray-400 hover:text-red-600">
                        <Trash2 size={16} />
                      </button>
                    </td>
                  </tr>)}
              </tbody>
            </table>}
        </div>
        {/* Forward Deployed Engineers Section - Only show if not Data Labeling only */}
        {!isDataLabelingOnly}
        {/* Summary */}
        <div className="border border-gray-200 rounded-lg p-6">
          <h2 className="text-lg font-semibold mb-4">Summary</h2>
          <div className="grid grid-cols-3 gap-6 mb-6">
            <div>
              <div className="text-sm text-gray-500 mb-1">Total Cost</div>
              <div className="text-3xl font-bold">
                ${calculateGrandTotal().toFixed(2)}
              </div>
            </div>
            <div>
              <div className="text-sm text-gray-500 mb-1">Total Tasks</div>
              <div className="text-3xl font-bold">
                {calculateTotalTasks().toLocaleString()}
              </div>
            </div>
            <div>
              <div className="text-sm text-gray-500 mb-1">Avg Cost/Task</div>
              <div className="text-3xl font-bold">
                ${calculateAvgCost().toFixed(2)}
              </div>
            </div>
          </div>
        </div>
        {/* Navigation */}
        <div className="mt-8 flex justify-between">
          <Link to="/configure" className="px-4 py-2 border border-gray-200 rounded-md text-sm font-medium transition-colors hover:bg-gray-50">
            Back
          </Link>
          <button onClick={handleNext} className="px-4 py-2 bg-black text-white rounded-md text-sm font-medium transition-colors hover:bg-gray-800">
            Next: Review Pricing
          </button>
        </div>
      </div>
    </div>;
}