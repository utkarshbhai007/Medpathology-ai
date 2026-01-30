import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Activity, Heart, Brain, AlertTriangle, CheckCircle } from 'lucide-react';
import { 
  calculateOverallHealthScore, 
  processBiomarkersFromLabData, 
  type OrganRiskData,
  type HealthScoreResult 
} from '@/utils/healthScoring';

const RealTimeHealthDemo: React.FC = () => {
  const [healthScore, setHealthScore] = useState<HealthScoreResult | null>(null);
  const [isCalculating, setIsCalculating] = useState(false);

  // Demo organ risk data with realistic medical scenarios
  const demoOrganRisks: OrganRiskData[] = [
    {
      organ: 'heart',
      currentRisk: 'MODERATE',
      futureRisk: 'HIGH',
      riskScore: 65,
      biomarkers: ['Cholesterol', 'LDL', 'HDL', 'Triglycerides', 'CRP'],
      criticalValues: { cholesterol: 1.2, ldl: 1.6 } // 20% and 60% above normal
    },
    {
      organ: 'liver',
      currentRisk: 'HIGH',
      futureRisk: 'HIGH',
      riskScore: 35,
      biomarkers: ['ALT', 'AST', 'Bilirubin', 'Albumin'],
      criticalValues: { alt: 3.6, ast: 2.8 } // Significantly elevated
    },
    {
      organ: 'kidneys',
      currentRisk: 'MODERATE',
      futureRisk: 'MODERATE',
      riskScore: 55,
      biomarkers: ['Creatinine', 'BUN', 'GFR'],
      criticalValues: { creatinine: 1.4 } // 40% above normal
    },
    {
      organ: 'pancreas',
      currentRisk: 'HIGH',
      futureRisk: 'HIGH',
      riskScore: 40,
      biomarkers: ['Glucose', 'HbA1c', 'Insulin'],
      criticalValues: { glucose: 1.8, hba1c: 2.0 } // Diabetic range
    },
    {
      organ: 'lungs',
      currentRisk: 'LOW',
      futureRisk: 'LOW',
      riskScore: 85,
      biomarkers: ['Oxygen saturation', 'Respiratory rate']
    },
    {
      organ: 'brain',
      currentRisk: 'LOW',
      futureRisk: 'MODERATE',
      riskScore: 75,
      biomarkers: ['Blood pressure', 'Cholesterol', 'Glucose']
    }
  ];

  // Demo lab data with critical values
  const demoLabData = {
    glucose: 180,        // High (normal: 70-100)
    cholesterol: 240,    // High (normal: <200)
    ldl: 160,           // High (normal: <100)
    hdl: 35,            // Low (normal: >40)
    triglycerides: 200,  // Borderline high (normal: <150)
    creatinine: 1.7,    // High (normal: 0.6-1.2)
    bun: 28,            // High (normal: 7-20)
    alt: 145,           // Very high (normal: 7-40)
    ast: 112,           // Very high (normal: 10-40)
    hba1c: 11.2,        // Very high (normal: <5.6)
    hemoglobin: 11.5,   // Low (normal: 12-16)
    wbc: 12.5,          // High (normal: 4-11)
    platelets: 450      // High normal (normal: 150-450)
  };

  // Real-time calculation effect
  useEffect(() => {
    const calculateScore = () => {
      setIsCalculating(true);
      
      setTimeout(() => {
        try {
          // Add slight variations to lab values for realistic real-time simulation
          const dynamicLabData = {
            ...demoLabData,
            glucose: Math.max(160, Math.min(200, demoLabData.glucose + (Math.random() - 0.5) * 10)), // ±5 variation
            cholesterol: Math.max(220, Math.min(260, demoLabData.cholesterol + (Math.random() - 0.5) * 20)), // ±10 variation
            creatinine: Math.max(1.5, Math.min(1.9, demoLabData.creatinine + (Math.random() - 0.5) * 0.2)), // ±0.1 variation
            alt: Math.max(130, Math.min(160, demoLabData.alt + (Math.random() - 0.5) * 20)), // ±10 variation
            hba1c: Math.max(10.8, Math.min(11.6, demoLabData.hba1c + (Math.random() - 0.5) * 0.4)), // ±0.2 variation
          };

          const biomarkers = processBiomarkersFromLabData(dynamicLabData);
          const newScore = calculateOverallHealthScore(demoOrganRisks, biomarkers, healthScore?.overallScore);
          setHealthScore(newScore);
        } catch (error) {
          console.error('Demo health score calculation error:', error);
        } finally {
          setIsCalculating(false);
        }
      }, 1500); // Simulate realistic calculation time
    };

    // Initial calculation
    calculateScore();

    // Update every 12 seconds for more frequent demo updates
    const interval = setInterval(calculateScore, 12000);

    return () => clearInterval(interval);
  }, [healthScore?.overallScore]);

  if (!healthScore) {
    return (
      <Card className="border-2 border-blue-200">
        <CardContent className="flex items-center justify-center h-32">
          <div className="flex items-center gap-3">
            <div className="w-6 h-6 border-3 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
            <span>Calculating real-time health score...</span>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="border-2 border-blue-200 bg-gradient-to-r from-blue-50 to-indigo-50">
      <CardHeader>
        <CardTitle className="flex items-center gap-3">
          <Activity className="h-6 w-6 text-blue-600" />
          Real-Time Health Analytics Demo
          <Badge className="bg-green-500 text-white animate-pulse">LIVE</Badge>
          {isCalculating && (
            <div className="w-4 h-4 border-2 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
          )}
        </CardTitle>
        <CardDescription>
          AI-powered continuous health monitoring based on critical lab values and organ dysfunction
        </CardDescription>
      </CardHeader>
      <CardContent>
        {/* Overall Score Display */}
        <div className="mb-6 p-4 bg-white rounded-lg border border-gray-200">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <Heart className="h-8 w-8 text-red-500" />
              <div>
                <div className="text-3xl font-bold text-red-600">{healthScore.overallScore}/100</div>
                <div className="text-sm text-gray-600">Overall Health Score</div>
              </div>
            </div>
            <div className="text-right">
              <Badge className={`text-lg px-4 py-2 ${
                healthScore.category === 'EXCELLENT' ? 'bg-green-500' :
                healthScore.category === 'GOOD' ? 'bg-blue-500' :
                healthScore.category === 'FAIR' ? 'bg-yellow-500' :
                'bg-red-500'
              } text-white`}>
                {healthScore.category}
              </Badge>
              <div className={`text-sm mt-1 ${
                healthScore.trend === 'IMPROVING' ? 'text-green-600' :
                healthScore.trend === 'DECLINING' ? 'text-red-600' :
                'text-gray-600'
              }`}>
                {healthScore.trend === 'IMPROVING' ? '↗ Improving' :
                 healthScore.trend === 'DECLINING' ? '↘ Declining' :
                 '→ Stable'}
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Organ Score Breakdown */}
          <div className="space-y-4">
            <h4 className="font-semibold text-gray-700 flex items-center gap-2">
              <Brain className="h-5 w-5" />
              Organ System Scores
            </h4>
            <div className="space-y-3">
              {Object.entries(healthScore.organScores).map(([organ, score]) => (
                <div key={organ} className="flex justify-between items-center p-2 bg-white rounded border">
                  <span className="text-sm capitalize font-medium">{organ}</span>
                  <div className="flex items-center gap-2">
                    <div className="w-20 bg-gray-200 rounded-full h-2">
                      <div 
                        className={`h-2 rounded-full transition-all duration-500 ${
                          score >= 80 ? 'bg-green-500' :
                          score >= 60 ? 'bg-yellow-500' : 'bg-red-500'
                        }`}
                        style={{ width: `${score}%` }}
                      ></div>
                    </div>
                    <span className="text-sm font-bold w-8">{Math.round(score)}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Critical Risk Factors */}
          <div className="space-y-4">
            <h4 className="font-semibold text-gray-700 flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-red-500" />
              Critical Risk Factors
            </h4>
            <div className="space-y-2">
              {healthScore.riskFactors.map((risk, index) => (
                <div key={index} className="flex items-start gap-2 p-3 bg-red-50 rounded-lg border border-red-200">
                  <AlertTriangle className="h-4 w-4 text-red-500 mt-0.5 shrink-0" />
                  <span className="text-sm text-red-700 font-medium">{risk}</span>
                </div>
              ))}
            </div>
          </div>

          {/* AI Recommendations */}
          <div className="space-y-4">
            <h4 className="font-semibold text-gray-700 flex items-center gap-2">
              <CheckCircle className="h-5 w-5 text-blue-500" />
              Immediate Actions
            </h4>
            <div className="space-y-2">
              {healthScore.recommendations.map((rec, index) => (
                <div key={index} className="flex items-start gap-2 p-3 bg-blue-50 rounded-lg border border-blue-200">
                  <CheckCircle className="h-4 w-4 text-blue-500 mt-0.5 shrink-0" />
                  <span className="text-sm text-blue-700">{rec}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Real-time Status */}
        <div className="mt-6 p-4 bg-gradient-to-r from-red-50 to-orange-50 rounded-lg border border-red-200">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-3 h-3 bg-red-500 rounded-full animate-pulse"></div>
              <span className="text-sm font-medium text-red-700">Critical patient - Real-time monitoring active</span>
            </div>
            <div className="flex items-center gap-4 text-xs text-gray-600">
              <span>Last Update: <strong>{healthScore.lastUpdated.toLocaleTimeString()}</strong></span>
              <Badge variant="outline" className="border-red-300 text-red-700">
                Multiple organ dysfunction
              </Badge>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default RealTimeHealthDemo;