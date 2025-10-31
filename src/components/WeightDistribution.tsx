import React, { useEffect, useState } from 'react';
interface WeightValues {
  multiplier: number;
  savingsPercent: number;
  fixedPercent: number;
  accuracyPoint: number;
}
export function WeightDistribution() {
  const [weights, setWeights] = useState<WeightValues>({
    multiplier: 0.4,
    savingsPercent: 0.3,
    fixedPercent: 0.2,
    accuracyPoint: 0.1
  });
  // Ensure weights always sum to 1
  const normalizeWeights = (changedKey: keyof WeightValues, newValue: number, currentWeights: WeightValues): WeightValues => {
    // Clamp the new value between 0 and 1
    const clampedValue = Math.max(0, Math.min(1, newValue));
    // Calculate the remaining weight to distribute
    const remainingWeight = 1 - clampedValue;
    // Get the sum of other weights
    const otherKeys = (Object.keys(currentWeights) as Array<keyof WeightValues>).filter(key => key !== changedKey);
    const otherWeightsSum = otherKeys.reduce((sum, key) => sum + currentWeights[key], 0);
    // Create new weights object
    const newWeights = {
      ...currentWeights
    };
    newWeights[changedKey] = clampedValue;
    // Distribute remaining weight proportionally among other values
    if (otherWeightsSum > 0) {
      otherKeys.forEach(key => {
        const proportion = currentWeights[key] / otherWeightsSum;
        newWeights[key] = remainingWeight * proportion;
      });
    } else {
      // If all other weights are 0, distribute equally
      const equalShare = remainingWeight / otherKeys.length;
      otherKeys.forEach(key => {
        newWeights[key] = equalShare;
      });
    }
    return newWeights;
  };
  const handleWeightChange = (key: keyof WeightValues, value: string) => {
    const numValue = parseFloat(value) || 0;
    const normalizedWeights = normalizeWeights(key, numValue, weights);
    setWeights(normalizedWeights);
  };
  // Calculate the sum for display (should always be 1)
  const totalWeight = Object.values(weights).reduce((sum, val) => sum + val, 0);
  return <div className="w-full max-w-md mx-auto p-6 bg-white rounded-lg border border-gray-200">
      <div className="mb-6">
        <h2 className="text-lg font-medium text-gray-500 text-center mb-2">
          WEIGHT
        </h2>
        <div className="text-sm text-center text-gray-400">
          Total: {totalWeight.toFixed(4)}
        </div>
      </div>
      <div className="space-y-4">
        <div className="border-t border-gray-200 pt-4">
          <input type="number" step="0.01" min="0" max="1" value={weights.multiplier.toFixed(2)} onChange={e => handleWeightChange('multiplier', e.target.value)} className="w-full px-4 py-3 text-2xl border-2 border-gray-200 rounded-lg focus:border-blue-500 focus:outline-none" />
          <div className="text-sm text-gray-500 mt-2">Multiplier</div>
        </div>
        <div className="border-t border-gray-200 pt-4">
          <div className="relative">
            <input type="number" step="0.01" min="0" max="1" value={weights.savingsPercent.toFixed(2)} onChange={e => handleWeightChange('savingsPercent', e.target.value)} className="w-full px-4 py-3 text-2xl border-2 border-blue-500 rounded-lg focus:border-blue-600 focus:outline-none" />
            <div className="absolute right-3 top-1/2 -translate-y-1/2 flex flex-col">
              <button onClick={() => handleWeightChange('savingsPercent', (weights.savingsPercent + 0.01).toString())} className="text-gray-400 hover:text-gray-600">
                ▲
              </button>
              <button onClick={() => handleWeightChange('savingsPercent', (weights.savingsPercent - 0.01).toString())} className="text-gray-400 hover:text-gray-600">
                ▼
              </button>
            </div>
          </div>
          <div className="text-sm text-gray-500 mt-2">% of savings</div>
        </div>
        <div className="border-t border-gray-200 pt-4">
          <div className="flex items-center justify-center py-3">
            <div className="text-xl text-gray-600">
              Fixed at {(weights.fixedPercent * 100).toFixed(0)}%
            </div>
          </div>
          <input type="range" min="0" max="1" step="0.01" value={weights.fixedPercent} onChange={e => handleWeightChange('fixedPercent', e.target.value)} className="w-full" />
        </div>
        <div className="border-t border-gray-200 pt-4">
          <input type="number" step="0.01" min="0" max="1" value={weights.accuracyPoint.toFixed(2)} onChange={e => handleWeightChange('accuracyPoint', e.target.value)} className="w-full px-4 py-3 text-2xl border-2 border-gray-200 rounded-lg focus:border-blue-500 focus:outline-none" />
          <div className="text-sm text-gray-500 mt-2">Per accuracy pt</div>
        </div>
      </div>
      <div className="mt-6 p-4 bg-gray-50 rounded-lg">
        <div className="text-xs text-gray-500 mb-2">Weight Distribution:</div>
        <div className="space-y-1 text-sm">
          <div className="flex justify-between">
            <span>Multiplier:</span>
            <span className="font-medium">
              {(weights.multiplier * 100).toFixed(1)}%
            </span>
          </div>
          <div className="flex justify-between">
            <span>Savings:</span>
            <span className="font-medium">
              {(weights.savingsPercent * 100).toFixed(1)}%
            </span>
          </div>
          <div className="flex justify-between">
            <span>Fixed:</span>
            <span className="font-medium">
              {(weights.fixedPercent * 100).toFixed(1)}%
            </span>
          </div>
          <div className="flex justify-between">
            <span>Accuracy:</span>
            <span className="font-medium">
              {(weights.accuracyPoint * 100).toFixed(1)}%
            </span>
          </div>
          <div className="flex justify-between pt-2 border-t border-gray-200 font-semibold">
            <span>Total:</span>
            <span className={totalWeight === 1 ? 'text-green-600' : 'text-red-600'}>
              {(totalWeight * 100).toFixed(1)}%
            </span>
          </div>
        </div>
      </div>
    </div>;
}