import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  FileText, 
  Upload, 
  Search, 
  CheckCircle2, 
  AlertCircle, 
  XCircle, 
  TrendingUp, 
  Star,
  Users,
  ChevronRight,
  Briefcase
} from 'lucide-react';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs) {
  return twMerge(clsx(inputs));
}

// Mock logic for the AI Screening System
const screenResume = (jd, resume) => {
  const jdLower = jd.toLowerCase();
  const resumeLower = resume.content.toLowerCase();
  
  // A simple keywords-based logic for this MVP
  const keywords = jdLower.split(/[\s,.\n]+/).filter(w => w.length > 3);
  let matchCount = 0;
  keywords.forEach(word => {
    if (resumeLower.includes(word)) matchCount++;
  });

  const baseScore = Math.min(Math.round((matchCount / (keywords.length * 0.4)) * 100), 98);
  const score = baseScore + (resume.content.length > 500 ? 2 : 0);

  let recommendation = "Not Fit";
  if (score >= 80) recommendation = "Strong Fit";
  else if (score >= 60) recommendation = "Moderate Fit";

  // Mock strengths and gaps based on the score
  const allStrengths = ["Strong SQL", "Experience in Analytics", "System Thinking", "Quick Learner", "Relevant Project Work"];
  const allGaps = ["Weak Python", "Lack of Deep Expertise", "Limited Cloud Experience", "Fresher in Field", "Need Supervision"];

  const strengths = allStrengths.slice(0, 2 + (score % 2));
  const gaps = allGaps.slice(0, 2 - (score % 2) + (score < 40 ? 1 : 0));

  return {
    id: resume.id,
    name: resume.name,
    score: score > 100 ? 100 : score,
    strengths,
    gaps,
    recommendation
  };
};

const Card = ({ children, className }) => (
  <div className={cn("glass rounded-2xl p-6 transition-all", className)}>
    {children}
  </div>
);

const Badge = ({ variant = "default", children }) => {
  const styles = {
    "default": "bg-slate-800 text-slate-300",
    "Strong Fit": "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20",
    "Moderate Fit": "bg-amber-500/10 text-amber-400 border border-amber-500/20",
    "Not Fit": "bg-rose-500/10 text-rose-400 border border-rose-500/20",
  };
  return (
    <span className={cn("px-2.5 py-0.5 rounded-full text-xs font-medium", styles[variant] || styles.default)}>
      {children}
    </span>
  );
};

