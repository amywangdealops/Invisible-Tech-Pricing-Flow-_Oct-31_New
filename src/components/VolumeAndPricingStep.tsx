import React, { useEffect, useState, Component } from 'react';
import { Link, useLocation, useSearchParams, useNavigate } from 'react-router-dom';
import { ArrowRight, Info, ChevronDown, ChevronRight, Check, AlertCircle, Phone, Mail, MessageSquare, FileText, Headphones, Settings, DollarSign, Shield, TrendingUp, BarChart3, Plus, Minus, Calendar, Clock, Sliders, ExternalLink, Share2, Link2, X, Database, Users, Zap, Target, Trash2 } from 'lucide-react';
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend, AreaChart, Area, PieChart, Pie, Cell } from 'recharts';
import { DndContext, closestCenter, KeyboardSensor, PointerSensor, useSensor, useSensors, DragEndEvent } from '@dnd-kit/core';
import { arrayMove, SortableContext, sortableKeyboardCoordinates, useSortable, horizontalListSortingStrategy } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { RampDrawer } from './RampDrawer';
import { PricingCategoriesTable } from './PricingCategoriesTable';
// Intercom products with pricing details
const products = [{
  id: 'platform-essential',
  name: 'Essential Plan',
  category: 'Core Platform',
  basePrice: 29,
  unit: 'per seat/month',
  unitShort: 'seats',
  volume: 120,
  pricingType: 'Subscription',
  pricingMetric: 'per-seat',
  tiers: [{
    min: 0,
    max: 10,
    price: 29
  }, {
    min: 10,
    max: 50,
    price: 27
  }, {
    min: 50,
    max: Infinity,
    price: 25
  }],
  cost: 10
}, {
  id: 'platform-advanced',
  name: 'Advanced Plan',
  category: 'Core Platform',
  basePrice: 85,
  unit: 'per seat/month',
  unitShort: 'seats',
  volume: 120,
  pricingType: 'Subscription',
  pricingMetric: 'per-seat',
  tiers: [{
    min: 0,
    max: 10,
    price: 85
  }, {
    min: 10,
    max: 50,
    price: 80
  }, {
    min: 50,
    max: Infinity,
    price: 75
  }],
  cost: 30
}, {
  id: 'platform-expert',
  name: 'Expert Plan',
  category: 'Core Platform',
  basePrice: 132,
  unit: 'per seat/month',
  unitShort: 'seats',
  volume: 120,
  pricingType: 'Subscription',
  pricingMetric: 'per-seat',
  tiers: [{
    min: 0,
    max: 10,
    price: 132
  }, {
    min: 10,
    max: 50,
    price: 125
  }, {
    min: 50,
    max: Infinity,
    price: 120
  }],
  cost: 45
}, {
  id: 'fin-ai-agent',
  name: 'Fin AI Agent',
  category: 'AI Services',
  basePrice: 0.99,
  unit: 'per resolution',
  unitShort: 'resolutions',
  volume: 12000,
  pricingType: 'Usage-based',
  pricingMetric: 'per-resolution',
  tiers: [{
    min: 0,
    max: 5000,
    price: 0.99
  }, {
    min: 5000,
    max: 20000,
    price: 0.89
  }, {
    min: 20000,
    max: Infinity,
    price: 0.79
  }],
  cost: 0.35
}, {
  id: 'fin-ai-copilot',
  name: 'Fin AI Copilot',
  category: 'AI Services',
  basePrice: 29,
  unit: 'per seat/month',
  unitShort: 'seats',
  volume: 120,
  pricingType: 'Subscription',
  pricingMetric: 'per-seat',
  tiers: [{
    min: 0,
    max: 10,
    price: 29
  }, {
    min: 10,
    max: 50,
    price: 27
  }, {
    min: 50,
    max: Infinity,
    price: 25
  }],
  cost: 10
}, {
  id: 'proactive-messaging',
  name: 'Proactive Support Plus',
  category: 'Messaging',
  basePrice: 99,
  unit: 'per month (base)',
  unitShort: 'months',
  volume: 12,
  pricingType: 'Subscription',
  pricingMetric: 'base-subscription',
  tiers: [{
    min: 0,
    max: 12,
    price: 99
  }, {
    min: 12,
    max: 24,
    price: 95
  }, {
    min: 24,
    max: Infinity,
    price: 90
  }],
  cost: 35
}, {
  id: 'sms',
  name: 'SMS',
  category: 'Communication Channels',
  basePrice: 0.05,
  unit: 'per segment',
  unitShort: 'segments',
  volume: 60000,
  pricingType: 'Usage-based',
  pricingMetric: 'per-segment',
  tiers: [{
    min: 0,
    max: 10000,
    price: 0.05
  }, {
    min: 10000,
    max: 50000,
    price: 0.045
  }, {
    min: 50000,
    max: Infinity,
    price: 0.04
  }],
  cost: 0.02
}, {
  id: 'whatsapp',
  name: 'WhatsApp',
  category: 'Communication Channels',
  basePrice: 0.06,
  unit: 'per conversation',
  unitShort: 'conversations',
  volume: 24000,
  pricingType: 'Usage-based',
  pricingMetric: 'per-conversation',
  tiers: [{
    min: 0,
    max: 5000,
    price: 0.06
  }, {
    min: 5000,
    max: 20000,
    price: 0.055
  }, {
    min: 20000,
    max: Infinity,
    price: 0.05
  }],
  cost: 0.025
}, {
  id: 'phone',
  name: 'Phone (Fin Voice)',
  category: 'Communication Channels',
  basePrice: 0.0035,
  unit: 'per minute',
  unitShort: 'minutes',
  volume: 360000,
  pricingType: 'Usage-based',
  pricingMetric: 'per-minute',
  tiers: [{
    min: 0,
    max: 100000,
    price: 0.0035
  }, {
    min: 100000,
    max: 500000,
    price: 0.003
  }, {
    min: 500000,
    max: Infinity,
    price: 0.0025
  }],
  cost: 0.001
}, {
  id: 'bulk-email',
  name: 'Bulk Email',
  category: 'Communication Channels',
  basePrice: 0.01,
  unit: 'per email',
  unitShort: 'emails',
  volume: 120000,
  pricingType: 'Usage-based',
  pricingMetric: 'per-email',
  tiers: [{
    min: 0,
    max: 50000,
    price: 0.01
  }, {
    min: 50000,
    max: 200000,
    price: 0.008
  }, {
    min: 200000,
    max: Infinity,
    price: 0.006
  }],
  cost: 0.003
}];
// Pricing guardrails
const pricingGuardrails = {
  marginBands: [{
    min: 0,
    max: 100000,
    minMargin: 0.4
  }, {
    min: 100000,
    max: 500000,
    minMargin: 0.35
  }, {
    min: 500000,
    max: 1000000,
    minMargin: 0.3
  }, {
    min: 1000000,
    max: Infinity,
    minMargin: 0.25
  }],
  contractTerms: [{
    months: 12,
    marginAdjustment: 0
  }, {
    months: 24,
    marginAdjustment: -0.02
  }, {
    months: 36,
    marginAdjustment: -0.05
  }],
  competitorAdjustments: {
    'Manual Processes': 0,
    'In-house Team': -0.02,
    'Competitor AI': -0.05
  },
  approvalLevels: [{
    threshold: 0.3,
    level: 'VP of Sales',
    color: 'red'
  }, {
    threshold: 0.11,
    level: 'Manager',
    color: 'amber'
  }, {
    threshold: 0,
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
// AI development seasonality patterns
const seasonalityPatterns = [{
  id: 'standard',
  name: 'Standard Distribution',
  distribution: [25, 25, 25, 25]
}, {
  id: 'model-training',
  name: 'Model Training Cycle',
  distribution: [15, 35, 35, 15]
}, {
  id: 'product-launch',
  name: 'Product Launch',
  distribution: [20, 20, 25, 35]
}, {
  id: 'research-cycle',
  name: 'Research Cycle',
  distribution: [22, 28, 28, 22]
}];
// Pricing metrics options
const pricingMetrics = [{
  id: 'per-seat',
  name: 'Per Seat/Month',
  icon: Users,
  description: 'Fixed monthly fee per agent or user seat',
  defaultFor: ['platform-essential', 'platform-advanced', 'platform-expert', 'fin-ai-copilot']
}, {
  id: 'per-resolution',
  name: 'Per Resolution',
  icon: Check,
  description: 'Pay per successful AI-resolved conversation',
  defaultFor: ['fin-ai-agent']
}, {
  id: 'per-segment',
  name: 'Per Message Segment',
  icon: MessageSquare,
  description: 'Pay per SMS segment sent or received',
  defaultFor: ['sms']
}, {
  id: 'per-conversation',
  name: 'Per 24-hour Conversation',
  icon: MessageSquare,
  description: 'Pay per WhatsApp conversation window',
  defaultFor: ['whatsapp']
}, {
  id: 'per-minute',
  name: 'Per Minute',
  icon: Phone,
  description: 'Pay per minute of voice call',
  defaultFor: ['phone']
}, {
  id: 'per-email',
  name: 'Per Email Sent',
  icon: Mail,
  description: 'Pay per bulk email sent',
  defaultFor: ['bulk-email']
}, {
  id: 'base-subscription',
  name: 'Base Subscription',
  icon: DollarSign,
  description: 'Fixed monthly base fee with included usage',
  defaultFor: ['proactive-messaging']
}];
// Get pricing metric display name
const getPricingMetricName = (metricId: string) => {
  switch (metricId) {
    case 'per-seat':
      return 'Per Seat/Month';
    case 'per-resolution':
      return 'Per Resolution';
    case 'per-segment':
      return 'Per Message Segment';
    case 'per-conversation':
      return 'Per 24-hour Conversation';
    case 'per-minute':
      return 'Per Minute';
    case 'per-email':
      return 'Per Email Sent';
    case 'base-subscription':
      return 'Base Subscription';
    default:
      return metricId;
  }
};
// Helper function to convert kebab-case to Title Case
const formatTabName = (id: string) => {
  return id.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
};
// Use case display names
const useCaseNames: Record<string, string> = {
  'ai-agent-deployment': 'AI Agent Deployment',
  'document-review': 'Document Review',
  'deep-research': 'Deep Research'
};
// Milestone data with names and descriptions
const milestones = [{
  id: 'benchmarking',
  name: 'Benchmarking',
  description: 'Establish baseline metrics and performance standards'
}, {
  id: 'prototype',
  name: 'Prototype',
  description: 'Develop and test initial prototype solution'
}, {
  id: 'systems-integration',
  name: 'Systems Integration',
  description: 'Integrate solution with existing systems'
}, {
  id: 'qa',
  name: 'QA',
  description: 'Quality assurance testing and validation'
}, {
  id: 'full-scale-rollout',
  name: 'Full Scale Rollout',
  description: 'Deploy solution across entire organization'
}];
interface CostItem {
  id: string;
  locale: string;
  difficulty: string;
  promptGenMin: number;
  reviewMin: number;
  rejectionRate: number;
  hourlyRate: number;
  taskVolume: number;
  quotePrice?: number; // Configurable quote price
}
interface PlatformFeeItem {
  id: string;
  feeType: string;
  unit: string;
  quantity: number;
  ratePerUnit: number;
  durationMonths: number;
  productName?: string; // For merged table
  suggestedPrice?: number;
  quotePrice?: number;
  discount?: number;
}
interface ResourceSection {
  id: string;
  name: string;
  type: 'resource' | 'platform-fee';
  items: CostItem[] | PlatformFeeItem[];
  expanded: boolean;
}
// Add SortableTab component before VolumeAndPricingStep
interface SortableTabProps {
  milestoneId: string;
  milestone: any;
  index: number;
  isActive: boolean;
  onSelect: () => void;
  onRemove: () => void;
  canRemove: boolean;
}
const SortableTab: React.FC<SortableTabProps> = ({
  milestoneId,
  milestone,
  index,
  isActive,
  onSelect,
  onRemove,
  canRemove
}) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging
  } = useSortable({
    id: milestoneId
  });
  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1
  };
  return <div ref={setNodeRef} style={style} className="relative group flex items-center">
      {/* Drag Handle */}
      <div {...attributes} {...listeners} className="cursor-grab active:cursor-grabbing px-1 py-2.5 hover:bg-gray-100 rounded-l-lg">
        <div className="flex flex-col gap-0.5">
          <div className="w-3 h-0.5 bg-gray-400 rounded"></div>
          <div className="w-3 h-0.5 bg-gray-400 rounded"></div>
          <div className="w-3 h-0.5 bg-gray-400 rounded"></div>
        </div>
      </div>
      {/* Clickable Tab */}
      <button onClick={onSelect} title={milestone.description} className={`flex items-center gap-2 px-4 py-2.5 text-sm font-medium whitespace-nowrap border-b-2 transition-colors ${isActive ? 'border-black text-black' : 'border-transparent text-gray-600 hover:text-gray-900'}`}>
        <span className={`flex items-center justify-center w-6 h-6 rounded-full text-xs ${isActive ? 'bg-black text-white' : 'bg-gray-200 text-gray-600'}`}>
          {index + 1}
        </span>
        <span>{milestone.name}</span>
      </button>
      {/* Remove Button */}
      {canRemove && <button onClick={onRemove} className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-xs hover:bg-red-600 z-10">
          ×
        </button>}
    </div>;
};
interface VolumeAndPricingStepProps {
  opportunity?: any;
}
const VolumeAndPricingStep: React.FC<VolumeAndPricingStepProps> = ({
  opportunity
}) => {
  const navigate = useNavigate();
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  // Read milestone order from URL params or use default
  const milestonesParam = searchParams.get('milestones');
  const initialMilestones = milestonesParam ? milestonesParam.split(',').filter(Boolean) : ['benchmarking', 'prototype', 'systems-integration', 'qa', 'full-scale-rollout'];
  const [activeTab, setActiveTab] = useState<string>(initialMilestones[0] || 'benchmarking');
  const [selectedMilestones, setSelectedMilestones] = useState<string[]>(initialMilestones);
  // Add state for default task volumes per milestone and section
  const [defaultTaskVolumes, setDefaultTaskVolumes] = useState<Record<string, Record<string, number>>>({
    benchmarking: {
      'expert-network': 300,
      'forward-deployed': 300
    },
    prototype: {
      'expert-network': 300,
      'forward-deployed': 300
    },
    'systems-integration': {
      'expert-network': 300,
      'forward-deployed': 300
    },
    qa: {
      'expert-network': 300,
      'forward-deployed': 300
    },
    'full-scale-rollout': {
      'expert-network': 300,
      'forward-deployed': 300
    }
  });
  const localeOptions = ['en-US', 'zh-CN', 'es-US', 'es-ES', 'es-MX', 'es-CL', 'zh-US'];
  const difficultyOptions = ['Easy', 'Hard'];
  const feeTypeOptions = ['Storage', 'API Calls'];
  // Initialize with independent milestone configurations including Platform Fee by default
  const [costData, setCostData] = useState<Record<string, ResourceSection[]>>({
    benchmarking: [{
      id: 'expert-network',
      name: 'Expert Network',
      type: 'resource',
      expanded: true,
      items: [{
        id: '1',
        locale: 'en-US',
        difficulty: 'Easy',
        promptGenMin: 2,
        reviewMin: 1,
        rejectionRate: 5,
        hourlyRate: 40,
        taskVolume: 300
      }, {
        id: '2',
        locale: 'en-US',
        difficulty: 'Hard',
        promptGenMin: 2,
        reviewMin: 1,
        rejectionRate: 5,
        hourlyRate: 45,
        taskVolume: 300
      }, {
        id: '3',
        locale: 'zh-CN',
        difficulty: 'Easy',
        promptGenMin: 2,
        reviewMin: 1,
        rejectionRate: 5,
        hourlyRate: 35,
        taskVolume: 300
      }, {
        id: '4',
        locale: 'zh-CN',
        difficulty: 'Hard',
        promptGenMin: 2,
        reviewMin: 1,
        rejectionRate: 5,
        hourlyRate: 40,
        taskVolume: 300
      }, {
        id: '5',
        locale: 'es-US',
        difficulty: 'Easy',
        promptGenMin: 2,
        reviewMin: 1,
        rejectionRate: 5,
        hourlyRate: 38,
        taskVolume: 300
      }, {
        id: '6',
        locale: 'es-US',
        difficulty: 'Hard',
        promptGenMin: 2,
        reviewMin: 1,
        rejectionRate: 5,
        hourlyRate: 43,
        taskVolume: 300
      }, {
        id: '7',
        locale: 'es-ES',
        difficulty: 'Easy',
        promptGenMin: 2,
        reviewMin: 1,
        rejectionRate: 5,
        hourlyRate: 36,
        taskVolume: 300
      }, {
        id: '8',
        locale: 'es-MX',
        difficulty: 'Hard',
        promptGenMin: 2,
        reviewMin: 1,
        rejectionRate: 5,
        hourlyRate: 42,
        taskVolume: 300
      }, {
        id: '9',
        locale: 'es-CL',
        difficulty: 'Easy',
        promptGenMin: 2,
        reviewMin: 1,
        rejectionRate: 5,
        hourlyRate: 37,
        taskVolume: 300
      }, {
        id: '10',
        locale: 'zh-US',
        difficulty: 'Hard',
        promptGenMin: 2,
        reviewMin: 1,
        rejectionRate: 5,
        hourlyRate: 44,
        taskVolume: 300
      }]
    }, {
      id: 'forward-deployed',
      name: 'Forward Deployed Engineers',
      type: 'resource',
      expanded: true,
      items: [{
        id: '1',
        locale: 'en-US',
        difficulty: 'Easy',
        promptGenMin: 3,
        reviewMin: 2,
        rejectionRate: 5,
        hourlyRate: 50,
        taskVolume: 300
      }, {
        id: '2',
        locale: 'en-US',
        difficulty: 'Hard',
        promptGenMin: 4,
        reviewMin: 2,
        rejectionRate: 5,
        hourlyRate: 55,
        taskVolume: 300
      }, {
        id: '3',
        locale: 'zh-CN',
        difficulty: 'Easy',
        promptGenMin: 3,
        reviewMin: 2,
        rejectionRate: 5,
        hourlyRate: 45,
        taskVolume: 300
      }, {
        id: '4',
        locale: 'zh-CN',
        difficulty: 'Hard',
        promptGenMin: 4,
        reviewMin: 2,
        rejectionRate: 5,
        hourlyRate: 50,
        taskVolume: 300
      }, {
        id: '5',
        locale: 'es-US',
        difficulty: 'Easy',
        promptGenMin: 3,
        reviewMin: 2,
        rejectionRate: 5,
        hourlyRate: 48,
        taskVolume: 300
      }, {
        id: '6',
        locale: 'es-US',
        difficulty: 'Hard',
        promptGenMin: 4,
        reviewMin: 2,
        rejectionRate: 5,
        hourlyRate: 53,
        taskVolume: 300
      }, {
        id: '7',
        locale: 'es-ES',
        difficulty: 'Easy',
        promptGenMin: 3,
        reviewMin: 2,
        rejectionRate: 5,
        hourlyRate: 46,
        taskVolume: 300
      }, {
        id: '8',
        locale: 'es-MX',
        difficulty: 'Hard',
        promptGenMin: 4,
        reviewMin: 2,
        rejectionRate: 5,
        hourlyRate: 52,
        taskVolume: 300
      }, {
        id: '9',
        locale: 'es-CL',
        difficulty: 'Easy',
        promptGenMin: 3,
        reviewMin: 2,
        rejectionRate: 5,
        hourlyRate: 47,
        taskVolume: 300
      }, {
        id: '10',
        locale: 'zh-US',
        difficulty: 'Hard',
        promptGenMin: 4,
        reviewMin: 2,
        rejectionRate: 5,
        hourlyRate: 54,
        taskVolume: 300
      }]
    }, {
      id: 'platform-fee',
      name: 'Platform Fee',
      type: 'platform-fee',
      expanded: true,
      items: [{
        id: '1',
        feeType: 'Storage',
        unit: 'GB',
        quantity: 100,
        ratePerUnit: 0.5,
        durationMonths: 12
      }, {
        id: '2',
        feeType: 'API Calls',
        unit: 'GB',
        quantity: 100,
        ratePerUnit: 0.5,
        durationMonths: 12
      }] as PlatformFeeItem[]
    }],
    prototype: [{
      id: 'expert-network',
      name: 'Expert Network',
      type: 'resource',
      expanded: true,
      items: [{
        id: '1',
        locale: 'en-US',
        difficulty: 'Easy',
        promptGenMin: 2,
        reviewMin: 1,
        rejectionRate: 5,
        hourlyRate: 40,
        taskVolume: 300
      }, {
        id: '2',
        locale: 'en-US',
        difficulty: 'Hard',
        promptGenMin: 2,
        reviewMin: 1,
        rejectionRate: 5,
        hourlyRate: 45,
        taskVolume: 300
      }, {
        id: '3',
        locale: 'zh-CN',
        difficulty: 'Easy',
        promptGenMin: 2,
        reviewMin: 1,
        rejectionRate: 5,
        hourlyRate: 35,
        taskVolume: 300
      }, {
        id: '4',
        locale: 'zh-CN',
        difficulty: 'Hard',
        promptGenMin: 2,
        reviewMin: 1,
        rejectionRate: 5,
        hourlyRate: 40,
        taskVolume: 300
      }, {
        id: '5',
        locale: 'es-US',
        difficulty: 'Easy',
        promptGenMin: 2,
        reviewMin: 1,
        rejectionRate: 5,
        hourlyRate: 38,
        taskVolume: 300
      }, {
        id: '6',
        locale: 'es-US',
        difficulty: 'Hard',
        promptGenMin: 2,
        reviewMin: 1,
        rejectionRate: 5,
        hourlyRate: 43,
        taskVolume: 300
      }, {
        id: '7',
        locale: 'es-ES',
        difficulty: 'Easy',
        promptGenMin: 2,
        reviewMin: 1,
        rejectionRate: 5,
        hourlyRate: 36,
        taskVolume: 300
      }, {
        id: '8',
        locale: 'es-MX',
        difficulty: 'Hard',
        promptGenMin: 2,
        reviewMin: 1,
        rejectionRate: 5,
        hourlyRate: 42,
        taskVolume: 300
      }, {
        id: '9',
        locale: 'es-CL',
        difficulty: 'Easy',
        promptGenMin: 2,
        reviewMin: 1,
        rejectionRate: 5,
        hourlyRate: 37,
        taskVolume: 300
      }, {
        id: '10',
        locale: 'zh-US',
        difficulty: 'Hard',
        promptGenMin: 2,
        reviewMin: 1,
        rejectionRate: 5,
        hourlyRate: 44,
        taskVolume: 300
      }]
    }, {
      id: 'forward-deployed',
      name: 'Forward Deployed Engineers',
      type: 'resource',
      expanded: true,
      items: [{
        id: '1',
        locale: 'en-US',
        difficulty: 'Easy',
        promptGenMin: 3,
        reviewMin: 2,
        rejectionRate: 5,
        hourlyRate: 50,
        taskVolume: 300
      }, {
        id: '2',
        locale: 'en-US',
        difficulty: 'Hard',
        promptGenMin: 4,
        reviewMin: 2,
        rejectionRate: 5,
        hourlyRate: 55,
        taskVolume: 300
      }, {
        id: '3',
        locale: 'zh-CN',
        difficulty: 'Easy',
        promptGenMin: 3,
        reviewMin: 2,
        rejectionRate: 5,
        hourlyRate: 45,
        taskVolume: 300
      }, {
        id: '4',
        locale: 'zh-CN',
        difficulty: 'Hard',
        promptGenMin: 4,
        reviewMin: 2,
        rejectionRate: 5,
        hourlyRate: 50,
        taskVolume: 300
      }, {
        id: '5',
        locale: 'es-US',
        difficulty: 'Easy',
        promptGenMin: 3,
        reviewMin: 2,
        rejectionRate: 5,
        hourlyRate: 48,
        taskVolume: 300
      }, {
        id: '6',
        locale: 'es-US',
        difficulty: 'Hard',
        promptGenMin: 4,
        reviewMin: 2,
        rejectionRate: 5,
        hourlyRate: 53,
        taskVolume: 300
      }, {
        id: '7',
        locale: 'es-ES',
        difficulty: 'Easy',
        promptGenMin: 3,
        reviewMin: 2,
        rejectionRate: 5,
        hourlyRate: 46,
        taskVolume: 300
      }, {
        id: '8',
        locale: 'es-MX',
        difficulty: 'Hard',
        promptGenMin: 4,
        reviewMin: 2,
        rejectionRate: 5,
        hourlyRate: 52,
        taskVolume: 300
      }, {
        id: '9',
        locale: 'es-CL',
        difficulty: 'Easy',
        promptGenMin: 3,
        reviewMin: 2,
        rejectionRate: 5,
        hourlyRate: 47,
        taskVolume: 300
      }, {
        id: '10',
        locale: 'zh-US',
        difficulty: 'Hard',
        promptGenMin: 4,
        reviewMin: 2,
        rejectionRate: 5,
        hourlyRate: 54,
        taskVolume: 300
      }]
    }, {
      id: 'platform-fee',
      name: 'Platform Fee',
      type: 'platform-fee',
      expanded: true,
      items: [{
        id: '1',
        feeType: 'Storage',
        unit: 'GB',
        quantity: 100,
        ratePerUnit: 0.5,
        durationMonths: 12
      }, {
        id: '2',
        feeType: 'API Calls',
        unit: 'GB',
        quantity: 100,
        ratePerUnit: 0.5,
        durationMonths: 12
      }] as PlatformFeeItem[]
    }],
    'systems-integration': [{
      id: 'expert-network',
      name: 'Expert Network',
      type: 'resource',
      expanded: true,
      items: [{
        id: '1',
        locale: 'en-US',
        difficulty: 'Easy',
        promptGenMin: 2,
        reviewMin: 1,
        rejectionRate: 5,
        hourlyRate: 40,
        taskVolume: 300
      }, {
        id: '2',
        locale: 'en-US',
        difficulty: 'Hard',
        promptGenMin: 2,
        reviewMin: 1,
        rejectionRate: 5,
        hourlyRate: 45,
        taskVolume: 300
      }, {
        id: '3',
        locale: 'zh-CN',
        difficulty: 'Easy',
        promptGenMin: 2,
        reviewMin: 1,
        rejectionRate: 5,
        hourlyRate: 35,
        taskVolume: 300
      }, {
        id: '4',
        locale: 'zh-CN',
        difficulty: 'Hard',
        promptGenMin: 2,
        reviewMin: 1,
        rejectionRate: 5,
        hourlyRate: 40,
        taskVolume: 300
      }, {
        id: '5',
        locale: 'es-US',
        difficulty: 'Easy',
        promptGenMin: 2,
        reviewMin: 1,
        rejectionRate: 5,
        hourlyRate: 38,
        taskVolume: 300
      }, {
        id: '6',
        locale: 'es-US',
        difficulty: 'Hard',
        promptGenMin: 2,
        reviewMin: 1,
        rejectionRate: 5,
        hourlyRate: 43,
        taskVolume: 300
      }, {
        id: '7',
        locale: 'es-ES',
        difficulty: 'Easy',
        promptGenMin: 2,
        reviewMin: 1,
        rejectionRate: 5,
        hourlyRate: 36,
        taskVolume: 300
      }, {
        id: '8',
        locale: 'es-MX',
        difficulty: 'Hard',
        promptGenMin: 2,
        reviewMin: 1,
        rejectionRate: 5,
        hourlyRate: 42,
        taskVolume: 300
      }, {
        id: '9',
        locale: 'es-CL',
        difficulty: 'Easy',
        promptGenMin: 2,
        reviewMin: 1,
        rejectionRate: 5,
        hourlyRate: 37,
        taskVolume: 300
      }, {
        id: '10',
        locale: 'zh-US',
        difficulty: 'Hard',
        promptGenMin: 2,
        reviewMin: 1,
        rejectionRate: 5,
        hourlyRate: 44,
        taskVolume: 300
      }]
    }, {
      id: 'forward-deployed',
      name: 'Forward Deployed Engineers',
      type: 'resource',
      expanded: true,
      items: [{
        id: '1',
        locale: 'en-US',
        difficulty: 'Easy',
        promptGenMin: 3,
        reviewMin: 2,
        rejectionRate: 5,
        hourlyRate: 50,
        taskVolume: 300
      }, {
        id: '2',
        locale: 'en-US',
        difficulty: 'Hard',
        promptGenMin: 4,
        reviewMin: 2,
        rejectionRate: 5,
        hourlyRate: 55,
        taskVolume: 300
      }, {
        id: '3',
        locale: 'zh-CN',
        difficulty: 'Easy',
        promptGenMin: 3,
        reviewMin: 2,
        rejectionRate: 5,
        hourlyRate: 45,
        taskVolume: 300
      }, {
        id: '4',
        locale: 'zh-CN',
        difficulty: 'Hard',
        promptGenMin: 4,
        reviewMin: 2,
        rejectionRate: 5,
        hourlyRate: 50,
        taskVolume: 300
      }, {
        id: '5',
        locale: 'es-US',
        difficulty: 'Easy',
        promptGenMin: 3,
        reviewMin: 2,
        rejectionRate: 5,
        hourlyRate: 48,
        taskVolume: 300
      }, {
        id: '6',
        locale: 'es-US',
        difficulty: 'Hard',
        promptGenMin: 4,
        reviewMin: 2,
        rejectionRate: 5,
        hourlyRate: 53,
        taskVolume: 300
      }, {
        id: '7',
        locale: 'es-ES',
        difficulty: 'Easy',
        promptGenMin: 3,
        reviewMin: 2,
        rejectionRate: 5,
        hourlyRate: 46,
        taskVolume: 300
      }, {
        id: '8',
        locale: 'es-MX',
        difficulty: 'Hard',
        promptGenMin: 4,
        reviewMin: 2,
        rejectionRate: 5,
        hourlyRate: 52,
        taskVolume: 300
      }, {
        id: '9',
        locale: 'es-CL',
        difficulty: 'Easy',
        promptGenMin: 3,
        reviewMin: 2,
        rejectionRate: 5,
        hourlyRate: 47,
        taskVolume: 300
      }, {
        id: '10',
        locale: 'zh-US',
        difficulty: 'Hard',
        promptGenMin: 4,
        reviewMin: 2,
        rejectionRate: 5,
        hourlyRate: 54,
        taskVolume: 300
      }]
    }, {
      id: 'platform-fee',
      name: 'Platform Fee',
      type: 'platform-fee',
      expanded: true,
      items: [{
        id: '1',
        feeType: 'Storage',
        unit: 'GB',
        quantity: 100,
        ratePerUnit: 0.5,
        durationMonths: 12
      }, {
        id: '2',
        feeType: 'API Calls',
        unit: 'GB',
        quantity: 100,
        ratePerUnit: 0.5,
        durationMonths: 12
      }] as PlatformFeeItem[]
    }],
    qa: [{
      id: 'expert-network',
      name: 'Expert Network',
      type: 'resource',
      expanded: true,
      items: [{
        id: '1',
        locale: 'en-US',
        difficulty: 'Easy',
        promptGenMin: 2,
        reviewMin: 1,
        rejectionRate: 5,
        hourlyRate: 40,
        taskVolume: 300
      }, {
        id: '2',
        locale: 'en-US',
        difficulty: 'Hard',
        promptGenMin: 2,
        reviewMin: 1,
        rejectionRate: 5,
        hourlyRate: 45,
        taskVolume: 300
      }, {
        id: '3',
        locale: 'zh-CN',
        difficulty: 'Easy',
        promptGenMin: 2,
        reviewMin: 1,
        rejectionRate: 5,
        hourlyRate: 35,
        taskVolume: 300
      }, {
        id: '4',
        locale: 'zh-CN',
        difficulty: 'Hard',
        promptGenMin: 2,
        reviewMin: 1,
        rejectionRate: 5,
        hourlyRate: 40,
        taskVolume: 300
      }, {
        id: '5',
        locale: 'es-US',
        difficulty: 'Easy',
        promptGenMin: 2,
        reviewMin: 1,
        rejectionRate: 5,
        hourlyRate: 38,
        taskVolume: 300
      }, {
        id: '6',
        locale: 'es-US',
        difficulty: 'Hard',
        promptGenMin: 2,
        reviewMin: 1,
        rejectionRate: 5,
        hourlyRate: 43,
        taskVolume: 300
      }, {
        id: '7',
        locale: 'es-ES',
        difficulty: 'Easy',
        promptGenMin: 2,
        reviewMin: 1,
        rejectionRate: 5,
        hourlyRate: 36,
        taskVolume: 300
      }, {
        id: '8',
        locale: 'es-MX',
        difficulty: 'Hard',
        promptGenMin: 2,
        reviewMin: 1,
        rejectionRate: 5,
        hourlyRate: 42,
        taskVolume: 300
      }, {
        id: '9',
        locale: 'es-CL',
        difficulty: 'Easy',
        promptGenMin: 2,
        reviewMin: 1,
        rejectionRate: 5,
        hourlyRate: 37,
        taskVolume: 300
      }, {
        id: '10',
        locale: 'zh-US',
        difficulty: 'Hard',
        promptGenMin: 2,
        reviewMin: 1,
        rejectionRate: 5,
        hourlyRate: 44,
        taskVolume: 300
      }]
    }, {
      id: 'forward-deployed',
      name: 'Forward Deployed Engineers',
      type: 'resource',
      expanded: true,
      items: [{
        id: '1',
        locale: 'en-US',
        difficulty: 'Easy',
        promptGenMin: 3,
        reviewMin: 2,
        rejectionRate: 5,
        hourlyRate: 50,
        taskVolume: 300
      }, {
        id: '2',
        locale: 'en-US',
        difficulty: 'Hard',
        promptGenMin: 4,
        reviewMin: 2,
        rejectionRate: 5,
        hourlyRate: 55,
        taskVolume: 300
      }, {
        id: '3',
        locale: 'zh-CN',
        difficulty: 'Easy',
        promptGenMin: 3,
        reviewMin: 2,
        rejectionRate: 5,
        hourlyRate: 45,
        taskVolume: 300
      }, {
        id: '4',
        locale: 'zh-CN',
        difficulty: 'Hard',
        promptGenMin: 4,
        reviewMin: 2,
        rejectionRate: 5,
        hourlyRate: 50,
        taskVolume: 300
      }, {
        id: '5',
        locale: 'es-US',
        difficulty: 'Easy',
        promptGenMin: 3,
        reviewMin: 2,
        rejectionRate: 5,
        hourlyRate: 48,
        taskVolume: 300
      }, {
        id: '6',
        locale: 'es-US',
        difficulty: 'Hard',
        promptGenMin: 4,
        reviewMin: 2,
        rejectionRate: 5,
        hourlyRate: 53,
        taskVolume: 300
      }, {
        id: '7',
        locale: 'es-ES',
        difficulty: 'Easy',
        promptGenMin: 3,
        reviewMin: 2,
        rejectionRate: 5,
        hourlyRate: 46,
        taskVolume: 300
      }, {
        id: '8',
        locale: 'es-MX',
        difficulty: 'Hard',
        promptGenMin: 4,
        reviewMin: 2,
        rejectionRate: 5,
        hourlyRate: 52,
        taskVolume: 300
      }, {
        id: '9',
        locale: 'es-CL',
        difficulty: 'Easy',
        promptGenMin: 3,
        reviewMin: 2,
        rejectionRate: 5,
        hourlyRate: 47,
        taskVolume: 300
      }, {
        id: '10',
        locale: 'zh-US',
        difficulty: 'Hard',
        promptGenMin: 4,
        reviewMin: 2,
        rejectionRate: 5,
        hourlyRate: 54,
        taskVolume: 300
      }]
    }, {
      id: 'platform-fee',
      name: 'Platform Fee',
      type: 'platform-fee',
      expanded: true,
      items: [{
        id: '1',
        feeType: 'Storage',
        unit: 'GB',
        quantity: 100,
        ratePerUnit: 0.5,
        durationMonths: 12
      }, {
        id: '2',
        feeType: 'API Calls',
        unit: 'GB',
        quantity: 100,
        ratePerUnit: 0.5,
        durationMonths: 12
      }] as PlatformFeeItem[]
    }],
    'full-scale-rollout': [{
      id: 'expert-network',
      name: 'Expert Network',
      type: 'resource',
      expanded: true,
      items: [{
        id: '1',
        locale: 'en-US',
        difficulty: 'Easy',
        promptGenMin: 2,
        reviewMin: 1,
        rejectionRate: 5,
        hourlyRate: 40,
        taskVolume: 300
      }, {
        id: '2',
        locale: 'en-US',
        difficulty: 'Hard',
        promptGenMin: 2,
        reviewMin: 1,
        rejectionRate: 5,
        hourlyRate: 45,
        taskVolume: 300
      }, {
        id: '3',
        locale: 'zh-CN',
        difficulty: 'Easy',
        promptGenMin: 2,
        reviewMin: 1,
        rejectionRate: 5,
        hourlyRate: 35,
        taskVolume: 300
      }, {
        id: '4',
        locale: 'zh-CN',
        difficulty: 'Hard',
        promptGenMin: 2,
        reviewMin: 1,
        rejectionRate: 5,
        hourlyRate: 40,
        taskVolume: 300
      }, {
        id: '5',
        locale: 'es-US',
        difficulty: 'Easy',
        promptGenMin: 2,
        reviewMin: 1,
        rejectionRate: 5,
        hourlyRate: 38,
        taskVolume: 300
      }, {
        id: '6',
        locale: 'es-US',
        difficulty: 'Hard',
        promptGenMin: 2,
        reviewMin: 1,
        rejectionRate: 5,
        hourlyRate: 43,
        taskVolume: 300
      }, {
        id: '7',
        locale: 'es-ES',
        difficulty: 'Easy',
        promptGenMin: 2,
        reviewMin: 1,
        rejectionRate: 5,
        hourlyRate: 36,
        taskVolume: 300
      }, {
        id: '8',
        locale: 'es-MX',
        difficulty: 'Hard',
        promptGenMin: 2,
        reviewMin: 1,
        rejectionRate: 5,
        hourlyRate: 42,
        taskVolume: 300
      }, {
        id: '9',
        locale: 'es-CL',
        difficulty: 'Easy',
        promptGenMin: 2,
        reviewMin: 1,
        rejectionRate: 5,
        hourlyRate: 37,
        taskVolume: 300
      }, {
        id: '10',
        locale: 'zh-US',
        difficulty: 'Hard',
        promptGenMin: 2,
        reviewMin: 1,
        rejectionRate: 5,
        hourlyRate: 44,
        taskVolume: 300
      }]
    }, {
      id: 'forward-deployed',
      name: 'Forward Deployed Engineers',
      type: 'resource',
      expanded: true,
      items: [{
        id: '1',
        locale: 'en-US',
        difficulty: 'Easy',
        promptGenMin: 3,
        reviewMin: 2,
        rejectionRate: 5,
        hourlyRate: 50,
        taskVolume: 300
      }, {
        id: '2',
        locale: 'en-US',
        difficulty: 'Hard',
        promptGenMin: 4,
        reviewMin: 2,
        rejectionRate: 5,
        hourlyRate: 55,
        taskVolume: 300
      }, {
        id: '3',
        locale: 'zh-CN',
        difficulty: 'Easy',
        promptGenMin: 3,
        reviewMin: 2,
        rejectionRate: 5,
        hourlyRate: 45,
        taskVolume: 300
      }, {
        id: '4',
        locale: 'zh-CN',
        difficulty: 'Hard',
        promptGenMin: 4,
        reviewMin: 2,
        rejectionRate: 5,
        hourlyRate: 50,
        taskVolume: 300
      }, {
        id: '5',
        locale: 'es-US',
        difficulty: 'Easy',
        promptGenMin: 3,
        reviewMin: 2,
        rejectionRate: 5,
        hourlyRate: 48,
        taskVolume: 300
      }, {
        id: '6',
        locale: 'es-US',
        difficulty: 'Hard',
        promptGenMin: 4,
        reviewMin: 2,
        rejectionRate: 5,
        hourlyRate: 53,
        taskVolume: 300
      }, {
        id: '7',
        locale: 'es-ES',
        difficulty: 'Easy',
        promptGenMin: 3,
        reviewMin: 2,
        rejectionRate: 5,
        hourlyRate: 46,
        taskVolume: 300
      }, {
        id: '8',
        locale: 'es-MX',
        difficulty: 'Hard',
        promptGenMin: 4,
        reviewMin: 2,
        rejectionRate: 5,
        hourlyRate: 52,
        taskVolume: 300
      }, {
        id: '9',
        locale: 'es-CL',
        difficulty: 'Easy',
        promptGenMin: 3,
        reviewMin: 2,
        rejectionRate: 5,
        hourlyRate: 47,
        taskVolume: 300
      }, {
        id: '10',
        locale: 'zh-US',
        difficulty: 'Hard',
        promptGenMin: 4,
        reviewMin: 2,
        rejectionRate: 5,
        hourlyRate: 54,
        taskVolume: 300
      }]
    }, {
      id: 'platform-fee',
      name: 'Platform Fee',
      type: 'platform-fee',
      expanded: true,
      items: [{
        id: '1',
        feeType: 'Storage',
        unit: 'GB',
        quantity: 100,
        ratePerUnit: 0.5,
        durationMonths: 12
      }, {
        id: '2',
        feeType: 'API Calls',
        unit: 'GB',
        quantity: 100,
        ratePerUnit: 0.5,
        durationMonths: 12
      }] as PlatformFeeItem[]
    }]
  });
  // Get custom milestones from localStorage if available
  const [customMilestones] = useState(() => {
    try {
      const stored = localStorage.getItem('customMilestones');
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  });
  // Combine default and custom milestones
  const allMilestones = [...milestones, ...customMilestones.map((cm: any) => ({
    id: cm.id,
    name: cm.name,
    description: cm.description || ''
  }))];
  // Compute available milestones (ones that haven't been selected yet)
  const availableMilestones = allMilestones.filter(milestone => !selectedMilestones.includes(milestone.id));
  const [showAddMilestoneDropdown, setShowAddMilestoneDropdown] = useState(false);
  // Add drag and drop sensors
  const sensors = useSensors(useSensor(PointerSensor), useSensor(KeyboardSensor, {
    coordinateGetter: sortableKeyboardCoordinates
  }));
  const handleDragEnd = (event: DragEndEvent) => {
    const {
      active,
      over
    } = event;
    if (over && active.id !== over.id) {
      setSelectedMilestones(items => {
        const oldIndex = items.indexOf(active.id as string);
        const newIndex = items.indexOf(over.id as string);
        return arrayMove(items, oldIndex, newIndex);
      });
    }
  };
  const handleAddMilestone = (milestoneId: string) => {
    setSelectedMilestones([...selectedMilestones, milestoneId]);
    setActiveTab(milestoneId);
    if (!costData[milestoneId]) {
      setCostData({
        ...costData,
        [milestoneId]: [{
          id: 'expert-network',
          name: 'Expert Network',
          type: 'resource',
          expanded: true,
          items: []
        }, {
          id: 'forward-deployed',
          name: 'Forward Deployed Engineers',
          type: 'resource',
          expanded: true,
          items: []
        }, {
          id: 'platform-fee',
          name: 'Platform Fee',
          type: 'platform-fee',
          expanded: true,
          items: [{
            id: '1',
            feeType: 'Storage',
            unit: 'GB',
            quantity: 100,
            ratePerUnit: 0.5,
            durationMonths: 12
          }, {
            id: '2',
            feeType: 'API Calls',
            unit: 'GB',
            quantity: 100,
            ratePerUnit: 0.5,
            durationMonths: 12
          }] as PlatformFeeItem[]
        }]
      });
    }
    setShowAddMilestoneDropdown(false);
  };
  const handleRemoveTab = (milestoneId: string) => {
    const newSelectedMilestones = selectedMilestones.filter(id => id !== milestoneId);
    setSelectedMilestones(newSelectedMilestones);
    if (activeTab === milestoneId && newSelectedMilestones.length > 0) {
      setActiveTab(newSelectedMilestones[0]);
    }
  };
  const toggleSection = (milestoneId: string, sectionId: string) => {
    setCostData(prev => ({
      ...prev,
      [milestoneId]: prev[milestoneId].map(section => section.id === sectionId ? {
        ...section,
        expanded: !section.expanded
      } : section)
    }));
  };
  const handleAddPlatformFeeSection = (milestoneId: string) => {
    const newSection: ResourceSection = {
      id: `platform-fee-${Date.now()}`,
      name: 'Platform Fee',
      type: 'platform-fee',
      expanded: true,
      items: [{
        id: '1',
        feeType: 'Storage',
        unit: 'GB',
        quantity: 100,
        ratePerUnit: 0.5,
        durationMonths: 12
      }] as PlatformFeeItem[]
    };
    setCostData(prev => ({
      ...prev,
      [milestoneId]: [...prev[milestoneId], newSection]
    }));
  };
  const handleDeleteSection = (milestoneId: string, sectionId: string) => {
    setCostData(prev => ({
      ...prev,
      [milestoneId]: prev[milestoneId].filter(s => s.id !== sectionId)
    }));
  };
  const handleAddRow = (milestoneId: string, sectionId: string) => {
    setCostData(prev => ({
      ...prev,
      [milestoneId]: prev[milestoneId].map(section => {
        if (section.id !== sectionId) return section;
        if (section.type === 'platform-fee') {
          const newItem: PlatformFeeItem = {
            id: Date.now().toString(),
            feeType: 'Storage',
            unit: 'GB',
            quantity: 100,
            ratePerUnit: 0.5,
            durationMonths: 12
          };
          return {
            ...section,
            items: [...section.items, newItem] as PlatformFeeItem[]
          };
        } else {
          const newItem: CostItem = {
            id: Date.now().toString(),
            locale: 'en-US',
            difficulty: 'Easy',
            promptGenMin: 2,
            reviewMin: 1,
            rejectionRate: 5,
            hourlyRate: sectionId === 'expert-network' ? 40 : 50,
            taskVolume: sectionId === 'forward-deployed' ? 10 : 300 // Default 10 hours for FDE
          };
          return {
            ...section,
            items: [...section.items, newItem] as CostItem[]
          };
        }
      })
    }));
  };
  const updateCostItem = (milestoneId: string, sectionId: string, itemId: string, field: string, value: string | number) => {
    setCostData(prev => ({
      ...prev,
      [milestoneId]: prev[milestoneId].map(section => section.id === sectionId ? {
        ...section,
        items: section.items.map(item => item.id === itemId ? {
          ...item,
          [field]: value
        } : item)
      } : section)
    }));
  };
  const updateTotalMinutes = (milestoneId: string, sectionId: string, itemId: string, totalMinutes: number) => {
    setCostData(prev => ({
      ...prev,
      [milestoneId]: prev[milestoneId].map(section => {
        if (section.id !== sectionId) return section;
        const item = section.items.find(i => i.id === itemId) as CostItem;
        if (!item) return section;
        const currentTotal = item.promptGenMin + item.reviewMin;
        // Maintain the ratio between promptGenMin and reviewMin
        let newPromptGenMin = item.promptGenMin;
        let newReviewMin = item.reviewMin;
        if (currentTotal > 0) {
          const ratio = item.promptGenMin / currentTotal;
          newPromptGenMin = Math.round(totalMinutes * ratio * 10) / 10; // Round to 1 decimal
          newReviewMin = Math.round((totalMinutes - newPromptGenMin) * 10) / 10;
          // Ensure at least 0.1 for each if total is positive
          if (totalMinutes > 0 && newPromptGenMin < 0.1) {
            newPromptGenMin = 0.1;
            newReviewMin = Math.max(0.1, totalMinutes - newPromptGenMin);
          }
          if (totalMinutes > 0 && newReviewMin < 0.1) {
            newReviewMin = 0.1;
            newPromptGenMin = Math.max(0.1, totalMinutes - newReviewMin);
          }
        } else {
          // Default split: 2/3 for promptGen, 1/3 for review
          newPromptGenMin = Math.round(totalMinutes * 0.67 * 10) / 10;
          newReviewMin = Math.round((totalMinutes - newPromptGenMin) * 10) / 10;
        }
        return {
          ...section,
          items: section.items.map(i => i.id === itemId ? {
            ...i,
            promptGenMin: newPromptGenMin,
            reviewMin: newReviewMin
          } : i)
        };
      })
    }));
  };
  const deleteRow = (milestoneId: string, sectionId: string, itemId: string) => {
    setCostData(prev => ({
      ...prev,
      [milestoneId]: prev[milestoneId].map(section => section.id === sectionId ? {
        ...section,
        items: section.items.filter(item => item.id !== itemId)
      } : section)
    }));
  };
  const calculateCostPerTask = (item: CostItem) => {
    const totalMinutes = item.promptGenMin + item.reviewMin;
    const hourlyFraction = totalMinutes / 60;
    const baseCost = item.hourlyRate * hourlyFraction;
    const costWithRejection = baseCost * (1 + item.rejectionRate / 100);
    return costWithRejection;
  };
  const calculateTotal = (item: CostItem) => {
    return calculateCostPerTask(item) * item.taskVolume;
  };
  const calculatePlatformFeeTotal = (item: PlatformFeeItem) => {
    return item.quantity * item.ratePerUnit * item.durationMonths;
  };
  const calculateSectionTotal = (milestoneId: string, sectionId: string) => {
    const section = costData[milestoneId]?.find(s => s.id === sectionId);
    if (!section) return 0;
    if (section.type === 'platform-fee') {
      return (section.items as PlatformFeeItem[]).reduce((sum, item) => sum + calculatePlatformFeeTotal(item), 0);
    } else {
      return (section.items as CostItem[]).reduce((sum, item) => sum + calculateTotal(item), 0);
    }
  };
  // Calculate estimated revenue for a section (for display purposes)
  const calculateSectionRevenue = (milestoneId: string, sectionId: string) => {
    const section = costData[milestoneId]?.find(s => s.id === sectionId);
    if (!section) return 0;
    if (section.type === 'platform-fee') {
      return (section.items as PlatformFeeItem[]).reduce((sum, item) => {
        const suggestedRate = item.suggestedPrice ?? item.ratePerUnit;
        const quoteRate = item.quotePrice ?? suggestedRate;
        const estRevenue = quoteRate * item.quantity * (item.durationMonths || 1);
        return sum + estRevenue;
      }, 0);
    } else if (sectionId === 'forward-deployed') {
      // For FDE, calculate revenue based on quote rate * hours
      const fdeItems = section.items as CostItem[];
      if (fdeItems.length === 0) return 0;
      const avgHourlyRate = fdeItems.reduce((sum, item) => sum + (item.hourlyRate || 50), 0) / fdeItems.length;
      const hourlyRate = fdeItems[0]?.hourlyRate || avgHourlyRate || 50;
      const totalHours = fdeItems.length > 0 ? fdeItems[0]?.taskVolume || 10 : 10;
      const suggestedRate = hourlyRate * 1.4;
      const quoteRate = fdeItems[0]?.quotePrice ?? suggestedRate;
      const estRevenue = quoteRate * totalHours;
      return estRevenue;
    } else {
      // For other resource sections, calculate based on quote price * task volume
      return (section.items as CostItem[]).reduce((sum, item) => {
        const costPerTask = calculateCostPerTask(item);
        const suggestedRate = costPerTask * 1.4;
        const quoteRate = item.quotePrice ?? suggestedRate;
        const estRevenue = quoteRate * item.taskVolume;
        return sum + estRevenue;
      }, 0);
    }
  };
  const calculateMilestoneTotal = (milestoneId: string) => {
    const sections = costData[milestoneId] || [];
    return sections.reduce((sum, section) => {
      return sum + calculateSectionTotal(milestoneId, section.id);
    }, 0);
  };
  const calculateGrandTotal = () => {
    return selectedMilestones.reduce((sum, milestoneId) => {
      return sum + calculateMilestoneTotal(milestoneId);
    }, 0);
  };
  // Calculate estimated revenue for all milestones
  const calculateMilestoneRevenue = (milestoneId: string) => {
    const sections = costData[milestoneId] || [];
    return sections.reduce((sum, section) => {
      return sum + calculateSectionRevenue(milestoneId, section.id);
    }, 0);
  };
  const calculateGrandRevenue = () => {
    return selectedMilestones.reduce((sum, milestoneId) => {
      return sum + calculateMilestoneRevenue(milestoneId);
    }, 0);
  };
  // Get approval level based on discount percentage
  const getApprovalLevel = (discountPercent: number) => {
    if (discountPercent >= 30) {
      return {
        level: 'CEO',
        color: 'bg-red-100 text-red-700'
      };
    } else if (discountPercent >= 15) {
      return {
        level: 'VP of Sales',
        color: 'bg-amber-100 text-amber-700'
      };
    } else if (discountPercent >= 2) {
      return {
        level: 'Manager',
        color: 'bg-green-100 text-green-700'
      };
    } else {
      return {
        level: 'None',
        color: 'bg-gray-100 text-gray-700'
      };
    }
  };
  const activeMilestone = allMilestones.find(m => m.id === activeTab);
  const activeMilestoneIndex = selectedMilestones.indexOf(activeTab);
  // Save data to localStorage when it changes
  useEffect(() => {
    localStorage.setItem('volumeAndPricingData', JSON.stringify(costData));
  }, [costData]);
  const handleNext = () => {
    // Preserve URL parameters when navigating to pricing review
    const currentParams = new URLSearchParams(window.location.search);
    navigate(`/pricing-review?${currentParams.toString()}`);
  };
  const updateDefaultTaskVolume = (milestoneId: string, sectionId: string, volume: number) => {
    setDefaultTaskVolumes(prev => ({
      ...prev,
      [milestoneId]: {
        ...prev[milestoneId],
        [sectionId]: volume
      }
    }));
    setCostData(prev => ({
      ...prev,
      [milestoneId]: prev[milestoneId].map(section => section.id === sectionId && section.type === 'resource' ? {
        ...section,
        items: (section.items as CostItem[]).map(item => ({
          ...item,
          taskVolume: volume
        }))
      } : section)
    }));
  };
  return <div className="min-h-screen bg-white">
      {/* Breadcrumb */}
      <div className="border-b border-gray-200 px-8 py-4">
        <div className="flex items-center gap-2 text-sm text-gray-600">
          <Link to="/" className="hover:text-gray-900">
            Invisible
          </Link>
          <ArrowRight size={14} />
          <Link to="/configure" className="hover:text-gray-900">
            Configure
          </Link>
          <ArrowRight size={14} />
          <span className="font-medium text-gray-900">Volume & Pricing</span>
        </div>
      </div>
      {/* Header */}
      <div className="border-b border-gray-200 px-8 py-8">
        <div className="flex items-start justify-between mb-8">
          <div>
            <h1 className="text-4xl font-semibold mb-2">Pricing Calculator</h1>
            <p className="text-gray-600 text-lg">
              Configure your custom automation solution
            </p>
          </div>
          <div className="flex items-center gap-2 bg-gray-100 rounded-lg p-1">
            <button className="px-4 py-2 bg-white rounded-md text-sm font-medium shadow-sm">
              Sales
            </button>
            <button className="px-4 py-2 text-sm font-medium text-gray-600 hover:text-gray-900">
              Client
            </button>
          </div>
        </div>
        {/* Milestone Tabs with Drag and Drop */}
        <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
          <div className="flex gap-2 overflow-x-auto">
            <SortableContext items={selectedMilestones} strategy={horizontalListSortingStrategy}>
              {selectedMilestones.map((milestoneId, index) => {
              const milestone = allMilestones.find(m => m.id === milestoneId);
              if (!milestone) return null;
              return <SortableTab key={milestoneId} milestoneId={milestoneId} milestone={milestone} index={index} isActive={activeTab === milestoneId} onSelect={() => setActiveTab(milestoneId)} onRemove={() => handleRemoveTab(milestoneId)} canRemove={selectedMilestones.length > 1} />;
            })}
            </SortableContext>
            {/* Add Tab Button with Dropdown */}
            <div className="relative">
              <button onClick={() => setShowAddMilestoneDropdown(!showAddMilestoneDropdown)} className="flex items-center gap-1 px-4 py-2.5 text-sm font-medium text-gray-500 hover:text-gray-700 whitespace-nowrap disabled:opacity-50 disabled:cursor-not-allowed" disabled={availableMilestones.length === 0}>
                <Plus size={16} />
                <span>Add Tab</span>
              </button>
              {/* Dropdown Menu */}
              {showAddMilestoneDropdown && availableMilestones.length > 0 && <>
                  <div className="fixed inset-0 z-10" onClick={() => setShowAddMilestoneDropdown(false)}></div>
                  <div className="absolute top-full left-0 mt-2 w-64 bg-white border border-gray-200 rounded-lg shadow-lg z-20">
                    <div className="p-2">
                      <div className="text-xs font-medium text-gray-500 px-2 py-1 mb-1">
                        Select Milestone
                      </div>
                      {availableMilestones.map(milestone => <button key={milestone.id} onClick={() => handleAddMilestone(milestone.id)} className="w-full text-left px-3 py-2 text-sm hover:bg-gray-50 rounded flex items-start gap-2">
                          <div className="flex-1">
                            <div className="font-medium">{milestone.name}</div>
                            <div className="text-xs text-gray-500 mt-0.5">
                              {milestone.description}
                            </div>
                          </div>
                        </button>)}
                    </div>
                  </div>
                </>}
            </div>
          </div>
        </DndContext>
      </div>
      {/* Main Content */}
      <div className="px-8 py-6">
        {activeMilestone && <div className="space-y-4">
            {/* Render all sections for the active milestone */}
            {costData[activeTab]?.map((section, sectionIndex) => {
          // Skip platform-fee section as it will be merged with forward-deployed
          if (section.id === 'platform-fee') return null;
          // Special handling for forward-deployed: merge with platform-fee
          if (section.id === 'forward-deployed') {
            const platformFeeSection = costData[activeTab]?.find(s => s.id === 'platform-fee');
            const fdeItems = section.items as CostItem[];
            const platformFeeItems = platformFeeSection ? platformFeeSection.items as PlatformFeeItem[] : [];
            // Calculate total items: 1 for aggregated FDE + platform fee items
            const totalItems = (fdeItems.length > 0 ? 1 : 0) + platformFeeItems.length;
            // Calculate section total as sum of estimated revenues
            const sectionTotal = calculateSectionRevenue(activeTab, section.id) + (platformFeeSection ? calculateSectionRevenue(activeTab, platformFeeSection.id) : 0);
            return <div key={section.id} className="border border-gray-200 rounded-lg overflow-hidden">
                    <div className="bg-gray-50 px-4 py-3 flex items-center justify-between cursor-pointer hover:bg-gray-100" onClick={() => toggleSection(activeTab, section.id)}>
                      <div className="flex items-center gap-2">
                        {section.expanded ? <ChevronDown size={20} /> : <ChevronRight size={20} />}
                        <h3 className="text-lg font-semibold">
                          Products and Services
                        </h3>
                        <span className="text-sm text-gray-500">
                          ({totalItems} {totalItems === 1 ? 'item' : 'items'})
                        </span>
                      </div>
                      <span className="text-lg font-semibold">
                        ${sectionTotal.toFixed(2)}
                      </span>
                    </div>
                    {section.expanded && <div>
                        <table className="w-full">
                          <thead className="bg-gray-50">
                            <tr>
                              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                                Product Name
                              </th>
                              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                                Hourly Rate ($/hr)
                              </th>
                              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                                Hours
                              </th>
                              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                                Quantity
                              </th>
                              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                                Suggested Rate ($)
                              </th>
                              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                                Quote Rate ($)
                              </th>
                              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                                Discount %
                              </th>
                              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                                Approval Level
                              </th>
                              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                                Est Revenue ($)
                              </th>
                              <th className="px-4 py-3"></th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-gray-200">
                            {/* FDE Row - Aggregate */}
                            {fdeItems.length > 0 && (() => {
                      // Get hourly rate from first item (or use average, default 50)
                      const avgHourlyRate = fdeItems.reduce((sum, item) => sum + (item.hourlyRate || 50), 0) / fdeItems.length;
                      const hourlyRate = fdeItems[0]?.hourlyRate || avgHourlyRate || 50;
                      // Get hours - use taskVolume to store hours, default to 10
                      const totalHours = fdeItems.length > 0 ? fdeItems[0]?.taskVolume || 10 : 10;
                      // Suggested rate is hourly rate * 1.4
                      const suggestedRate = hourlyRate * 1.4;
                      // Quote rate (stored per item, but we'll use first item's value or default to suggested)
                      const quoteRate = fdeItems[0]?.quotePrice ?? suggestedRate;
                      const discount = (suggestedRate - quoteRate) / suggestedRate * 100;
                      const approval = getApprovalLevel(Math.max(0, discount));
                      // Est revenue = quote rate * hours
                      const estRevenue = quoteRate * totalHours;
                      return <tr className="hover:bg-gray-50">
                                    <td className="px-4 py-3">
                                      <input type="text" value="Forward Deployed Engineers" className="w-full px-2 py-1 border border-gray-300 rounded-md text-sm bg-gray-50" readOnly />
                                    </td>
                                    <td className="px-4 py-3">
                                      <input type="number" step="0.01" value={hourlyRate.toFixed(2)} onChange={e => {
                            const hr = parseFloat(e.target.value) || 0;
                            // Update hourly rate for all FDE items
                            fdeItems.forEach(item => {
                              updateCostItem(activeTab, section.id, item.id, 'hourlyRate', hr);
                            });
                          }} className="w-24 px-2 py-1 border border-gray-300 rounded-md text-sm" />
                                    </td>
                                    <td className="px-4 py-3">
                                      <input type="number" value={totalHours} onChange={e => {
                            const hours = parseInt(e.target.value) || 10;
                            // Store hours in taskVolume for all items
                            fdeItems.forEach(item => {
                              updateCostItem(activeTab, section.id, item.id, 'taskVolume', hours);
                            });
                          }} className="w-24 px-2 py-1 border border-gray-300 rounded-md text-sm" />
                                    </td>
                                    <td className="px-4 py-3 text-sm text-gray-400">
                                      —
                                    </td>
                                    <td className="px-4 py-3 text-sm">
                                      ${suggestedRate.toFixed(2)}
                                    </td>
                                    <td className="px-4 py-3">
                                      <input type="number" step="0.01" value={quoteRate.toFixed(2)} onChange={e => {
                            const qr = parseFloat(e.target.value) || 0;
                            fdeItems.forEach(item => {
                              updateCostItem(activeTab, section.id, item.id, 'quotePrice', qr);
                            });
                          }} className="w-24 px-2 py-1 border border-gray-300 rounded-md text-sm" />
                                    </td>
                                    <td className="px-4 py-3 text-sm">
                                      {discount.toFixed(1)}%
                                    </td>
                                    <td className="px-4 py-3">
                                      <span className={`px-2 py-1 rounded text-xs font-medium ${approval.color}`}>
                                        {approval.level}
                                      </span>
                                    </td>
                                    <td className="px-4 py-3 text-sm font-medium">
                                      ${estRevenue.toFixed(2)}
                                    </td>
                                    <td className="px-4 py-3"></td>
                                  </tr>;
                    })()}
                            {/* Platform Fee Rows */}
                            {platformFeeItems.map(item => {
                      // For platform fee, suggested rate is the rate per unit
                      const suggestedRate = item.suggestedPrice ?? item.ratePerUnit;
                      const quoteRate = item.quotePrice ?? suggestedRate;
                      const discount = (suggestedRate - quoteRate) / suggestedRate * 100;
                      const approval = getApprovalLevel(Math.max(0, discount));
                      // Est revenue = quote rate * quantity * duration
                      const estRevenue = quoteRate * item.quantity * (item.durationMonths || 1);
                      return <tr key={item.id} className="hover:bg-gray-50">
                                  <td className="px-4 py-3">
                                    <input type="text" value={item.productName || item.feeType} onChange={e => updateCostItem(activeTab, 'platform-fee', item.id, 'productName', e.target.value)} className="w-full px-2 py-1 border border-gray-300 rounded-md text-sm" />
                                  </td>
                                  <td className="px-4 py-3 text-sm text-gray-400">
                                    —
                                  </td>
                                  <td className="px-4 py-3 text-sm text-gray-400">
                                    —
                                  </td>
                                  <td className="px-4 py-3">
                                    <input type="number" value={item.quantity} onChange={e => updateCostItem(activeTab, 'platform-fee', item.id, 'quantity', parseInt(e.target.value) || 0)} className="w-24 px-2 py-1 border border-gray-300 rounded-md text-sm" />
                                  </td>
                                  <td className="px-4 py-3 text-sm">
                                    ${suggestedRate.toFixed(2)}
                                  </td>
                                  <td className="px-4 py-3">
                                    <input type="number" step="0.01" value={quoteRate.toFixed(2)} onChange={e => {
                            const qr = parseFloat(e.target.value) || 0;
                            updateCostItem(activeTab, 'platform-fee', item.id, 'quotePrice', qr);
                            const sr = item.suggestedPrice ?? item.ratePerUnit;
                            const disc = (sr - qr) / sr * 100;
                            updateCostItem(activeTab, 'platform-fee', item.id, 'discount', disc);
                          }} className="w-24 px-2 py-1 border border-gray-300 rounded-md text-sm" />
                                  </td>
                                  <td className="px-4 py-3 text-sm">
                                    {discount.toFixed(1)}%
                                  </td>
                                  <td className="px-4 py-3">
                                    <span className={`px-2 py-1 rounded text-xs font-medium ${approval.color}`}>
                                      {approval.level}
                                    </span>
                                  </td>
                                  <td className="px-4 py-3 text-sm font-medium">
                                    ${estRevenue.toFixed(2)}
                                  </td>
                                  <td className="px-4 py-3">
                                    <button onClick={() => deleteRow(activeTab, 'platform-fee', item.id)} className="text-gray-400 hover:text-red-600">
                                      <X size={16} />
                                    </button>
                                  </td>
                                </tr>;
                    })}
                          </tbody>
                        </table>
                        <div className="bg-gray-50 px-4 py-3 border-t border-gray-200">
                          <button onClick={() => handleAddRow(activeTab, 'platform-fee')} className="px-3 py-1 bg-black text-white rounded-md text-sm font-medium flex items-center gap-1 hover:bg-gray-800">
                            <Plus size={14} />
                            Add Row
                          </button>
                        </div>
                      </div>}
                  </div>;
          }
          // Regular section rendering
          return <div key={section.id} className="border border-gray-200 rounded-lg overflow-hidden">
                  <div className="bg-gray-50 px-4 py-3 flex items-center justify-between cursor-pointer hover:bg-gray-100" onClick={() => toggleSection(activeTab, section.id)}>
                    <div className="flex items-center gap-2">
                      {section.expanded ? <ChevronDown size={20} /> : <ChevronRight size={20} />}
                      <h3 className="font-medium">{section.name}</h3>
                      <span className="text-sm text-gray-500">
                        ({section.items.length}{' '}
                        {section.type === 'platform-fee' ? 'fees' : 'configurations'}
                        )
                      </span>
                    </div>
                    <div className="flex items-center gap-4">
                      <span className="text-sm font-medium">
                        $
                        {calculateSectionRevenue(activeTab, section.id).toFixed(2)}
                      </span>
                      <div className="flex items-center gap-2">
                        <button onClick={e => {
                    e.stopPropagation();
                    handleAddRow(activeTab, section.id);
                  }} className="px-3 py-1 bg-black text-white rounded-md text-sm font-medium flex items-center gap-1 hover:bg-gray-800">
                          <Plus size={14} />
                          Add Row
                        </button>
                        {section.type === 'platform-fee'}
                      </div>
                    </div>
                  </div>
                  {section.expanded && <>
                      {section.type === 'resource' ? <>
                          {/* Default Task Count Section */}
                          <div className="bg-gray-50 border-b border-gray-200 px-4 py-3">
                            <div className="flex items-center gap-4">
                              <label className="text-sm font-medium text-gray-700">
                                Default Task Count:
                              </label>
                              <input type="number" value={defaultTaskVolumes[activeTab]?.[section.id] || 300} onChange={e => updateDefaultTaskVolume(activeTab, section.id, parseInt(e.target.value) || 0)} className="w-32 px-3 py-1.5 border border-gray-300 rounded-md text-sm" placeholder="300" />
                              <span className="text-sm text-gray-500">
                                This will update all task volumes in this
                                section
                              </span>
                            </div>
                          </div>
                          {/* Resource Table */}
                          <table className="w-full">
                            <thead className="bg-gray-50">
                              <tr>
                                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                                  <div className="flex items-center gap-1">
                                    Deployment Region
                                    <Info size={14} className="text-gray-400" />
                                  </div>
                                </th>
                                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                                  <div className="flex items-center gap-1">
                                    Task Complexity
                                  </div>
                                </th>
                                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                                  <div className="flex items-center gap-1">
                                    min/Task
                                    <Info size={14} className="text-gray-400" />
                                  </div>
                                </th>
                                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                                  <div className="flex items-center gap-1">
                                    Rework Rate (%)
                                    <Info size={14} className="text-gray-400" />
                                  </div>
                                </th>
                                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                                  <div className="flex items-center gap-1">
                                    Engineer Rate ($/hr)
                                    <Info size={14} className="text-gray-400" />
                                  </div>
                                </th>
                                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                                  <div className="flex items-center gap-1">
                                    Task Count
                                    <Info size={14} className="text-gray-400" />
                                  </div>
                                </th>
                                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                                  <div className="flex items-center gap-1">
                                    Unit Cost ($)
                                    <Info size={14} className="text-gray-400" />
                                  </div>
                                </th>
                                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                                  <div className="flex items-center gap-1">
                                    Suggested Rate ($)
                                    <Info size={14} className="text-gray-400" />
                                  </div>
                                </th>
                                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                                  <div className="flex items-center gap-1">
                                    Quote Rate ($)
                                    <Info size={14} className="text-gray-400" />
                                  </div>
                                </th>
                                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                                  <div className="flex items-center gap-1">
                                    Subtotal ($)
                                    <Info size={14} className="text-gray-400" />
                                  </div>
                                </th>
                                <th className="px-4 py-3"></th>
                              </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-200">
                              {(section.items as CostItem[]).map(item => <tr key={item.id} className="hover:bg-gray-50">
                                  <td className="px-4 py-3">
                                    <select value={item.locale} onChange={e => updateCostItem(activeTab, section.id, item.id, 'locale', e.target.value)} className="w-full px-2 py-1 border border-gray-300 rounded-md text-sm">
                                      {localeOptions.map(locale => <option key={locale} value={locale}>
                                          {locale}
                                        </option>)}
                                    </select>
                                  </td>
                                  <td className="px-4 py-3">
                                    <select value={item.difficulty} onChange={e => updateCostItem(activeTab, section.id, item.id, 'difficulty', e.target.value)} className="w-full px-2 py-1 border border-gray-300 rounded-md text-sm">
                                      {difficultyOptions.map(diff => <option key={diff} value={diff}>
                                          {diff}
                                        </option>)}
                                    </select>
                                  </td>
                                  <td className="px-4 py-3">
                                    <input type="number" value={item.promptGenMin + item.reviewMin} onChange={e => updateTotalMinutes(activeTab, section.id, item.id, parseFloat(e.target.value) || 0)} className="w-20 px-2 py-1 border border-gray-300 rounded-md text-sm" step="0.1" />
                                  </td>
                                  <td className="px-4 py-3">
                                    <input type="number" value={item.rejectionRate} onChange={e => updateCostItem(activeTab, section.id, item.id, 'rejectionRate', parseInt(e.target.value) || 0)} className="w-20 px-2 py-1 border border-gray-300 rounded-md text-sm" />
                                  </td>
                                  <td className="px-4 py-3">
                                    <input type="number" value={item.hourlyRate} onChange={e => updateCostItem(activeTab, section.id, item.id, 'hourlyRate', parseInt(e.target.value) || 0)} className="w-20 px-2 py-1 border border-gray-300 rounded-md text-sm" />
                                  </td>
                                  <td className="px-4 py-3">
                                    <input type="number" value={item.taskVolume} onChange={e => updateCostItem(activeTab, section.id, item.id, 'taskVolume', parseInt(e.target.value) || 0)} className="w-24 px-2 py-1 border border-gray-300 rounded-md text-sm" />
                                  </td>
                                  <td className="px-4 py-3 text-sm">
                                    ${calculateCostPerTask(item).toFixed(2)}
                                  </td>
                                  <td className="px-4 py-3 text-sm">
                                    $
                                    {(calculateCostPerTask(item) * 1.4).toFixed(2)}
                                  </td>
                                  <td className="px-4 py-3">
                                    <input type="number" step="0.01" value={item.quotePrice ?? calculateCostPerTask(item) * 1.4} onChange={e => updateCostItem(activeTab, section.id, item.id, 'quotePrice', parseFloat(e.target.value) || 0)} className="w-24 px-2 py-1 border border-gray-300 rounded-md text-sm" />
                                  </td>
                                  <td className="px-4 py-3 text-sm font-medium">
                                    $
                                    {((item.quotePrice ?? calculateCostPerTask(item) * 1.4) * item.taskVolume).toFixed(2)}
                                  </td>
                                  <td className="px-4 py-3">
                                    <button onClick={() => deleteRow(activeTab, section.id, item.id)} className="text-gray-400 hover:text-red-600">
                                      <X size={16} />
                                    </button>
                                  </td>
                                </tr>)}
                            </tbody>
                          </table>
                        </> : <table className="w-full">
                          <thead className="bg-gray-50">
                            <tr>
                              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                                <div className="flex items-center gap-1">
                                  Fee Type
                                  <Info size={14} className="text-gray-400" />
                                </div>
                              </th>
                              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                                <div className="flex items-center gap-1">
                                  Unit
                                  <Info size={14} className="text-gray-400" />
                                </div>
                              </th>
                              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                                <div className="flex items-center gap-1">
                                  Quantity
                                  <Info size={14} className="text-gray-400" />
                                </div>
                              </th>
                              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                                <div className="flex items-center gap-1">
                                  Rate ($/Unit)
                                  <Info size={14} className="text-gray-400" />
                                </div>
                              </th>
                              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                                <div className="flex items-center gap-1">
                                  Duration (Months)
                                  <Info size={14} className="text-gray-400" />
                                </div>
                              </th>
                              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                                <div className="flex items-center gap-1">
                                  Subtotal ($)
                                  <Info size={14} className="text-gray-400" />
                                </div>
                              </th>
                              <th className="px-4 py-3"></th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-gray-200">
                            {(section.items as PlatformFeeItem[]).map(item => <tr key={item.id} className="hover:bg-gray-50">
                                  <td className="px-4 py-3">
                                    <select value={item.feeType} onChange={e => updateCostItem(activeTab, section.id, item.id, 'feeType', e.target.value)} className="w-full px-2 py-1 border border-gray-300 rounded-md text-sm">
                                      {feeTypeOptions.map(type => <option key={type} value={type}>
                                          {type}
                                        </option>)}
                                    </select>
                                  </td>
                                  <td className="px-4 py-3">
                                    <input type="text" value={item.unit} onChange={e => updateCostItem(activeTab, section.id, item.id, 'unit', e.target.value)} className="w-20 px-2 py-1 border border-gray-300 rounded-md text-sm" />
                                  </td>
                                  <td className="px-4 py-3">
                                    <input type="number" value={item.quantity} onChange={e => updateCostItem(activeTab, section.id, item.id, 'quantity', parseInt(e.target.value) || 0)} className="w-24 px-2 py-1 border border-gray-300 rounded-md text-sm" />
                                  </td>
                                  <td className="px-4 py-3">
                                    <input type="number" step="0.01" value={item.ratePerUnit} onChange={e => updateCostItem(activeTab, section.id, item.id, 'ratePerUnit', parseFloat(e.target.value) || 0)} className="w-24 px-2 py-1 border border-gray-300 rounded-md text-sm" />
                                  </td>
                                  <td className="px-4 py-3">
                                    <input type="number" value={item.durationMonths} onChange={e => updateCostItem(activeTab, section.id, item.id, 'durationMonths', parseInt(e.target.value) || 0)} className="w-20 px-2 py-1 border border-gray-300 rounded-md text-sm" />
                                  </td>
                                  <td className="px-4 py-3 text-sm font-medium">
                                    $
                                    {calculatePlatformFeeTotal(item).toFixed(2)}
                                  </td>
                                  <td className="px-4 py-3">
                                    <button onClick={() => deleteRow(activeTab, section.id, item.id)} className="text-gray-400 hover:text-red-600">
                                      <X size={16} />
                                    </button>
                                  </td>
                                </tr>)}
                          </tbody>
                        </table>}
                    </>}
                </div>;
        })}
            {/* Add Section Button */}
            <button onClick={() => handleAddPlatformFeeSection(activeTab)} className="w-full py-3 border-2 border-dashed border-gray-300 rounded-lg text-sm font-medium text-gray-600 hover:border-gray-400 hover:text-gray-700 flex items-center justify-center gap-2">
              <Plus size={16} />
              Add Section
            </button>
          </div>}
      </div>
      {/* Bottom Bar */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 shadow-lg">
        <div className="px-8 py-4 flex items-center justify-between">
          <div className="flex items-center gap-12">
            <div>
              <div className="text-sm text-gray-600 mb-1">
                Current Milestone
              </div>
              <div className="text-2xl font-semibold">
                $
                {calculateMilestoneRevenue(activeTab).toLocaleString('en-US', {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2
              })}
              </div>
            </div>
            <div className="h-12 w-px bg-gray-200"></div>
            <div>
              <div className="text-sm text-gray-600 mb-1">
                Total All Milestones
              </div>
              <div className="text-2xl font-semibold text-blue-600">
                $
                {calculateGrandRevenue().toLocaleString('en-US', {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2
              })}
              </div>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <Link to="/configure" className="px-6 py-2.5 border border-gray-300 rounded-lg text-sm font-medium hover:bg-gray-50">
              Back
            </Link>
            <button onClick={handleNext} className="px-6 py-2.5 bg-black text-white rounded-lg text-sm font-medium hover:bg-gray-800">
              Next: Review Pricing
            </button>
          </div>
        </div>
      </div>
      {/* Add padding to bottom to account for fixed bar */}
      <div className="h-24"></div>
    </div>;
};
export { VolumeAndPricingStep };