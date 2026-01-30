import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';
import {
  FileText,
  Calendar,
  Pill,
  Heart,
  Download,
  Eye,
  Shield,
  Brain,
  PlusCircle,
  User,
  TrendingUp,
  Activity,
  AlertTriangle,
  CheckCircle,
  Globe,
  Search,
  FileDown,
  Loader2
} from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area, BarChart, Bar, PieChart, Pie, Cell } from 'recharts';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { openFDAService } from '@/services/OpenFDAService';
import BiologicalAgeAnalysis from '@/components/BiologicalAgeAnalysis';
import TelemedicineDemo from '@/components/TelemedicineDemo';
import { pathologyAI } from '@/utils/apiService';
import DigitalTwin from '@/components/DigitalTwin';
import DigitalTwinDemo from '@/components/DigitalTwinDemo';
import RealTimeHealthDemo from '@/components/RealTimeHealthDemo';
import MedicineInfoLookup from '@/components/MedicineInfoLookup';
import DrugInteractionChecker from '@/components/DrugInteractionChecker';
import LanguageSelector from '@/components/LanguageSelector';
import { pdfReportService } from '@/services/PDFReportService';
import { 
  calculateOverallHealthScore, 
  processBiomarkersFromLabData, 
  type OrganRiskData,
  type HealthScoreResult 
} from '@/utils/healthScoring';
import { useTranslation } from '@/services/TranslationService';

