import { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { FileText, Upload, CheckCircle, AlertTriangle, Lightbulb, List } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

export default function DocSimplifier() {
  const [file, setFile] = useState<string | null>(null);
  const [processing, setProcessing] = useState(false);
  const [result, setResult] = useState(false);
  const { addXP } = useAuth();

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    const f = e.dataTransfer.files[0];
    if (f) simulateUpload(f.name);
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0];
    if (f) simulateUpload(f.name);
  };

  const simulateUpload = (name: string) => {
    setFile(name);
    setProcessing(true);
    setResult(false);
    setTimeout(() => { setProcessing(false); setResult(true); addXP(20); }, 2000);
  };

  return (
    <div className="animate-fade-in space-y-6">
      <div className="glass-card-gold p-4">
        <h2 className="font-serif text-xl font-bold">Document Simplifier</h2>
        <p className="text-sm text-muted-foreground">Upload a legal document for AI-powered analysis.</p>
      </div>

      {!result && (
        <div
          onDrop={handleDrop}
          onDragOver={e => e.preventDefault()}
          className={`glass-card border-2 border-dashed p-12 text-center cursor-pointer transition-all ${processing ? 'border-electric animate-glow-pulse' : 'border-border/50 hover:border-electric/40'}`}
          onClick={() => document.getElementById('file-input')?.click()}
        >
          <input id="file-input" type="file" className="hidden" onChange={handleFileSelect} />
          {processing ? (
            <div className="space-y-4">
              <div className="w-16 h-16 mx-auto rounded-full border-4 border-electric border-t-transparent animate-spin" />
              <p className="text-electric font-medium">Analyzing {file}...</p>
            </div>
          ) : (
            <>
              <Upload className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
              <p className="text-foreground font-medium">Drag & drop or click to upload</p>
              <p className="text-sm text-muted-foreground mt-1">PDF, DOCX, TXT supported</p>
            </>
          )}
        </div>
      )}

      {result && (
        <div className="space-y-4">
          <Badge variant="outline" className="border-gold/40 text-gold">AI Analysis – Prototype Simulation</Badge>

          <div className="glass-card p-5 space-y-4">
            <div className="flex items-start gap-3"><CheckCircle className="w-5 h-5 text-green-500 shrink-0 mt-0.5" /><div><h4 className="font-semibold text-sm">Summary</h4><p className="text-sm text-muted-foreground">This document is a standard rental agreement between two parties outlining terms of tenancy for a residential property. It covers duration, rent amount, security deposit, maintenance responsibilities, and termination clauses.</p></div></div>

            <div className="flex items-start gap-3"><List className="w-5 h-5 text-electric shrink-0 mt-0.5" /><div><h4 className="font-semibold text-sm">Key Points</h4><ul className="text-sm text-muted-foreground list-disc list-inside space-y-1 mt-1"><li>Monthly rent: ₹25,000 with annual 10% escalation</li><li>Security deposit: 2 months rent (refundable)</li><li>Lock-in period: 11 months</li><li>Maintenance charges borne by tenant</li><li>Notice period: 2 months for termination</li></ul></div></div>

            <div className="flex items-start gap-3"><AlertTriangle className="w-5 h-5 text-gold shrink-0 mt-0.5" /><div><h4 className="font-semibold text-sm">Risk Clauses</h4><ul className="text-sm text-muted-foreground list-disc list-inside space-y-1 mt-1"><li>No cap on annual rent escalation beyond 10%</li><li>Vague maintenance responsibility definition</li><li>Unilateral termination clause favoring landlord</li></ul></div></div>

            <div className="flex items-start gap-3"><Lightbulb className="w-5 h-5 text-electric shrink-0 mt-0.5" /><div><h4 className="font-semibold text-sm">Suggested Legal Action</h4><p className="text-sm text-muted-foreground">Negotiate clearer maintenance definitions, add a mutual termination clause, and cap rent escalation. Consider legal registration if tenure exceeds 11 months.</p></div></div>
          </div>
        </div>
      )}
    </div>
  );
}
