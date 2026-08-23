import React, { useState } from 'react';
import {
  Printer,
  RotateCcw,
  Share2,
  Building2,
  Mail,
  DollarSign,
  Layers,
  Check,
  FileBadge,
  Activity,
  KeyRound,
  Clock,
  Radio,
  CheckCircle2
} from 'lucide-react';
import { InvestigationReport } from '../types/investigation';
import { EvidenceChain } from './EvidenceChain';
import { OrgConsistencyMatrix } from './OrgConsistencyMatrix';
import { PotentialExposureView } from './PotentialExposure';
import { ActionRecommendations } from './ActionRecommendations';
import { UncertaintyBanner } from './UncertaintyBanner';
import { PrintReportModal } from './PrintReportModal';

interface InvestigationReportProps {
  report: InvestigationReport;
  onReset: () => void;
}

export const InvestigationReportView: React.FC<InvestigationReportProps> = ({
  report,
  onReset
}) => {
  const [showPrintModal, setShowPrintModal] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);

  const isHighRisk = report.riskTier === 'HIGH RISK';
  const isNeedsVerif = report.riskTier === 'NEEDS VERIFICATION';

  const riskBadgeStyle = isHighRisk
    ? 'bg-rose-950 text-rose-300 border-rose-600 shadow-[0_0_20px_rgba(239,68,68,0.3)]'
    : isNeedsVerif
    ? 'bg-amber-950 text-amber-300 border-amber-600 shadow-[0_0_20px_rgba(245,158,11,0.3)]'
    : 'bg-emerald-950 text-emerald-300 border-emerald-600 shadow-[0_0_20px_rgba(16,185,129,0.3)]';

  const riskGaugeColor = isHighRisk
    ? '#ef4444'
    : isNeedsVerif
    ? '#f59e0b'
    : '#10b981';

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2000);
  };

  const entities = report.extractedOpportunity;
  const categoryRisks = report.categoryRisks || {
    financial: 0,
    identity: 0,
    communication: 0,
    urgency: 0,
    credential: 0,
    organization: 0
  };

  const getDimensionColor = (score: number) => {
    if (score >= 60) return { bar: 'bg-rose-500 shadow-[0_0_10px_#ef4444]', text: 'text-rose-400', badge: 'bg-rose-950/80 text-rose-300 border-rose-800' };
    if (score >= 30) return { bar: 'bg-amber-500 shadow-[0_0_10px_#f59e0b]', text: 'text-amber-400', badge: 'bg-amber-950/80 text-amber-300 border-amber-800' };
    return { bar: 'bg-emerald-500 shadow-[0_0_10px_#10b981]', text: 'text-emerald-400', badge: 'bg-emerald-950/80 text-emerald-300 border-emerald-800' };
  };

  return (
    <div className="max-w-5xl mx-auto my-8 space-y-8 animate-fadeIn">
      {/* Top Header Card */}
      <div className={`glass-panel p-6 sm:p-8 rounded-3xl border ${isHighRisk ? 'glow-red' : isNeedsVerif ? 'glow-amber' : 'glow-green'} relative overflow-hidden`}>
        {/* Glow orb */}
        <div
          className="absolute -top-10 -right-10 w-60 h-60 rounded-full blur-3xl opacity-30 pointer-events-none"
          style={{ backgroundColor: riskGaugeColor }}
        />

        {/* Top meta strip */}
        <div className="flex flex-wrap items-center justify-between gap-3 pb-6 border-b border-slate-800">
          <div className="flex items-center space-x-3">
            <span className="text-xs font-mono font-bold tracking-widest px-2.5 py-1 rounded bg-slate-900 border border-slate-800 text-cyan-400">
              AUDIT ID: {report.id}
            </span>
            <span className="text-xs text-slate-400 font-mono">
              {new Date(report.timestamp).toLocaleString()}
            </span>
            <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-800 text-slate-300 uppercase">
              MODE: {report.inputMode}
            </span>
          </div>

          <div className="flex items-center space-x-2">
            <button
              onClick={() => setShowPrintModal(true)}
              className="flex items-center space-x-1.5 px-3 py-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-700 text-slate-300 text-xs font-semibold transition-all"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Export Report</span>
            </button>

            <button
              onClick={handleShare}
              className="flex items-center space-x-1.5 px-3 py-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-700 text-slate-300 text-xs font-semibold transition-all"
            >
              {copiedLink ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Share2 className="w-3.5 h-3.5" />}
              <span>{copiedLink ? 'Copied' : 'Share'}</span>
            </button>

            <button
              onClick={onReset}
              className="flex items-center space-x-1.5 px-3 py-1.5 rounded-xl bg-cyan-950/80 hover:bg-cyan-900 border border-cyan-700/60 text-cyan-300 text-xs font-bold transition-all"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>New Analysis</span>
            </button>
          </div>
        </div>

        {/* Main Risk & Confidence Header */}
        <div className="pt-6 grid grid-cols-1 md:grid-cols-3 gap-6 items-center">
          {/* Left: Risk Score & Tier */}
          <div className="flex items-center space-x-5 md:col-span-2">
            {/* SVG Circular Risk Gauge */}
            <div className="relative w-28 h-28 flex-shrink-0 flex items-center justify-center">
              <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
                <circle
                  cx="50"
                  cy="50"
                  r="42"
                  stroke="#1e293b"
                  strokeWidth="10"
                  fill="transparent"
                />
                <circle
                  cx="50"
                  cy="50"
                  r="42"
                  stroke={riskGaugeColor}
                  strokeWidth="10"
                  strokeDasharray="263.89"
                  strokeDashoffset={263.89 - (263.89 * report.riskScore) / 100}
                  strokeLinecap="round"
                  fill="transparent"
                  className="transition-all duration-1000 ease-out"
                />
              </svg>
              <div className="absolute flex flex-col items-center justify-center text-center">
                <span className="text-2xl font-extrabold font-mono text-white tracking-tighter">
                  {report.riskScore}
                </span>
                <span className="text-[9px] font-mono text-slate-400 uppercase tracking-widest">
                  / 100
                </span>
              </div>
            </div>

            {/* Risk Tier & Threat Descriptor */}
            <div className="space-y-2">
              <div className="flex items-center space-x-2">
                <span
                  className={`px-3 py-1 rounded-xl text-xs font-mono font-extrabold tracking-wider border uppercase ${riskBadgeStyle}`}
                >
                  {report.riskTier}
                </span>
              </div>
              <h2 className="text-xl sm:text-2xl font-extrabold text-white font-['Outfit']">
                {isHighRisk
                  ? 'High Probability of Fraudulent Exploitation'
                  : isNeedsVerif
                  ? 'Caution: Unverified Opportunity Attributes'
                  : 'Authentic Opportunity Profile'}
              </h2>
              <p className="text-xs text-slate-400 font-mono">
                Evaluated against 22+ deterministic fraud pattern signatures.
              </p>
            </div>
          </div>

          {/* Right: Confidence Metric */}
          <div className="p-4 rounded-2xl bg-slate-900/90 border border-slate-800 space-y-2">
            <div className="flex items-center justify-between text-xs font-mono">
              <span className="text-slate-400 uppercase tracking-wider">Assessment Confidence</span>
              <span className="font-bold text-cyan-300">{report.confidenceScore}%</span>
            </div>
            {/* Confidence bar */}
            <div className="w-full h-2 bg-slate-950 rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-cyan-500 to-blue-500 rounded-full"
                style={{ width: `${report.confidenceScore}%` }}
              />
            </div>
            <p className="text-[11px] text-slate-400 leading-relaxed pt-1">
              {report.confidenceRationale}
            </p>
          </div>
        </div>

        {/* Executive Assessment Box */}
        <div className="mt-6 p-4 rounded-2xl bg-slate-950/80 border border-slate-800/80 space-y-1.5">
          <div className="text-[10px] font-mono font-bold uppercase tracking-wider text-cyan-400 flex items-center space-x-1.5">
            <FileBadge className="w-3.5 h-3.5" />
            <span>Executive Security Assessment & Grounded Summary:</span>
          </div>
          <p className="text-xs text-slate-200 leading-relaxed">
            {report.summary || report.executiveAssessment}
          </p>
        </div>
      </div>

      {/* 6 Category Risk Dimensions Grid (Section 7) */}
      <div className="glass-panel p-6 rounded-3xl border border-slate-800 space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-slate-800">
          <div className="flex items-center space-x-2">
            <span className="text-[10px] font-mono font-bold tracking-widest px-2 py-0.5 rounded bg-cyan-950 text-cyan-300 border border-cyan-800/50 uppercase">
              RISK DIMENSIONS
            </span>
            <h3 className="text-sm font-bold text-slate-200 font-['Outfit']">
              Category-Level Threat Breakdown
            </h3>
          </div>
          <span className="text-xs font-mono text-slate-400">
            6 Threat Vectors
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5">
          {/* Financial Risk */}
          <div className="p-3.5 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2 text-slate-300">
                <DollarSign className="w-4 h-4 text-emerald-400" />
                <span className="text-xs font-bold">Financial Risk</span>
              </div>
              <span className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded border ${getDimensionColor(categoryRisks.financial).badge}`}>
                {categoryRisks.financial}/100
              </span>
            </div>
            <div className="w-full h-1.5 bg-slate-950 rounded-full overflow-hidden">
              <div className={`h-full ${getDimensionColor(categoryRisks.financial).bar} transition-all duration-500`} style={{ width: `${categoryRisks.financial}%` }} />
            </div>
            <p className="text-[11px] text-slate-400 truncate">
              {categoryRisks.financial > 50 ? 'Advance fee / kit deposit threat' : 'No financial liability detected'}
            </p>
          </div>

          {/* Identity Risk */}
          <div className="p-3.5 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2 text-slate-300">
                <FileBadge className="w-4 h-4 text-amber-400" />
                <span className="text-xs font-bold">Identity Risk</span>
              </div>
              <span className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded border ${getDimensionColor(categoryRisks.identity).badge}`}>
                {categoryRisks.identity}/100
              </span>
            </div>
            <div className="w-full h-1.5 bg-slate-950 rounded-full overflow-hidden">
              <div className={`h-full ${getDimensionColor(categoryRisks.identity).bar} transition-all duration-500`} style={{ width: `${categoryRisks.identity}%` }} />
            </div>
            <p className="text-[11px] text-slate-400 truncate">
              {categoryRisks.identity > 40 ? 'Premature national ID / doc harvesting' : 'Standard identity footprint'}
            </p>
          </div>

          {/* Communication Risk */}
          <div className="p-3.5 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2 text-slate-300">
                <Radio className="w-4 h-4 text-purple-400" />
                <span className="text-xs font-bold">Communication Risk</span>
              </div>
              <span className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded border ${getDimensionColor(categoryRisks.communication).badge}`}>
                {categoryRisks.communication}/100
              </span>
            </div>
            <div className="w-full h-1.5 bg-slate-950 rounded-full overflow-hidden">
              <div className={`h-full ${getDimensionColor(categoryRisks.communication).bar} transition-all duration-500`} style={{ width: `${categoryRisks.communication}%` }} />
            </div>
            <p className="text-[11px] text-slate-400 truncate">
              {categoryRisks.communication > 40 ? 'Public webmail / Telegram routing' : 'Official communication channel'}
            </p>
          </div>

          {/* Urgency Risk */}
          <div className="p-3.5 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2 text-slate-300">
                <Clock className="w-4 h-4 text-rose-400" />
                <span className="text-xs font-bold">Urgency Risk</span>
              </div>
              <span className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded border ${getDimensionColor(categoryRisks.urgency).badge}`}>
                {categoryRisks.urgency}/100
              </span>
            </div>
            <div className="w-full h-1.5 bg-slate-950 rounded-full overflow-hidden">
              <div className={`h-full ${getDimensionColor(categoryRisks.urgency).bar} transition-all duration-500`} style={{ width: `${categoryRisks.urgency}%` }} />
            </div>
            <p className="text-[11px] text-slate-400 truncate">
              {categoryRisks.urgency > 40 ? 'Artificial 24h deadline / FOMO' : 'Standard hiring timeline'}
            </p>
          </div>

          {/* Credential Risk */}
          <div className="p-3.5 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2 text-slate-300">
                <KeyRound className="w-4 h-4 text-red-400" />
                <span className="text-xs font-bold">Credential Risk</span>
              </div>
              <span className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded border ${getDimensionColor(categoryRisks.credential).badge}`}>
                {categoryRisks.credential}/100
              </span>
            </div>
            <div className="w-full h-1.5 bg-slate-950 rounded-full overflow-hidden">
              <div className={`h-full ${getDimensionColor(categoryRisks.credential).bar} transition-all duration-500`} style={{ width: `${categoryRisks.credential}%` }} />
            </div>
            <p className="text-[11px] text-slate-400 truncate">
              {categoryRisks.credential > 0 ? 'OTP / password / PIN theft threat' : 'Zero credential solicitation'}
            </p>
          </div>

          {/* Organization Risk */}
          <div className="p-3.5 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2 text-slate-300">
                <Building2 className="w-4 h-4 text-cyan-400" />
                <span className="text-xs font-bold">Organization Risk</span>
              </div>
              <span className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded border ${getDimensionColor(categoryRisks.organization).badge}`}>
                {categoryRisks.organization}/100
              </span>
            </div>
            <div className="w-full h-1.5 bg-slate-950 rounded-full overflow-hidden">
              <div className={`h-full ${getDimensionColor(categoryRisks.organization).bar} transition-all duration-500`} style={{ width: `${categoryRisks.organization}%` }} />
            </div>
            <p className="text-[11px] text-slate-400 truncate">
              {categoryRisks.organization > 40 ? 'Domain mismatch / impersonation' : 'Verified entity alignment'}
            </p>
          </div>
        </div>
      </div>

      {/* Structured Opportunity Blueprint Chips */}
      <div className="glass-panel p-6 rounded-3xl border border-slate-800 space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-slate-800">
          <div className="flex items-center space-x-2">
            <span className="text-[10px] font-mono font-bold tracking-widest px-2 py-0.5 rounded bg-slate-800 text-slate-300 uppercase">
              STRUCTURED EXTRACTION
            </span>
            <h3 className="text-sm font-bold text-slate-200 font-['Outfit']">
              Opportunity Blueprint
            </h3>
          </div>
          <span className="text-[11px] font-mono text-slate-500">
            Source: {report.inputMode.toUpperCase()}
          </span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 text-xs">
          {/* Org */}
          <div className="p-3 rounded-xl bg-slate-900/60 border border-slate-800">
            <div className="text-[10px] font-mono text-slate-500 uppercase flex items-center space-x-1">
              <Building2 className="w-3 h-3 text-cyan-400" />
              <span>Organization</span>
            </div>
            <div className="font-semibold text-slate-200 mt-1 truncate">
              {entities.organization}
            </div>
          </div>

          {/* Role */}
          <div className="p-3 rounded-xl bg-slate-900/60 border border-slate-800">
            <div className="text-[10px] font-mono text-slate-500 uppercase flex items-center space-x-1">
              <Layers className="w-3 h-3 text-blue-400" />
              <span>Role / Profile</span>
            </div>
            <div className="font-semibold text-slate-200 mt-1 truncate">
              {entities.jobTitle}
            </div>
          </div>

          {/* Type */}
          <div className="p-3 rounded-xl bg-slate-900/60 border border-slate-800">
            <div className="text-[10px] font-mono text-slate-500 uppercase">Opportunity Type</div>
            <div className="font-semibold text-slate-200 mt-1 truncate">
              {entities.opportunityType}
            </div>
          </div>

          {/* Compensation */}
          <div className="p-3 rounded-xl bg-slate-900/60 border border-slate-800">
            <div className="text-[10px] font-mono text-slate-500 uppercase flex items-center space-x-1">
              <DollarSign className="w-3 h-3 text-emerald-400" />
              <span>Compensation</span>
            </div>
            <div className="font-semibold text-slate-200 mt-1 truncate">
              {entities.salaryStipend}
            </div>
          </div>

          {/* Requested Fee */}
          <div className="p-3 rounded-xl bg-slate-900/60 border border-slate-800">
            <div className="text-[10px] font-mono text-slate-500 uppercase">Upfront Fee</div>
            <div className={`font-semibold mt-1 truncate ${entities.paymentAmount !== 'Not detected' ? 'text-rose-400 font-bold' : 'text-slate-200'}`}>
              {entities.paymentAmount}
            </div>
          </div>

          {/* Recruiter Email */}
          <div className="p-3 rounded-xl bg-slate-900/60 border border-slate-800">
            <div className="text-[10px] font-mono text-slate-500 uppercase flex items-center space-x-1">
              <Mail className="w-3 h-3 text-purple-400" />
              <span>Recruiter Email</span>
            </div>
            <div className="font-semibold text-slate-200 mt-1 truncate font-mono text-[11px]">
              {entities.recruiterEmail}
            </div>
          </div>

          {/* Channel */}
          <div className="p-3 rounded-xl bg-slate-900/60 border border-slate-800">
            <div className="text-[10px] font-mono text-slate-500 uppercase">Contact Channel</div>
            <div className="font-semibold text-slate-200 mt-1 truncate">
              {entities.communicationPlatform}
            </div>
          </div>

          {/* Selection Method */}
          <div className="p-3 rounded-xl bg-slate-900/60 border border-slate-800">
            <div className="text-[10px] font-mono text-slate-500 uppercase">Selection Flow</div>
            <div className="font-semibold text-slate-200 mt-1 truncate">
              {entities.applicationMethod}
            </div>
          </div>
        </div>
      </div>

      {/* Uncertainty / Refusal Gate (if applicable) */}
      <UncertaintyBanner uncertainty={report.uncertainty} />

      {/* Explainable Evidence Chain */}
      <EvidenceChain evidenceChain={report.evidenceChain} />

      {/* Organization Intelligence Matrix */}
      <OrgConsistencyMatrix consistency={report.orgConsistency} />

      {/* Potential Exposure Breakdown */}
      <PotentialExposureView exposure={report.potentialExposure} />

      {/* Action Recommendations Playbook */}
      <ActionRecommendations action={report.recommendedAction} />

      {/* Structured Investigation Timeline / Steps (Section 13) */}
      {report.investigationSteps && report.investigationSteps.length > 0 && (
        <div className="glass-panel p-6 rounded-3xl border border-slate-800 space-y-4">
          <div className="flex items-center space-x-2 pb-3 border-b border-slate-800">
            <Activity className="w-4 h-4 text-cyan-400" />
            <h3 className="text-sm font-bold text-slate-200 font-['Outfit']">
              Investigation Audit Trail
            </h3>
          </div>
          <div className="space-y-2">
            {report.investigationSteps.map((step) => (
              <div
                key={step.step}
                className="flex items-center justify-between p-2.5 rounded-xl bg-slate-900/60 border border-slate-800 text-xs font-mono"
              >
                <div className="flex items-center space-x-2.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                  <span className="text-slate-200 font-semibold">{step.step}. {step.name}</span>
                </div>
                <span className="text-slate-400 truncate max-w-xs">{step.detail}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Responsible AI Disclaimer Footer */}
      <div className="p-4 rounded-2xl bg-slate-950/40 border border-slate-900 text-center text-[11px] text-slate-500 font-mono leading-relaxed">
        {report.disclaimer}
      </div>

      {/* Print / Export Report Modal */}
      {showPrintModal && (
        <PrintReportModal report={report} onClose={() => setShowPrintModal(false)} />
      )}
    </div>
  );
};