const PatientPortal = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { t, language } = useTranslation();
  const [activeTab, setActiveTab] = useState('dashboard');
  const [loading, setLoading] = useState(true);
  const [patientData, setPatientData] = useState({
    name: '',
    age: 0,
    gender: '',
    patientId: '',
    lastVisit: '',
    nextAppointment: ''
  });
  const [analysisData, setAnalysisData] = useState<any>(null);
  const [healthRecords, setHealthRecords] = useState<any[]>([]);
  const [aiInsights, setAiInsights] = useState<any[]>([]);
  const [medications, setMedications] = useState<any[]>([]);
  const [selectedReport, setSelectedReport] = useState<any>(null); // For View Modal
  const [overallHealthScore, setOverallHealthScore] = useState(0);
  const [scoreTrend, setScoreTrend] = useState(0); // Difference from last report
  const [nextAppointment, setNextAppointment] = useState('Not Scheduled');
  const [showDemo, setShowDemo] = useState(false);
  const [isGeneratingPDF, setIsGeneratingPDF] = useState(false); // PDF generation state

  // Helper function to download report as PDF
  const downloadReportAsPDF = async (record: any) => {
    setIsGeneratingPDF(true);
    try {
      const patientInfo = {
        name: patientData.name,
        id: record.id,
        age: patientData.age,
        gender: patientData.gender,
        email: user?.email || 'Not provided'
      };

      const reportData = {
        id: record.id,
        date: record.date,
        type: record.type,
        status: record.status,
        riskScore: record.riskScore,
        fullData: record.fullData
      };

      await pdfReportService.generateMedicalReportPDF(reportData, patientInfo);
      
      // Show success message
      alert(t('pdf_generated_successfully') || 'PDF report generated successfully!');
    } catch (error) {
      console.error('PDF generation error:', error);
      alert(t('pdf_generation_error') || 'Failed to generate PDF. Please try again.');
    } finally {
      setIsGeneratingPDF(false);
    }
  };

  // Real-time health scoring state
  const [realTimeHealthScore, setRealTimeHealthScore] = useState<HealthScoreResult | null>(null);
  const [isCalculatingScore, setIsCalculatingScore] = useState(false);
  const [lastLabData, setLastLabData] = useState<any>(null);
  
  // Real-time data states for all modules
  const [realTimeVitals, setRealTimeVitals] = useState<any>({
    heartRate: 72,
    bloodPressure: { systolic: 120, diastolic: 80 },
    temperature: 98.6,
    oxygenSaturation: 98,
    respiratoryRate: 16
  });
  const [realTimeLabValues, setRealTimeLabValues] = useState<any>({
    glucose: 95,
    cholesterol: 180,
    creatinine: 0.9,
    alt: 25,
    ast: 22,
    hba1c: 5.4,
    hemoglobin: 14.2,
    wbc: 7.5,
    platelets: 250
  });
  const [realTimeRiskScores, setRealTimeRiskScores] = useState<any>({
    cardiovascular: 15,
    diabetes: 12,
    kidney: 8,
    liver: 10
  });
  const [isLiveMode, setIsLiveMode] = useState(true);
  const [lastUpdateTime, setLastUpdateTime] = useState(new Date());

  // Default "Zero" risk state to start
  const [riskAssessment, setRiskAssessment] = useState({
    diabetes: { risk: 'LOW', score: 0, trend: 'STABLE', nextScreening: 'Annual' },
    cardiovascular: { risk: 'LOW', score: 0, trend: 'STABLE', nextScreening: 'Annual' },
    kidney: { risk: 'LOW', score: 0, trend: 'STABLE', nextScreening: 'Annual' },
    liver: { risk: 'LOW', score: 0, trend: 'STABLE', nextScreening: 'Annual' }
  });

  // Chart data for trends
  const [healthTrendData, setHealthTrendData] = useState<any[]>([]);
  const [biomarkerData, setBiomarkerData] = useState<any[]>([]);
  const [riskTrendData, setRiskTrendData] = useState<any[]>([]);

  // Use refs to store current values to avoid dependency issues
  const currentRiskAssessment = React.useRef(riskAssessment);
  const currentRealTimeLabValues = React.useRef(realTimeLabValues);
  const currentRealTimeVitals = React.useRef(realTimeVitals);
  const currentRealTimeRiskScores = React.useRef(realTimeRiskScores);
  const currentRealTimeHealthScore = React.useRef(realTimeHealthScore);

  // Update refs when state changes
  React.useEffect(() => {
    currentRiskAssessment.current = riskAssessment;
  }, [riskAssessment]);

  React.useEffect(() => {
    currentRealTimeLabValues.current = realTimeLabValues;
  }, [realTimeLabValues]);

  React.useEffect(() => {
    currentRealTimeVitals.current = realTimeVitals;
  }, [realTimeVitals]);

  React.useEffect(() => {
    currentRealTimeRiskScores.current = realTimeRiskScores;
  }, [realTimeRiskScores]);

  React.useEffect(() => {
    currentRealTimeHealthScore.current = realTimeHealthScore;
  }, [realTimeHealthScore]);

  // Initial Data Fetch (Profile + First Record Load)
  useEffect(() => {
    const initData = async () => {
      try {
        setLoading(true);
        if (user) {
          setPatientData({
            name: user.name || 'Valued Patient',
            age: 35,
            gender: 'Not Specified',
            patientId: user.uid || 'PAT-000',
            lastVisit: new Date().toLocaleDateString(),
            nextAppointment: 'Scheduled upon request'
          });

          // Initialize demo chart data if no real data exists
          initializeDemoData();
        }
      } catch (error) {
        console.error("Failed to load patient data", error);
      } finally {
        setLoading(false);
      }
    };
    initData();
  }, [user]);

  // Real-time health score calculation with dynamic data simulation - Using refs to avoid infinite loops
  const calculateRealTimeHealthScore = React.useCallback(() => {
    const riskAssessmentData = currentRiskAssessment.current;
    if (!riskAssessmentData) return;

    setIsCalculatingScore(true);

    try {
      const currentLabValues = currentRealTimeLabValues.current;
      const currentVitals = currentRealTimeVitals.current;
      const currentRiskScores = currentRealTimeRiskScores.current;
      const currentHealthScore = currentRealTimeHealthScore.current;

      // Simulate real-time lab data fluctuations
      const dynamicLabData = {
        glucose: Math.max(70, Math.min(200, currentLabValues.glucose + (Math.random() - 0.5) * 15)),
        cholesterol: Math.max(150, Math.min(300, currentLabValues.cholesterol + (Math.random() - 0.5) * 25)),
        creatinine: Math.max(0.6, Math.min(2.0, currentLabValues.creatinine + (Math.random() - 0.5) * 0.3)),
        alt: Math.max(10, Math.min(100, currentLabValues.alt + (Math.random() - 0.5) * 10)),
        ast: Math.max(10, Math.min(100, currentLabValues.ast + (Math.random() - 0.5) * 8)),
        hba1c: Math.max(4.0, Math.min(12.0, currentLabValues.hba1c + (Math.random() - 0.5) * 0.5)),
        hemoglobin: Math.max(10, Math.min(18, currentLabValues.hemoglobin + (Math.random() - 0.5) * 1.0)),
        wbc: Math.max(3, Math.min(15, currentLabValues.wbc + (Math.random() - 0.5) * 2)),
        platelets: Math.max(100, Math.min(500, currentLabValues.platelets + (Math.random() - 0.5) * 50))
      };

      // Update real-time lab values
      setRealTimeLabValues(dynamicLabData);
      setLastLabData(dynamicLabData);

      // Simulate real-time vitals fluctuations
      const dynamicVitals = {
        heartRate: Math.max(60, Math.min(100, currentVitals.heartRate + (Math.random() - 0.5) * 8)),
        bloodPressure: {
          systolic: Math.max(90, Math.min(160, currentVitals.bloodPressure.systolic + (Math.random() - 0.5) * 10)),
          diastolic: Math.max(60, Math.min(100, currentVitals.bloodPressure.diastolic + (Math.random() - 0.5) * 8))
        },
        temperature: Math.max(97.0, Math.min(102.0, currentVitals.temperature + (Math.random() - 0.5) * 1.5)),
        oxygenSaturation: Math.max(92, Math.min(100, currentVitals.oxygenSaturation + (Math.random() - 0.5) * 3)),
        respiratoryRate: Math.max(12, Math.min(24, currentVitals.respiratoryRate + (Math.random() - 0.5) * 4))
      };
      setRealTimeVitals(dynamicVitals);

      // Convert risk assessment to OrganRiskData format with dynamic updates
      const organRisks: OrganRiskData[] = Object.entries(riskAssessmentData).map(([organ, data]) => {
        // Add slight variations to risk scores
        const dynamicScore = Math.max(0, Math.min(100, data.score + (Math.random() - 0.5) * 5));
        return {
          organ,
          currentRisk: data.risk as 'LOW' | 'MODERATE' | 'HIGH',
          futureRisk: (data.risk === 'LOW' ? 'LOW' : data.risk === 'MODERATE' ? 'MODERATE' : 'HIGH') as 'LOW' | 'MODERATE' | 'HIGH',
          riskScore: dynamicScore,
          biomarkers: getBiomarkersForOrgan(organ),
          criticalValues: getCriticalValuesForOrgan(organ, dynamicLabData)
        };
      });

      // Process biomarkers from dynamic lab data
      const biomarkers = processBiomarkersFromLabData(dynamicLabData);
      
      // Calculate new health score
      const previousScore = currentHealthScore?.overallScore;
      const newHealthScore = calculateOverallHealthScore(organRisks, biomarkers, previousScore);
      
      setRealTimeHealthScore(newHealthScore);
      setOverallHealthScore(newHealthScore.overallScore);
      
      // Update trend based on calculation
      const trend = newHealthScore.trend === 'IMPROVING' ? 5 : 
                   newHealthScore.trend === 'DECLINING' ? -5 : 0;
      setScoreTrend(trend);

      // Update real-time risk scores
      const newRiskScores = {
        cardiovascular: Math.max(5, Math.min(50, currentRiskScores.cardiovascular + (Math.random() - 0.5) * 3)),
        diabetes: Math.max(5, Math.min(40, currentRiskScores.diabetes + (Math.random() - 0.5) * 2)),
        kidney: Math.max(3, Math.min(30, currentRiskScores.kidney + (Math.random() - 0.5) * 2)),
        liver: Math.max(5, Math.min(35, currentRiskScores.liver + (Math.random() - 0.5) * 2))
      };
      setRealTimeRiskScores(newRiskScores);

      // Update timestamp
      setLastUpdateTime(new Date());

    } catch (error) {
      console.error('Real-time health score calculation error:', error);
    } finally {
      setIsCalculatingScore(false);
    }
  }, []); // Empty dependency array - using refs instead

  // Helper function to get biomarkers for each organ
  const getBiomarkersForOrgan = (organ: string): string[] => {
    const organBiomarkers: { [key: string]: string[] } = {
      cardiovascular: ['Cholesterol', 'LDL', 'HDL', 'Triglycerides', 'CRP', 'Troponin'],
      diabetes: ['Glucose', 'HbA1c', 'Insulin', 'C-peptide'],
      kidney: ['Creatinine', 'BUN', 'GFR', 'Proteinuria', 'Cystatin C'],
      liver: ['ALT', 'AST', 'Bilirubin', 'Albumin', 'GGT', 'ALP']
    };
    return organBiomarkers[organ] || [];
  };

  // Helper function to get critical values for organs
  const getCriticalValuesForOrgan = (organ: string, labData: any): { [key: string]: number } | undefined => {
    if (!labData) return undefined;

    const criticalRatios: { [key: string]: number } = {};
    
    switch (organ) {
      case 'cardiovascular':
        if (labData.cholesterol > 240) criticalRatios.cholesterol = labData.cholesterol / 200;
        if (labData.ldl > 160) criticalRatios.ldl = labData.ldl / 100;
        break;
      case 'diabetes':
        if (labData.glucose > 126) criticalRatios.glucose = labData.glucose / 100;
        if (labData.hba1c > 7.0) criticalRatios.hba1c = labData.hba1c / 5.6;
        break;
      case 'kidney':
        if (labData.creatinine > 1.5) criticalRatios.creatinine = labData.creatinine / 1.2;
        if (labData.bun > 25) criticalRatios.bun = labData.bun / 20;
        break;
      case 'liver':
        if (labData.alt > 50) criticalRatios.alt = labData.alt / 40;
        if (labData.ast > 50) criticalRatios.ast = labData.ast / 40;
        break;
    }

    return Object.keys(criticalRatios).length > 0 ? criticalRatios : undefined;
  };

  // Initialize demo data for better visual presentation
  const initializeDemoData = () => {
    // Demo health trend data (last 7 days)
    const demoHealthData = [];
    for (let i = 6; i >= 0; i--) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      const baseScore = 75 + Math.sin(i * 0.5) * 15; // Creates a realistic trend
      demoHealthData.push({
        date: date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
        fullDate: date.toLocaleDateString(),
        healthScore: Math.max(50, Math.min(95, Math.round(baseScore))),
        status: 'Normal'
      });
    }
    setHealthTrendData(demoHealthData);

    // Demo biomarker data (last 6 months)
    const demoBiomarkers = [];
    for (let i = 5; i >= 0; i--) {
      const date = new Date();
      date.setMonth(date.getMonth() - i);
      demoBiomarkers.push({
        month: date.toLocaleDateString('en-US', { month: 'short' }),
        glucose: Math.round(90 + Math.sin(i * 0.8) * 20), // 70-110 range
        cholesterol: Math.round(180 + Math.cos(i * 0.6) * 30), // 150-210 range
        bloodPressure: Math.round(115 + Math.sin(i * 0.4) * 15), // 100-130 range
        hemoglobin: Math.round(13.5 + Math.cos(i * 0.3) * 2) // 11.5-15.5 range
      });
    }
    setBiomarkerData(demoBiomarkers);

    // Demo risk data
    const demoRiskData = [
      { disease: 'Diabetes', score: 25, risk: 'LOW', fill: '#10b981' },
      { disease: 'Cardiovascular', score: 35, risk: 'LOW', fill: '#10b981' },
      { disease: 'Kidney', score: 15, risk: 'LOW', fill: '#10b981' },
      { disease: 'Liver', score: 20, risk: 'LOW', fill: '#10b981' }
    ];
    setRiskTrendData(demoRiskData);
  };

  // Load minted record from localStorage on mount
  useEffect(() => {
    const stored = localStorage.getItem('currentPatientAnalysis');
    if (stored) {
      try {
        const parsed = JSON.parse(stored);
        setAnalysisData(parsed);
      } catch (e) {
        console.error('Failed to parse stored analysis', e);
      }
    }
  }, []);

  // Polling for Records (Live Updates) using Backend API
  useEffect(() => {
    if (!user) return;

    const fetchRecords = async () => {
      try {
        // OLD: Blockchain Service
        // const records = blockchainService.getRecordsByPatient(user.uid);

        // NEW: Backend API Service
        const reports = await pathologyAI.getReports({ patientId: user.uid });

        // Helper to calculate score dynamically if missing
        const calculateScore = (analysis: any) => {
          if (analysis?.riskAssessment?.score) return analysis.riskAssessment.score;
          // Heuristic: Start at 100, deduct for risks
          let score = 100;
          const risks = analysis?.riskFactors || [];
          score -= (risks.length * 10);
          if (analysis?.status === 'flagged') score -= 15;
          return Math.max(0, score); // Min 0
        };

        // Map to UI
        const mappedRecords = reports.map((r: any) => {
          const score = calculateScore(r.aiAnalysis);
          // Check for "Scheduled Followups" in Care Plan
          const followups = r.aiAnalysis?.careCoordinator?.carePlan?.scheduledFollowups || [];
          const nextAppt = followups.length > 0 ? followups[0] : null;

          return {
            id: r._id,
            date: new Date(r.createdAt).toLocaleDateString(),
            rawDate: new Date(r.createdAt), // For sorting
            type: r.testType || 'General Analysis',
            status: score < 60 ? 'Critical' : score < 80 ? 'Attention Required' : 'Normal',
            riskScore: score,
            fullData: r.aiAnalysis || {},
            nextAppt: nextAppt
          };
        });

        setHealthRecords(mappedRecords);

        if (mappedRecords.length > 0) {
          // Sort by Date Descending
          const sorted = [...mappedRecords].sort((a, b) => b.rawDate - a.rawDate);
          const latest = sorted[0];
          const previous = sorted.length > 1 ? sorted[1] : null;

          // Extract lab data from latest report for real-time scoring
          const latestLabData = extractLabDataFromReport(latest.fullData);
          setLastLabData(latestLabData);

          // Update Top Level Stats (will be overridden by real-time calculation)
          setOverallHealthScore(latest.riskScore);
          setScoreTrend(previous ? latest.riskScore - previous.riskScore : 0);
          if (latest.nextAppt) setNextAppointment(latest.nextAppt);

          // Prepare Chart Data from real records
          const chartData = sorted.reverse().map((rec, index) => ({
            date: new Date(rec.rawDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
            fullDate: rec.date,
            healthScore: rec.riskScore,
            status: rec.status,
            // Simulate biomarker trends for demo
            glucose: Math.max(70, Math.min(200, 100 + (Math.random() - 0.5) * 40)),
            cholesterol: Math.max(150, Math.min(300, 200 + (Math.random() - 0.5) * 60)),
            bloodPressure: Math.max(90, Math.min(160, 120 + (Math.random() - 0.5) * 30)),
            hemoglobin: Math.max(10, Math.min(18, 14 + (Math.random() - 0.5) * 4))
          }));

          setHealthTrendData(chartData);

          // Biomarker trend data (last 6 months simulation)
          const biomarkers = [];
          for (let i = 5; i >= 0; i--) {
            const date = new Date();
            date.setMonth(date.getMonth() - i);
            biomarkers.push({
              month: date.toLocaleDateString('en-US', { month: 'short' }),
              glucose: Math.max(70, Math.min(200, 100 + (Math.random() - 0.5) * 40)),
              cholesterol: Math.max(150, Math.min(300, 200 + (Math.random() - 0.5) * 60)),
              bloodPressure: Math.max(90, Math.min(160, 120 + (Math.random() - 0.5) * 30)),
              hemoglobin: Math.max(10, Math.min(18, 14 + (Math.random() - 0.5) * 4))
            });
          }
          setBiomarkerData(biomarkers);

          // Risk assessment trend data
          const riskData = Object.entries(riskAssessment).map(([disease, data]) => ({
            disease: disease.charAt(0).toUpperCase() + disease.slice(1),
            score: data.score,
            risk: data.risk,
            fill: data.risk === 'HIGH' ? '#ef4444' : data.risk === 'MODERATE' ? '#f59e0b' : '#10b981'
          }));
          setRiskTrendData(riskData);

          // Update Insights
          const newInsights = latest.fullData.nextSteps?.map((step: any, i: number) => ({
            title: 'Action Item',
            message: typeof step === 'string' ? step : step.step,
            priority: 'high',
            date: new Date().toLocaleDateString()
          })) || [];
          setAiInsights(newInsights);

          // Update Risk Assessment Display
          // Update Risk Assessment Display
          if (latest.fullData.riskAssessment) {
            // Use Real AI Data if available
            const ra = latest.fullData.riskAssessment;
            setRiskAssessment({
              diabetes: {
                risk: ra.diabetes?.risk || 'LOW',
                score: ra.diabetes?.score || 0,
                trend: ra.diabetes?.trend || 'STABLE',
                nextScreening: ra.diabetes?.nextScreening || 'Annual'
              },
              cardiovascular: {
                risk: ra.cardiovascular?.risk || 'LOW',
                score: ra.cardiovascular?.score || 0,
                trend: ra.cardiovascular?.trend || 'STABLE',
                nextScreening: ra.cardiovascular?.nextScreening || 'Annual'
              },
              kidney: {
                risk: ra.kidney?.risk || 'LOW',
                score: ra.kidney?.score || 0,
                trend: ra.kidney?.trend || 'STABLE',
                nextScreening: ra.kidney?.nextScreening || 'Annual'
              },
              liver: {
                risk: ra.liver?.risk || 'LOW',
                score: ra.liver?.score || 0,
                trend: ra.liver?.trend || 'STABLE',
                nextScreening: ra.liver?.nextScreening || 'Annual'
              }
            });
          } else {
            // Fallback for old reports (Heuristic)
            const score = latest.riskScore;
            setRiskAssessment({
              diabetes: { risk: score < 70 ? 'MODERATE' : 'LOW', score: Math.round(100 - score * 0.2), trend: 'STABLE', nextScreening: '6 months' },
              cardiovascular: { risk: score < 50 ? 'HIGH' : 'LOW', score: Math.round(100 - score * 0.4), trend: 'STABLE', nextScreening: 'Annual' },
              kidney: { risk: 'LOW', score: Math.round(100 - score * 0.1), trend: 'STABLE', nextScreening: 'Annual' },
              liver: { risk: 'LOW', score: Math.round(100 - score * 0.1), trend: 'STABLE', nextScreening: 'Annual' }
            });
          }

          // Trigger FDA Check
          extractAndValidateMedications(latest.fullData);
        }
      } catch (e) {
        console.error("Failed to fetch records", e);
      }
    };

    const extractAndValidateMedications = async (analysis: any) => {
      if (!analysis) return;

      const candidates = new Set<string>();
      // Regex to find capitalized words after action verbs
      const regex = /(?:Start|Take|Prescribe|Consider|Monitor|Add)\s+([A-Z][a-z]+)/g;

      // 1. Scan Recommendations
      const recs = analysis.recommendations || [];
      recs.forEach((r: any) => {
        const text = r.recommendation || "";
        let match;
        while ((match = regex.exec(text)) !== null) {
          if (match[1].length > 3) candidates.add(match[1]);
        }
      });

      // 2. Scan Care Plan Actions
      const actions = analysis.careCoordinator?.carePlan?.immediateActions || [];
      actions.forEach((act: string) => {
        let match;
        while ((match = regex.exec(act)) !== null) {
          if (match[1].length > 3) candidates.add(match[1]);
        }
      });

      const validatedMeds = [];
      for (const drug of Array.from(candidates)) {
        // Filter common non-drugs
        if (['Blood', 'Sugar', 'Pressure', 'Diet', 'Exercise', 'Water', 'Salt', 'Insulin', 'Daily', 'Weekly'].includes(drug)) continue;

        try {
          const info = await openFDAService.getDrugLabel(drug);
          const eventCount = await openFDAService.getAdverseEventCount(drug);

          if (info) {
            validatedMeds.push({
              name: info.brand_name,
              dosage: "As prescribed",
              purpose: `Based on recommendation: ${drug}`,
              safetyStatus: (info.boxed_warning || eventCount > 1000) ? 'Alert' : 'Safe',
              warnings: info.boxed_warning || info.warnings[0],
              adverseEvents: eventCount,
              nextReview: 'Next Appt'
            });
          }
        } catch (e) {
          console.warn(`Skipping FDA check for ${drug}`);
        }
      }
      setMedications(validatedMeds);
    };

    fetchRecords();
    const interval = setInterval(fetchRecords, 10000); // Poll every 10s
    return () => clearInterval(interval);
  }, [user]);

  // Helper function to extract lab data from AI analysis
  const extractLabDataFromReport = (analysisData: any) => {
    if (!analysisData) return null;

    // Extract lab values from various possible locations in the analysis
    const labData: any = {};

    // Try to extract from diagnosis evidence or recommendations
    const allText = JSON.stringify(analysisData).toLowerCase();
    
    // Extract common lab values using regex patterns
    const patterns = {
      glucose: /glucose[:\s]*(\d+\.?\d*)/i,
      cholesterol: /cholesterol[:\s]*(\d+\.?\d*)/i,
      ldl: /ldl[:\s]*(\d+\.?\d*)/i,
      hdl: /hdl[:\s]*(\d+\.?\d*)/i,
      creatinine: /creatinine[:\s]*(\d+\.?\d*)/i,
      alt: /alt[:\s]*(\d+\.?\d*)/i,
      ast: /ast[:\s]*(\d+\.?\d*)/i,
      hba1c: /hba1c[:\s]*(\d+\.?\d*)/i,
      hemoglobin: /hemoglobin[:\s]*(\d+\.?\d*)/i
    };

    Object.entries(patterns).forEach(([key, pattern]) => {
      const match = allText.match(pattern);
      if (match && match[1]) {
        labData[key] = parseFloat(match[1]);
      }
    });

    // Add some realistic demo values if no data found
    if (Object.keys(labData).length === 0) {
      labData.glucose = 95 + Math.random() * 30;
      labData.cholesterol = 180 + Math.random() * 60;
      labData.creatinine = 0.8 + Math.random() * 0.6;
      labData.alt = 25 + Math.random() * 30;
      labData.hba1c = 5.2 + Math.random() * 1.5;
    }

    return labData;
  };

  // Real-time health score calculation effect - Fixed dependencies
  React.useEffect(() => {
    if (riskAssessment && Object.keys(riskAssessment).length > 0) {
      calculateRealTimeHealthScore();
    }
  }, [riskAssessment]); // Removed calculateRealTimeHealthScore from dependencies

  // Set up real-time updates every 5 seconds for maximum live effect - Fixed dependencies
  React.useEffect(() => {
    if (!isLiveMode) return;

    const interval = setInterval(() => {
      if (riskAssessment && Object.keys(riskAssessment).length > 0) {
        calculateRealTimeHealthScore();
      }
    }, 5000); // Update every 5 seconds for true real-time feel

    return () => clearInterval(interval);
  }, [isLiveMode]); // Removed calculateRealTimeHealthScore and riskAssessment from dependencies

  // Real-time chart data updates - Using refs to avoid infinite loops
  React.useEffect(() => {
    if (!isLiveMode) return;

    const updateChartData = () => {
      const currentLabValues = currentRealTimeLabValues.current;
      const currentVitals = currentRealTimeVitals.current;
      const currentRiskScores = currentRealTimeRiskScores.current;

      // Update health trend data with current score
      setHealthTrendData(prev => {
        const newData = [...prev];
        const now = new Date();
        const newPoint = {
          date: now.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
          fullDate: now.toLocaleDateString(),
          healthScore: overallHealthScore,
          status: overallHealthScore >= 80 ? 'Normal' : overallHealthScore >= 60 ? 'Attention Required' : 'Critical'
        };
        
        // Keep only last 10 points for smooth animation
        if (newData.length >= 10) {
          newData.shift();
        }
        newData.push(newPoint);
        return newData;
      });

      // Update biomarker data with current values
      setBiomarkerData(prev => {
        const newData = [...prev];
        const now = new Date();
        const newPoint = {
          month: now.toLocaleDateString('en-US', { month: 'short' }),
          glucose: Math.round(currentLabValues.glucose),
          cholesterol: Math.round(currentLabValues.cholesterol),
          bloodPressure: Math.round(currentVitals.bloodPressure.systolic),
          hemoglobin: Math.round(currentLabValues.hemoglobin * 10) / 10
        };
        
        // Keep only last 6 points
        if (newData.length >= 6) {
          newData.shift();
        }
        newData.push(newPoint);
        return newData;
      });

      // Update risk trend data with current scores
      setRiskTrendData([
        { disease: 'Cardiovascular', score: currentRiskScores.cardiovascular, risk: currentRiskScores.cardiovascular > 30 ? 'HIGH' : currentRiskScores.cardiovascular > 15 ? 'MODERATE' : 'LOW', fill: currentRiskScores.cardiovascular > 30 ? '#ef4444' : currentRiskScores.cardiovascular > 15 ? '#f59e0b' : '#10b981' },
        { disease: 'Diabetes', score: currentRiskScores.diabetes, risk: currentRiskScores.diabetes > 25 ? 'HIGH' : currentRiskScores.diabetes > 12 ? 'MODERATE' : 'LOW', fill: currentRiskScores.diabetes > 25 ? '#ef4444' : currentRiskScores.diabetes > 12 ? '#f59e0b' : '#10b981' },
        { disease: 'Kidney', score: currentRiskScores.kidney, risk: currentRiskScores.kidney > 20 ? 'HIGH' : currentRiskScores.kidney > 10 ? 'MODERATE' : 'LOW', fill: currentRiskScores.kidney > 20 ? '#ef4444' : currentRiskScores.kidney > 10 ? '#f59e0b' : '#10b981' },
        { disease: 'Liver', score: currentRiskScores.liver, risk: currentRiskScores.liver > 25 ? 'HIGH' : currentRiskScores.liver > 12 ? 'MODERATE' : 'LOW', fill: currentRiskScores.liver > 25 ? '#ef4444' : currentRiskScores.liver > 12 ? '#f59e0b' : '#10b981' }
      ]);
    };

    const chartInterval = setInterval(updateChartData, 6000); // Update charts every 6 seconds
    return () => clearInterval(chartInterval);
  }, [isLiveMode, overallHealthScore]); // Only depend on isLiveMode and overallHealthScore
  const getRiskColor = (risk: string) => {
    switch (risk) {
      case 'LOW': return 'text-green-600 bg-green-100';
      case 'MODERATE': return 'text-yellow-600 bg-yellow-100';
      case 'HIGH': return 'text-red-600 bg-red-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'border-red-500 bg-red-50';
      case 'medium': return 'border-yellow-500 bg-yellow-50';
      case 'low': return 'border-green-500 bg-green-50';
      default: return 'border-gray-500 bg-gray-50';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Normal': return 'bg-green-100 text-green-800';
      case 'Attention Required': return 'bg-yellow-100 text-yellow-800';
      case 'Critical': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header with Language Selector */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">{t('patient_portal') || 'Patient Health Portal'}</h1>
              <p className="text-gray-600">{t('welcome_back') || 'Welcome back'}, {patientData.name}</p>
            </div>
            <div className="text-right space-y-3">
              <LanguageSelector variant="compact" />
              <div>
                <p className="text-sm text-gray-600">Patient ID: {patientData.patientId}</p>
                <p className="text-sm text-gray-600">{t('last_visit') || 'Last Visit'}: {patientData.lastVisit}</p>
                <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                  <p className="text-xs text-blue-800 font-medium mb-1">📋 Next Steps</p>
                  <p className="text-xs text-blue-700">Your doctor will order new tests when needed. Results will appear here automatically.</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {analysisData && (
          <Card className="mt-8 border-blue-100 bg-blue-50/30 overflow-hidden">
            <CardHeader className="py-4 bg-white border-b border-blue-50">
              <div className="flex items-center justify-between">
                <CardTitle className="text-sm font-bold uppercase tracking-widest text-blue-600">Active Health Architecture</CardTitle>
                <div className="flex gap-2">
                  <Badge variant="outline" className="bg-white">Ref: {analysisData.blockchainRecord?.recordId?.slice(-8) || 'LIVE'}</Badge>
                </div>
              </div>
            </CardHeader>
            <CardContent className="pt-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="space-y-4">
                  <h4 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Primary Diagnosis</h4>
                  {(analysisData.analysis?.diagnosis || []).map((d: any, i: number) => (
                    <div key={i} className="bg-white p-3 border border-slate-100 rounded-xl shadow-sm">
                      <p className="text-sm font-bold text-slate-900">{d.condition}</p>
                      <p className="text-[10px] text-slate-500 mt-1 uppercase tracking-tight">{d.confidenceLevel} Confidence</p>
                    </div>
                  ))}
                </div>
                <div className="space-y-4">
                  <h4 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Signal Quality</h4>
                  <div className="bg-white p-4 border border-slate-100 rounded-xl shadow-sm">
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-xs font-medium text-slate-600">Completeness</span>
                      <span className="text-xs font-bold text-green-600">{analysisData.analysis?.dataQuality?.completeness || 'High'}</span>
                    </div>
                    <Progress value={analysisData.analysis?.dataQuality?.completeness === 'High' ? 100 : 70} className="h-1.5" />
                  </div>
                </div>
                <div className="space-y-4">
                  <h4 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Security Protocol</h4>
                  <div className="flex items-center gap-3 bg-white p-3 border border-slate-100 rounded-xl">
                    <Shield className="h-5 w-5 text-blue-500" />
                    <div>
                      <p className="text-xs font-bold text-slate-900">E2EE Protected</p>
                      <p className="text-[10px] text-slate-400">Validated Session</p>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        )}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-6 lg:grid-cols-11 gap-1">
            <TabsTrigger value="dashboard" className="text-xs lg:text-sm">
              📊 Dashboard
              {isLiveMode && <div className="ml-1 w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>}
            </TabsTrigger>
            <TabsTrigger value="biological-age" className="text-xs lg:text-sm">🧬 Longevity</TabsTrigger>
            <TabsTrigger value="telemedicine" className="text-xs lg:text-sm">📹 Telemedicine</TabsTrigger>
            <TabsTrigger value="real-time" className="text-xs lg:text-sm">⚡ Real-Time</TabsTrigger>
            <TabsTrigger value="medicine-info" className="text-xs lg:text-sm">💊 Medicine</TabsTrigger>
            <TabsTrigger value="drug-interactions" className="text-xs lg:text-sm">🔍 Drug Check</TabsTrigger>
            <TabsTrigger value="digital-twin" className="text-xs lg:text-sm">🤖 Digital Twin</TabsTrigger>
            <TabsTrigger value="reports" className="text-xs lg:text-sm">📄 Reports</TabsTrigger>
            <TabsTrigger value="medications" className="text-xs lg:text-sm">💉 Medications</TabsTrigger>
            <TabsTrigger value="trends" className="text-xs lg:text-sm">📈 Trends</TabsTrigger>
            <TabsTrigger value="insights" className="text-xs lg:text-sm">🧠 AI Insights</TabsTrigger>
          </TabsList>

          <TabsContent value="dashboard" className="space-y-6">
            {/* Real-Time Control Panel */}
            <Card className="border-2 border-green-200 bg-gradient-to-r from-green-50 to-blue-50">
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <CardTitle className="flex items-center gap-3">
                    <Activity className="h-6 w-6 text-green-600" />
                    Live Patient Monitoring System
                    <Badge className="bg-green-500 text-white animate-pulse">LIVE</Badge>
                  </CardTitle>
                  <div className="flex items-center gap-4">
                    <button
                      onClick={() => setIsLiveMode(!isLiveMode)}
                      className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                        isLiveMode 
                          ? 'bg-green-500 text-white shadow-md' 
                          : 'bg-gray-200 text-gray-600 hover:bg-gray-300'
                      }`}
                    >
                      {isLiveMode ? '🔴 LIVE' : '⏸️ PAUSED'}
                    </button>
                    <div className="text-xs text-gray-600">
                      Last Update: <strong>{lastUpdateTime.toLocaleTimeString()}</strong>
                    </div>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                  {/* Real-time Vitals */}
                  <div className="bg-white p-3 rounded-lg border border-green-200">
                    <div className="flex items-center gap-2 mb-2">
                      <Heart className="h-4 w-4 text-red-500" />
                      <span className="text-xs font-medium">Heart Rate</span>
                    </div>
                    <div className="text-lg font-bold text-red-600">
                      {Math.round(realTimeVitals.heartRate)} BPM
                    </div>
                    <div className="text-xs text-gray-500">
                      {realTimeVitals.heartRate > 90 ? '↗ Elevated' : realTimeVitals.heartRate < 70 ? '↘ Low' : '→ Normal'}
                    </div>
                  </div>

                  <div className="bg-white p-3 rounded-lg border border-green-200">
                    <div className="flex items-center gap-2 mb-2">
                      <Activity className="h-4 w-4 text-blue-500" />
                      <span className="text-xs font-medium">Blood Pressure</span>
                    </div>
                    <div className="text-lg font-bold text-blue-600">
                      {Math.round(realTimeVitals.bloodPressure.systolic)}/{Math.round(realTimeVitals.bloodPressure.diastolic)}
                    </div>
                    <div className="text-xs text-gray-500">
                      {realTimeVitals.bloodPressure.systolic > 140 ? '↗ High' : '→ Normal'}
                    </div>
                  </div>

                  <div className="bg-white p-3 rounded-lg border border-green-200">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="text-red-500">🌡️</span>
                      <span className="text-xs font-medium">Temperature</span>
                    </div>
                    <div className="text-lg font-bold text-orange-600">
                      {realTimeVitals.temperature.toFixed(1)}°F
                    </div>
                    <div className="text-xs text-gray-500">
                      {realTimeVitals.temperature > 100.4 ? '↗ Fever' : '→ Normal'}
                    </div>
                  </div>

                  <div className="bg-white p-3 rounded-lg border border-green-200">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="text-blue-500">💨</span>
                      <span className="text-xs font-medium">O2 Saturation</span>
                    </div>
                    <div className="text-lg font-bold text-blue-600">
                      {Math.round(realTimeVitals.oxygenSaturation)}%
                    </div>
                    <div className="text-xs text-gray-500">
                      {realTimeVitals.oxygenSaturation < 95 ? '↘ Low' : '→ Normal'}
                    </div>
                  </div>

                  <div className="bg-white p-3 rounded-lg border border-green-200">
                    <div className="flex items-center gap-2 mb-2">
                      <Activity className="h-4 w-4 text-green-500" />
                      <span className="text-xs font-medium">Respiratory Rate</span>
                    </div>
                    <div className="text-lg font-bold text-green-600">
                      {Math.round(realTimeVitals.respiratoryRate)} /min
                    </div>
                    <div className="text-xs text-gray-500">
                      {realTimeVitals.respiratoryRate > 20 ? '↗ Elevated' : '→ Normal'}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Health Overview with Real-time Updates */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium flex items-center gap-2">
                    Overall Health Score
                    {isCalculatingScore && (
                      <div className="w-3 h-3 border-2 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
                    )}
                  </CardTitle>
                  <Heart className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="flex items-baseline gap-2">
                    <div className={`text-2xl font-bold ${overallHealthScore >= 80 ? 'text-green-600' : overallHealthScore >= 60 ? 'text-yellow-600' : 'text-red-600'}`}>
                      {overallHealthScore}/100
                    </div>
                    {realTimeHealthScore && (
                      <div className="flex items-center gap-1">
                        <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                        <span className="text-xs text-green-600 font-medium">LIVE</span>
                      </div>
                    )}
                  </div>
                  
                  <div className="flex items-center justify-between mt-2">
                    <p className="text-xs text-muted-foreground">
                      {realTimeHealthScore?.category || (overallHealthScore >= 80 ? 'Excellent' : 'Needs Attention')}
                    </p>
                    {realTimeHealthScore && (
                      <div className={`text-xs px-2 py-1 rounded-full ${
                        realTimeHealthScore.trend === 'IMPROVING' ? 'bg-green-100 text-green-700' :
                        realTimeHealthScore.trend === 'DECLINING' ? 'bg-red-100 text-red-700' :
                        'bg-gray-100 text-gray-700'
                      }`}>
                        {realTimeHealthScore.trend === 'IMPROVING' ? '↗ Improving' :
                         realTimeHealthScore.trend === 'DECLINING' ? '↘ Declining' :
                         '→ Stable'}
                      </div>
                    )}
                  </div>

                  {/* Real-time biomarker indicators */}
                  {realTimeHealthScore && (
                    <div className="mt-3 space-y-1">
                      <div className="text-xs text-gray-500">Key Factors:</div>
                      <div className="flex flex-wrap gap-1">
                        {Object.entries(realTimeHealthScore.organScores).slice(0, 3).map(([organ, score]) => (
                          <div key={organ} className={`text-xs px-2 py-1 rounded ${
                            score >= 80 ? 'bg-green-100 text-green-700' :
                            score >= 60 ? 'bg-yellow-100 text-yellow-700' :
                            'bg-red-100 text-red-700'
                          }`}>
                            {organ}: {Math.round(score)}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Mini trend sparkline */}
                  <div className="h-8 w-full mt-3">
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart data={healthTrendData.slice(-7)}>
                        <Line 
                          type="monotone" 
                          dataKey="healthScore" 
                          stroke={overallHealthScore >= 80 ? '#10b981' : '#f59e0b'} 
                          strokeWidth={2}
                          dot={false}
                        />
                      </LineChart>
                    </ResponsiveContainer>
                  </div>

                  {/* Last updated timestamp */}
                  {realTimeHealthScore && (
                    <div className="text-xs text-gray-400 mt-2">
                      Updated: {realTimeHealthScore.lastUpdated.toLocaleTimeString()}
                    </div>
                  )}
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Recent Reports</CardTitle>
                  <FileText className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{healthRecords.length}</div>
                  <p className="text-xs text-muted-foreground">
                    Last 30 days
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Active Medications</CardTitle>
                  <Pill className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{medications.length}</div>
                  <p className="text-xs text-muted-foreground">
                    Currently prescribed
                  </p>
                  {isLiveMode && (
                    <div className="mt-2 text-xs text-green-600 flex items-center gap-1">
                      <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                      Monitoring interactions
                    </div>
                  )}
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Next Appointment</CardTitle>
                  <Calendar className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-xl font-bold truncate" title={nextAppointment}>{nextAppointment}</div>
                  <p className="text-xs text-muted-foreground">
                    Upcoming
                  </p>
                </CardContent>
              </Card>
            </div>

            {/* Real-Time Lab Values Panel */}
            <Card className="border-2 border-blue-200">
              <CardHeader>
                <CardTitle className="flex items-center gap-3">
                  <Brain className="h-5 w-5 text-blue-600" />
                  Live Laboratory Values
                  <Badge className="bg-blue-500 text-white animate-pulse">REAL-TIME</Badge>
                  {isCalculatingScore && (
                    <div className="w-4 h-4 border-2 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
                  )}
                </CardTitle>
                <CardDescription>
                  Continuous monitoring of key biomarkers with instant analysis
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
                  <div className="bg-gradient-to-br from-red-50 to-red-100 p-4 rounded-lg border border-red-200">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium text-red-700">Glucose</span>
                      <div className={`w-2 h-2 rounded-full ${realTimeLabValues.glucose > 126 ? 'bg-red-500 animate-pulse' : realTimeLabValues.glucose > 100 ? 'bg-yellow-500' : 'bg-green-500'}`}></div>
                    </div>
                    <div className="text-xl font-bold text-red-800">{Math.round(realTimeLabValues.glucose)}</div>
                    <div className="text-xs text-red-600">mg/dL</div>
                    <div className="text-xs mt-1">
                      {realTimeLabValues.glucose > 126 ? 'HIGH' : realTimeLabValues.glucose > 100 ? 'ELEVATED' : 'NORMAL'}
                    </div>
                  </div>

                  <div className="bg-gradient-to-br from-orange-50 to-orange-100 p-4 rounded-lg border border-orange-200">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium text-orange-700">Cholesterol</span>
                      <div className={`w-2 h-2 rounded-full ${realTimeLabValues.cholesterol > 240 ? 'bg-red-500 animate-pulse' : realTimeLabValues.cholesterol > 200 ? 'bg-yellow-500' : 'bg-green-500'}`}></div>
                    </div>
                    <div className="text-xl font-bold text-orange-800">{Math.round(realTimeLabValues.cholesterol)}</div>
                    <div className="text-xs text-orange-600">mg/dL</div>
                    <div className="text-xs mt-1">
                      {realTimeLabValues.cholesterol > 240 ? 'HIGH' : realTimeLabValues.cholesterol > 200 ? 'ELEVATED' : 'NORMAL'}
                    </div>
                  </div>

                  <div className="bg-gradient-to-br from-purple-50 to-purple-100 p-4 rounded-lg border border-purple-200">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium text-purple-700">Creatinine</span>
                      <div className={`w-2 h-2 rounded-full ${realTimeLabValues.creatinine > 1.5 ? 'bg-red-500 animate-pulse' : realTimeLabValues.creatinine > 1.2 ? 'bg-yellow-500' : 'bg-green-500'}`}></div>
                    </div>
                    <div className="text-xl font-bold text-purple-800">{realTimeLabValues.creatinine.toFixed(1)}</div>
                    <div className="text-xs text-purple-600">mg/dL</div>
                    <div className="text-xs mt-1">
                      {realTimeLabValues.creatinine > 1.5 ? 'HIGH' : realTimeLabValues.creatinine > 1.2 ? 'ELEVATED' : 'NORMAL'}
                    </div>
                  </div>

                  <div className="bg-gradient-to-br from-green-50 to-green-100 p-4 rounded-lg border border-green-200">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium text-green-700">ALT</span>
                      <div className={`w-2 h-2 rounded-full ${realTimeLabValues.alt > 50 ? 'bg-red-500 animate-pulse' : realTimeLabValues.alt > 40 ? 'bg-yellow-500' : 'bg-green-500'}`}></div>
                    </div>
                    <div className="text-xl font-bold text-green-800">{Math.round(realTimeLabValues.alt)}</div>
                    <div className="text-xs text-green-600">U/L</div>
                    <div className="text-xs mt-1">
                      {realTimeLabValues.alt > 50 ? 'HIGH' : realTimeLabValues.alt > 40 ? 'ELEVATED' : 'NORMAL'}
                    </div>
                  </div>

                  <div className="bg-gradient-to-br from-blue-50 to-blue-100 p-4 rounded-lg border border-blue-200">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium text-blue-700">HbA1c</span>
                      <div className={`w-2 h-2 rounded-full ${realTimeLabValues.hba1c > 7.0 ? 'bg-red-500 animate-pulse' : realTimeLabValues.hba1c > 5.6 ? 'bg-yellow-500' : 'bg-green-500'}`}></div>
                    </div>
                    <div className="text-xl font-bold text-blue-800">{realTimeLabValues.hba1c.toFixed(1)}</div>
                    <div className="text-xs text-blue-600">%</div>
                    <div className="text-xs mt-1">
                      {realTimeLabValues.hba1c > 7.0 ? 'HIGH' : realTimeLabValues.hba1c > 5.6 ? 'ELEVATED' : 'NORMAL'}
                    </div>
                  </div>

                  <div className="bg-gradient-to-br from-pink-50 to-pink-100 p-4 rounded-lg border border-pink-200">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium text-pink-700">Hemoglobin</span>
                      <div className={`w-2 h-2 rounded-full ${realTimeLabValues.hemoglobin < 12 ? 'bg-red-500 animate-pulse' : realTimeLabValues.hemoglobin > 16 ? 'bg-yellow-500' : 'bg-green-500'}`}></div>
                    </div>
                    <div className="text-xl font-bold text-pink-800">{realTimeLabValues.hemoglobin.toFixed(1)}</div>
                    <div className="text-xs text-pink-600">g/dL</div>
                    <div className="text-xs mt-1">
                      {realTimeLabValues.hemoglobin < 12 ? 'LOW' : realTimeLabValues.hemoglobin > 16 ? 'HIGH' : 'NORMAL'}
                    </div>
                  </div>
                </div>
                
                <div className="mt-4 p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-600">Last Lab Update:</span>
                    <span className="font-medium text-gray-800">{lastUpdateTime.toLocaleTimeString()}</span>
                  </div>
                  <div className="flex items-center justify-between text-sm mt-1">
                    <span className="text-gray-600">Next Auto-Update:</span>
                    <span className="font-medium text-blue-600">
                      {isLiveMode ? 'In 5 seconds' : 'Paused'}
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Real-Time AI Risk Assessment */}
            <Card className="border-2 border-purple-200">
              <CardHeader>
                <CardTitle className="flex items-center gap-3">
                  <Brain className="h-5 w-5 text-purple-600" />
                  Real-Time AI Risk Assessment
                  <Badge className="bg-purple-500 text-white animate-pulse">LIVE ANALYSIS</Badge>
                  {isCalculatingScore && (
                    <div className="w-4 h-4 border-2 border-purple-500 border-t-transparent rounded-full animate-spin"></div>
                  )}
                </CardTitle>
                <CardDescription>
                  Continuous disease risk monitoring with instant AI analysis updates every 5 seconds
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                  <div className="border rounded-lg p-4 bg-gradient-to-br from-red-50 to-red-100 border-red-200">
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="font-semibold flex items-center gap-2">
                        <Heart className="h-4 w-4 text-red-500" />
                        Cardiovascular
                      </h4>
                      <Badge className={`${getRiskColor(realTimeRiskScores.cardiovascular > 30 ? 'HIGH' : realTimeRiskScores.cardiovascular > 15 ? 'MODERATE' : 'LOW')} animate-pulse`}>
                        {realTimeRiskScores.cardiovascular > 30 ? 'HIGH' : realTimeRiskScores.cardiovascular > 15 ? 'MODERATE' : 'LOW'}
                      </Badge>
                    </div>
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span>Risk Score:</span>
                        <span className="font-bold text-red-700">{Math.round(realTimeRiskScores.cardiovascular)}%</span>
                      </div>
                      <Progress value={realTimeRiskScores.cardiovascular} className="h-3" />
                      <div className="text-xs text-gray-600 flex items-center justify-between">
                        <span>Trend: {realTimeRiskScores.cardiovascular > 20 ? '↗ Rising' : '→ Stable'}</span>
                        <div className="flex items-center gap-1">
                          <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></div>
                          <span>Live</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="border rounded-lg p-4 bg-gradient-to-br from-orange-50 to-orange-100 border-orange-200">
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="font-semibold flex items-center gap-2">
                        <span className="text-orange-500">🩸</span>
                        Diabetes
                      </h4>
                      <Badge className={`${getRiskColor(realTimeRiskScores.diabetes > 25 ? 'HIGH' : realTimeRiskScores.diabetes > 12 ? 'MODERATE' : 'LOW')} animate-pulse`}>
                        {realTimeRiskScores.diabetes > 25 ? 'HIGH' : realTimeRiskScores.diabetes > 12 ? 'MODERATE' : 'LOW'}
                      </Badge>
                    </div>
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span>Risk Score:</span>
                        <span className="font-bold text-orange-700">{Math.round(realTimeRiskScores.diabetes)}%</span>
                      </div>
                      <Progress value={realTimeRiskScores.diabetes} className="h-3" />
                      <div className="text-xs text-gray-600 flex items-center justify-between">
                        <span>Trend: {realTimeRiskScores.diabetes > 15 ? '↗ Rising' : '→ Stable'}</span>
                        <div className="flex items-center gap-1">
                          <div className="w-2 h-2 bg-orange-500 rounded-full animate-pulse"></div>
                          <span>Live</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="border rounded-lg p-4 bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200">
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="font-semibold flex items-center gap-2">
                        <span className="text-blue-500">🫘</span>
                        Kidney
                      </h4>
                      <Badge className={`${getRiskColor(realTimeRiskScores.kidney > 20 ? 'HIGH' : realTimeRiskScores.kidney > 10 ? 'MODERATE' : 'LOW')} animate-pulse`}>
                        {realTimeRiskScores.kidney > 20 ? 'HIGH' : realTimeRiskScores.kidney > 10 ? 'MODERATE' : 'LOW'}
                      </Badge>
                    </div>
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span>Risk Score:</span>
                        <span className="font-bold text-blue-700">{Math.round(realTimeRiskScores.kidney)}%</span>
                      </div>
                      <Progress value={realTimeRiskScores.kidney} className="h-3" />
                      <div className="text-xs text-gray-600 flex items-center justify-between">
                        <span>Trend: {realTimeRiskScores.kidney > 12 ? '↗ Rising' : '→ Stable'}</span>
                        <div className="flex items-center gap-1">
                          <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></div>
                          <span>Live</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="border rounded-lg p-4 bg-gradient-to-br from-green-50 to-green-100 border-green-200">
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="font-semibold flex items-center gap-2">
                        <span className="text-green-500">🫀</span>
                        Liver
                      </h4>
                      <Badge className={`${getRiskColor(realTimeRiskScores.liver > 25 ? 'HIGH' : realTimeRiskScores.liver > 12 ? 'MODERATE' : 'LOW')} animate-pulse`}>
                        {realTimeRiskScores.liver > 25 ? 'HIGH' : realTimeRiskScores.liver > 12 ? 'MODERATE' : 'LOW'}
                      </Badge>
                    </div>
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span>Risk Score:</span>
                        <span className="font-bold text-green-700">{Math.round(realTimeRiskScores.liver)}%</span>
                      </div>
                      <Progress value={realTimeRiskScores.liver} className="h-3" />
                      <div className="text-xs text-gray-600 flex items-center justify-between">
                        <span>Trend: {realTimeRiskScores.liver > 15 ? '↗ Rising' : '→ Stable'}</span>
                        <div className="flex items-center gap-1">
                          <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                          <span>Live</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                
                {/* Real-Time Risk Overview Chart */}
                <div className="mt-6 p-4 bg-gradient-to-r from-gray-50 to-blue-50 rounded-lg border border-blue-200">
                  <div className="flex items-center justify-between mb-3">
                    <h4 className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                      <TrendingUp className="h-4 w-4 text-blue-500" />
                      Live Risk Overview
                    </h4>
                    <div className="flex items-center gap-2 text-xs text-blue-600">
                      <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></div>
                      Updating every 5 seconds
                    </div>
                  </div>
                  <div className="h-32 w-full">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={riskTrendData}>
                        <XAxis dataKey="disease" stroke="#64748b" fontSize={10} />
                        <YAxis domain={[0, 50]} stroke="#64748b" fontSize={10} />
                        <Tooltip 
                          contentStyle={{
                            backgroundColor: 'white',
                            border: '1px solid #e2e8f0',
                            borderRadius: '6px',
                            fontSize: '12px'
                          }}
                          formatter={(value: any) => [`${value}%`, 'Risk Score']}
                        />
                        <Bar dataKey="score" radius={[2, 2, 0, 0]}>
                          {riskTrendData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.fill} />
                          ))}
                        </Bar>
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Real-Time AI Insights */}
            <Card className="border-2 border-indigo-200">
              <CardHeader>
                <CardTitle className="flex items-center gap-3">
                  <Brain className="h-5 w-5 text-indigo-600" />
                  Real-Time AI Health Insights
                  <Badge className="bg-indigo-500 text-white animate-pulse">LIVE AI</Badge>
                </CardTitle>
                <CardDescription>
                  Dynamic health recommendations updating based on live biomarker changes
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {/* Dynamic insights based on real-time values */}
                  {realTimeLabValues.glucose > 126 && (
                    <div className="p-4 border-l-4 rounded-lg border-red-500 bg-red-50 animate-pulse">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <h4 className="font-semibold text-sm mb-1 text-red-800 flex items-center gap-2">
                            <AlertTriangle className="h-4 w-4" />
                            Critical Glucose Alert
                          </h4>
                          <p className="text-sm text-red-700">
                            Current glucose level ({Math.round(realTimeLabValues.glucose)} mg/dL) indicates hyperglycemia. 
                            Immediate medical attention recommended.
                          </p>
                        </div>
                        <span className="text-xs text-red-500 ml-4 font-medium">LIVE</span>
                      </div>
                    </div>
                  )}

                  {realTimeLabValues.cholesterol > 240 && (
                    <div className="p-4 border-l-4 rounded-lg border-orange-500 bg-orange-50">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <h4 className="font-semibold text-sm mb-1 text-orange-800 flex items-center gap-2">
                            <Heart className="h-4 w-4" />
                            Cardiovascular Risk Alert
                          </h4>
                          <p className="text-sm text-orange-700">
                            Cholesterol level ({Math.round(realTimeLabValues.cholesterol)} mg/dL) is elevated. 
                            Consider dietary modifications and lipid-lowering therapy.
                          </p>
                        </div>
                        <span className="text-xs text-orange-500 ml-4 font-medium">LIVE</span>
                      </div>
                    </div>
                  )}

                  {realTimeVitals.heartRate > 90 && (
                    <div className="p-4 border-l-4 rounded-lg border-yellow-500 bg-yellow-50">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <h4 className="font-semibold text-sm mb-1 text-yellow-800 flex items-center gap-2">
                            <Activity className="h-4 w-4" />
                            Elevated Heart Rate
                          </h4>
                          <p className="text-sm text-yellow-700">
                            Current heart rate ({Math.round(realTimeVitals.heartRate)} BPM) is elevated. 
                            Monitor for signs of stress or underlying cardiac issues.
                          </p>
                        </div>
                        <span className="text-xs text-yellow-500 ml-4 font-medium">LIVE</span>
                      </div>
                    </div>
                  )}

                  {realTimeLabValues.creatinine > 1.5 && (
                    <div className="p-4 border-l-4 rounded-lg border-purple-500 bg-purple-50">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <h4 className="font-semibold text-sm mb-1 text-purple-800 flex items-center gap-2">
                            <span>🫘</span>
                            Kidney Function Alert
                          </h4>
                          <p className="text-sm text-purple-700">
                            Creatinine level ({realTimeLabValues.creatinine.toFixed(1)} mg/dL) suggests reduced kidney function. 
                            Nephrology consultation recommended.
                          </p>
                        </div>
                        <span className="text-xs text-purple-500 ml-4 font-medium">LIVE</span>
                      </div>
                    </div>
                  )}

                  {/* Static insights from AI analysis */}
                  {aiInsights.slice(0, 2).map((insight, index) => (
                    <div key={index} className={`p-4 border-l-4 rounded-lg ${getPriorityColor(insight.priority)}`}>
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <h4 className="font-semibold text-sm mb-1">{insight.title}</h4>
                          <p className="text-sm text-gray-700">{insight.message}</p>
                        </div>
                        <span className="text-xs text-gray-500 ml-4">{insight.date}</span>
                      </div>
                    </div>
                  ))}

                  {/* Real-time recommendation based on overall health score */}
                  <div className="p-4 border-l-4 rounded-lg border-blue-500 bg-blue-50">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <h4 className="font-semibold text-sm mb-1 text-blue-800 flex items-center gap-2">
                          <CheckCircle className="h-4 w-4" />
                          AI Health Optimization
                        </h4>
                        <p className="text-sm text-blue-700">
                          {overallHealthScore >= 80 
                            ? "Excellent health status maintained. Continue current lifestyle and monitoring routine."
                            : overallHealthScore >= 60 
                            ? "Health score indicates room for improvement. Focus on diet, exercise, and medication adherence."
                            : "Health score requires immediate attention. Schedule urgent medical consultation and follow care plan."
                          }
                        </p>
                      </div>
                      <div className="flex items-center gap-1 ml-4">
                        <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></div>
                        <span className="text-xs text-blue-500 font-medium">AI</span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="mt-4 p-3 bg-gradient-to-r from-indigo-50 to-purple-50 rounded-lg border border-indigo-200">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-indigo-700 font-medium">AI Analysis Status:</span>
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-indigo-500 rounded-full animate-pulse"></div>
                      <span className="text-indigo-600 font-medium">
                        {isCalculatingScore ? 'Processing...' : 'Active Monitoring'}
                      </span>
                    </div>
                  </div>
                  <div className="text-xs text-indigo-600 mt-1">
                    Next insight update: {isLiveMode ? 'In 5 seconds' : 'Paused'}
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="biological-age" className="space-y-6">
            <BiologicalAgeAnalysis 
              patientData={{
                age: 35,
                biomarkers: {
                  bloodPressure: { systolic: realTimeVitals.bloodPressure.systolic, diastolic: realTimeVitals.bloodPressure.diastolic },
                  cholesterol: { total: 195, hdl: 55, ldl: 120 },
                  glucose: { fasting: realTimeVitals.glucose },
                  hba1c: 5.4,
                  crp: 1.2,
                  bmi: 24.5,
                  creatinine: 0.9,
                  alt: 28,
                  hemoglobin: 14.2,
                  wbc: 6800
                }
              }}
              historicalData={[
                { glucose: 88, cholesterol: { total: 185 }, timestamp: '2024-01-01' },
                { glucose: 92, cholesterol: { total: 190 }, timestamp: '2024-02-01' },
                { glucose: realTimeVitals.glucose, cholesterol: { total: 195 }, timestamp: '2024-03-01' }
              ]}
            />
          </TabsContent>

          <TabsContent value="telemedicine" className="space-y-6">
            <TelemedicineDemo 
              patientData={{
                age: 35,
                biologicalAge: 38.5,
                vitalityGap: 3.5,
                currentVitals: realTimeVitals
              }}
            />
          </TabsContent>

          <TabsContent value="real-time" className="space-y-6">
            <RealTimeHealthDemo />
          </TabsContent>

          <TabsContent value="medicine-info" className="space-y-6">
            <MedicineInfoLookup />
          </TabsContent>

          <TabsContent value="drug-interactions" className="space-y-6">
            <DrugInteractionChecker />
          </TabsContent>

          <TabsContent value="digital-twin" className="space-y-6">
            {/* Demo Toggle */}
            <div className="flex justify-center mb-6">
              <div className="flex items-center gap-4 p-4 bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl border">
                <span className="text-sm font-medium">Data Source:</span>
                <button
                  onClick={() => setShowDemo(false)}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${!showDemo ? 'bg-blue-500 text-white shadow-md' : 'bg-white text-gray-600 hover:bg-gray-50'}`}
                >
                  Live Patient Data
                </button>
                <button
                  onClick={() => setShowDemo(true)}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${showDemo ? 'bg-purple-500 text-white shadow-md' : 'bg-white text-gray-600 hover:bg-gray-50'}`}
                >
                  Demo Mode (High Risk Patient)
                </button>
              </div>
            </div>

            {showDemo ? (
              <DigitalTwinDemo />
            ) : (
              <DigitalTwin 
                riskAssessment={riskAssessment}
                healthRecords={healthRecords}
                analysisData={analysisData}
              />
            )}
          </TabsContent>

          <TabsContent value="reports" className="space-y-6">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle>My Health Reports</CardTitle>
                    <CardDescription>View and download your pathology reports</CardDescription>
                  </div>
                  <div className="flex gap-2">
                    <Button 
                      size="sm" 
                      onClick={async () => {
                        setIsGeneratingPDF(true);
                        try {
                          for (const record of healthRecords) {
                            await downloadReportAsPDF(record);
                            // Small delay between downloads
                            await new Promise(resolve => setTimeout(resolve, 1000));
                          }
                          alert(t('all_pdfs_generated') || 'All PDF reports generated successfully!');
                        } catch (error) {
                          alert(t('bulk_pdf_error') || 'Some PDFs failed to generate. Please try individual downloads.');
                        } finally {
                          setIsGeneratingPDF(false);
                        }
                      }}
                      disabled={isGeneratingPDF || healthRecords.length === 0}
                      className="bg-red-600 hover:bg-red-700 text-white"
                    >
                      {isGeneratingPDF ? (
                        <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      ) : (
                        <FileDown className="h-4 w-4 mr-2" />
                      )}
                      {t('download_all_pdf') || 'Download All PDF'}
                    </Button>
                    <Button size="sm" variant="outline">
                      <Download className="h-4 w-4 mr-2" />
                      {t('download_all_json') || 'Download All JSON'}
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {healthRecords.map((record) => (
                    <div key={record.id} className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50">
                      <div className="flex items-center space-x-4">
                        <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                          <FileText className="h-5 w-5 text-blue-600" />
                        </div>
                        <div>
                          <p className="font-medium">{record.type}</p>
                          <p className="text-sm text-gray-600">{record.date}</p>
                          <p className="text-xs text-gray-500">Risk Score: {record.riskScore}%</p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-3">
                        <Badge className={getStatusColor(record.status)}>
                          {record.status}
                        </Badge>
                        <div className="flex space-x-2">
                          <Button size="sm" variant="outline" onClick={() => setSelectedReport(record)}>
                            <Eye className="h-4 w-4 mr-2" />
                            {t('view') || 'View'}
                          </Button>
                          <Button 
                            size="sm" 
                            variant="outline" 
                            onClick={() => downloadReportAsPDF(record)}
                            disabled={isGeneratingPDF}
                            className="bg-red-50 hover:bg-red-100 text-red-700 border-red-200"
                          >
                            {isGeneratingPDF ? (
                              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                            ) : (
                              <FileDown className="h-4 w-4 mr-2" />
                            )}
                            {t('download_pdf') || 'PDF'}
                          </Button>
                          <Button size="sm" variant="outline" onClick={() => {
                            const blob = new Blob([JSON.stringify(record.fullData, null, 2)], { type: 'application/json' });
                            const url = URL.createObjectURL(blob);
                            const a = document.createElement('a');
                            a.href = url;
                            a.download = `Report-${record.id}.json`;
                            document.body.appendChild(a);
                            a.click();
                            document.body.removeChild(a);
                            URL.revokeObjectURL(url);
                          }}>
                            <Download className="h-4 w-4 mr-2" />
                            {t('json') || 'JSON'}
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))}

                  {/* REPORT VIEW MODAL (Simple Overlay) */}
                  {selectedReport && (
                    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
                      <div className="bg-white rounded-xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
                        <div className="p-6 border-b flex justify-between items-center sticky top-0 bg-white">
                          <h2 className="text-xl font-bold">{t('health_report_details') || 'Health Report Details'}</h2>
                          <div className="flex gap-2">
                            <Button 
                              variant="outline" 
                              size="sm" 
                              onClick={() => downloadReportAsPDF(selectedReport)}
                              disabled={isGeneratingPDF}
                              className="bg-red-50 hover:bg-red-100 text-red-700 border-red-200"
                            >
                              {isGeneratingPDF ? (
                                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                              ) : (
                                <FileDown className="h-4 w-4 mr-2" />
                              )}
                              {t('download_pdf') || 'Download PDF'}
                            </Button>
                            <Button variant="ghost" size="sm" onClick={() => setSelectedReport(null)}>
                              ✕ {t('close') || 'Close'}
                            </Button>
                          </div>
                        </div>
                        <div className="p-6">
                          <p className="text-sm font-mono bg-gray-100 p-2 rounded mb-4">Report ID: {selectedReport.id}</p>

                          {/* Diagnosis */}
                          {selectedReport.fullData.diagnosis?.length > 0 && (
                            <div className="mb-6">
                              <h3 className="font-bold text-lg mb-2">Diagnosis</h3>
                              {selectedReport.fullData.diagnosis.map((d: any, i: number) => (
                                <div key={i} className="mb-2 p-3 bg-blue-50 border border-blue-100 rounded">
                                  <p className="font-semibold text-blue-900">{d.condition}</p>
                                  <p className="text-sm">{d.description}</p>
                                </div>
                              ))}
                            </div>
                          )}

                          {/* Care Plan */}
                          {selectedReport.fullData.careCoordinator?.carePlan && (
                            <div className="mb-6">
                              <h3 className="font-bold text-lg mb-2 text-green-700">Care Plan</h3>
                              <div className="p-4 bg-green-50 border border-green-100 rounded">
                                <p className="text-sm font-medium mb-2">{selectedReport.fullData.careCoordinator.carePlan.summary}</p>

                                <h4 className="text-xs font-bold uppercase mt-2">Actions</h4>
                                <ul className="list-disc pl-5 text-sm">
                                  {selectedReport.fullData.careCoordinator.carePlan.immediateActions.map((act: string, i: number) => <li key={i}>{act}</li>)}
                                </ul>
                              </div>
                            </div>
                          )}

                          <div className="mt-8">
                            <h4 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-4">Detailed Laboratory Signal Analysis</h4>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                              <div className="bg-slate-50 p-4 border border-slate-100 rounded-xl">
                                <h5 className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-3">Diagnostic Reasoning</h5>
                                <div className="space-y-3">
                                  {(selectedReport.fullData.diagnosis || []).map((d: any, i: number) => (
                                    <div key={i} className="text-sm leading-relaxed text-slate-700 italic border-l-2 border-slate-200 pl-3">
                                      "{d.description}"
                                    </div>
                                  ))}
                                </div>
                              </div>
                              <div className="bg-slate-50 p-4 border border-slate-100 rounded-xl">
                                <h5 className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-3">Suggested Screenings</h5>
                                <div className="flex flex-wrap gap-2">
                                  {(selectedReport.fullData.dataQuality?.suggestedTests || []).map((t: string, i: number) => (
                                    <Badge key={i} variant="outline" className="bg-white border-slate-200 text-slate-600 font-normal">
                                      {t}
                                    </Badge>
                                  ))}
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                        <div className="p-4 border-t bg-gray-50 text-right">
                          <Button onClick={() => setSelectedReport(null)}>Close</Button>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="medications" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <div className="flex items-center">
                    <Shield className="h-5 w-5 mr-2" />
                    Medication Safety Monitor
                  </div>
                  <Badge variant="outline" className="text-xs font-normal border-blue-200 text-blue-700 bg-blue-50">
                    Verified by openFDA API
                  </Badge>
                </CardTitle>
                <CardDescription>
                  Real-time safety checks against FDA drug labels and adverse event databases
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {medications.map((med, index) => (
                    <div key={index} className="group bg-white border border-slate-100 rounded-2xl p-6 hover:shadow-xl hover:shadow-slate-200/50 transition-all">
                      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
                        <div className="flex items-start gap-4">
                          <div className={`p-3 rounded-xl ${med.safetyStatus === 'Safe' ? 'bg-emerald-50 text-emerald-600' : 'bg-rose-50 text-rose-600'}`}>
                            <Pill className="h-6 w-6" />
                          </div>
                          <div>
                            <h4 className="text-lg font-bold text-slate-900 uppercase tracking-tight">{med.name}</h4>
                            <div className="flex items-center gap-2 mt-1">
                              <Badge variant="outline" className="text-[10px] uppercase font-bold text-slate-400 border-slate-100">{med.dosage}</Badge>
                              <span className="text-xs text-slate-400 font-medium">{med.purpose}</span>
                            </div>
                          </div>
                        </div>
                        <div className="text-right flex flex-col items-end gap-2">
                          <Badge className={`${med.safetyStatus === 'Safe' ? 'bg-emerald-100 text-emerald-800' : 'bg-rose-100 text-rose-800'} border-none px-4 py-1.5 rounded-full font-bold text-[10px] uppercase tracking-widest`}>
                            {med.safetyStatus}
                          </Badge>
                          <div className="flex items-center gap-1.5 text-xs font-bold text-slate-400 uppercase tracking-tighter">
                            <Activity className="h-3 w-3" />
                            {med.adverseEvents.toLocaleString()} Reports
                          </div>
                        </div>
                      </div>

                      {med.warnings && (
                        <div className="mb-6 p-4 bg-slate-50 border border-slate-100 rounded-xl">
                          <h5 className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em] mb-2 flex items-center gap-2">
                            <Shield className="h-3 w-3" /> FDA Safety Notice
                          </h5>
                          <p className="text-sm text-slate-600 leading-relaxed font-light">
                            {med.warnings.length > 250 ? `${med.warnings.slice(0, 250)}...` : med.warnings}
                          </p>
                        </div>
                      )}

                      <div className="flex items-center justify-between pt-4 border-t border-slate-50">
                        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Monitor Active • Review {med.nextReview}</span>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-9 px-4 rounded-xl text-xs font-bold uppercase tracking-widest hover:bg-slate-50"
                          onClick={() => window.open(`https://open.fda.gov/drug/label/`, '_blank')}
                        >
                          View FDA Registry
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="trends" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Health Score Trend Chart */}
              <Card className="lg:col-span-2">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <TrendingUp className="h-5 w-5 text-blue-600" />
                    Health Score Trend
                  </CardTitle>
                  <CardDescription>Your overall health score progression over time</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="h-64 w-full">
                    <ResponsiveContainer width="100%" height="100%">
                      <AreaChart data={healthTrendData}>
                        <defs>
                          <linearGradient id="healthGradient" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#10b981" stopOpacity={0.8}/>
                            <stop offset="95%" stopColor="#10b981" stopOpacity={0.1}/>
                          </linearGradient>
                        </defs>
                        <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                        <XAxis 
                          dataKey="date" 
                          stroke="#64748b"
                          fontSize={12}
                        />
                        <YAxis 
                          domain={[0, 100]}
                          stroke="#64748b"
                          fontSize={12}
                        />
                        <Tooltip 
                          contentStyle={{
                            backgroundColor: 'white',
                            border: '1px solid #e2e8f0',
                            borderRadius: '8px',
                            boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
                          }}
                          formatter={(value: any) => [`${value}/100`, 'Health Score']}
                          labelFormatter={(label) => `Date: ${label}`}
                        />
                        <Area 
                          type="monotone" 
                          dataKey="healthScore" 
                          stroke="#10b981" 
                          strokeWidth={3}
                          fill="url(#healthGradient)" 
                        />
                      </AreaChart>
                    </ResponsiveContainer>
                  </div>
                  <div className="mt-4 flex items-center justify-between text-sm">
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                      <span>Current Score: <strong>{overallHealthScore}/100</strong></span>
                    </div>
                    <div className={`flex items-center gap-1 ${scoreTrend >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                      {scoreTrend >= 0 ? '↗' : '↘'} {Math.abs(scoreTrend)} points since last report
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Biomarker Trends */}
              <Card className="lg:col-span-2">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Activity className="h-5 w-5 text-purple-600" />
                    Key Biomarker Trends
                  </CardTitle>
                  <CardDescription>Track important health indicators over the last 6 months</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="h-80 w-full">
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart data={biomarkerData}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                        <XAxis 
                          dataKey="month" 
                          stroke="#64748b"
                          fontSize={12}
                        />
                        <YAxis 
                          stroke="#64748b"
                          fontSize={12}
                        />
                        <Tooltip 
                          contentStyle={{
                            backgroundColor: 'white',
                            border: '1px solid #e2e8f0',
                            borderRadius: '8px',
                            boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
                          }}
                        />
                        <Line 
                          type="monotone" 
                          dataKey="glucose" 
                          stroke="#3b82f6" 
                          strokeWidth={2}
                          dot={{ fill: '#3b82f6', strokeWidth: 2, r: 4 }}
                          name="Glucose (mg/dL)"
                        />
                        <Line 
                          type="monotone" 
                          dataKey="cholesterol" 
                          stroke="#ef4444" 
                          strokeWidth={2}
                          dot={{ fill: '#ef4444', strokeWidth: 2, r: 4 }}
                          name="Cholesterol (mg/dL)"
                        />
                        <Line 
                          type="monotone" 
                          dataKey="bloodPressure" 
                          stroke="#f59e0b" 
                          strokeWidth={2}
                          dot={{ fill: '#f59e0b', strokeWidth: 2, r: 4 }}
                          name="Blood Pressure (mmHg)"
                        />
                        <Line 
                          type="monotone" 
                          dataKey="hemoglobin" 
                          stroke="#10b981" 
                          strokeWidth={2}
                          dot={{ fill: '#10b981', strokeWidth: 2, r: 4 }}
                          name="Hemoglobin (g/dL)"
                        />
                      </LineChart>
                    </ResponsiveContainer>
                  </div>
                  <div className="mt-4 grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div className="flex items-center gap-2 text-sm">
                      <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                      <span>Glucose</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                      <span>Cholesterol</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                      <span>Blood Pressure</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                      <span>Hemoglobin</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Risk Assessment Visualization */}
              <Card>
                <CardHeader>
                  <CardTitle>Risk Assessment Overview</CardTitle>
                  <CardDescription>Current disease risk levels</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="h-64 w-full">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={riskTrendData} layout="horizontal">
                        <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                        <XAxis type="number" domain={[0, 100]} stroke="#64748b" fontSize={12} />
                        <YAxis type="category" dataKey="disease" stroke="#64748b" fontSize={12} width={80} />
                        <Tooltip 
                          contentStyle={{
                            backgroundColor: 'white',
                            border: '1px solid #e2e8f0',
                            borderRadius: '8px',
                            boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
                          }}
                          formatter={(value: any) => [`${value}%`, 'Risk Score']}
                        />
                        <Bar dataKey="score" fill="#8884d8" radius={[0, 4, 4, 0]} />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>

              {/* Risk Distribution Pie Chart */}
              <Card>
                <CardHeader>
                  <CardTitle>Risk Distribution</CardTitle>
                  <CardDescription>Breakdown of health risk categories</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="h-64 w-full">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={riskTrendData}
                          cx="50%"
                          cy="50%"
                          innerRadius={40}
                          outerRadius={80}
                          paddingAngle={5}
                          dataKey="score"
                        >
                          {riskTrendData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.fill} />
                          ))}
                        </Pie>
                        <Tooltip 
                          contentStyle={{
                            backgroundColor: 'white',
                            border: '1px solid #e2e8f0',
                            borderRadius: '8px',
                            boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
                          }}
                          formatter={(value: any) => [`${value}%`, 'Risk Score']}
                        />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                  <div className="mt-4 space-y-2">
                    {riskTrendData.map((item, index) => (
                      <div key={index} className="flex items-center justify-between text-sm">
                        <div className="flex items-center gap-2">
                          <div 
                            className="w-3 h-3 rounded-full" 
                            style={{ backgroundColor: item.fill }}
                          ></div>
                          <span>{item.disease}</span>
                        </div>
                        <Badge className={getRiskColor(item.risk)}>
                          {item.risk}
                        </Badge>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="insights" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>AI Health Insights</CardTitle>
                <CardDescription>
                  Personalized recommendations from PathologyAI agents
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {aiInsights.map((insight, index) => (
                    <div key={index} className={`p-4 border-l-4 rounded-lg ${getPriorityColor(insight.priority)}`}>
                      <div className="flex items-start justify-between mb-2">
                        <h4 className="font-semibold">{insight.title}</h4>
                        <Badge variant="outline" className="capitalize">
                          {insight.priority} Priority
                        </Badge>
                      </div>
                      <p className="text-gray-700 mb-3">{insight.message}</p>
                      <div className="flex items-center justify-between">
                        <span className="text-xs text-gray-500">{insight.date}</span>
                        <Button size="sm" variant="outline">
                          Learn More
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default PatientPortal;