export default function App() {
  const [jd, setJd] = useState("");
  const [resumes, setResumes] = useState([]);
  const [results, setResults] = useState([]);
  const [isScreening, setIsScreening] = useState(false);

  const handleFileUpload = (e) => {
    const files = Array.from(e.target.files);
    const newResumes = files.map((file, idx) => ({
      id: Math.random().toString(36).substr(2, 9),
      name: file.name,
      // For this MVP, we simulate reading the content
      content: `This is a sample resume for ${file.name.split('.')[0]}. I have experience in SQL, Python, and data analysis. I am looking for a role like ${jd.slice(0, 20)}...`
    }));
    setResumes([...resumes, ...newResumes]);
  };

  const startScreening = () => {
    if (!jd || resumes.length === 0) return;
    setIsScreening(true);
    setTimeout(() => {
      const screenedResults = resumes.map(r => screenResume(jd, r));
      setResults(screenedResults.sort((a, b) => b.score - a.score));
      setIsScreening(false);
    }, 1500);
  };

  return (
    <div className="min-h-screen bg-background text-foreground p-8 max-w-7xl mx-auto space-y-8">
      {/* Header */}
      <header className="flex justify-between items-center bg-slate-900/40 p-6 rounded-3xl border border-white/5 backdrop-blur-sm">
        <div className="flex items-center gap-3">
          <div className="bg-primary/20 p-3 rounded-xl">
             <Star className="w-6 h-6 text-primary fill-primary/20" />
          </div>
          <div>
            <h1 className="text-2xl font-bold tracking-tight">AI Resume Screener</h1>
            <p className="text-sm text-muted-foreground">Shortlist candidates with precision</p>
          </div>
        </div>
        <div className="flex gap-4">
          <button className="px-4 py-2 text-sm font-medium hover:bg-slate-800 rounded-lg transition-colors">Settings</button>
          <div className="h-10 w-10 rounded-full bg-gradient-to-tr from-primary to-purple-500 flex items-center justify-center font-bold">JD</div>
        </div>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Column: Inputs */}
        <div className="lg:col-span-5 space-y-6">
          <Card className="space-y-4">
             <div className="flex items-center gap-2 mb-2">
               <Briefcase className="w-5 h-5 text-primary" />
               <h2 className="text-lg font-semibold">Job Description</h2>
             </div>
             <textarea 
               className="w-full h-40 bg-background border border-border rounded-xl p-4 focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all placeholder:text-muted-foreground"
               placeholder="Paste the Job Description here (e.g., We are looking for a Data Analyst with experience in SQL...)"
               value={jd}
               onChange={(e) => setJd(e.target.value)}
             />
          </Card>

          <Card className="space-y-4">
             <div className="flex items-center gap-2 mb-2">
               <Upload className="w-5 h-5 text-primary" />
               <h2 className="text-lg font-semibold">Upload Resumes</h2>
             </div>
             <div className="border-2 border-dashed border-border rounded-xl p-8 text-center space-y-4 hover:border-primary/50 transition-colors cursor-pointer relative group">
                <input 
                  type="file" 
                  multiple 
                  className="absolute inset-0 opacity-0 cursor-pointer" 
                  onChange={handleFileUpload}
                />
                <div className="bg-primary/10 w-12 h-12 rounded-full flex items-center justify-center mx-auto group-hover:scale-110 transition-transform">
                  <Upload className="w-6 h-6 text-primary" />
                </div>
                <div className="text-sm text-muted-foreground">
                  <span className="text-primary font-medium">Click to upload</span> or drag and drop
                  <br /> PDFs, Word docs (Simulated content)
                </div>
             </div>
             
             {resumes.length > 0 && (
               <div className="space-y-2 max-h-40 overflow-y-auto pr-2">
                 {resumes.map((f, i) => (
                   <div key={i} className="flex justify-between items-center text-xs bg-slate-800/50 p-2 rounded-lg border border-white/5">
                     <span className="truncate max-w-[200px] flex items-center gap-2"><FileText className="w-3 h-3" /> {f.name}</span>
                     <button className="text-muted-foreground hover:text-rose-400" onClick={() => setResumes(resumes.filter(r => r.id !== f.id))}><XCircle className="w-4 h-4" /></button>
                   </div>
                 ))}
               </div>
             )}
          </Card>

          <button 
            disabled={!jd || resumes.length === 0 || isScreening}
            onClick={startScreening}
            className="w-full bg-primary hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed text-white font-semibold py-4 rounded-2xl transition-all shadow-lg shadow-primary/20 flex items-center justify-center gap-2"
          >
            {isScreening ? (
              <>
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                Analyzing...
              </>
            ) : (
              <>
                <Search className="w-5 h-5" />
                Start AI Screening
              </>
            )}
          </button>
        </div>

        {/* Right Column: Results */}
        <div className="lg:col-span-7">
          <AnimatePresence mode="wait">
            {results.length > 0 ? (
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="space-y-6"
              >
                <div className="flex justify-between items-center mb-2">
                  <h2 className="text-xl font-bold flex items-center gap-2">
                    <TrendingUp className="w-6 h-6 text-primary" />
                    Screening Results
                  </h2>
                  <span className="text-sm text-muted-foreground font-medium">{results.length} Candidates Scanned</span>
                </div>

                <div className="space-y-4">
                  {results.map((res, idx) => (
                    <motion.div
                      key={res.id}
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: idx * 0.1 }}
                    >
                      <Card className="hover:border-primary/30 group">
                        <div className="flex flex-col md:flex-row gap-6">
                           {/* Score Circle */}
                           <div className="relative w-16 h-16 flex-shrink-0">
                              <svg className="w-full h-full transform -rotate-90">
                                <circle
                                  cx="32" cy="32" r="28"
                                  stroke="currentColor"
                                  strokeWidth="4"
                                  fill="transparent"
                                  className="text-slate-800"
                                />
                                <circle
                                  cx="32" cy="32" r="28"
                                  stroke="currentColor"
                                  strokeWidth="4"
                                  fill="transparent"
                                  strokeDasharray={175.9}
                                  strokeDashoffset={175.9 - (175.9 * res.score) / 100}
                                  className="text-primary"
                                />
                              </svg>
                              <div className="absolute inset-0 flex items-center justify-center font-bold">
                                {res.score}
                              </div>
                           </div>

                           <div className="flex-1 space-y-4">
                              <div className="flex justify-between items-start">
                                <div>
                                  <h3 className="font-bold text-lg group-hover:text-primary transition-colors">{res.name.split('.')[0]}</h3>
                                  <Badge variant={res.recommendation}>{res.recommendation}</Badge>
                                </div>
                                <div className="text-xs text-muted-foreground flex items-center gap-1 font-mono uppercase bg-slate-800 px-2 py-1 rounded">
                                  Rank #{idx + 1}
                                </div>
                              </div>

                              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                                <div className="bg-emerald-500/5 p-3 rounded-xl border border-emerald-500/10 h-full">
                                  <div className="flex items-center gap-2 text-emerald-400 font-semibold mb-2">
                                    <CheckCircle2 className="w-4 h-4" /> Strengths
                                  </div>
                                  <ul className="space-y-1 text-slate-300">
                                    {res.strengths.map((s, i) => <li key={i} className="flex gap-2 items-start"><ChevronRight className="w-3 h-3 mt-1 flex-shrink-0 text-emerald-500/50" /> {s}</li>)}
                                  </ul>
                                </div>
                                <div className="bg-rose-500/5 p-3 rounded-xl border border-rose-500/10 h-full">
                                  <div className="flex items-center gap-2 text-rose-400 font-semibold mb-2">
                                    <AlertCircle className="w-4 h-4" /> Gaps
                                  </div>
                                  <ul className="space-y-1 text-slate-300">
                                    {res.gaps.map((g, i) => <li key={i} className="flex gap-2 items-start"><ChevronRight className="w-3 h-3 mt-1 flex-shrink-0 text-rose-500/50" /> {g}</li>)}
                                  </ul>
                                </div>
                              </div>
                           </div>
                        </div>
                      </Card>
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            ) : (
              <div className="h-full flex flex-col items-center justify-center text-center p-12 glass rounded-3xl border border-dashed border-white/5 opacity-50 space-y-4">
                <div className="bg-slate-800 p-6 rounded-3xl">
                  <Users className="w-12 h-12 text-slate-400" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-slate-300">No Screening Data</h3>
                  <p className="max-w-[300px] text-sm text-slate-500">Upload resumes and enter a job description to see AI matching results and insights.</p>
                </div>
              </div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
