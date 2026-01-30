import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Heart, 
  Brain, 
  Activity,
  AlertTriangle,
  CheckCircle,
  Clock,
  Zap,
  Eye
} from 'lucide-react';

interface OrganRisk {
  organ: string;
  currentRisk: 'LOW' | 'MODERATE' | 'HIGH';
  futureRisk: 'LOW' | 'MODERATE' | 'HIGH';
  riskScore: number;
  timeframe: string;
  biomarkers: string[];
  recommendations: string[];
}

interface DigitalTwinProps {
  riskAssessment: any;
  healthRecords: any[];
  analysisData: any;
}

const DigitalTwin: React.FC<DigitalTwinProps> = ({ riskAssessment, healthRecords, analysisData }) => {
  const [selectedOrgan, setSelectedOrgan] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<'current' | 'future'>('current');
  const [organRisks, setOrganRisks] = useState<OrganRisk[]>([]);

  useEffect(() => {
    // Process risk assessment data into organ-specific risks
    const processedRisks: OrganRisk[] = [
      {
        organ: 'heart',
        currentRisk: riskAssessment?.cardiovascular?.risk || 'LOW',
        futureRisk: calculateFutureRisk(riskAssessment?.cardiovascular?.risk || 'LOW'),
        riskScore: riskAssessment?.cardiovascular?.score || 15,
        timeframe: '6-12 months',
        biomarkers: ['Cholesterol', 'Blood Pressure', 'Triglycerides', 'CRP'],
        recommendations: ['Regular cardio exercise 30min/day', 'Monitor blood pressure daily', 'Reduce sodium intake <2g/day', 'Omega-3 supplements']
      },
      {
        organ: 'liver',
        currentRisk: riskAssessment?.liver?.risk || 'LOW',
        futureRisk: calculateFutureRisk(riskAssessment?.liver?.risk || 'LOW'),
        riskScore: riskAssessment?.liver?.score || 10,
        timeframe: '12-18 months',
        biomarkers: ['ALT', 'AST', 'Bilirubin', 'Albumin', 'GGT'],
        recommendations: ['Limit alcohol to <1 drink/day', 'Maintain healthy BMI 18.5-24.9', 'Regular liver function tests', 'Avoid hepatotoxic medications']
      },
      {
        organ: 'kidneys',
        currentRisk: riskAssessment?.kidney?.risk || 'LOW',
        futureRisk: calculateFutureRisk(riskAssessment?.kidney?.risk || 'LOW'),
        riskScore: riskAssessment?.kidney?.score || 12,
        timeframe: '9-15 months',
        biomarkers: ['Creatinine', 'BUN', 'GFR', 'Proteinuria', 'Cystatin C'],
        recommendations: ['Maintain hydration 8-10 glasses/day', 'Monitor blood pressure <130/80', 'Limit protein if CKD present', 'Avoid NSAIDs long-term']
      },
      {
        organ: 'pancreas',
        currentRisk: riskAssessment?.diabetes?.risk || 'LOW',
        futureRisk: calculateFutureRisk(riskAssessment?.diabetes?.risk || 'LOW'),
        riskScore: riskAssessment?.diabetes?.score || 20,
        timeframe: '3-6 months',
        biomarkers: ['Glucose', 'HbA1c', 'Insulin', 'C-peptide', 'Lipase'],
        recommendations: ['Monitor blood sugar 2x daily', 'Low glycemic index diet', 'Regular exercise 150min/week', 'Weight management if overweight']
      },
      {
        organ: 'lungs',
        currentRisk: 'LOW',
        futureRisk: 'LOW',
        riskScore: 8,
        timeframe: '12+ months',
        biomarkers: ['Oxygen saturation', 'Respiratory rate', 'Peak flow', 'CO diffusion'],
        recommendations: ['Avoid smoking/secondhand smoke', 'Regular breathing exercises', 'Air quality monitoring', 'Annual chest X-ray if high risk']
      },
      {
        organ: 'brain',
        currentRisk: 'LOW',
        futureRisk: 'MODERATE',
        riskScore: 25,
        timeframe: '18-24 months',
        biomarkers: ['Blood pressure', 'Cholesterol', 'Glucose', 'Homocysteine', 'B12'],
        recommendations: ['Mental exercises/puzzles daily', 'Stress management techniques', 'Regular sleep 7-9 hours', 'Mediterranean diet pattern']
      },
      {
        organ: 'stomach',
        currentRisk: 'LOW',
        futureRisk: 'LOW',
        riskScore: 5,
        timeframe: '24+ months',
        biomarkers: ['H. pylori', 'Pepsinogen', 'Gastrin', 'pH levels'],
        recommendations: ['Avoid spicy/acidic foods if symptomatic', 'Regular meal timing', 'Limit alcohol consumption', 'Manage stress levels']
      }
    ];

    setOrganRisks(processedRisks);
  }, [riskAssessment]);

  const calculateFutureRisk = (currentRisk: string): 'LOW' | 'MODERATE' | 'HIGH' => {
    // Simple logic to show progression for demo
    if (currentRisk === 'LOW') return Math.random() > 0.7 ? 'MODERATE' : 'LOW';
    if (currentRisk === 'MODERATE') return Math.random() > 0.5 ? 'HIGH' : 'MODERATE';
    return 'HIGH';
  };

  const getRiskColor = (risk: string, isActive: boolean = false) => {
    const opacity = isActive ? '1' : '0.7';
    switch (risk) {
      case 'LOW': return `rgba(16, 185, 129, ${opacity})`; // Green
      case 'MODERATE': return `rgba(245, 158, 11, ${opacity})`; // Yellow
      case 'HIGH': return `rgba(239, 68, 68, ${opacity})`; // Red
      default: return `rgba(156, 163, 175, ${opacity})`; // Gray
    }
  };

  const getOrganRisk = (organName: string) => {
    return organRisks.find(r => r.organ === organName);
  };

  const selectedOrganData = selectedOrgan ? getOrganRisk(selectedOrgan) : null;

  return (
    <div className="space-y-6">
      {/* Header */}
      <Card className="border-2 border-blue-100 bg-gradient-to-r from-blue-50 to-indigo-50">
        <CardHeader>
          <CardTitle className="flex items-center gap-3 text-2xl">
            <Zap className="h-7 w-7 text-blue-600" />
            Patient Digital Twin
          </CardTitle>
          <CardDescription className="text-base">
            AI-powered predictive health visualization showing current status and future risk projections
          </CardDescription>
        </CardHeader>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Digital Twin Visualization */}
        <Card className="lg:col-span-2 relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 opacity-50"></div>
          <CardHeader className="relative">
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center gap-2">
                <Activity className="h-5 w-5 text-purple-600" />
                Interactive Body Map
                <Badge variant="outline" className="ml-2 bg-gradient-to-r from-purple-100 to-pink-100 text-purple-700 border-purple-200">
                  AI-Powered
                </Badge>
              </CardTitle>
              <Tabs value={viewMode} onValueChange={(v) => setViewMode(v as 'current' | 'future')}>
                <TabsList className="grid w-full grid-cols-2 bg-white/80 backdrop-blur-sm">
                  <TabsTrigger value="current" className="data-[state=active]:bg-blue-500 data-[state=active]:text-white">
                    Current Status
                  </TabsTrigger>
                  <TabsTrigger value="future" className="data-[state=active]:bg-purple-500 data-[state=active]:text-white">
                    6-12 Month Forecast
                  </TabsTrigger>
                </TabsList>
              </Tabs>
            </div>
            <CardDescription>
              Click on organs to see detailed risk analysis and AI recommendations
              {viewMode === 'future' && (
                <Badge className="ml-2 bg-purple-100 text-purple-800 animate-pulse">
                  Predictive Mode
                </Badge>
              )}
            </CardDescription>
          </CardHeader>
          <CardContent className="relative">
            <div className="flex justify-center">
              <div className="relative">
                <svg
                  width="450"
                  height="700"
                  viewBox="0 0 450 700"
                  className="border rounded-2xl bg-gradient-to-b from-gray-900 via-gray-800 to-gray-900 shadow-2xl"
                >
                  {/* Medical Imaging Background */}
                  <defs>
                    {/* Medical Scan Grid */}
                    <pattern id="medicalScan" width="10" height="10" patternUnits="userSpaceOnUse">
                      <path d="M 10 0 L 0 0 0 10" fill="none" stroke="#1f2937" strokeWidth="0.3" opacity="0.6"/>
                      <circle cx="5" cy="5" r="0.2" fill="#374151" opacity="0.4"/>
                    </pattern>
                    
                    {/* X-Ray Style Body Gradient */}
                    <radialGradient id="xrayGradient" cx="50%" cy="40%" r="60%">
                      <stop offset="0%" stopColor="#f3f4f6" stopOpacity="0.9"/>
                      <stop offset="70%" stopColor="#e5e7eb" stopOpacity="0.7"/>
                      <stop offset="100%" stopColor="#d1d5db" stopOpacity="0.5"/>
                    </radialGradient>
                    
                    {/* Bone Structure Gradient */}
                    <linearGradient id="boneGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                      <stop offset="0%" stopColor="#f9fafb" stopOpacity="0.8"/>
                      <stop offset="50%" stopColor="#f3f4f6" stopOpacity="0.6"/>
                      <stop offset="100%" stopColor="#e5e7eb" stopOpacity="0.4"/>
                    </linearGradient>
                    
                    {/* Advanced Organ Glow Effects */}
                    <filter id="organGlow" x="-50%" y="-50%" width="200%" height="200%">
                      <feGaussianBlur stdDeviation="4" result="coloredBlur"/>
                      <feMerge> 
                        <feMergeNode in="coloredBlur"/>
                        <feMergeNode in="SourceGraphic"/>
                      </feMerge>
                    </filter>
                    
                    {/* Critical Alert Glow */}
                    <filter id="criticalGlow" x="-100%" y="-100%" width="300%" height="300%">
                      <feGaussianBlur stdDeviation="6" result="coloredBlur"/>
                      <feColorMatrix in="coloredBlur" type="matrix" values="1 0 0 0 0.9  0 0 0 0 0.2  0 0 0 0 0.2  0 0 0 1 0"/>
                      <feMerge> 
                        <feMergeNode in="coloredBlur"/>
                        <feMergeNode in="SourceGraphic"/>
                      </feMerge>
                    </filter>
                  </defs>
                  
                  <rect width="100%" height="100%" fill="url(#medicalScan)" />

                  {/* Realistic Skeletal Structure */}
                  <g className="skeletal-structure" opacity="0.15">
                    {/* Skull */}
                    <ellipse cx="225" cy="90" rx="45" ry="50" fill="url(#boneGradient)" stroke="#9ca3af" strokeWidth="1"/>
                    
                    {/* Spine */}
                    <rect x="222" y="135" width="6" height="300" fill="url(#boneGradient)" rx="3"/>
                    <circle cx="225" cy="150" r="3" fill="url(#boneGradient)"/>
                    <circle cx="225" cy="180" r="3" fill="url(#boneGradient)"/>
                    <circle cx="225" cy="210" r="3" fill="url(#boneGradient)"/>
                    <circle cx="225" cy="240" r="3" fill="url(#boneGradient)"/>
                    <circle cx="225" cy="270" r="3" fill="url(#boneGradient)"/>
                    
                    {/* Rib Cage */}
                    <ellipse cx="225" cy="200" rx="80" ry="60" fill="none" stroke="url(#boneGradient)" strokeWidth="2" opacity="0.3"/>
                    <ellipse cx="225" cy="220" rx="85" ry="65" fill="none" stroke="url(#boneGradient)" strokeWidth="2" opacity="0.3"/>
                    <ellipse cx="225" cy="240" rx="80" ry="60" fill="none" stroke="url(#boneGradient)" strokeWidth="2" opacity="0.3"/>
                    
                    {/* Pelvis */}
                    <ellipse cx="225" cy="380" rx="60" ry="30" fill="none" stroke="url(#boneGradient)" strokeWidth="2" opacity="0.4"/>
                  </g>

                  {/* Realistic Body Outline */}
                  <g className="body-outline">
                    {/* Head - More realistic proportions */}
                    <ellipse cx="225" cy="90" rx="40" ry="45" fill="url(#xrayGradient)" stroke="#6b7280" strokeWidth="2" opacity="0.3"/>
                    
                    {/* Neck */}
                    <rect x="210" y="130" width="30" height="35" fill="url(#xrayGradient)" stroke="#6b7280" strokeWidth="1" opacity="0.3"/>
                    
                    {/* Torso - Anatomically correct */}
                    <path
                      d="M180 165 C170 165 160 175 160 190 L160 280 C160 320 165 350 175 380 L175 450 C175 480 185 500 200 520 L200 580 C200 600 210 620 225 620 C240 620 250 600 250 580 L250 520 C265 500 275 480 275 450 L275 380 C285 350 290 320 290 280 L290 190 C290 175 280 165 270 165 L225 160 L180 165 Z"
                      fill="url(#xrayGradient)"
                      stroke="#6b7280"
                      strokeWidth="2"
                      opacity="0.3"
                    />
                    
                    {/* Arms - More realistic positioning */}
                    <ellipse cx="130" cy="220" rx="20" ry="80" fill="url(#xrayGradient)" stroke="#6b7280" strokeWidth="1" transform="rotate(-20 130 220)" opacity="0.3"/>
                    <ellipse cx="320" cy="220" rx="20" ry="80" fill="url(#xrayGradient)" stroke="#6b7280" strokeWidth="1" transform="rotate(20 320 220)" opacity="0.3"/>
                    
                    {/* Legs - Proper proportions */}
                    <ellipse cx="200" cy="550" rx="25" ry="90" fill="url(#xrayGradient)" stroke="#6b7280" strokeWidth="1" opacity="0.3"/>
                    <ellipse cx="250" cy="550" rx="25" ry="90" fill="url(#xrayGradient)" stroke="#6b7280" strokeWidth="1" opacity="0.3"/>
                  </g>

                  {/* Realistic Brain with Detailed Structure */}
                  <g className="brain-system" onClick={() => setSelectedOrgan(selectedOrgan === 'brain' ? null : 'brain')}>
                    {/* Brain Hemispheres */}
                    <path
                      d="M190 75 C185 65 195 60 205 65 C215 60 225 65 220 75 C230 70 240 75 245 85 C250 95 245 105 235 110 C240 120 230 125 220 120 C225 130 215 135 205 130 C195 135 185 130 190 120 C180 125 170 120 175 110 C165 105 160 95 165 85 C170 75 180 70 190 75 Z"
                      fill={getRiskColor(getOrganRisk('brain')?.[viewMode === 'current' ? 'currentRisk' : 'futureRisk'] || 'LOW', selectedOrgan === 'brain')}
                      stroke="#374151"
                      strokeWidth="2"
                      filter="url(#organGlow)"
                      className="cursor-pointer hover:opacity-90 transition-all duration-300 hover:scale-105 drop-shadow-2xl"
                    />
                    {/* Brain Folds and Sulci */}
                    <path d="M190 85 Q205 80 220 85 M185 95 Q205 90 225 95 M190 105 Q205 100 220 105" 
                          stroke="#1f2937" strokeWidth="1" opacity="0.6"/>
                    {/* Corpus Callosum */}
                    <path d="M200 90 Q205 85 210 90" stroke="#1f2937" strokeWidth="1.5" opacity="0.7"/>
                    
                    {selectedOrgan === 'brain' && (
                      <>
                        <circle cx="205" cy="90" r="50" fill="none" stroke="#8b5cf6" strokeWidth="3" strokeDasharray="8,4" className="animate-spin" style={{animationDuration: '4s'}}/>
                        {/* Neural Activity Indicators */}
                        <circle cx="195" cy="85" r="2" fill="#8b5cf6" className="animate-ping"/>
                        <circle cx="215" cy="95" r="2" fill="#8b5cf6" className="animate-ping" style={{animationDelay: '0.5s'}}/>
                        <circle cx="205" cy="105" r="2" fill="#8b5cf6" className="animate-ping" style={{animationDelay: '1s'}}/>
                      </>
                    )}
                  </g>

                  {/* Anatomically Accurate Heart */}
                  <g className="heart-system" onClick={() => setSelectedOrgan(selectedOrgan === 'heart' ? null : 'heart')}>
                    {/* Heart Shape - More realistic */}
                    <path
                      d="M200 200 C190 185 175 185 175 205 C175 225 200 250 225 275 C250 250 275 225 275 205 C275 185 260 185 250 200 C245 185 235 185 225 205 C235 185 225 185 215 200 C210 185 200 185 200 200 Z"
                      fill={getRiskColor(getOrganRisk('heart')?.[viewMode === 'current' ? 'currentRisk' : 'futureRisk'] || 'LOW', selectedOrgan === 'heart')}
                      stroke="#374151"
                      strokeWidth="2"
                      filter={getOrganRisk('heart')?.[viewMode === 'current' ? 'currentRisk' : 'futureRisk'] === 'HIGH' ? "url(#criticalGlow)" : "url(#organGlow)"}
                      className="cursor-pointer hover:opacity-90 transition-all duration-300 hover:scale-105 drop-shadow-2xl"
                    />
                    
                    {/* Heart Chambers - Anatomically correct */}
                    <path d="M210 215 Q225 210 240 215" stroke="#1f2937" strokeWidth="1.5" opacity="0.7"/>
                    <path d="M210 235 Q225 230 240 235" stroke="#1f2937" strokeWidth="1.5" opacity="0.7"/>
                    <path d="M225 210 L225 250" stroke="#1f2937" strokeWidth="1" opacity="0.6"/>
                    
                    {/* Aorta and Major Vessels */}
                    <path d="M225 185 Q220 175 215 165" stroke="#dc2626" strokeWidth="3" opacity="0.8"/>
                    <path d="M225 185 Q230 175 235 165" stroke="#1e40af" strokeWidth="3" opacity="0.8"/>
                    
                    {/* Heartbeat Animation */}
                    <animateTransform
                      attributeName="transform"
                      attributeType="XML"
                      type="scale"
                      values="1;1.08;1"
                      dur="0.8s"
                      repeatCount="indefinite"
                    />
                    
                    {selectedOrgan === 'heart' && (
                      <>
                        <circle cx="225" cy="225" r="35" fill="none" stroke="#ef4444" strokeWidth="3" className="animate-pulse"/>
                        {/* EKG Trace */}
                        <path d="M180 280 L190 280 L195 270 L200 290 L205 260 L210 280 L270 280" 
                              stroke="#ef4444" strokeWidth="2" fill="none" className="animate-pulse"/>
                        {/* Blood Flow Animation */}
                        <circle cx="215" cy="175" r="3" fill="#ef4444" className="animate-bounce"/>
                        <circle cx="235" cy="175" r="3" fill="#1e40af" className="animate-bounce" style={{animationDelay: '0.4s'}}/>
                      </>
                    )}
                  </g>

                  {/* Detailed Lung Structure */}
                  <g className="lung-system" onClick={() => setSelectedOrgan(selectedOrgan === 'lungs' ? null : 'lungs')}>
                    {/* Left Lung - Realistic shape with lobes */}
                    <path
                      d="M170 180 C155 180 145 190 145 210 L145 290 C145 310 155 325 170 330 C185 335 195 325 195 305 L195 285 C200 280 200 270 195 265 L195 210 C195 190 185 180 170 180 Z"
                      fill={getRiskColor(getOrganRisk('lungs')?.[viewMode === 'current' ? 'currentRisk' : 'futureRisk'] || 'LOW', selectedOrgan === 'lungs')}
                      stroke="#374151"
                      strokeWidth="2"
                      filter="url(#organGlow)"
                      className="cursor-pointer hover:opacity-90 transition-all duration-300 hover:scale-105 drop-shadow-2xl"
                    />
                    
                    {/* Right Lung - Three lobes */}
                    <path
                      d="M280 180 C295 180 305 190 305 210 L305 290 C305 310 295 325 280 330 C265 335 255 325 255 305 L255 285 C250 280 250 270 255 265 L255 245 C250 240 250 230 255 225 L255 210 C255 190 265 180 280 180 Z"
                      fill={getRiskColor(getOrganRisk('lungs')?.[viewMode === 'current' ? 'currentRisk' : 'futureRisk'] || 'LOW', selectedOrgan === 'lungs')}
                      stroke="#374151"
                      strokeWidth="2"
                      filter="url(#organGlow)"
                      className="cursor-pointer hover:opacity-90 transition-all duration-300 hover:scale-105 drop-shadow-2xl"
                    />
                    
                    {/* Bronchial Tree - Detailed */}
                    <path d="M225 165 L225 185 M225 185 L195 200 M225 185 L255 200 M195 200 L180 220 M195 200 L185 240 M255 200 L270 220 M255 200 L265 240" 
                          stroke="#1f2937" strokeWidth="1.5" opacity="0.6"/>
                    
                    {/* Alveoli representation */}
                    <circle cx="170" cy="220" r="2" fill="#1e40af" opacity="0.4"/>
                    <circle cx="175" cy="240" r="2" fill="#1e40af" opacity="0.4"/>
                    <circle cx="165" cy="260" r="2" fill="#1e40af" opacity="0.4"/>
                    <circle cx="280" cy="220" r="2" fill="#1e40af" opacity="0.4"/>
                    <circle cx="275" cy="240" r="2" fill="#1e40af" opacity="0.4"/>
                    <circle cx="285" cy="260" r="2" fill="#1e40af" opacity="0.4"/>
                    
                    {/* Breathing Animation */}
                    <animateTransform
                      attributeName="transform"
                      attributeType="XML"
                      type="scale"
                      values="1;1.03;1"
                      dur="4s"
                      repeatCount="indefinite"
                    />
                    
                    {selectedOrgan === 'lungs' && (
                      <>
                        <ellipse cx="170" cy="255" rx="25" ry="50" fill="none" stroke="#06b6d4" strokeWidth="2" className="animate-pulse"/>
                        <ellipse cx="280" cy="255" rx="25" ry="50" fill="none" stroke="#06b6d4" strokeWidth="2" className="animate-pulse"/>
                        {/* Oxygen Flow */}
                        <circle cx="170" cy="230" r="3" fill="#06b6d4" className="animate-ping"/>
                        <circle cx="280" cy="230" r="3" fill="#06b6d4" className="animate-ping"/>
                      </>
                    )}
                  </g>

                  {/* Anatomically Accurate Liver */}
                  <g className="liver-system" onClick={() => setSelectedOrgan(selectedOrgan === 'liver' ? null : 'liver')}>
                    <path
                      d="M255 300 C285 300 315 315 315 340 C315 365 305 385 285 395 C275 400 265 398 255 390 C250 385 248 375 252 365 C256 355 260 345 265 335 C268 325 270 315 270 305 C270 300 265 295 260 295 C255 295 250 298 255 300 Z"
                      fill={getRiskColor(getOrganRisk('liver')?.[viewMode === 'current' ? 'currentRisk' : 'futureRisk'] || 'LOW', selectedOrgan === 'liver')}
                      stroke="#374151"
                      strokeWidth="2"
                      filter="url(#organGlow)"
                      className="cursor-pointer hover:opacity-90 transition-all duration-300 hover:scale-105 drop-shadow-2xl"
                    />
                    
                    {/* Liver Lobes and Segments */}
                    <path d="M270 320 Q285 325 295 335 M275 340 Q285 345 290 355 M265 360 Q275 365 280 375" 
                          stroke="#1f2937" strokeWidth="1" opacity="0.6"/>
                    
                    {/* Hepatic Vessels */}
                    <path d="M260 310 Q270 315 280 320" stroke="#dc2626" strokeWidth="2" opacity="0.7"/>
                    <path d="M265 330 Q275 335 285 340" stroke="#1e40af" strokeWidth="2" opacity="0.7"/>
                    
                    {selectedOrgan === 'liver' && (
                      <>
                        <path d="M255 300 C285 300 315 315 315 340 C315 365 305 385 285 395 C275 400 265 398 255 390 C250 385 248 375 252 365 C256 355 260 345 265 335 C268 325 270 315 270 305 C270 300 265 295 260 295 C255 295 250 298 255 300 Z" 
                              fill="none" stroke="#f97316" strokeWidth="3" strokeDasharray="10,5" className="animate-pulse"/>
                        {/* Metabolic Activity */}
                        <circle cx="275" cy="340" r="2" fill="#f97316" className="animate-ping"/>
                        <circle cx="285" cy="360" r="2" fill="#f97316" className="animate-ping" style={{animationDelay: '0.3s'}}/>
                      </>
                    )}
                  </g>

                  {/* Detailed Pancreas */}
                  <g className="pancreas-system" onClick={() => setSelectedOrgan(selectedOrgan === 'pancreas' ? null : 'pancreas')}>
                    <path
                      d="M180 340 C165 340 155 345 155 355 C155 365 165 375 180 375 C195 375 210 370 220 365 C230 360 235 355 235 350 C235 345 230 340 220 340 C210 340 195 340 180 340 Z"
                      fill={getRiskColor(getOrganRisk('pancreas')?.[viewMode === 'current' ? 'currentRisk' : 'futureRisk'] || 'LOW', selectedOrgan === 'pancreas')}
                      stroke="#374151"
                      strokeWidth="2"
                      filter="url(#organGlow)"
                      className="cursor-pointer hover:opacity-90 transition-all duration-300 hover:scale-105 drop-shadow-2xl"
                    />
                    
                    {/* Pancreatic Duct */}
                    <path d="M165 355 L225 355" stroke="#1f2937" strokeWidth="1.5" opacity="0.6"/>
                    
                    {/* Islets of Langerhans */}
                    <circle cx="175" cy="350" r="1.5" fill="#10b981" opacity="0.8"/>
                    <circle cx="190" cy="360" r="1.5" fill="#10b981" opacity="0.8"/>
                    <circle cx="205" cy="350" r="1.5" fill="#10b981" opacity="0.8"/>
                    <circle cx="220" cy="360" r="1.5" fill="#10b981" opacity="0.8"/>
                    
                    {selectedOrgan === 'pancreas' && (
                      <>
                        <ellipse cx="195" cy="355" rx="40" ry="20" fill="none" stroke="#10b981" strokeWidth="2" className="animate-pulse"/>
                        {/* Insulin Production */}
                        <circle cx="175" cy="350" r="3" fill="#10b981" className="animate-ping"/>
                        <circle cx="205" cy="350" r="3" fill="#10b981" className="animate-ping" style={{animationDelay: '0.5s'}}/>
                      </>
                    )}
                  </g>

                  {/* Realistic Kidneys */}
                  <g className="kidney-system" onClick={() => setSelectedOrgan(selectedOrgan === 'kidneys' ? null : 'kidneys')}>
                    {/* Left Kidney */}
                    <path
                      d="M170 380 C155 380 145 390 145 405 L145 435 C145 450 155 465 170 465 C185 465 195 450 195 435 L195 420 C200 415 200 405 195 400 L195 405 C195 390 185 380 170 380 Z"
                      fill={getRiskColor(getOrganRisk('kidneys')?.[viewMode === 'current' ? 'currentRisk' : 'futureRisk'] || 'LOW', selectedOrgan === 'kidneys')}
                      stroke="#374151"
                      strokeWidth="2"
                      filter="url(#organGlow)"
                      className="cursor-pointer hover:opacity-90 transition-all duration-300 hover:scale-105 drop-shadow-2xl"
                    />
                    
                    {/* Right Kidney */}
                    <path
                      d="M280 380 C295 380 305 390 305 405 L305 435 C305 450 295 465 280 465 C265 465 255 450 255 435 L255 420 C250 415 250 405 255 400 L255 405 C255 390 265 380 280 380 Z"
                      fill={getRiskColor(getOrganRisk('kidneys')?.[viewMode === 'current' ? 'currentRisk' : 'futureRisk'] || 'LOW', selectedOrgan === 'kidneys')}
                      stroke="#374151"
                      strokeWidth="2"
                      filter="url(#organGlow)"
                      className="cursor-pointer hover:opacity-90 transition-all duration-300 hover:scale-105 drop-shadow-2xl"
                    />
                    
                    {/* Kidney Internal Structure - Cortex and Medulla */}
                    <ellipse cx="170" cy="422" rx="12" ry="25" fill="none" stroke="#1f2937" strokeWidth="1" opacity="0.5"/>
                    <ellipse cx="280" cy="422" rx="12" ry="25" fill="none" stroke="#1f2937" strokeWidth="1" opacity="0.5"/>
                    <ellipse cx="170" cy="422" rx="6" ry="15" fill="none" stroke="#1f2937" strokeWidth="1" opacity="0.7"/>
                    <ellipse cx="280" cy="422" rx="6" ry="15" fill="none" stroke="#1f2937" strokeWidth="1" opacity="0.7"/>
                    
                    {/* Ureters */}
                    <path d="M170 465 Q175 480 180 500" stroke="#1f2937" strokeWidth="2" opacity="0.6"/>
                    <path d="M280 465 Q275 480 270 500" stroke="#1f2937" strokeWidth="2" opacity="0.6"/>
                    
                    {selectedOrgan === 'kidneys' && (
                      <>
                        <ellipse cx="170" cy="422" rx="20" ry="35" fill="none" stroke="#3b82f6" strokeWidth="2" className="animate-pulse"/>
                        <ellipse cx="280" cy="422" rx="20" ry="35" fill="none" stroke="#3b82f6" strokeWidth="2" className="animate-pulse"/>
                        {/* Filtration Activity */}
                        <circle cx="170" cy="410" r="2" fill="#3b82f6" className="animate-ping"/>
                        <circle cx="280" cy="410" r="2" fill="#3b82f6" className="animate-ping" style={{animationDelay: '0.4s'}}/>
                      </>
                    )}
                  </g>

                  {/* Realistic Stomach */}
                  <g className="stomach-system" onClick={() => setSelectedOrgan(selectedOrgan === 'stomach' ? null : 'stomach')}>
                    <path
                      d="M180 310 C165 310 155 320 155 335 C155 350 165 365 180 370 C195 375 210 373 220 365 C230 357 235 345 230 335 C225 325 215 315 205 310 C195 305 185 308 180 310 Z"
                      fill={getRiskColor('LOW', selectedOrgan === 'stomach')}
                      stroke="#374151"
                      strokeWidth="2"
                      filter="url(#organGlow)"
                      className="cursor-pointer hover:opacity-90 transition-all duration-300 hover:scale-105 drop-shadow-2xl"
                    />
                    
                    {/* Stomach Folds (Rugae) */}
                    <path d="M170 325 Q185 320 200 325 M170 340 Q185 335 200 340 M170 355 Q185 350 200 355" 
                          stroke="#1f2937" strokeWidth="1" opacity="0.5"/>
                    
                    {/* Esophageal Connection */}
                    <path d="M185 310 Q190 300 195 290" stroke="#1f2937" strokeWidth="2" opacity="0.6"/>
                    
                    {selectedOrgan === 'stomach' && (
                      <>
                        <path d="M180 310 C165 310 155 320 155 335 C155 350 165 365 180 370 C195 375 210 373 220 365 C230 357 235 345 230 335 C225 325 215 315 205 310 C195 305 185 308 180 310 Z" 
                              fill="none" stroke="#8b5cf6" strokeWidth="2" className="animate-pulse"/>
                        {/* Digestive Activity */}
                        <circle cx="185" cy="340" r="2" fill="#8b5cf6" className="animate-ping"/>
                      </>
                    )}
                  </g>

                  {/* Enhanced Risk Indicators with Medical Accuracy */}
                  {organRisks.map((organ, index) => {
                    const risk = viewMode === 'current' ? organ.currentRisk : organ.futureRisk;
                    if (risk === 'HIGH' || risk === 'MODERATE') {
                      const positions = {
                        brain: { x: 280, y: 80 },
                        heart: { x: 290, y: 220 },
                        lungs: { x: 330, y: 250 },
                        liver: { x: 330, y: 350 },
                        pancreas: { x: 240, y: 340 },
                        kidneys: { x: 330, y: 420 },
                        stomach: { x: 240, y: 320 }
                      };
                      const pos = positions[organ.organ as keyof typeof positions];
                      if (pos) {
                        return (
                          <g key={organ.organ}>
                            {/* Medical Alert Symbol */}
                            <circle
                              cx={pos.x}
                              cy={pos.y}
                              r="15"
                              fill={risk === 'HIGH' ? '#dc2626' : '#f59e0b'}
                              stroke="#ffffff"
                              strokeWidth="2"
                              className="drop-shadow-lg animate-pulse"
                            />
                            <text x={pos.x} y={pos.y + 2} textAnchor="middle" className="text-sm fill-white font-bold">⚠</text>
                            
                            {/* Pulsing Rings */}
                            <circle
                              cx={pos.x}
                              cy={pos.y}
                              r="20"
                              fill="none"
                              stroke={risk === 'HIGH' ? '#dc2626' : '#f59e0b'}
                              strokeWidth="2"
                              opacity="0.6"
                              className="animate-ping"
                            />
                          </g>
                        );
                      }
                    }
                    return null;
                  })}

                  {/* Medical Grade Organ Labels */}
                  <g className="organ-labels" style={{ fontSize: '12px', fontWeight: '600', fill: '#e5e7eb' }}>
                    <text x="225" y="50" textAnchor="middle">CEREBRUM</text>
                    <text x="225" y="300" textAnchor="middle">CARDIAC</text>
                    <text x="100" y="250" textAnchor="middle" transform="rotate(-90 100 250)">PULMONARY</text>
                    <text x="350" y="350" textAnchor="middle">HEPATIC</text>
                    <text x="225" y="500" textAnchor="middle">RENAL</text>
                  </g>
                </svg>

                {/* Enhanced Medical Interface */}
                {viewMode === 'future' && (
                  <div className="absolute top-6 right-6 bg-gradient-to-r from-purple-600 to-pink-600 text-white px-4 py-2 rounded-lg text-sm font-bold animate-pulse shadow-xl border border-purple-400">
                    🔮 PREDICTIVE ANALYSIS MODE
                  </div>
                )}
                
                {selectedOrgan && (
                  <div className="absolute top-6 left-6 bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-4 py-2 rounded-lg text-sm font-bold shadow-xl border border-blue-400">
                    📊 ANALYZING: {selectedOrgan.toUpperCase()}
                  </div>
                )}

                {/* Medical Grade Status Display */}
                <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2 bg-gray-900/90 backdrop-blur-sm rounded-lg px-6 py-3 shadow-xl border border-gray-600">
                  <div className="flex items-center gap-6 text-sm text-gray-300">
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
                      <span className="font-mono">{organRisks.filter(o => (viewMode === 'current' ? o.currentRisk : o.futureRisk) === 'LOW').length} NORMAL</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 bg-yellow-500 rounded-full animate-pulse"></div>
                      <span className="font-mono">{organRisks.filter(o => (viewMode === 'current' ? o.currentRisk : o.futureRisk) === 'MODERATE').length} MODERATE</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 bg-red-500 rounded-full animate-pulse"></div>
                      <span className="font-mono">{organRisks.filter(o => (viewMode === 'current' ? o.currentRisk : o.futureRisk) === 'HIGH').length} CRITICAL</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Enhanced Legend */}
            <div className="mt-6 p-4 bg-white/60 backdrop-blur-sm rounded-lg border">
              <div className="flex justify-center">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 rounded-full bg-green-500 shadow-sm"></div>
                    <span className="font-medium">Low Risk</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 rounded-full bg-yellow-500 shadow-sm"></div>
                    <span className="font-medium">Moderate Risk</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 rounded-full bg-red-500 shadow-sm"></div>
                    <span className="font-medium">High Risk</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 rounded-full bg-red-500 animate-pulse shadow-sm"></div>
                    <span className="font-medium">Critical Alert</span>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Enhanced Organ Details Panel */}
        <Card className="relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-indigo-50 via-white to-purple-50 opacity-60"></div>
          <CardHeader className="relative">
            <CardTitle className="flex items-center gap-2">
              {selectedOrgan ? (
                <>
                  {selectedOrgan === 'heart' && <Heart className="h-5 w-5 text-red-500" />}
                  {selectedOrgan === 'brain' && <Brain className="h-5 w-5 text-purple-500" />}
                  {selectedOrgan === 'kidneys' && <Activity className="h-5 w-5 text-blue-500" />}
                  {selectedOrgan === 'liver' && <Activity className="h-5 w-5 text-orange-500" />}
                  {selectedOrgan === 'lungs' && <Activity className="h-5 w-5 text-cyan-500" />}
                  {selectedOrgan === 'pancreas' && <Activity className="h-5 w-5 text-green-500" />}
                  <span className="capitalize">{selectedOrganData?.organ} Analysis</span>
                  <Badge className="ml-2 bg-gradient-to-r from-blue-500 to-purple-500 text-white">
                    AI Insights
                  </Badge>
                </>
              ) : (
                <>
                  <Eye className="h-5 w-5 text-gray-500" />
                  Select an Organ
                  <Badge variant="outline" className="ml-2 text-gray-500">
                    Interactive Mode
                  </Badge>
                </>
              )}
            </CardTitle>
          </CardHeader>
          <CardContent className="relative">
            {selectedOrganData ? (
              <div className="space-y-6">
                {/* Enhanced Current vs Future Risk */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="text-center p-4 bg-white/80 backdrop-blur-sm rounded-xl border shadow-sm">
                    <p className="text-xs text-gray-500 uppercase font-bold tracking-wider mb-2">Current Status</p>
                    <Badge className={`text-sm px-3 py-1 ${selectedOrganData.currentRisk === 'LOW' ? 'bg-green-100 text-green-800 border-green-200' : selectedOrganData.currentRisk === 'MODERATE' ? 'bg-yellow-100 text-yellow-800 border-yellow-200' : 'bg-red-100 text-red-800 border-red-200'}`}>
                      {selectedOrganData.currentRisk}
                    </Badge>
                  </div>
                  <div className="text-center p-4 bg-gradient-to-br from-blue-50 to-purple-50 rounded-xl border shadow-sm">
                    <p className="text-xs text-blue-600 uppercase font-bold tracking-wider mb-2">AI Forecast</p>
                    <Badge className={`text-sm px-3 py-1 ${selectedOrganData.futureRisk === 'LOW' ? 'bg-green-100 text-green-800 border-green-200' : selectedOrganData.futureRisk === 'MODERATE' ? 'bg-yellow-100 text-yellow-800 border-yellow-200' : 'bg-red-100 text-red-800 border-red-200'}`}>
                      {selectedOrganData.futureRisk}
                    </Badge>
                  </div>
                </div>

                {/* Enhanced Risk Score with Animation */}
                <div className="p-4 bg-gradient-to-r from-purple-50 via-pink-50 to-indigo-50 rounded-xl border shadow-sm">
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-sm font-semibold text-gray-700">Risk Score</span>
                    <span className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                      {selectedOrganData.riskScore}%
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
                    <div 
                      className="bg-gradient-to-r from-purple-500 via-pink-500 to-indigo-500 h-3 rounded-full transition-all duration-1000 ease-out shadow-sm"
                      style={{ width: `${selectedOrganData.riskScore}%` }}
                    ></div>
                  </div>
                  <div className="flex justify-between text-xs text-gray-500 mt-2">
                    <span>Low</span>
                    <span>Moderate</span>
                    <span>High</span>
                  </div>
                </div>

                {/* Enhanced Timeframe */}
                <div className="flex items-center gap-3 p-4 bg-gradient-to-r from-orange-50 to-amber-50 rounded-xl border shadow-sm">
                  <Clock className="h-5 w-5 text-orange-600" />
                  <div>
                    <p className="text-xs text-orange-600 uppercase font-bold tracking-wider">Projection Timeline</p>
                    <p className="text-sm font-semibold text-gray-700">{selectedOrganData.timeframe}</p>
                  </div>
                </div>

                {/* Enhanced Key Biomarkers */}
                <div className="space-y-3">
                  <h4 className="text-sm font-bold text-gray-700 flex items-center gap-2">
                    <Activity className="h-4 w-4 text-blue-500" />
                    Key Biomarkers
                  </h4>
                  <div className="grid grid-cols-2 gap-2">
                    {selectedOrganData.biomarkers.map((biomarker, index) => (
                      <Badge 
                        key={index} 
                        variant="outline" 
                        className="text-xs py-1 px-2 bg-white/80 backdrop-blur-sm border-blue-200 text-blue-700 hover:bg-blue-50 transition-colors"
                      >
                        {biomarker}
                      </Badge>
                    ))}
                  </div>
                </div>

                {/* Enhanced Recommendations */}
                <div className="space-y-3">
                  <h4 className="text-sm font-bold text-gray-700 flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-green-600" />
                    AI Recommendations
                  </h4>
                  <div className="space-y-2">
                    {selectedOrganData.recommendations.map((rec, index) => (
                      <div key={index} className="flex items-start gap-3 p-3 bg-white/80 backdrop-blur-sm rounded-lg border shadow-sm hover:shadow-md transition-shadow">
                        <span className="text-green-500 mt-0.5 text-lg">•</span>
                        <span className="text-sm text-gray-700 leading-relaxed">{rec}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Enhanced Action Button */}
                <Button className="w-full mt-6 bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 hover:from-blue-700 hover:via-purple-700 hover:to-pink-700 text-white font-semibold py-3 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105">
                  <Activity className="h-4 w-4 mr-2" />
                  Schedule Specialist Consultation
                </Button>
              </div>
            ) : (
              <div className="text-center py-12 text-gray-500">
                <div className="relative">
                  <Eye className="h-16 w-16 mx-auto mb-6 opacity-30" />
                  <div className="absolute inset-0 bg-gradient-to-r from-blue-400 to-purple-400 opacity-20 rounded-full blur-xl"></div>
                </div>
                <p className="text-sm leading-relaxed max-w-xs mx-auto">
                  Click on any organ in the interactive body map to see detailed risk analysis and AI-powered health recommendations.
                </p>
                <div className="mt-4 flex justify-center gap-2">
                  <div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce"></div>
                  <div className="w-2 h-2 bg-purple-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                  <div className="w-2 h-2 bg-pink-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Risk Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {organRisks.map((organ) => (
          <Card 
            key={organ.organ}
            className={`cursor-pointer transition-all hover:shadow-lg ${selectedOrgan === organ.organ ? 'ring-2 ring-blue-500 bg-blue-50' : ''}`}
            onClick={() => setSelectedOrgan(selectedOrgan === organ.organ ? null : organ.organ)}
          >
            <CardContent className="p-4">
              <div className="flex items-center justify-between mb-2">
                <h4 className="font-semibold capitalize text-sm">{organ.organ}</h4>
                {(organ.currentRisk === 'HIGH' || organ.futureRisk === 'HIGH') && (
                  <AlertTriangle className="h-4 w-4 text-red-500" />
                )}
              </div>
              <div className="flex justify-between text-xs text-gray-600">
                <span>Current: <Badge className={`ml-1 ${organ.currentRisk === 'LOW' ? 'bg-green-100 text-green-800' : organ.currentRisk === 'MODERATE' ? 'bg-yellow-100 text-yellow-800' : 'bg-red-100 text-red-800'}`}>{organ.currentRisk}</Badge></span>
                <span>Future: <Badge className={`ml-1 ${organ.futureRisk === 'LOW' ? 'bg-green-100 text-green-800' : organ.futureRisk === 'MODERATE' ? 'bg-yellow-100 text-yellow-800' : 'bg-red-100 text-red-800'}`}>{organ.futureRisk}</Badge></span>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default DigitalTwin;