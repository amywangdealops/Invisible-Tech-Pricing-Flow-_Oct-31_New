import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ArrowRight, Building2, Cpu, Shield, Briefcase, Scale, Microscope, FileText, BookOpen, Check } from 'lucide-react';
const industries = [{
  id: 'av-robotics',
  name: 'Autonomous Vehicles & Robotics',
  icon: Cpu
}, {
  id: 'genai-fm',
  name: 'Generative AI / Foundation Models',
  icon: Cpu
}, {
  id: 'government',
  name: 'Government & Defense',
  icon: Shield
}, {
  id: 'financial',
  name: 'Enterprise - Financial Services',
  icon: Building2
}, {
  id: 'legal',
  name: 'Enterprise - Legal',
  icon: Scale
}, {
  id: 'healthcare',
  name: 'Enterprise - Healthcare',
  icon: Microscope
}, {
  id: 'media',
  name: 'Media & Publishing',
  icon: FileText
}, {
  id: 'research',
  name: 'Research & Academia',
  icon: BookOpen
}];
const customerSegments = [{
  id: 'ai-labs',
  name: 'AI Labs',
  description: 'AI research and development organizations'
}, {
  id: 'fortune-500',
  name: 'Fortune 500 Enterprise',
  description: 'Large enterprise organizations'
}, {
  id: 'government',
  name: 'Government / Public Sector',
  description: 'Federal, state, and local government'
}];
const dealTypes = [{
  id: 'new',
  name: 'New Business'
}, {
  id: 'expansion',
  name: 'Expansion'
}, {
  id: 'renewal',
  name: 'Renewal'
}];
const useCases = [{
  id: 'av-training',
  name: 'Autonomous Vehicle Training',
  description: 'LiDAR annotation, edge case curation, HD mapping',
  industry: 'av-robotics',
  products: ['Data Engine', 'Nucleus']
}, {
  id: 'foundation-model',
  name: 'Foundation Model Development',
  description: 'RLHF, data generation, red teaming, evaluation',
  industry: 'genai-fm',
  products: ['Data Engine', 'GenAI Platform']
}, {
  id: 'enterprise-agents',
  name: 'Enterprise AI Agent Deployment',
  description: 'Agents for customer service, legal, operations',
  industry: 'financial',
  products: ['GenAI Platform', 'Prebuilt Apps']
}, {
  id: 'defense-ops',
  name: 'Defense & Intelligence Operations',
  description: 'Mission planning, ISR, cyber operations',
  industry: 'government',
  products: ['Donovan', 'Professional Services']
}, {
  id: 'legal-review',
  name: 'Legal Document Review',
  description: 'Agentic document analysis and contract management',
  industry: 'legal',
  products: ['GenAI Platform', 'Legal App']
}, {
  id: 'due-diligence',
  name: 'Investment Due Diligence',
  description: 'Automated M&A and VC research',
  industry: 'financial',
  products: ['GenAI Platform', 'Due Diligence App']
}, {
  id: 'medical-research',
  name: 'Medical Research Acceleration',
  description: 'Annotation for medical imaging and research',
  industry: 'healthcare',
  products: ['Data Engine (Rapid)']
}, {
  id: 'ai-transformation',
  name: 'Custom AI Transformation',
  description: 'Full-stack AI with white-glove service',
  industry: 'financial',
  products: ['All Products', 'Professional Services']
}];
export function DealContextStep() {
  const navigate = useNavigate();
  const [companyName, setCompanyName] = useState('');
  const [selectedIndustry, setSelectedIndustry] = useState('');
  const [selectedSegment, setSelectedSegment] = useState('');
  const [selectedDealType, setSelectedDealType] = useState('new');
  const [primaryUseCase, setPrimaryUseCase] = useState('');
  const [secondaryUseCases, setSecondaryUseCases] = useState<string[]>([]);
  const filteredUseCases = useCases.filter(uc => !selectedIndustry || uc.industry === selectedIndustry);
  const toggleSecondaryUseCase = (id: string) => {
    if (secondaryUseCases.includes(id)) {
      setSecondaryUseCases(secondaryUseCases.filter(uc => uc !== id));
    } else {
      setSecondaryUseCases([...secondaryUseCases, id]);
    }
  };
  const canProceed = companyName && selectedIndustry && selectedSegment && primaryUseCase;
  const handleNext = () => {
    const params = new URLSearchParams();
    params.set('company', companyName);
    params.set('industry', selectedIndustry);
    params.set('segment', selectedSegment);
    params.set('dealType', selectedDealType);
    params.set('primaryUseCase', primaryUseCase);
    params.set('secondaryUseCases', secondaryUseCases.join(','));
    navigate(`/product-config?${params.toString()}`);
  };
  return <div className="w-full bg-white min-h-screen">
      <div className="p-4 border-b border-gray-200">
        <div className="flex items-center gap-2 text-sm text-gray-500">
          <Link to="/" className="hover:text-gray-700">
            Opportunities
          </Link>
          <ArrowRight size={12} />
          <span className="font-medium text-black">Deal Context</span>
        </div>
      </div>
      <div className="max-w-5xl mx-auto p-8">
        <h1 className="text-3xl font-semibold mb-2">Deal Context</h1>
        <p className="text-gray-500 mb-8">
          Provide context about the customer and their needs
        </p>
        <div className="space-y-8">
          {/* Company Name */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Company Name
            </label>
            <input type="text" value={companyName} onChange={e => setCompanyName(e.target.value)} placeholder="Enter company name" className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black" />
          </div>
          {/* Industry */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-3">
              Industry
            </label>
            <div className="grid grid-cols-2 gap-3">
              {industries.map(industry => {
              const Icon = industry.icon;
              return <button key={industry.id} onClick={() => setSelectedIndustry(industry.id)} className={`p-4 border rounded-lg text-left transition-all ${selectedIndustry === industry.id ? 'border-black bg-gray-50 shadow-sm' : 'border-gray-200 hover:border-gray-300'}`}>
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center">
                        <Icon size={20} className="text-gray-700" />
                      </div>
                      <span className="font-medium">{industry.name}</span>
                      {selectedIndustry === industry.id && <Check size={20} className="ml-auto text-black" />}
                    </div>
                  </button>;
            })}
            </div>
          </div>
          {/* Customer Segment */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-3">
              Customer Segment
            </label>
            <div className="grid grid-cols-3 gap-3">
              {customerSegments.map(segment => <button key={segment.id} onClick={() => setSelectedSegment(segment.id)} className={`p-4 border rounded-lg text-left transition-all ${selectedSegment === segment.id ? 'border-black bg-gray-50 shadow-sm' : 'border-gray-200 hover:border-gray-300'}`}>
                  <div className="font-medium mb-1">{segment.name}</div>
                  <div className="text-sm text-gray-500">
                    {segment.description}
                  </div>
                  {selectedSegment === segment.id && <Check size={16} className="mt-2 text-black" />}
                </button>)}
            </div>
          </div>
          {/* Deal Type */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-3">
              Deal Type
            </label>
            <div className="flex gap-3">
              {dealTypes.map(type => <button key={type.id} onClick={() => setSelectedDealType(type.id)} className={`px-6 py-3 border rounded-lg transition-all ${selectedDealType === type.id ? 'border-black bg-black text-white' : 'border-gray-200 hover:border-gray-300'}`}>
                  {type.name}
                </button>)}
            </div>
          </div>
          {/* Primary Use Case */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-3">
              Primary Use Case
            </label>
            <div className="space-y-3">
              {filteredUseCases.map(useCase => <button key={useCase.id} onClick={() => setPrimaryUseCase(useCase.id)} className={`w-full p-4 border rounded-lg text-left transition-all ${primaryUseCase === useCase.id ? 'border-black bg-gray-50 shadow-sm' : 'border-gray-200 hover:border-gray-300'}`}>
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="font-medium mb-1">{useCase.name}</div>
                      <div className="text-sm text-gray-500 mb-2">
                        {useCase.description}
                      </div>
                      <div className="flex gap-2">
                        {useCase.products.map((product, idx) => <span key={idx} className="text-xs px-2 py-1 bg-gray-100 rounded">
                            {product}
                          </span>)}
                      </div>
                    </div>
                    {primaryUseCase === useCase.id && <Check size={20} className="text-black ml-4" />}
                  </div>
                </button>)}
            </div>
          </div>
          {/* Secondary Use Cases */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-3">
              Secondary Use Cases (Optional)
            </label>
            <div className="space-y-2">
              {filteredUseCases.filter(uc => uc.id !== primaryUseCase).map(useCase => <label key={useCase.id} className="flex items-start gap-3 p-3 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer">
                    <input type="checkbox" checked={secondaryUseCases.includes(useCase.id)} onChange={() => toggleSecondaryUseCase(useCase.id)} className="mt-1" />
                    <div className="flex-1">
                      <div className="font-medium text-sm">{useCase.name}</div>
                      <div className="text-xs text-gray-500">
                        {useCase.description}
                      </div>
                    </div>
                  </label>)}
            </div>
          </div>
        </div>
        <div className="mt-8 flex justify-between">
          <Link to="/" className="px-6 py-2 border border-gray-200 rounded-lg text-sm font-medium hover:bg-gray-50">
            Back
          </Link>
          <button onClick={handleNext} disabled={!canProceed} className={`px-6 py-2 rounded-lg text-sm font-medium transition-colors ${canProceed ? 'bg-black text-white hover:bg-gray-800' : 'bg-gray-200 text-gray-500 cursor-not-allowed'}`}>
            Next: Configure Products
          </button>
        </div>
      </div>
    </div>;
}