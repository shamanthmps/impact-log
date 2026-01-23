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

export interface Win {
  id: string;
  date: Date;
  category: WinCategory;
  situation: string;
  action: string;
  impact: string;
  impactType: ImpactType;
  evidence?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface WeeklyReflection {
  id: string;
  weekStartDate: Date;
  wentWell: string;
  unblocked: string;
  proudOf: string;
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
