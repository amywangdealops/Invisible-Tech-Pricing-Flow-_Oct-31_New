import React, { useEffect, useState } from 'react';
import { X, Plus, Minus, ChevronDown, Info, Check, AlertCircle, Calendar, Clock, TrendingUp, BarChart3 } from 'lucide-react';
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend, AreaChart, Area } from 'recharts';
interface Phase {
  name: string;
  months: number;
  quantity: number;
  estMonthlyRevenue: number;
}
interface RampDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  productId: string;
  productName: string;
  initialVolume: number;
  unit: string;
  onVolumeChange: (productId: string, volumes: {
    [key: string]: number;
  }) => void;
}
export function RampDrawer({
  isOpen,
  onClose,
  productId,
  productName,
  initialVolume,
  unit,
  onVolumeChange
}: RampDrawerProps) {
  if (!isOpen) return null;
  // State for ramp configuration
  const [interval, setInterval] = useState<'monthly' | 'quarterly' | 'annually'>('monthly');
  const [rampType, setRampType] = useState<'step-up' | 'linear'>('step-up');
  const [phases, setPhases] = useState<Phase[]>([{
    name: '1st',
    months: 1,
    quantity: 10,
    estMonthlyRevenue: 0
  }, {
    name: '2nd',
    months: 1,
    quantity: 10,
    estMonthlyRevenue: 0
  }, {
    name: '3rd',
    months: 1,
    quantity: 10,
    estMonthlyRevenue: 0
  }, {
    name: '4th',
    months: 1,
    quantity: 10,
    estMonthlyRevenue: 0
  }, {
    name: '5th',
    months: 1,
    quantity: 10,
    estMonthlyRevenue: 0
  }, {
    name: '6th',
    months: 1,
    quantity: 10,
    estMonthlyRevenue: 0
  }]);
  // Calculate total volume
  const totalVolume = phases.reduce((sum, phase) => sum + phase.quantity, 0);
  // Update monthly revenue estimates (just for demonstration)
  useEffect(() => {
    const newPhases = phases.map(phase => ({
      ...phase,
      estMonthlyRevenue: phase.quantity * 0.2 // Simple calculation for demo
    }));
    setPhases(newPhases);
  }, []);
  // Update phase quantity
  const handleQuantityChange = (index: number, value: number) => {
    const newPhases = [...phases];
    newPhases[index] = {
      ...newPhases[index],
      quantity: value
    };
    setPhases(newPhases);
  };
  // Generate chart data
  const generateChartData = () => {
    return phases.map(phase => ({
      name: phase.name,
      quantity: phase.quantity,
      revenue: phase.estMonthlyRevenue
    }));
  };
  const chartData = generateChartData();
  // Save changes
  const handleSave = () => {
    // Create a phase-based volume object
    const volumesByPhase: {
      [key: string]: number;
    } = {};
    phases.forEach(phase => {
      volumesByPhase[phase.name.toLowerCase()] = phase.quantity;
    });
    onVolumeChange(productId, volumesByPhase);
    onClose();
  };
  return <div className="fixed inset-0 z-50 overflow-hidden">
      <div className="absolute inset-0 bg-black bg-opacity-30" onClick={onClose}></div>
      <div className="absolute inset-y-0 right-0 max-w-full flex">
        <div className="relative w-screen max-w-xl">
          <div className="h-full flex flex-col bg-white shadow-xl">
            <div className="flex items-center justify-between p-3 border-b border-gray-200">
              <h2 className="text-lg font-medium">Ramp</h2>
              <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
                <X size={20} />
              </button>
            </div>
            <div className="flex-1 overflow-y-auto p-4">
              <p className="text-sm text-gray-600 mb-4">
                Set intervals over the term of the agreement to match a
                customer's expected growth
              </p>
              {/* Chart visualization */}
              <div className="h-56 mb-6">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={chartData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Area type="stepAfter" dataKey="quantity" fill="#ff6b35" stroke="#ff6b35" />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
              {/* Interval selection */}
              <div className="mb-4">
                <label className="block text-sm mb-2">Interval</label>
                <div className="flex rounded-md overflow-hidden border border-gray-200">
                  <button className={`flex-1 py-2 px-4 text-sm ${interval === 'monthly' ? 'bg-gray-100 font-medium' : 'bg-white'}`} onClick={() => setInterval('monthly')}>
                    Monthly
                  </button>
                  <button className={`flex-1 py-2 px-4 text-sm ${interval === 'quarterly' ? 'bg-gray-100 font-medium' : 'bg-white'}`} onClick={() => setInterval('quarterly')}>
                    Quarterly
                  </button>
                  <button className={`flex-1 py-2 px-4 text-sm ${interval === 'annually' ? 'bg-gray-100 font-medium' : 'bg-white'}`} onClick={() => setInterval('annually')}>
                    Annually
                  </button>
                </div>
              </div>
              {/* Type selection */}
              <div className="mb-4">
                <label className="block text-sm mb-2">Type</label>
                <div className="flex rounded-md overflow-hidden border border-gray-200">
                  <button className={`flex-1 py-2 px-4 text-sm ${rampType === 'step-up' ? 'bg-gray-100 font-medium' : 'bg-white'}`} onClick={() => setRampType('step-up')}>
                    Step up
                  </button>
                  <button className={`flex-1 py-2 px-4 text-sm ${rampType === 'linear' ? 'bg-gray-100 font-medium' : 'bg-white'}`} onClick={() => setRampType('linear')}>
                    Linear ramp
                  </button>
                </div>
              </div>
              {/* Ramp table */}
              <div className="border border-gray-200 rounded-md overflow-hidden">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                        Month
                      </th>
                      <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                        Step up
                      </th>
                      <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                        Quantity
                      </th>
                      <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                        Est. Mo. Rev.
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {phases.map((phase, index) => <tr key={index}>
                        <td className="px-4 py-3 whitespace-nowrap text-sm">
                          {phase.name}
                        </td>
                        <td className="px-4 py-3 whitespace-nowrap">
                          <input type="number" min="0" className="w-16 py-1 px-2 border border-gray-300 rounded-md text-sm" value={0} readOnly />
                        </td>
                        <td className="px-4 py-3 whitespace-nowrap">
                          <input type="number" min="0" className="w-20 py-1 px-2 border border-gray-300 rounded-md text-sm" value={phase.quantity} onChange={e => {
                        const value = e.target.valueAsNumber;
                        handleQuantityChange(index, isNaN(value) ? 0 : value);
                      }} />
                        </td>
                        <td className="px-4 py-3 whitespace-nowrap text-sm">
                          ${phase.estMonthlyRevenue.toFixed(2)}
                        </td>
                      </tr>)}
                  </tbody>
                </table>
              </div>
            </div>
            <div className="p-4 border-t border-gray-200 flex justify-end gap-3">
              <button onClick={onClose} className="px-4 py-2 border border-gray-200 rounded-md text-sm">
                Cancel
              </button>
              <button onClick={handleSave} className="px-4 py-2 bg-black text-white rounded-md text-sm">
                Save
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>;
}