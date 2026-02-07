export type WinCategory =
  | 'delivery'
  | 'stakeholder'
  | 'leadership'
  | 'process'
  | 'ai'
  | 'risk';

export type ImpactType =
  | 'time-saved'
  | 'cost-avoided'
  | 'risk-reduced'
  | 'quality-improved'
  | 'customer-satisfaction';

export type ImpactLevel = 'High' | 'Medium' | 'Low';

export interface Win {
  id: string;
  date: Date;
  category: WinCategory;
  situation: string;
  action: string;
  impact: string;
  impactType: ImpactType;
  impactLevel?: ImpactLevel;
  evidence?: string;
  createdAt: Date;
  updatedAt: Date;
}

export const IMPACT_LEVELS: Record<ImpactLevel, { label: string; color: string; value: number }> = {
  High: { label: 'High Impact', color: 'text-emerald-800 bg-emerald-100 border-emerald-300', value: 3 },
  Medium: { label: 'Medium Impact', color: 'text-green-600 bg-green-50 border-green-200', value: 2 },
  Low: { label: 'Low Impact', color: 'text-slate-500 bg-slate-100 border-slate-200', value: 1 },
};

export interface WeeklyReflection {
  id: string;
  weekStartDate: Date;
  wentWell?: string;
  unblocked?: string;
  proudOf?: string;
  focusedOn?: string;
  contributed?: string;
  impact?: string;
  learned?: string;
  carryForward?: string;
  createdAt: Date;
}

export const WIN_CATEGORIES: Record<WinCategory, { label: string; color: string }> = {
  delivery: { label: 'Delivery', color: 'category-delivery' },
  stakeholder: { label: 'Stakeholder', color: 'category-stakeholder' },
  leadership: { label: 'Leadership', color: 'category-leadership' },
  process: { label: 'Process Improvement', color: 'category-process' },
  ai: { label: 'AI / Automation', color: 'category-ai' },
  risk: { label: 'Risk Mitigation', color: 'category-risk' },
};

export const IMPACT_TYPES: Record<ImpactType, { label: string; color: string }> = {
  'time-saved': { label: 'Time Saved', color: 'impact-time' },
  'cost-avoided': { label: 'Cost Avoided', color: 'impact-cost' },
  'risk-reduced': { label: 'Risk Reduced', color: 'impact-risk' },
  'quality-improved': { label: 'Quality Improved', color: 'impact-quality' },
  'customer-satisfaction': { label: 'Customer Satisfaction', color: 'impact-satisfaction' },
};
