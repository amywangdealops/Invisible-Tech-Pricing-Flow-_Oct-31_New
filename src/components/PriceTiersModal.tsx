import React, { useState } from 'react';
import { X, Info, Trash2, Plus } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Area, AreaChart } from 'recharts';
type PriceTier = {
  id: number;
  startQty: number;
  endQty: number | string;
  price: number;
};
type PriceTiersModalProps = {
  isOpen: boolean;
  onClose: () => void;
  onSave: (tiers: PriceTier[]) => void;
  initialTiers?: PriceTier[];
  basePrice: number;
};
export function PriceTiersModal({
  isOpen,
  onClose,
  onSave,
  initialTiers,
  basePrice
}: PriceTiersModalProps) {
  const [tiers, setTiers] = useState<PriceTier[]>(initialTiers || [{
    id: 1,
    startQty: 0,
    endQty: 10,
    price: basePrice
  }, {
    id: 2,
    startQty: 11,
    endQty: 20,
    price: Math.round(basePrice * 0.9)
  }, {
    id: 3,
    startQty: 21,
    endQty: 30,
    price: Math.round(basePrice * 0.8)
  }, {
    id: 4,
    startQty: 31,
    endQty: 40,
    price: Math.round(basePrice * 0.7)
  }, {
    id: 5,
    startQty: 41,
    endQty: 50,
    price: Math.round(basePrice * 0.6)
  }, {
    id: 6,
    startQty: 51,
    endQty: '∞',
    price: Math.round(basePrice * 0.5)
  }]);
  // Calculate suggested price tiers for display
  const suggestedPriceTiers = [{
    range: '0 - 100',
    price: basePrice
  }, {
    range: '101 - 500',
    price: Math.round(basePrice * 0.9)
  }, {
    range: '501 - 1000',
    price: Math.round(basePrice * 0.7)
  }, {
    range: '1001 +',
    price: Math.round(basePrice * 0.5)
  }];
  // Calculate the discount percentage based on the original price
  const calculateDiscount = () => {
    const lastTier = tiers[tiers.length - 1];
    return Math.round((basePrice - lastTier.price) / basePrice * 100);
  };
  // Calculate the blended price
  const calculateBlendedPrice = () => {
    // For simplicity, we'll just use the middle tier price
    const middleTierIndex = Math.floor(tiers.length / 2);
    return tiers[middleTierIndex].price;
  };
  // Generate chart data from tiers
  const generateChartData = () => {
    const chartData = [];
    const maxQty = 60;
    // Add data points for each tier boundary
    for (let i = 0; i < tiers.length; i++) {
      const tier = tiers[i];
      const endQty = tier.endQty === '∞' ? maxQty : tier.endQty as number;
      // Add point at the start of the tier
      if (i === 0 || tier.startQty !== (tiers[i - 1].endQty as number) + 1) {
        chartData.push({
          qty: tier.startQty,
          suggestedPrice: basePrice,
          yourPrice: tier.price
        });
      }
      // Add point at the end of the tier
      chartData.push({
        qty: endQty,
        suggestedPrice: basePrice,
        yourPrice: tier.price
      });
    }
    return chartData;
  };
  const chartData = generateChartData();
  // Add a new tier
  const addTier = () => {
    const lastTier = tiers[tiers.length - 1];
    const newStartQty = typeof lastTier.endQty === 'string' ? 101 : (lastTier.endQty as number) + 1;
    const newEndQty = typeof lastTier.endQty === 'string' ? '∞' : newStartQty + 9;
    const newPrice = Math.round(lastTier.price * 0.9);
    // Update the last tier's end quantity
    const updatedTiers = [...tiers];
    if (typeof lastTier.endQty !== 'string') {
      updatedTiers[updatedTiers.length - 1] = {
        ...lastTier,
        endQty: newStartQty - 1
      };
    }
    // Add the new tier
    setTiers([...updatedTiers, {
      id: tiers.length + 1,
      startQty: newStartQty,
      endQty: newEndQty,
      price: newPrice
    }]);
  };
  // Remove a tier
  const removeTier = (id: number) => {
    if (tiers.length <= 1) return;
    const tierIndex = tiers.findIndex(tier => tier.id === id);
    if (tierIndex === -1) return;
    const updatedTiers = [...tiers];
    // If removing a tier in the middle, we need to adjust the next tier's start quantity
    if (tierIndex < updatedTiers.length - 1) {
      updatedTiers[tierIndex + 1] = {
        ...updatedTiers[tierIndex + 1],
        startQty: updatedTiers[tierIndex].startQty
      };
    }
    // Remove the tier
    setTiers(updatedTiers.filter(tier => tier.id !== id));
  };
  // Remove all tiers
  const removeAllTiers = () => {
    setTiers([{
      id: 1,
      startQty: 0,
      endQty: '∞',
      price: basePrice
    }]);
  };
  // Update a tier's values
  const updateTier = (id: number, field: string, value: number | string) => {
    const updatedTiers = tiers.map(tier => {
      if (tier.id === id) {
        return {
          ...tier,
          [field]: value
        };
      }
      return tier;
    });
    setTiers(updatedTiers);
  };
  // Handle save
  const handleSave = () => {
    onSave(tiers);
    onClose();
  };
  if (!isOpen) return null;
  return <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="fixed inset-0 bg-black bg-opacity-30" onClick={onClose}></div>
      <div className="relative w-full max-w-2xl bg-white rounded-md shadow-xl max-h-[90vh] overflow-y-auto">
        <div className="p-4 border-b border-gray-200 flex justify-between items-center">
          <h2 className="text-lg font-medium">Price tiers</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
            <X size={20} />
          </button>
        </div>
        <div className="p-6">
          <p className="text-sm text-gray-600 mb-6">
            Set quantity-based price tiers to deliver greater value at scale.
            Going lower than that company suggested price may trigger an
            approval.
          </p>
          {/* Chart */}
          <div className="h-60 mb-6">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="qty" label={{
                value: 'End quantity',
                position: 'insideBottom',
                offset: -5
              }} />
                <YAxis label={{
                value: 'Price',
                angle: -90,
                position: 'insideLeft'
              }} domain={[0, Math.ceil(basePrice * 1.2 / 100) * 100]} />
                <Tooltip />
                <Area type="stepAfter" dataKey="suggestedPrice" stroke="#ff7d45" fill="#ff7d45" fillOpacity={0.3} name="Suggested price" />
                <Area type="stepAfter" dataKey="yourPrice" stroke="#3f8f6b" fill="#8fd3b6" fillOpacity={0.5} name="You" />
              </AreaChart>
            </ResponsiveContainer>
            <div className="flex justify-center gap-6 mt-2">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-[#ff7d45] rounded-full"></div>
                <span className="text-xs">Suggested price</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-[#3f8f6b] rounded-full"></div>
                <span className="text-xs">You</span>
              </div>
            </div>
          </div>
          {/* Suggested price table */}
          <div className="mb-6">
            <h3 className="text-sm font-medium mb-2">Suggested price</h3>
            <div className="grid grid-cols-2 gap-4">
              {suggestedPriceTiers.map(tier => <div key={tier.range} className="flex justify-between text-sm">
                  <span className="text-gray-600">{tier.range}</span>
                  <span className="font-medium">${tier.price}</span>
                </div>)}
            </div>
          </div>
          {/* Tier table */}
          <div className="mb-6">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="py-2 font-medium text-gray-500 text-left">
                    Tier
                  </th>
                  <th className="py-2 font-medium text-gray-500 text-left">
                    Start Qty
                  </th>
                  <th className="py-2 font-medium text-gray-500 text-left">
                    End Qty
                  </th>
                  <th className="py-2 font-medium text-gray-500 text-left">
                    Price
                  </th>
                  <th className="py-2 font-medium text-gray-500 text-left"></th>
                </tr>
              </thead>
              <tbody>
                {tiers.map((tier, index) => <tr key={tier.id} className="border-b border-gray-100">
                    <td className="py-2">{index + 1}</td>
                    <td className="py-2">
                      <input type="number" value={tier.startQty} onChange={e => updateTier(tier.id, 'startQty', Number(e.target.value))} className="w-full px-2 py-1 border border-gray-300 rounded-md" min="0" readOnly={index === 0} />
                    </td>
                    <td className="py-2">
                      <input type={typeof tier.endQty === 'string' ? 'text' : 'number'} value={tier.endQty} onChange={e => {
                    const value = e.target.value === '∞' ? '∞' : Number(e.target.value);
                    updateTier(tier.id, 'endQty', value);
                  }} className="w-full px-2 py-1 border border-gray-300 rounded-md" min={tier.startQty + 1} />
                    </td>
                    <td className="py-2">
                      <div className="relative">
                        <span className="absolute left-2 top-1/2 transform -translate-y-1/2">
                          $
                        </span>
                        <input type="number" value={tier.price} onChange={e => updateTier(tier.id, 'price', Number(e.target.value))} className="w-full px-6 py-1 border border-gray-300 rounded-md" min="0" />
                      </div>
                    </td>
                    <td className="py-2">
                      <button onClick={() => removeTier(tier.id)} className="p-1 text-gray-400 hover:text-gray-600">
                        <Trash2 size={16} />
                      </button>
                    </td>
                  </tr>)}
              </tbody>
            </table>
            <div className="flex justify-between mt-3">
              <button onClick={addTier} className="flex items-center gap-1 text-sm text-gray-600 px-3 py-1.5 border border-gray-200 rounded-md hover:bg-gray-50">
                <Plus size={14} />
                <span>Add</span>
              </button>
              <button onClick={removeAllTiers} className="flex items-center gap-1 text-sm text-gray-600 px-3 py-1.5 border border-gray-200 rounded-md hover:bg-gray-50">
                <Trash2 size={14} />
                <span>Remove all</span>
              </button>
            </div>
          </div>
          {/* Approvals section */}
          <div className="mb-6 p-4 bg-gray-50 rounded-md">
            <h3 className="text-sm font-medium mb-3">
              Approvals required of{' '}
              <span className="bg-black text-white px-2 py-0.5 rounded text-xs">
                VP of Sales
              </span>{' '}
              to avoid approval:
            </h3>
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <div className="w-5 h-5 rounded-full bg-gray-200 flex items-center justify-center text-gray-600">
                  <Info size={12} />
                </div>
                <span className="text-sm">
                  Change start quantity of Tier 6 to 100
                </span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-5 h-5 rounded-full bg-gray-200 flex items-center justify-center text-gray-600">
                  <Info size={12} />
                </div>
                <span className="text-sm">
                  Change price of Tier 6 to $90.00
                </span>
              </div>
            </div>
          </div>
          {/* Summary */}
          <div className="grid grid-cols-2 gap-4 mb-6">
            <div className="flex justify-between">
              <span className="text-sm text-gray-600">Discount</span>
              <span className="font-medium">{calculateDiscount()}%</span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-gray-600">Blended price</span>
              <span className="font-medium">
                ${calculateBlendedPrice().toFixed(2)}
              </span>
            </div>
          </div>
          {/* Action buttons */}
          <div className="flex justify-end gap-3">
            <button onClick={onClose} className="px-4 py-2 border border-gray-200 rounded-md text-sm">
              Cancel
            </button>
            <button onClick={handleSave} className="px-4 py-2 bg-black text-white rounded-md text-sm">
              Save
            </button>
          </div>
        </div>
      </div>
    </div>;
}