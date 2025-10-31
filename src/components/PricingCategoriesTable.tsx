import React, { useEffect, useState } from 'react';
import { ChevronRight, Settings, X, AlertCircle } from 'lucide-react';
interface SelectedPlan {
  planId: string;
  quantity: number;
  discount: number;
  months: number;
}
interface PricingCategoriesTableProps {
  platformFee: number;
  projectFee: number;
  saasFee: number;
  selectedPlans: SelectedPlan[];
  projectParams: any;
  saasConfig: any;
  onUpdateSelectedPlans: (plans: SelectedPlan[]) => void;
  onUpdateProjectParam: (param: string, value: any) => void;
  onUpdateSaasConfig: (param: string, value: number) => void;
  onCalculationsUpdate?: (calculations: {
    platformTotal: number;
    projectTotal: number;
    saasTotal: number;
  }) => void;
  showOnlyPlatform?: boolean;
  showOnlyProjectAndSaas?: boolean;
}
export function PricingCategoriesTable({
  platformFee,
  projectFee,
  saasFee,
  selectedPlans,
  projectParams,
  saasConfig,
  onUpdateSelectedPlans,
  onUpdateProjectParam,
  onUpdateSaasConfig,
  onCalculationsUpdate,
  showOnlyPlatform = false,
  showOnlyProjectAndSaas = false
}: PricingCategoriesTableProps) {
  const [expandedSection, setExpandedSection] = useState<string | null>('platform');
  const [projectDiscounts, setProjectDiscounts] = useState<Record<string, number>>({
    workflows: 0,
    dataIntegrations: 0,
    sops: 0,
    teamSize: 0
  });
  // Add state for project item months
  const [projectMonths, setProjectMonths] = useState<Record<string, number>>({
    workflows: 12,
    dataIntegrations: 12,
    sops: 12
  });
  // Add state for SaaS item discounts
  const [saasDiscounts, setSaasDiscounts] = useState<Record<string, number>>({
    apiCalls: 0,
    storage: 0,
    throughput: 0
  });
  // Add state for SaaS item months
  const [saasMonths, setSaasMonths] = useState<Record<string, number>>({
    apiCalls: 12,
    storage: 12,
    throughput: 12
  });
  const platformPlans = [{
    id: 'essential',
    name: 'Essential Plan',
    description: 'Basic orchestration for small teams',
    listRate: 29,
    unit: 'Per Seat/Month'
  }, {
    id: 'growth',
    name: 'Advanced Plan',
    description: 'Advanced features for scaling businesses',
    listRate: 75,
    unit: 'Per Seat/Month'
  }, {
    id: 'enterprise',
    name: 'Expert Plan',
    description: 'Full platform access with dedicated support',
    listRate: 132,
    unit: 'Per Seat/Month'
  }];
  const getApprovalLevel = (discount: number) => {
    if (discount > 30) return {
      level: 'CEO',
      color: 'bg-red-100 text-red-800'
    };
    if (discount > 15) return {
      level: 'VP of Sales',
      color: 'bg-amber-100 text-amber-800'
    };
    return {
      level: 'Manager',
      color: 'bg-blue-100 text-blue-800'
    };
  };
  const calculateSuggestedPrice = (listRate: number, discount: number) => {
    // Suggested price always shows 10% discount from list rate
    return listRate * 0.9;
  };
  const calculateMonthlyRevenue = (quantity: number, price: number, months: number) => {
    return Math.round(quantity * price * months);
  };
  const calculatePlatformTotal = () => {
    return selectedPlans.reduce((total, selectedPlan) => {
      const plan = platformPlans.find(p => p.id === selectedPlan.planId);
      if (!plan) return total;
      const discount = isNaN(selectedPlan.discount) ? 0 : selectedPlan.discount;
      const quantity = isNaN(selectedPlan.quantity) ? 0 : selectedPlan.quantity;
      const months = isNaN(selectedPlan.months) ? 12 : selectedPlan.months;
      const quotePrice = plan.listRate * (1 - discount / 100);
      const monthlyRev = calculateMonthlyRevenue(quantity, quotePrice, months);
      return total + (isNaN(monthlyRev) ? 0 : monthlyRev);
    }, 0);
  };
  const toggleSection = (section: string) => {
    setExpandedSection(expandedSection === section ? null : section);
  };
  const isPlanSelected = (planId: string) => {
    return selectedPlans.some(p => p.planId === planId);
  };
  const getSelectedPlan = (planId: string) => {
    return selectedPlans.find(p => p.planId === planId);
  };
  const togglePlanSelection = (planId: string) => {
    const plan = platformPlans.find(p => p.id === planId);
    if (!plan) return;
    if (isPlanSelected(planId)) {
      onUpdateSelectedPlans(selectedPlans.filter(p => p.planId !== planId));
    } else {
      onUpdateSelectedPlans([...selectedPlans, {
        planId,
        quantity: 120,
        discount: 15,
        months: 12
      }]);
    }
  };
  const updatePlanQuantity = (planId: string, quantity: number) => {
    onUpdateSelectedPlans(selectedPlans.map(p => p.planId === planId ? {
      ...p,
      quantity: isNaN(quantity) ? 0 : quantity
    } : p));
  };
  const updatePlanDiscount = (planId: string, discount: number) => {
    onUpdateSelectedPlans(selectedPlans.map(p => p.planId === planId ? {
      ...p,
      discount: isNaN(discount) ? 0 : Math.max(0, Math.min(100, discount))
    } : p));
  };
  const updatePlanMonths = (planId: string, months: number) => {
    onUpdateSelectedPlans(selectedPlans.map(p => p.planId === planId ? {
      ...p,
      months: isNaN(months) ? 12 : Math.max(1, Math.min(60, months))
    } : p));
  };
  const selectedCount = selectedPlans.length;
  const updateProjectDiscount = (param: string, discount: number) => {
    setProjectDiscounts({
      ...projectDiscounts,
      [param]: Math.max(0, Math.min(100, discount))
    });
  };
  const updateProjectMonths = (param: string, months: number) => {
    setProjectMonths({
      ...projectMonths,
      [param]: Math.max(1, Math.min(60, months))
    });
  };
  const getProjectItemPrice = (basePrice: number, discount: number) => {
    return basePrice * (1 - discount / 100);
  };
  const getProjectApprovalLevel = (discount: number) => {
    if (discount > 30) return {
      level: 'CEO',
      color: 'bg-red-100 text-red-800'
    };
    if (discount > 15) return {
      level: 'VP of Sales',
      color: 'bg-amber-100 text-amber-800'
    };
    if (discount > 0) return {
      level: 'Manager',
      color: 'bg-blue-100 text-blue-800'
    };
    return {
      level: '—',
      color: ''
    };
  };
  const calculateDiscountedProjectFee = () => {
    const workflows = isNaN(projectParams.workflows) ? 0 : projectParams.workflows || 0;
    const dataIntegrations = isNaN(projectParams.dataIntegrations) ? 0 : projectParams.dataIntegrations || 0;
    const sops = isNaN(projectParams.sops) ? 0 : projectParams.sops || 0;
    const workflowDiscount = isNaN(projectDiscounts.workflows) ? 0 : projectDiscounts.workflows;
    const integrationDiscount = isNaN(projectDiscounts.dataIntegrations) ? 0 : projectDiscounts.dataIntegrations;
    const sopDiscount = isNaN(projectDiscounts.sops) ? 0 : projectDiscounts.sops;
    const teamDiscount = isNaN(projectDiscounts.teamSize) ? 0 : projectDiscounts.teamSize;
    const workflowMonths = isNaN(projectMonths.workflows) ? 12 : projectMonths.workflows;
    const integrationMonths = isNaN(projectMonths.dataIntegrations) ? 12 : projectMonths.dataIntegrations;
    const sopMonths = isNaN(projectMonths.sops) ? 12 : projectMonths.sops;
    const workflowPrice = getProjectItemPrice(500, workflowDiscount);
    const integrationPrice = getProjectItemPrice(1000, integrationDiscount);
    const sopPrice = getProjectItemPrice(750, sopDiscount);
    const workflowCost = workflows * workflowPrice * workflowMonths;
    const integrationCost = dataIntegrations * integrationPrice * integrationMonths;
    const sopCost = sops * sopPrice * sopMonths;
    const subtotal = workflowCost + integrationCost + sopCost;
    const teamMultiplier = projectParams.teamSize === 'small' ? 1.0 : projectParams.teamSize === 'medium' ? 1.5 : 2.0;
    const effectiveTeamMultiplier = teamMultiplier * (1 - teamDiscount / 100);
    const result = Math.round(subtotal * effectiveTeamMultiplier);
    return isNaN(result) ? 0 : result;
  };
  const getTeamSizeCost = () => {
    const workflowPrice = getProjectItemPrice(500, projectDiscounts.workflows);
    const integrationPrice = getProjectItemPrice(1000, projectDiscounts.dataIntegrations);
    const sopPrice = getProjectItemPrice(750, projectDiscounts.sops);
    const subtotal = (projectParams.workflows || 0) * workflowPrice * projectMonths.workflows + (projectParams.dataIntegrations || 0) * integrationPrice * projectMonths.dataIntegrations + (projectParams.sops || 0) * sopPrice * projectMonths.sops;
    const teamMultiplier = projectParams.teamSize === 'small' ? 1.0 : projectParams.teamSize === 'medium' ? 1.5 : 2.0;
    return subtotal * (teamMultiplier - 1);
  };
  const updateSaasDiscount = (param: string, discount: number) => {
    setSaasDiscounts({
      ...saasDiscounts,
      [param]: Math.max(0, Math.min(100, discount))
    });
  };
  const updateSaasMonths = (param: string, months: number) => {
    setSaasMonths({
      ...saasMonths,
      [param]: Math.max(1, Math.min(60, months))
    });
  };
  const getSaasItemPrice = (basePrice: number, discount: number) => {
    return basePrice * (1 - discount / 100);
  };
  const getSaasApprovalLevel = (discount: number) => {
    if (discount > 30) return {
      level: 'CEO',
      color: 'bg-red-100 text-red-800'
    };
    if (discount > 15) return {
      level: 'VP of Sales',
      color: 'bg-amber-100 text-amber-800'
    };
    if (discount > 0) return {
      level: 'Manager',
      color: 'bg-blue-100 text-blue-800'
    };
    return {
      level: '—',
      color: ''
    };
  };
  const calculateGrandTotal = () => {
    const platformTotal = calculatePlatformTotal();
    const projectTotal = calculateDiscountedProjectFee();
    const saasTotal = calculateSaasFee();
    const total = platformTotal + projectTotal + saasTotal;
    return isNaN(total) ? 0 : total;
  };
  const calculateSaasFee = () => {
    const apiDiscount = isNaN(saasDiscounts.apiCalls) ? 0 : saasDiscounts.apiCalls;
    const storageDiscount = isNaN(saasDiscounts.storage) ? 0 : saasDiscounts.storage;
    const throughputDiscount = isNaN(saasDiscounts.throughput) ? 0 : saasDiscounts.throughput;
    const apiMonths = isNaN(saasMonths.apiCalls) ? 12 : saasMonths.apiCalls;
    const storageMonths = isNaN(saasMonths.storage) ? 12 : saasMonths.storage;
    const throughputMonths = isNaN(saasMonths.throughput) ? 12 : saasMonths.throughput;
    const apiCalls = isNaN(saasConfig.apiCalls) ? 0 : saasConfig.apiCalls || 0;
    const dataStorage = isNaN(saasConfig.dataStorage) ? 0 : saasConfig.dataStorage || 0;
    const dataThroughput = isNaN(saasConfig.dataThroughput) ? 0 : saasConfig.dataThroughput || 0;
    const apiCost = apiCalls / 1000 * getSaasItemPrice(0.5, apiDiscount) * apiMonths;
    const storageCost = dataStorage * getSaasItemPrice(0.1, storageDiscount) * storageMonths;
    const throughputCost = dataThroughput * getSaasItemPrice(0.15, throughputDiscount) * throughputMonths;
    const total = apiCost + storageCost + throughputCost;
    return isNaN(total) ? 0 : Math.round(total);
  };
  // Update parent with calculations whenever they change
  useEffect(() => {
    if (onCalculationsUpdate) {
      const platformTotal = calculatePlatformTotal();
      const projectTotal = calculateDiscountedProjectFee();
      const saasTotal = calculateSaasFee();
      onCalculationsUpdate({
        platformTotal: isNaN(platformTotal) ? 0 : platformTotal,
        projectTotal: isNaN(projectTotal) ? 0 : projectTotal,
        saasTotal: isNaN(saasTotal) ? 0 : saasTotal
      });
    }
  }, [selectedPlans, projectParams, projectDiscounts, projectMonths, saasConfig, saasDiscounts, saasMonths]);
  return <div className="border border-gray-200 rounded-lg overflow-hidden">
      {/* Header Row */}
      <div className="bg-gray-50 px-4 py-3 grid grid-cols-[2fr,1fr,1fr,1fr,1fr,1fr,1fr,1fr,1fr,auto] gap-4 text-xs font-medium text-gray-500 uppercase">
        <div>PRODUCTS</div>
        <div>VOLUME</div>
        <div>LIST RATE</div>
        <div>DISCOUNT %</div>
        <div>SUGGESTED PRICE</div>
        <div>QUOTE PRICE</div>
        <div>APPROVAL LEVEL</div>
        <div>MONTHS</div>
        <div>TOTAL</div>
        <div></div>
      </div>
      {/* Platform Plans Section - Only show if not filtered out */}
      {!showOnlyProjectAndSaas && <div className="border-t border-gray-200">
          <button className="w-full bg-white px-4 py-3 flex items-center gap-3 hover:bg-gray-50 transition-colors" onClick={() => toggleSection('platform')}>
            <ChevronRight size={20} className={`transition-transform ${expandedSection === 'platform' ? 'rotate-90' : ''}`} />
            <div className="text-left flex-1">
              <h3 className="font-medium">Core Platform Plans</h3>
              <p className="text-sm text-gray-500">
                {selectedCount} {selectedCount === 1 ? 'plan' : 'plans'}{' '}
                selected
              </p>
            </div>
          </button>
          {expandedSection === 'platform' && <div className="bg-white">
              {platformPlans.map(plan => {
          const isSelected = isPlanSelected(plan.id);
          const selectedPlan = getSelectedPlan(plan.id);
          const quantity = selectedPlan?.quantity || 120;
          const discount = selectedPlan?.discount || 15;
          const months = selectedPlan?.months || 12;
          const suggestedPrice = calculateSuggestedPrice(plan.listRate, discount);
          const quotePrice = suggestedPrice;
          const monthlyRev = calculateMonthlyRevenue(quantity, quotePrice, months);
          const approval = getApprovalLevel(discount);
          return <div key={plan.id} className={`px-4 py-3 grid grid-cols-[2fr,1fr,1fr,1fr,1fr,1fr,1fr,1fr,1fr,auto] gap-4 items-center border-t border-gray-100 ${isSelected ? 'bg-blue-50' : ''}`}>
                    {/* Product Name */}
                    <div>
                      <div className="font-medium">{plan.name}</div>
                      <div className="text-sm text-gray-500">{plan.unit}</div>
                    </div>
                    {/* Volume */}
                    <div>
                      {isSelected ? <input type="number" value={quantity} onChange={e => {
                const value = e.target.valueAsNumber;
                updatePlanQuantity(plan.id, isNaN(value) ? 0 : value);
              }} className="w-full px-2 py-1.5 border border-gray-300 rounded-md text-sm" /> : <span className="text-sm text-gray-400">—</span>}
                    </div>
                    {/* List Rate */}
                    <div className="text-sm">
                      {isSelected ? `$${plan.listRate.toFixed(2)}` : '—'}
                    </div>
                    {/* Discount % */}
                    <div>
                      {isSelected ? <input type="number" value={discount} onChange={e => {
                const value = e.target.valueAsNumber;
                updatePlanDiscount(plan.id, isNaN(value) ? 0 : value);
              }} className="w-20 px-2 py-1.5 border border-gray-300 rounded-md text-sm" /> : <span className="text-sm text-gray-400">—</span>}
                    </div>
                    {/* Suggested Price */}
                    <div className="text-sm">
                      {isSelected ? <>
                          ${suggestedPrice.toFixed(2)}
                          <div className="text-xs text-gray-500">(-10%)</div>
                        </> : '—'}
                    </div>
                    {/* Quote Price */}
                    <div className="flex items-center gap-2">
                      {isSelected ? <>
                          <span className="text-sm font-medium">
                            ${quotePrice.toFixed(2)}
                          </span>
                          <button className="text-gray-400 hover:text-gray-600">
                            <Settings size={16} />
                          </button>
                        </> : <span className="text-sm text-gray-400">—</span>}
                    </div>
                    {/* Approval Level */}
                    <div>
                      {isSelected && discount > 0 ? <span className={`px-2 py-1 text-xs font-medium rounded-full ${approval.color}`}>
                          {approval.level}
                        </span> : <span className="text-sm text-gray-400">—</span>}
                    </div>
                    {/* Months */}
                    <div>
                      {isSelected ? <input type="number" min="1" max="60" value={months} onChange={e => {
                const value = e.target.valueAsNumber;
                updatePlanMonths(plan.id, isNaN(value) ? 12 : value);
              }} className="w-16 px-2 py-1.5 border border-gray-300 rounded-md text-sm" /> : <span className="text-sm text-gray-400">—</span>}
                    </div>
                    {/* Total */}
                    <div className="text-sm font-medium">
                      {isSelected ? `$${monthlyRev.toLocaleString()}` : '—'}
                    </div>
                    {/* Actions */}
                    <div>
                      {isSelected ? <button onClick={() => togglePlanSelection(plan.id)} className="text-gray-400 hover:text-gray-600">
                          <X size={16} />
                        </button> : <button onClick={() => togglePlanSelection(plan.id)} className="text-blue-600 hover:text-blue-700 text-sm">
                          Select
                        </button>}
                    </div>
                  </div>;
        })}
              {/* Subtotal Row */}
              <div className="px-4 py-3 grid grid-cols-[2fr,1fr,1fr,1fr,1fr,1fr,1fr,1fr,1fr,auto] gap-4 items-center border-t border-gray-200 bg-gray-50">
                <div className="font-semibold">Subtotal</div>
                <div></div>
                <div></div>
                <div></div>
                <div></div>
                <div></div>
                <div></div>
                <div></div>
                <div className="text-sm font-semibold">
                  ${calculatePlatformTotal().toLocaleString()}
                </div>
                <div></div>
              </div>
            </div>}
        </div>}
      {/* Project Fees Section - Only show if not filtered out */}
      {!showOnlyPlatform && <div className="border-t border-gray-200">
          <button className="w-full bg-white px-4 py-3 flex items-center gap-3 hover:bg-gray-50 transition-colors" onClick={() => toggleSection('project')}>
            <ChevronRight size={20} className={`transition-transform ${expandedSection === 'project' ? 'rotate-90' : ''}`} />
            <div className="text-left flex-1">
              <h3 className="font-medium">
                Project Fees – Custom Automations & Setup
              </h3>
              <p className="text-sm text-gray-500">Recurring monthly costs</p>
            </div>
            <div className="text-right">
              <div className="text-lg font-semibold">
                ${calculateDiscountedProjectFee().toLocaleString()}
              </div>
            </div>
          </button>
          {expandedSection === 'project' && <div className="bg-white">
              {/* Workflows / Automations */}
              <div className="px-4 py-3 grid grid-cols-[2fr,1fr,1fr,1fr,1fr,1fr,1fr,1fr,1fr,auto] gap-4 items-center border-t border-gray-100">
                <div>
                  <div className="font-medium">Workflows / Automations</div>
                  <div className="text-sm text-gray-500">Per month</div>
                </div>
                <div>
                  <input type="number" value={projectParams.workflows || 0} onChange={e => {
              const value = e.target.valueAsNumber;
              onUpdateProjectParam('workflows', isNaN(value) ? 0 : value);
            }} className="w-full px-2 py-1.5 border border-gray-300 rounded-md text-sm" />
                </div>
                <div className="text-sm">$500.00</div>
                <div>
                  <input type="number" min="0" max="100" value={projectDiscounts.workflows} onChange={e => {
              const value = e.target.valueAsNumber;
              updateProjectDiscount('workflows', isNaN(value) ? 0 : value);
            }} className="w-20 px-2 py-1.5 border border-gray-300 rounded-md text-sm" />
                </div>
                <div className="text-sm">
                  $
                  {getProjectItemPrice(500, projectDiscounts.workflows).toFixed(2)}
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-sm font-medium">
                    $
                    {getProjectItemPrice(500, projectDiscounts.workflows).toFixed(2)}
                  </span>
                </div>
                <div>
                  {projectDiscounts.workflows > 0 ? <span className={`px-2 py-1 text-xs font-medium rounded-full ${getProjectApprovalLevel(projectDiscounts.workflows).color}`}>
                      {getProjectApprovalLevel(projectDiscounts.workflows).level}
                    </span> : <span className="text-sm text-gray-400">—</span>}
                </div>
                <div>
                  <input type="number" min="1" max="60" value={projectMonths.workflows} onChange={e => {
              const value = e.target.valueAsNumber;
              updateProjectMonths('workflows', isNaN(value) ? 12 : value);
            }} className="w-16 px-2 py-1.5 border border-gray-300 rounded-md text-sm" />
                </div>
                <div className="text-sm font-medium">
                  $
                  {((projectParams.workflows || 0) * getProjectItemPrice(500, projectDiscounts.workflows) * projectMonths.workflows).toLocaleString()}
                </div>
                <div></div>
              </div>
              {/* Data Integrations */}
              <div className="px-4 py-3 grid grid-cols-[2fr,1fr,1fr,1fr,1fr,1fr,1fr,1fr,1fr,auto] gap-4 items-center border-t border-gray-100">
                <div>
                  <div className="font-medium">Data Integrations</div>
                  <div className="text-sm text-gray-500">Per month</div>
                </div>
                <div>
                  <input type="number" value={projectParams.dataIntegrations || 0} onChange={e => {
              const value = e.target.valueAsNumber;
              onUpdateProjectParam('dataIntegrations', isNaN(value) ? 0 : value);
            }} className="w-full px-2 py-1.5 border border-gray-300 rounded-md text-sm" />
                </div>
                <div className="text-sm">$1,000.00</div>
                <div>
                  <input type="number" min="0" max="100" value={projectDiscounts.dataIntegrations} onChange={e => {
              const value = e.target.valueAsNumber;
              updateProjectDiscount('dataIntegrations', isNaN(value) ? 0 : value);
            }} className="w-20 px-2 py-1.5 border border-gray-300 rounded-md text-sm" />
                </div>
                <div className="text-sm">
                  $
                  {getProjectItemPrice(1000, projectDiscounts.dataIntegrations).toFixed(2)}
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-sm font-medium">
                    $
                    {getProjectItemPrice(1000, projectDiscounts.dataIntegrations).toFixed(2)}
                  </span>
                </div>
                <div>
                  {projectDiscounts.dataIntegrations > 0 ? <span className={`px-2 py-1 text-xs font-medium rounded-full ${getProjectApprovalLevel(projectDiscounts.dataIntegrations).color}`}>
                      {getProjectApprovalLevel(projectDiscounts.dataIntegrations).level}
                    </span> : <span className="text-sm text-gray-400">—</span>}
                </div>
                <div>
                  <input type="number" min="1" max="60" value={projectMonths.dataIntegrations} onChange={e => {
              const value = e.target.valueAsNumber;
              updateProjectMonths('dataIntegrations', isNaN(value) ? 12 : value);
            }} className="w-16 px-2 py-1.5 border border-gray-300 rounded-md text-sm" />
                </div>
                <div className="text-sm font-medium">
                  $
                  {((projectParams.dataIntegrations || 0) * getProjectItemPrice(1000, projectDiscounts.dataIntegrations) * projectMonths.dataIntegrations).toLocaleString()}
                </div>
                <div></div>
              </div>
              {/* SOPs or Agents */}
              <div className="px-4 py-3 grid grid-cols-[2fr,1fr,1fr,1fr,1fr,1fr,1fr,1fr,1fr,auto] gap-4 items-center border-t border-gray-100">
                <div>
                  <div className="font-medium">SOPs or Agents</div>
                  <div className="text-sm text-gray-500">Per month</div>
                </div>
                <div>
                  <input type="number" value={projectParams.sops || 0} onChange={e => {
              const value = e.target.valueAsNumber;
              onUpdateProjectParam('sops', isNaN(value) ? 0 : value);
            }} className="w-full px-2 py-1.5 border border-gray-300 rounded-md text-sm" />
                </div>
                <div className="text-sm">$750.00</div>
                <div>
                  <input type="number" min="0" max="100" value={projectDiscounts.sops} onChange={e => {
              const value = e.target.valueAsNumber;
              updateProjectDiscount('sops', isNaN(value) ? 0 : value);
            }} className="w-20 px-2 py-1.5 border border-gray-300 rounded-md text-sm" />
                </div>
                <div className="text-sm">
                  ${getProjectItemPrice(750, projectDiscounts.sops).toFixed(2)}
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-sm font-medium">
                    $
                    {getProjectItemPrice(750, projectDiscounts.sops).toFixed(2)}
                  </span>
                </div>
                <div>
                  {projectDiscounts.sops > 0 ? <span className={`px-2 py-1 text-xs font-medium rounded-full ${getProjectApprovalLevel(projectDiscounts.sops).color}`}>
                      {getProjectApprovalLevel(projectDiscounts.sops).level}
                    </span> : <span className="text-sm text-gray-400">—</span>}
                </div>
                <div>
                  <input type="number" min="1" max="60" value={projectMonths.sops} onChange={e => {
              const value = e.target.valueAsNumber;
              updateProjectMonths('sops', isNaN(value) ? 12 : value);
            }} className="w-16 px-2 py-1.5 border border-gray-300 rounded-md text-sm" />
                </div>
                <div className="text-sm font-medium">
                  $
                  {((projectParams.sops || 0) * getProjectItemPrice(750, projectDiscounts.sops) * projectMonths.sops).toLocaleString()}
                </div>
                <div></div>
              </div>
              {/* Team Size */}
              <div className="px-4 py-3 grid grid-cols-[2fr,1fr,1fr,1fr,1fr,1fr,1fr,1fr,1fr,auto] gap-4 items-center border-t border-gray-100">
                <div>
                  <div className="font-medium">Team Size</div>
                  <div className="text-sm text-gray-500">
                    # of Invisible experts
                  </div>
                </div>
                <div>
                  <select value={projectParams.teamSize} onChange={e => onUpdateProjectParam('teamSize', e.target.value)} className="w-full px-2 py-1.5 border border-gray-300 rounded-md text-sm">
                    <option value="small">Small (1-2)</option>
                    <option value="medium">Medium (3-5)</option>
                    <option value="large">Large (6+)</option>
                  </select>
                </div>
                <div className="text-sm">
                  {projectParams.teamSize === 'small' ? '+$0' : projectParams.teamSize === 'medium' ? '+50%' : '+100%'}
                </div>
                <div>
                  <input type="number" min="0" max="100" value={projectDiscounts.teamSize} onChange={e => {
              const value = e.target.valueAsNumber;
              updateProjectDiscount('teamSize', isNaN(value) ? 0 : value);
            }} className="w-20 px-2 py-1.5 border border-gray-300 rounded-md text-sm" />
                </div>
                <div className="text-sm">
                  {projectParams.teamSize === 'small' ? '+$0' : `+${Math.round(getTeamSizeCost() * (1 - projectDiscounts.teamSize / 100)).toLocaleString()}`}
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-sm font-medium">
                    {projectParams.teamSize === 'small' ? '+$0' : `+${Math.round(getTeamSizeCost() * (1 - projectDiscounts.teamSize / 100)).toLocaleString()}`}
                  </span>
                </div>
                <div>
                  {projectDiscounts.teamSize > 0 ? <span className={`px-2 py-1 text-xs font-medium rounded-full ${getProjectApprovalLevel(projectDiscounts.teamSize).color}`}>
                      {getProjectApprovalLevel(projectDiscounts.teamSize).level}
                    </span> : <span className="text-sm text-gray-400">—</span>}
                </div>
                <div className="text-sm text-gray-400">—</div>
                <div className="text-sm font-medium">Multiplier</div>
                <div></div>
              </div>
              {/* Subtotal Row */}
              <div className="px-4 py-3 grid grid-cols-[2fr,1fr,1fr,1fr,1fr,1fr,1fr,1fr,1fr,auto] gap-4 items-center border-t border-gray-200 bg-gray-50">
                <div className="font-semibold">Subtotal</div>
                <div></div>
                <div></div>
                <div></div>
                <div></div>
                <div></div>
                <div></div>
                <div></div>
                <div className="text-sm font-semibold">
                  ${calculateDiscountedProjectFee().toLocaleString()}
                </div>
                <div></div>
              </div>
            </div>}
        </div>}
      {/* SaaS Fees Section - Only show if not filtered out */}
      {!showOnlyPlatform && <div className="border-t border-gray-200">
          <button className="w-full bg-white px-4 py-3 flex items-center justify-between hover:bg-gray-50 transition-colors" onClick={() => toggleSection('saas')}>
            <div className="flex items-center gap-3">
              <ChevronRight size={20} className={`transition-transform ${expandedSection === 'saas' ? 'rotate-90' : ''}`} />
              <div className="text-left">
                <h3 className="font-medium">SaaS Usage Fees</h3>
                <p className="text-sm text-gray-500">
                  Consumption-based pricing
                </p>
              </div>
            </div>
            <div className="text-right">
              <div className="text-lg font-semibold">
                ${saasFee.toLocaleString()}
              </div>
            </div>
          </button>
          {expandedSection === 'saas' && <div className="bg-white">
              {/* API Call Volume */}
              <div className="px-4 py-3 grid grid-cols-[2fr,1fr,1fr,1fr,1fr,1fr,1fr,1fr,1fr,auto] gap-4 items-center border-t border-gray-100">
                <div>
                  <div className="font-medium">API Call Volume</div>
                  <div className="text-sm text-gray-500">
                    Per 1,000 calls/month
                  </div>
                </div>
                <div>
                  <input type="number" value={saasConfig.apiCalls || 0} onChange={e => {
              const value = e.target.valueAsNumber;
              onUpdateSaasConfig('apiCalls', isNaN(value) ? 0 : value);
            }} className="w-full px-2 py-1.5 border border-gray-300 rounded-md text-sm" />
                </div>
                <div className="text-sm">$0.50</div>
                <div>
                  <input type="number" min="0" max="100" value={saasDiscounts.apiCalls} onChange={e => {
              const value = e.target.valueAsNumber;
              updateSaasDiscount('apiCalls', isNaN(value) ? 0 : value);
            }} className="w-20 px-2 py-1.5 border border-gray-300 rounded-md text-sm" />
                </div>
                <div className="text-sm">
                  ${getSaasItemPrice(0.5, saasDiscounts.apiCalls).toFixed(2)}
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-sm font-medium">
                    ${getSaasItemPrice(0.5, saasDiscounts.apiCalls).toFixed(2)}
                  </span>
                </div>
                <div>
                  {saasDiscounts.apiCalls > 0 ? <span className={`px-2 py-1 text-xs font-medium rounded-full ${getSaasApprovalLevel(saasDiscounts.apiCalls).color}`}>
                      {getSaasApprovalLevel(saasDiscounts.apiCalls).level}
                    </span> : <span className="text-sm text-gray-400">—</span>}
                </div>
                <div>
                  <input type="number" min="1" max="60" value={saasMonths.apiCalls} onChange={e => {
              const value = e.target.valueAsNumber;
              updateSaasMonths('apiCalls', isNaN(value) ? 12 : value);
            }} className="w-16 px-2 py-1.5 border border-gray-300 rounded-md text-sm" />
                </div>
                <div className="text-sm font-medium">
                  $
                  {((saasConfig.apiCalls || 0) / 1000 * getSaasItemPrice(0.5, saasDiscounts.apiCalls) * saasMonths.apiCalls).toLocaleString()}
                </div>
                <div></div>
              </div>
              {/* Storage */}
              <div className="px-4 py-3 grid grid-cols-[2fr,1fr,1fr,1fr,1fr,1fr,1fr,1fr,1fr,auto] gap-4 items-center border-t border-gray-100">
                <div>
                  <div className="font-medium">Storage</div>
                  <div className="text-sm text-gray-500">Per GB/month</div>
                </div>
                <div>
                  <input type="number" value={saasConfig.dataStorage || 0} onChange={e => {
              const value = e.target.valueAsNumber;
              onUpdateSaasConfig('dataStorage', isNaN(value) ? 0 : value);
            }} className="w-full px-2 py-1.5 border border-gray-300 rounded-md text-sm" />
                </div>
                <div className="text-sm">$0.10</div>
                <div>
                  <input type="number" min="0" max="100" value={saasDiscounts.storage} onChange={e => {
              const value = e.target.valueAsNumber;
              updateSaasDiscount('storage', isNaN(value) ? 0 : value);
            }} className="w-20 px-2 py-1.5 border border-gray-300 rounded-md text-sm" />
                </div>
                <div className="text-sm">
                  ${getSaasItemPrice(0.1, saasDiscounts.storage).toFixed(2)}
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-sm font-medium">
                    ${getSaasItemPrice(0.1, saasDiscounts.storage).toFixed(2)}
                  </span>
                </div>
                <div>
                  {saasDiscounts.storage > 0 ? <span className={`px-2 py-1 text-xs font-medium rounded-full ${getSaasApprovalLevel(saasDiscounts.storage).color}`}>
                      {getSaasApprovalLevel(saasDiscounts.storage).level}
                    </span> : <span className="text-sm text-gray-400">—</span>}
                </div>
                <div>
                  <input type="number" min="1" max="60" value={saasMonths.storage} onChange={e => {
              const value = e.target.valueAsNumber;
              updateSaasMonths('storage', isNaN(value) ? 12 : value);
            }} className="w-16 px-2 py-1.5 border border-gray-300 rounded-md text-sm" />
                </div>
                <div className="text-sm font-medium">
                  $
                  {((saasConfig.dataStorage || 0) * getSaasItemPrice(0.1, saasDiscounts.storage) * saasMonths.storage).toLocaleString()}
                </div>
                <div></div>
              </div>
              {/* Data Throughput */}
              <div className="px-4 py-3 grid grid-cols-[2fr,1fr,1fr,1fr,1fr,1fr,1fr,1fr,1fr,auto] gap-4 items-center border-t border-gray-100">
                <div>
                  <div className="font-medium">Data Throughput</div>
                  <div className="text-sm text-gray-500">
                    Per GB transferred/month
                  </div>
                </div>
                <div>
                  <input type="number" value={saasConfig.dataThroughput || 0} onChange={e => {
              const value = e.target.valueAsNumber;
              onUpdateSaasConfig('dataThroughput', isNaN(value) ? 0 : value);
            }} className="w-full px-2 py-1.5 border border-gray-300 rounded-md text-sm" />
                </div>
                <div className="text-sm">$0.15</div>
                <div>
                  <input type="number" min="0" max="100" value={saasDiscounts.throughput} onChange={e => {
              const value = e.target.valueAsNumber;
              updateSaasDiscount('throughput', isNaN(value) ? 0 : value);
            }} className="w-20 px-2 py-1.5 border border-gray-300 rounded-md text-sm" />
                </div>
                <div className="text-sm">
                  ${getSaasItemPrice(0.15, saasDiscounts.throughput).toFixed(2)}
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-sm font-medium">
                    $
                    {getSaasItemPrice(0.15, saasDiscounts.throughput).toFixed(2)}
                  </span>
                </div>
                <div>
                  {saasDiscounts.throughput > 0 ? <span className={`px-2 py-1 text-xs font-medium rounded-full ${getSaasApprovalLevel(saasDiscounts.throughput).color}`}>
                      {getSaasApprovalLevel(saasDiscounts.throughput).level}
                    </span> : <span className="text-sm text-gray-400">—</span>}
                </div>
                <div>
                  <input type="number" min="1" max="60" value={saasMonths.throughput} onChange={e => {
              const value = e.target.valueAsNumber;
              updateSaasMonths('throughput', isNaN(value) ? 12 : value);
            }} className="w-16 px-2 py-1.5 border border-gray-300 rounded-md text-sm" />
                </div>
                <div className="text-sm font-medium">
                  $
                  {((saasConfig.dataThroughput || 0) * getSaasItemPrice(0.15, saasDiscounts.throughput) * saasMonths.throughput).toLocaleString()}
                </div>
                <div></div>
              </div>
              {/* Subtotal Row */}
              <div className="px-4 py-3 grid grid-cols-[2fr,1fr,1fr,1fr,1fr,1fr,1fr,1fr,1fr,auto] gap-4 items-center border-t border-gray-200 bg-gray-50">
                <div className="font-semibold">Subtotal</div>
                <div></div>
                <div></div>
                <div></div>
                <div></div>
                <div></div>
                <div></div>
                <div></div>
                <div className="text-sm font-semibold">
                  ${saasFee.toLocaleString()}
                </div>
                <div></div>
              </div>
            </div>}
        </div>}
      {/* Grand Total Row - Only show if showing all sections */}
      {!showOnlyPlatform && !showOnlyProjectAndSaas && <div className="border-t-2 border-gray-300 bg-blue-50">
          <div className="px-4 py-4 grid grid-cols-[2fr,1fr,1fr,1fr,1fr,1fr,1fr,1fr,1fr,auto] gap-4 items-center">
            <div className="font-bold text-lg">Grand Total</div>
            <div></div>
            <div></div>
            <div></div>
            <div></div>
            <div></div>
            <div></div>
            <div></div>
            <div className="text-xl font-bold text-blue-600">
              ${calculateGrandTotal().toLocaleString()}
            </div>
            <div></div>
          </div>
        </div>}
    </div>;
}