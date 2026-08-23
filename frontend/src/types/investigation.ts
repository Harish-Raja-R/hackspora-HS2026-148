export type OpportunityType =
  | 'Internship'
  | 'Full-time Job'
  | 'Part-time Job'
  | 'Freelance Project'
  | 'Scholarship / Grant'
  | 'Training / Bootcamp'
  | 'Research Program'
  | 'Unspecified';

export type SignalSeverity = 'CRITICAL' | 'HIGH' | 'MEDIUM' | 'LOW' | 'INFO' | 'POSITIVE';

export type SignalCategory =
  | 'FINANCIAL'
  | 'IDENTITY'
  | 'COMMUNICATION'
  | 'PROCEDURE'
  | 'CONSISTENCY'
  | 'PSYCHOLOGICAL'
  | 'TRUST'
  | 'CREDENTIAL'
  | 'URGENCY'
  | 'ORGANIZATION';

export type RiskTier = 'LOW RISK' | 'NEEDS VERIFICATION' | 'HIGH RISK';
export type RiskLevel = 'LOW' | 'NEEDS_VERIFICATION' | 'HIGH';

export type ExposureLevel = 'CRITICAL' | 'HIGH' | 'MEDIUM' | 'LOW' | 'NONE';

export interface CategoryRisks {
  financial: number;      // 0 - 100
  identity: number;       // 0 - 100
  communication: number;  // 0 - 100
  urgency: number;        // 0 - 100
  credential: number;     // 0 - 100
  organization: number;   // 0 - 100
}

export interface ExtractedOpportunity {
  title: string;
  jobTitle: string;
  organization: string;
  recruiter: string;
  email: string;
  recruiterEmail: string;
  phone: string;
  phoneNumber: string;
  website: string;
  url: string;
  opportunityUrl: string;
  type: OpportunityType;
  opportunityType: OpportunityType;
  location: string;
  compensation: string;
  salaryStipend: string;
  paymentRequested: boolean;
  paymentAmount: string;
  paymentReason: string;
  paymentPurpose: string;
  deadline: string;
  deadlines: string;
  requestedDocuments: string[];
  requestedCredentials: string[];
  communicationPlatform: string;
  applicationMethod: string;
  claims: string[];
}

export interface ScamSignal {
  id: string;
  signalId: string;
  name: string;
  severity: SignalSeverity;
  category: SignalCategory;
  evidence: string;
  weight: number;
  riskContribution: number;
  explanation: string;
  whyItMatters: string;
  mitigation: string;
}

export interface EvidenceNode {
  id: string;
  finding: string;
  evidenceQuote: string;
  whyItMatters: string;
  riskContribution: number;
  severity: SignalSeverity;
  category: SignalCategory;
}

export interface OrgConsistencyVector {
  orgIdentityStatus: 'VERIFIED' | 'DETECTED' | 'AMBIGUOUS' | 'UNRESOLVED';
  orgIdentityNotes: string;
  officialDomainStatus: 'MATCHED' | 'DETECTED' | 'UNVERIFIED' | 'MISSING';
  officialDomainNotes: string;
  recruiterDomainStatus:
    | 'OFFICIAL_MATCH'
    | 'PUBLIC_FREE_EMAIL'
    | 'DOMAIN_MISMATCH'
    | 'ANONYMOUS_CHANNEL'
    | 'UNSPECIFIED';
  recruiterDomainNotes: string;
  contactPlatformStatus:
    | 'ENTERPRISE_ATS'
    | 'OFFICIAL_EMAIL'
    | 'DIRECT_PHONE'
    | 'UNOFFICIAL_CHAT_APP'
    | 'UNSPECIFIED';
  contactPlatformNotes: string;
  recruitmentWorkflowStatus:
    | 'STANDARD_MULTI_STAGE'
    | 'INFORMAL_DIRECT'
    | 'NO_INTERVIEW_INSTANT_OFFER'
    | 'PAYMENT_GATED'
    | 'UNSPECIFIED';
  recruitmentWorkflowNotes: string;
  overallConsistency: 'STRONG_ALIGNMENT' | 'PARTIAL_INCONSISTENCY' | 'SEVERE_MISMATCH' | 'INSUFFICIENT_DATA';
}

export interface PotentialExposure {
  financial: ExposureLevel;
  financialAmount: string;
  financialLevel: ExposureLevel;
  financialNotes: string;
  credential: ExposureLevel;
  credentialLevel: ExposureLevel;
  credentialNotes: string;
  identity: ExposureLevel;
  identityLevel: ExposureLevel;
  identityNotes: string;
  employment: ExposureLevel;
  employmentLevel: ExposureLevel;
  employmentNotes: string;
  privacy: ExposureLevel;
  privacyLevel: ExposureLevel;
  privacyNotes: string;
}

export interface RecommendedAction {
  primaryVerdict: 'STOP' | 'VERIFY' | 'PROCEED_WITH_CAUTION';
  headline: string;
  actionSteps: string[];
  safetyTips: string[];
  officialVerificationGuide: string[];
}

export interface UncertaintyHandling {
  isAmbiguous: boolean;
  refusalExplanation?: string;
  missingEvidence: string[];
  guidanceToAcquire: string[];
}

export interface InvestigationStep {
  step: number;
  name: string;
  status: 'COMPLETED' | 'IN_PROGRESS' | 'SKIPPED';
  detail: string;
  timestamp: string;
}

export interface InvestigationReport {
  id: string;
  timestamp: string;
  inputSnippet: string;
  inputMode: 'text' | 'document' | 'image' | 'url';
  riskScore: number;
  confidenceScore: number;
  riskLevel: RiskLevel;
  riskTier: RiskTier;
  confidenceRationale: string;
  summary: string;
  executiveAssessment: string;
  recommendation: string;
  categoryRisks: CategoryRisks;
  opportunity: ExtractedOpportunity;
  extractedOpportunity: ExtractedOpportunity;
  signals: ScamSignal[];
  evidence: EvidenceNode[];
  evidenceChain: EvidenceNode[];
  orgConsistency: OrgConsistencyVector;
  potentialExposure: PotentialExposure;
  recommendedAction: RecommendedAction;
  uncertainty: UncertaintyHandling;
  limitations: string[];
  investigationSteps: InvestigationStep[];
  disclaimer: string;
}

export interface ComparisonReport {
  id: string;
  timestamp: string;
  itemA: InvestigationReport;
  itemB: InvestigationReport;
  deltaSummary: {
    riskDelta: number;
    saferOption: 'A' | 'B' | 'EQUAL';
    keyDifferences: string[];
    recommendation: string;
  };
}

export interface DemoCase {
  id: string;
  title: string;
  category: string;
  badge: 'HIGH RISK' | 'NEEDS VERIFICATION' | 'LOW RISK';
  description: string;
  content: string;
}
