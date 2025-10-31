import React, { useEffect, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { ArrowRight, FileText, PresentationIcon, Copy, Download, Check, Calendar, ChevronDown, Info, CheckCircle, Layers, Clock, ArrowUpRight, Mail, Phone, MessageSquare, FileIcon, Headphones, X, AlertCircle, Users, ExternalLink, Globe } from 'lucide-react';
export function QuoteStep() {
  const location = useLocation();
  const navigate = useNavigate();
  const queryParams = new URLSearchParams(location.search);
  // Get deal types from URL parameters
  const dealTypesParam = queryParams.get('dealTypes') || '';
  const dealTypes = dealTypesParam.split(',').filter(Boolean);
  const hasDataLabeling = dealTypes.includes('data-labeling');
  const hasEnterpriseTransformation = dealTypes.includes('enterprise-transformation');
  // Get industry/use case label from URL parameters
  const industryId = queryParams.get('type') || queryParams.get('industry') || 'ai-training';
  const useCaseId = queryParams.get('useCase') || '';
  // Convert industry ID to display name
  const industryDisplayNames: Record<string, string> = {
    'ai-training': 'AI & Machine Learning',
    finance: 'Financial Services',
    healthcare: 'Healthcare',
    insurance: 'Insurance',
    retail: 'Retail & E-commerce',
    technology: 'Technology',
    'public-sector': 'Public Sector',
    sports: 'Sports & Entertainment',
    'model-provider': 'AI Model Provider',
    custom: 'Custom Industry'
  };
  const industryLabel = industryDisplayNames[industryId] || industryId;
  // Convert use case ID to display name
  const useCaseDisplayNames: Record<string, string> = {
    'seo-content-gen': 'SEO Content Optimization',
    'rag-optimization': 'RAG Pipeline Optimization',
    'llm-training-speed': 'LLM Training Acceleration',
    'red-teaming': 'AI Red-Teaming',
    'synthetic-edge-cases': 'Synthetic Data Generation',
    'investment-strategy': 'Investment Strategy AI',
    'credit-risk': 'Credit Risk Modeling',
    'compliance-monitoring': 'Compliance Monitoring',
    'fraud-detection': 'Fraud Detection',
    'deal-sourcing': 'Intelligent Deal Sourcing',
    'clinical-workflow': 'Clinical Workflow Automation',
    'automated-documentation': 'Automated Documentation',
    'predictive-care': 'Predictive Care Analytics',
    'medical-image-triage': 'Medical Image Triage',
    'knowledge-retrieval': 'Medical Knowledge Retrieval',
    'claims-automation': 'Claims Processing Automation',
    'underwriting-automation': 'Underwriting Automation',
    'predictive-analytics': 'Predictive Analytics',
    'insurance-fraud': 'Insurance Fraud Detection',
    'self-service-chatbot': 'Self-Service Chatbot',
    'recruitment-automation': 'Recruitment Automation',
    'onboarding-speed': 'Seller Onboarding Acceleration',
    'sku-enrichment': 'SKU Enrichment & Catalog Optimization',
    'inventory-optimization': 'Inventory Optimization',
    'demand-forecasting': 'Demand Forecasting',
    'price-optimization': 'Dynamic Price Optimization',
    'customer-segmentation': 'Customer Segmentation',
    'recommendation-engine': 'Recommendation Engine',
    'supply-chain-optimization': 'Supply Chain Optimization',
    'workflow-automation': 'Workflow Automation',
    'document-processing': 'Document Processing',
    'data-integration': 'Data Integration',
    'reporting-analytics': 'Reporting & Analytics',
    'compliance-management': 'Compliance Management',
    'security-monitoring': 'Security Monitoring',
    'performance-optimization': 'Performance Optimization',
    'cost-optimization': 'Cost Optimization',
    'scalability-planning': 'Scalability Planning',
    'migration-strategy': 'Migration Strategy',
    'integration-planning': 'Integration Planning',
    'training-support': 'Training & Support',
    'change-management': 'Change Management',
    'governance-framework': 'Governance Framework',
    'risk-assessment': 'Risk Assessment',
    'vendor-management': 'Vendor Management',
    'contract-management': 'Contract Management',
    'budget-planning': 'Budget Planning',
    'timeline-management': 'Timeline Management',
    'stakeholder-communication': 'Stakeholder Communication',
    'progress-tracking': 'Progress Tracking',
    'quality-assurance': 'Quality Assurance',
    'testing-validation': 'Testing & Validation',
    'deployment-strategy': 'Deployment Strategy',
    'rollout-planning': 'Rollout Planning',
    'user-adoption': 'User Adoption',
    'success-metrics': 'Success Metrics',
    'continuous-improvement': 'Continuous Improvement'
  };
  const useCaseLabel = useCaseId ? useCaseDisplayNames[useCaseId] || useCaseId : '';
  // Get pricing calculator data from localStorage (Data Labeling)
  const pricingData = JSON.parse(localStorage.getItem('pricingCalculatorData') || '{"rows": [], "totals": {}}');
  const dataLabelingTotal = pricingData.totals?.grandTotal || 0;
  const totalTasks = pricingData.totals?.totalTasks || 0;
  const avgCostPerTask = pricingData.totals?.avgCost || 0;
  // Get enterprise transformation data from localStorage and calculate total
  const volumeDataRaw = JSON.parse(localStorage.getItem('volumeAndPricingData') || '{}');
  // Helper function to calculate cost per task (matching PricingReviewStep)
  const calculateCostPerTask = (item: any) => {
    const totalMinutes = (item.promptGenMin || 0) + (item.reviewMin || 0);
    const hourlyFraction = totalMinutes / 60;
    const baseCost = (item.hourlyRate || 0) * hourlyFraction;
    const costWithRejection = baseCost * (1 + (item.rejectionRate || 0) / 100);
    return costWithRejection;
  };
  // Helper function to calculate section revenue (matching PricingReviewStep logic)
  const calculateSectionRevenue = (milestoneId: string, sectionId: string, costData: any) => {
    const section = costData[milestoneId]?.find((s: any) => s.id === sectionId);
    if (!section) return 0;
    if (section.type === 'platform-fee') {
      return (section.items as any[]).reduce((sum, item) => {
        const suggestedRate = item.suggestedPrice ?? item.ratePerUnit;
        const quoteRate = item.quotePrice ?? suggestedRate;
        const estRevenue = quoteRate * item.quantity * (item.durationMonths || 1);
        return sum + estRevenue;
      }, 0);
    } else if (sectionId === 'forward-deployed') {
      // For FDE, calculate revenue based on quote rate * hours
      const fdeItems = section.items as any[];
      if (fdeItems.length === 0) return 0;
      const avgHourlyRate = fdeItems.reduce((sum: number, item: any) => sum + (item.hourlyRate || 50), 0) / fdeItems.length;
      const hourlyRate = fdeItems[0]?.hourlyRate || avgHourlyRate || 50;
      const totalHours = fdeItems.length > 0 ? fdeItems[0]?.taskVolume || 10 : 10;
      const suggestedRate = hourlyRate * 1.4;
      const quoteRate = fdeItems[0]?.quotePrice ?? suggestedRate;
      const estRevenue = quoteRate * totalHours;
      return estRevenue;
    } else {
      // For other resource sections, calculate based on quote price * task volume
      return (section.items as any[]).reduce((sum, item) => {
        const costPerTask = calculateCostPerTask(item);
        const suggestedRate = costPerTask * 1.4;
        const quoteRate = item.quotePrice ?? suggestedRate;
        const estRevenue = quoteRate * item.taskVolume;
        return sum + estRevenue;
      }, 0);
    }
  };
  // Calculate enterprise total using revenue calculation (matching PricingReviewStep)
  const calculateEnterpriseTotal = (costData: any) => {
    if (!costData || typeof costData !== 'object') return 0;
    return Object.keys(costData).reduce((sum, milestoneId) => {
      const sections = costData[milestoneId] || [];
      const milestoneRevenue = sections.reduce((sectionSum: number, section: any) => {
        return sectionSum + calculateSectionRevenue(milestoneId, section.id, costData);
      }, 0);
      return sum + milestoneRevenue;
    }, 0);
  };
  const enterpriseTotal = calculateEnterpriseTotal(volumeDataRaw);
  console.log('Enterprise Total Calculated:', enterpriseTotal);
  console.log('Data Labeling Total:', dataLabelingTotal);
  console.log('Volume Data Raw:', volumeDataRaw);
  // Calculate combined total
  const calculatedTotal = (hasDataLabeling ? dataLabelingTotal : 0) + (hasEnterpriseTransformation ? enterpriseTotal : 0);
  console.log('Calculated Total:', calculatedTotal);
  // Get values from URL parameters, with fallbacks to calculated values
  const [totalValue, setTotalValue] = useState(parseInt(queryParams.get('tcv') || calculatedTotal.toString()) || calculatedTotal);
  const outcomeTcv = parseInt(queryParams.get('outcomeTcv') || '0');
  const [contractTerm, setContractTerm] = useState(parseInt(queryParams.get('term') || '12'));
  // Calculate monthly value dynamically
  const [monthlyValue, setMonthlyValue] = useState(Math.round(totalValue / contractTerm));
  // Get configuration values from URL
  const industry = queryParams.get('industry') || 'AI & Machine Learning';
  const useCases = queryParams.get('useCases')?.split(',').filter(Boolean) || ['Data Labeling', 'Model Training'];
  // Get POC settings from URL
  const pocEnabled = queryParams.get('poc') === 'true';
  const pocMonths = parseInt(queryParams.get('pocMonths') || '2');
  const pocProducts = queryParams.get('pocProducts')?.split(',') || [];
  const deploymentModel = queryParams.get('deploymentModel') || 'annual-commitment';
  const billingCycle = queryParams.get('billingCycle') || 'monthly';
  // State for quote options
  const [startDate, setStartDate] = useState(queryParams.get('startDate') || new Date().toISOString().split('T')[0]);
  const [billingTerms, setBillingTerms] = useState(billingCycle.charAt(0).toUpperCase() + billingCycle.slice(1));
  const [paymentTerms, setPaymentTerms] = useState('Net-30');
  // State for document options
  const [includeOutcomeDefinitions, setIncludeOutcomeDefinitions] = useState(true);
  const [includeRoiAnalysis, setIncludeRoiAnalysis] = useState(true);
  const [includeAllPricingOptions, setIncludeAllPricingOptions] = useState(true);
  const [includePocResults, setIncludePocResults] = useState(pocEnabled);
  // State for additional clauses
  const [annualInflationAdjustment, setAnnualInflationAdjustment] = useState(true);
  const [earlyTerminationClause, setEarlyTerminationClause] = useState(true);
  const [serviceLevelAgreement, setServiceLevelAgreement] = useState(true);
  const [dataOwnershipClause, setDataOwnershipClause] = useState(true);
  // State for export
  const [exportingFormat, setExportingFormat] = useState<string | null>(null);
  // Update monthly value when total value or contract term changes
  useEffect(() => {
    setMonthlyValue(Math.round(totalValue / contractTerm));
  }, [totalValue, contractTerm]);
  // Update total value when localStorage data changes
  useEffect(() => {
    const newCalculatedTotal = (hasDataLabeling ? dataLabelingTotal : 0) + (hasEnterpriseTransformation ? enterpriseTotal : 0);
    console.log('useEffect - New Calculated Total:', newCalculatedTotal);
    if (newCalculatedTotal > 0) {
      setTotalValue(newCalculatedTotal);
    }
  }, [dataLabelingTotal, enterpriseTotal, hasDataLabeling, hasEnterpriseTransformation]);
  // Log whenever totalValue changes
  useEffect(() => {
    console.log('Total Value Updated:', totalValue);
  }, [totalValue]);
  // Calculate locale breakdown from pricing data
  const localeBreakdown = pricingData.rows?.reduce((acc: any, row: any) => {
    if (!acc[row.locale]) {
      acc[row.locale] = {
        tasks: 0,
        cost: 0
      };
    }
    const rowTotal = row.hourlyRate * ((row.promptGenMin + row.reviewMin) / 60) * (1 + row.rejectionRate / 100) * row.taskVolume;
    acc[row.locale].tasks += row.taskVolume;
    acc[row.locale].cost += rowTotal;
    return acc;
  }, {}) || {};
  // Determine service types display with proper names
  const getServiceTypes = () => {
    const types = [];
    if (hasDataLabeling) types.push('Data Labeling');
    if (hasEnterpriseTransformation) types.push('Enterprise Transformation');
    return types.join(' + ') || 'AI Services';
  };
  // Calculate contract end date
  const getContractEndDate = () => {
    const start = new Date(startDate);
    const end = new Date(start);
    end.setMonth(end.getMonth() + contractTerm);
    return end.toLocaleDateString();
  };
  // Handle export action
  const handleExport = (format: string) => {
    setExportingFormat(format);
    // Simulate export process
    setTimeout(() => {
      setExportingFormat(null);
      // In a real app, this would trigger a download
      alert(`Exporting ${format}...`);
    }, 1500);
  };
  // Function to save and finalize quote with metadata
  const handleFinalizeQuote = () => {
    const quoteMetadata = {
      industryLabel: industryLabel,
      useCaseLabel: useCaseLabel,
      dealTypes: dealTypes,
      serviceTypes: getServiceTypes(),
      generatedAt: new Date().toISOString(),
      contractStartDate: startDate,
      contractEndDate: getContractEndDate(),
      billingCadence: billingTerms,
      paymentTerms: paymentTerms
    };
    const newQuote = {
      id: Date.now(),
      name: `${industryLabel} • ${useCaseLabel || useCases.join(', ')}`,
      description: getServiceTypes(),
      term: contractTerm,
      totalValue: totalValue,
      services: getServiceTypes().split(' + '),
      deployment: deploymentModel,
      createdAt: 'Just now',
      status: 'Draft',
      industry: industryLabel,
      useCases: useCaseLabel ? [useCaseLabel] : useCases,
      startDate: startDate,
      billingTerms: billingTerms,
      paymentTerms: paymentTerms,
      metadata: quoteMetadata
    };
    // Get existing quotes from localStorage
    const existingQuotes = JSON.parse(localStorage.getItem('savedQuotes') || '[]');
    // Add new quote
    existingQuotes.push(newQuote);
    // Save back to localStorage
    localStorage.setItem('savedQuotes', JSON.stringify(existingQuotes));
    // Log metadata for analytics
    console.log('Quote finalized with metadata:', quoteMetadata);
    // Navigate to home page
    navigate('/');
  };
  return <div className="w-full bg-white pb-24">
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
          <Link to="/pricing" className="hover:text-gray-700">
            Pricing
          </Link>
          <ArrowRight size={12} />
          <span className="font-medium text-black">Quote</span>
        </div>
      </div>
      <div className="max-w-6xl mx-auto p-6">
        <h1 className="text-2xl font-semibold mb-2">Generate Quote</h1>
        <p className="text-gray-500 mb-8">
          Customize quote options and generate customer-facing materials
        </p>
        <div className="space-y-8">
          {/* Commercial Terms */}

          {/* Quote Summary */}
          <div className="border border-gray-200 rounded-lg p-6">
            <h2 className="text-lg font-medium mb-6">Quote Summary</h2>
            <div className="space-y-4">
              <div className="flex justify-between py-2 border-b border-gray-100">
                <span className="text-gray-500">Service Type</span>
                <span className="font-medium">{getServiceTypes()}</span>
              </div>
              {hasDataLabeling && <>
                  <div className="flex justify-between py-2 border-b border-gray-100">
                    <span className="text-gray-500">
                      Data Labeling - Total Tasks
                    </span>
                    <span className="font-medium">
                      {totalTasks.toLocaleString()}
                    </span>
                  </div>
                  {Object.keys(localeBreakdown).length > 0 && <div className="flex justify-between py-2 border-b border-gray-100">
                      <span className="text-gray-500">Locales Covered</span>
                      <span className="font-medium">
                        {Object.keys(localeBreakdown).join(', ')}
                      </span>
                    </div>}
                  <div className="flex justify-between py-2 border-b border-gray-100">
                    <span className="text-gray-500">Average Cost per Task</span>
                    <span className="font-medium">
                      ${avgCostPerTask.toFixed(2)}
                    </span>
                  </div>
                  <div className="flex justify-between py-2 border-b border-gray-100">
                    <span className="text-gray-500">
                      Data Labeling Subtotal
                    </span>
                    <span className="font-medium">
                      $
                      {dataLabelingTotal.toLocaleString('en-US', {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2
                  })}
                    </span>
                  </div>
                </>}
              {hasEnterpriseTransformation && <>
                  <div className="flex justify-between py-2 border-b border-gray-100">
                    <span className="text-gray-500">
                      Enterprise Transformation (TCV)
                    </span>
                    <span className="font-medium">
                      $
                      {enterpriseTotal.toLocaleString('en-US', {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2
                  })}
                    </span>
                  </div>
                  {volumeDataRaw && Object.keys(volumeDataRaw).length > 0 && <div className="flex justify-between py-2 border-b border-gray-100">
                      <span className="text-gray-500">Project Milestones</span>
                      <span className="font-medium">
                        {Object.keys(volumeDataRaw).length} phases
                      </span>
                    </div>}
                </>}
              <div className="flex justify-between py-2 border-b border-gray-100">
                <span className="text-gray-500">Contract Period</span>
                <span className="font-medium">
                  {new Date(startDate).toLocaleDateString()} -{' '}
                  {getContractEndDate()}
                </span>
              </div>
              <div className="flex justify-between py-2 border-b border-gray-100">
                <span className="text-gray-500">Billing Cadence</span>
                <span className="font-medium">{billingTerms}</span>
              </div>
              <div className="flex justify-between py-2 border-b border-gray-100">
                <span className="text-gray-500">Payment Terms</span>
                <span className="font-medium">{paymentTerms}</span>
              </div>
              <div className="flex justify-between py-2 bg-gray-50 -mx-6 px-6 py-3">
                <span className="text-gray-700 font-medium">
                  Total Contract Value
                </span>
                <span className="font-semibold text-lg">
                  $
                  {totalValue.toLocaleString('en-US', {
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 2
                })}
                </span>
              </div>
            </div>
          </div>
          {/* Export Quote */}
          <div className="border border-gray-200 rounded-lg p-6">
            <h2 className="text-lg font-medium mb-6">Export Quote</h2>
            <div className="grid grid-cols-3 gap-4 mb-6">
              <button onClick={() => handleExport('Order Form')} disabled={exportingFormat === 'Order Form'} className="p-6 border border-gray-200 rounded-lg hover:border-gray-300 hover:shadow-sm transition-all text-center">
                <FileText size={32} className="mx-auto mb-3 text-gray-400" />
                <h3 className="font-medium mb-1">Order Form</h3>
                <p className="text-sm text-gray-500">Scale-branded contract</p>
                {exportingFormat === 'Order Form' && <div className="mt-3">
                    <div className="animate-spin h-5 w-5 border-2 border-gray-300 border-t-black rounded-full mx-auto"></div>
                  </div>}
              </button>
              <button onClick={() => handleExport('Presentation Deck')} disabled={exportingFormat === 'Presentation Deck'} className="p-6 border border-gray-200 rounded-lg hover:border-gray-300 hover:shadow-sm transition-all text-center">
                <PresentationIcon size={32} className="mx-auto mb-3 text-gray-400" />
                <h3 className="font-medium mb-1">Presentation Deck</h3>
                <p className="text-sm text-gray-500">ROI analysis & proposal</p>
                {exportingFormat === 'Presentation Deck' && <div className="mt-3">
                    <div className="animate-spin h-5 w-5 border-2 border-gray-300 border-t-black rounded-full mx-auto"></div>
                  </div>}
              </button>
              <button onClick={() => handleExport('Customer Portal')} disabled={exportingFormat === 'Customer Portal'} className="p-6 border border-gray-200 rounded-lg hover:border-gray-300 hover:shadow-sm transition-all text-center">
                <Globe size={32} className="mx-auto mb-3 text-gray-400" />
                <h3 className="font-medium mb-1">Customer Portal</h3>
                <p className="text-sm text-gray-500">
                  Interactive quote review
                </p>
                {exportingFormat === 'Customer Portal' && <div className="mt-3">
                    <div className="animate-spin h-5 w-5 border-2 border-gray-300 border-t-black rounded-full mx-auto"></div>
                  </div>}
              </button>
            </div>
          </div>
          {/* Options & Settings */}
          <div className="border border-gray-200 rounded-lg p-6">
            <h2 className="text-lg font-medium mb-6">Options & Settings</h2>
            <div className="grid grid-cols-2 gap-8">
              <div>
                <h3 className="text-sm font-medium text-gray-700 mb-4">
                  Document Options
                </h3>
                <div className="space-y-3">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input type="checkbox" checked={includeOutcomeDefinitions} onChange={e => setIncludeOutcomeDefinitions(e.target.checked)} className="w-4 h-4 rounded border-gray-300" />
                    <span className="text-sm">
                      Include outcome definitions in contract
                    </span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input type="checkbox" checked={includeRoiAnalysis} onChange={e => setIncludeRoiAnalysis(e.target.checked)} className="w-4 h-4 rounded border-gray-300" />
                    <span className="text-sm">
                      Include ROI analysis in presentation
                    </span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input type="checkbox" checked={includeAllPricingOptions} onChange={e => setIncludeAllPricingOptions(e.target.checked)} className="w-4 h-4 rounded border-gray-300" />
                    <span className="text-sm">
                      Include all pricing options (A/B/C)
                    </span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input type="checkbox" checked={includePocResults} onChange={e => setIncludePocResults(e.target.checked)} className="w-4 h-4 rounded border-gray-300" />
                    <span className="text-sm">Include POC results summary</span>
                  </label>
                </div>
              </div>
              <div>
                <h3 className="text-sm font-medium text-gray-700 mb-4">
                  Additional Clauses
                </h3>
                <div className="space-y-3">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input type="checkbox" checked={annualInflationAdjustment} onChange={e => setAnnualInflationAdjustment(e.target.checked)} className="w-4 h-4 rounded border-gray-300" />
                    <span className="text-sm">
                      Annual inflation adjustment (3%)
                    </span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input type="checkbox" checked={earlyTerminationClause} onChange={e => setEarlyTerminationClause(e.target.checked)} className="w-4 h-4 rounded border-gray-300" />
                    <span className="text-sm">Early termination clause</span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input type="checkbox" checked={serviceLevelAgreement} onChange={e => setServiceLevelAgreement(e.target.checked)} className="w-4 h-4 rounded border-gray-300" />
                    <span className="text-sm">
                      Service level agreement (SLA)
                    </span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input type="checkbox" checked={dataOwnershipClause} onChange={e => setDataOwnershipClause(e.target.checked)} className="w-4 h-4 rounded border-gray-300" />
                    <span className="text-sm">Data ownership clause</span>
                  </label>
                </div>
              </div>
            </div>
            <div className="mt-6 p-4 bg-amber-50 border border-amber-200 rounded-lg flex items-start gap-2">
              <Info size={16} className="text-amber-600 mt-0.5 flex-shrink-0" />
              <p className="text-sm text-amber-800">
                Custom terms and clauses will be reviewed by legal before final
                approval. Standard terms are pre-approved for immediate use.
              </p>
            </div>
          </div>
        </div>
      </div>
      {/* Bottom Bar */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 p-4 shadow-lg">
        <div className="max-w-6xl mx-auto flex justify-between items-center">
          <div className="flex gap-6">
            <div>
              <div className="text-sm text-gray-500">Total Value</div>
              <div className="text-xl font-semibold">
                $
                {totalValue.toLocaleString('en-US', {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2
              })}
              </div>
            </div>
            <div>
              <div className="text-sm text-gray-500">Term</div>
              <div className="text-xl font-semibold">{contractTerm} months</div>
            </div>
            <div>
              <div className="text-sm text-gray-500">Monthly Value</div>
              <div className="text-xl font-semibold">
                $
                {monthlyValue.toLocaleString('en-US', {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2
              })}
              </div>
            </div>
          </div>
          <div className="flex gap-3">
            <Link to="/pricing-review" className="px-4 py-2 border border-gray-200 rounded-md text-sm">
              Back
            </Link>
            <button onClick={handleFinalizeQuote} className="px-4 py-2 bg-black text-white rounded-md text-sm font-medium hover:bg-gray-800">
              Finalize Quote
            </button>
          </div>
        </div>
      </div>
    </div>;
}