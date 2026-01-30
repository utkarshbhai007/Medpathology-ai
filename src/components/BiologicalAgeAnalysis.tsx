import React, { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { 
  Clock, 
  TrendingUp, 
  TrendingDown, 
  Heart, 
  Activity, 
  Shield, 
  Brain,
  Calendar,
  Target,
  AlertTriangle,
  CheckCircle,
  ArrowRight,
  Zap
} from 'lucide-react';
import { BiologicalAgeCalculator, BiologicalAgeData } from '@/utils/biologicalAge';

interface BiologicalAgeAnalysisProps {
  patientData: any;
  historicalData?: any[];
}

const BiologicalAgeAnalysis: React.FC<BiologicalAgeAnalysisProps> = ({ 
  patientData, 
  historicalData = [] 
}) => {
  const [biologicalAgeData, setBiologicalAgeData] = useState<BiologicalAgeData | null>(null);
  const [showDetails, setShowDetails] = useState(false);

  useEffect(() => {
    if (patientData) {
      const ageData = BiologicalAgeCalculator.calculateBiologicalAge(
        patientData.age || 35,
        patientData.biomarkers || {},
        historicalData
      );
      setBiologicalAgeData(ageData);
    }
  }, [patientData, historicalData]);

  if (!biologicalAgeData) {
    return (
      <Card className="p-6">
        <div className="flex items-center gap-3 mb-4">
          <Clock className="h-6 w-6 text-blue-600" />
          <h3 className="text-lg font-semibold">Biological Age Analysis</h3>
        </div>
        <p className="text-gray-600">Loading biological age calculation...</p>
      </Card>
    );
  }

  const getVitalityColor = (score: number) => {
    if (score >= 80) return 'text-green-600';
    if (score >= 60) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getVitalityBgColor = (score: number) => {
    if (score >= 80) return 'bg-green-50 border-green-200';
    if (score >= 60) return 'bg-yellow-50 border-yellow-200';
    return 'bg-red-50 border-red-200';
  };

  const getUrgencyColor = (urgency: string) => {
    switch (urgency) {
      case 'immediate': return 'bg-red-100 text-red-800 border-red-200';
      case 'within_month': return 'bg-orange-100 text-orange-800 border-orange-200';
      case 'routine': return 'bg-blue-100 text-blue-800 border-blue-200';
      default: return 'bg-green-100 text-green-800 border-green-200';
    }
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'cardiovascular': return <Heart className="h-4 w-4" />;
      case 'metabolic': return <Activity className="h-4 w-4" />;
      case 'inflammatory': return <Shield className="h-4 w-4" />;
      case 'cognitive': return <Brain className="h-4 w-4" />;
      default: return <Zap className="h-4 w-4" />;
    }
  };

  return (
    <div className="space-y-6">
      {/* Main Biological Age Card */}
      <Card className={`p-6 ${getVitalityBgColor(biologicalAgeData.vitalityScore)}`}>
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <Clock className="h-6 w-6 text-blue-600" />
            <h3 className="text-xl font-bold">Biological Age Analysis</h3>
          </div>
          <Badge variant="outline" className="text-sm">
            Longevity Intelligence
          </Badge>
        </div>

        <div className="grid md:grid-cols-3 gap-6 mb-6">
          {/* Chronological Age */}
          <div className="text-center">
            <Calendar className="h-8 w-8 mx-auto mb-2 text-gray-600" />
            <p className="text-sm text-gray-600 mb-1">Chronological Age</p>
            <p className="text-3xl font-bold text-gray-800">
              {biologicalAgeData.chronologicalAge}
            </p>
            <p className="text-xs text-gray-500">Years since birth</p>
          </div>

          {/* Biological Age */}
          <div className="text-center">
            <div className="flex items-center justify-center mb-2">
              {biologicalAgeData.vitalityGap > 0 ? (
                <TrendingUp className="h-8 w-8 text-red-500" />
              ) : (
                <TrendingDown className="h-8 w-8 text-green-500" />
              )}
            </div>
            <p className="text-sm text-gray-600 mb-1">Biological Age</p>
            <p className={`text-3xl font-bold ${biologicalAgeData.vitalityGap > 0 ? 'text-red-600' : 'text-green-600'}`}>
              {biologicalAgeData.biologicalAge}
            </p>
            <p className="text-xs text-gray-500">
              {biologicalAgeData.vitalityGap > 0 ? 'Aging faster' : 'Aging slower'}
            </p>
          </div>

          {/* Vitality Score */}
          <div className="text-center">
            <Target className="h-8 w-8 mx-auto mb-2 text-blue-600" />
            <p className="text-sm text-gray-600 mb-1">Vitality Score</p>
            <p className={`text-3xl font-bold ${getVitalityColor(biologicalAgeData.vitalityScore)}`}>
              {biologicalAgeData.vitalityScore}
            </p>
            <p className="text-xs text-gray-500">Out of 100</p>
          </div>
        </div>

        {/* Vitality Gap Alert */}
        <div className="bg-white rounded-lg p-4 border-2 border-dashed border-gray-300 mb-6">
          <div className="flex items-start gap-3">
            {biologicalAgeData.vitalityGap > 0 ? (
              <AlertTriangle className="h-6 w-6 text-orange-500 mt-1" />
            ) : (
              <CheckCircle className="h-6 w-6 text-green-500 mt-1" />
            )}
            <div className="flex-1">
              <h4 className="font-semibold text-gray-800 mb-2">
                {biologicalAgeData.vitalityGap > 0 ? 'Vitality Gap Detected' : 'Excellent Biological Age'}
              </h4>
              {biologicalAgeData.vitalityGap > 0 ? (
                <p className="text-gray-700 mb-3">
                  Your biological age is <strong>{Math.abs(biologicalAgeData.vitalityGap)} years older</strong> than your chronological age. 
                  This represents an opportunity to optimize your longevity and reverse biological aging through targeted interventions.
                </p>
              ) : (
                <p className="text-gray-700 mb-3">
                  Congratulations! Your biological age is <strong>{Math.abs(biologicalAgeData.vitalityGap)} years younger</strong> than your chronological age. 
                  You're aging optimally and should focus on maintaining this excellent trajectory.
                </p>
              )}
              
              {/* Doctor Recommendation */}
              <div className={`p-3 rounded-lg border ${getUrgencyColor(biologicalAgeData.doctorRecommendation.urgency)}`}>
                <p className="font-medium mb-1">
                  🩺 Doctor Consultation Recommended
                </p>
                <p className="text-sm mb-2">
                  {biologicalAgeData.doctorRecommendation.reason}
                </p>
                <p className="text-sm font-medium">
                  Expected Outcome: {biologicalAgeData.doctorRecommendation.expectedOutcome}
                </p>
                <p className="text-xs mt-1 opacity-75">
                  💰 {biologicalAgeData.doctorRecommendation.costBenefit}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="mb-4">
          <div className="flex justify-between text-sm text-gray-600 mb-2">
            <span>Vitality Score Progress</span>
            <span>{biologicalAgeData.vitalityScore}/100</span>
          </div>
          <Progress 
            value={biologicalAgeData.vitalityScore} 
            className="h-3"
          />
        </div>

        <Button 
          onClick={() => setShowDetails(!showDetails)}
          variant="outline" 
          className="w-full"
        >
          {showDetails ? 'Hide' : 'Show'} Detailed Analysis
          <ArrowRight className="ml-2 h-4 w-4" />
        </Button>
      </Card>

      {/* Detailed Analysis */}
      {showDetails && (
        <>
          {/* Longevity Insights */}
          <Card className="p-6">
            <h4 className="text-lg font-semibold mb-4 flex items-center gap-2">
              <Brain className="h-5 w-5 text-purple-600" />
              Longevity Insights
            </h4>
            <div className="grid gap-4">
              {biologicalAgeData.longevityInsights.map((insight, index) => (
                <div 
                  key={index}
                  className={`p-4 rounded-lg border ${
                    insight.impact === 'positive' ? 'bg-green-50 border-green-200' :
                    insight.impact === 'negative' ? 'bg-red-50 border-red-200' :
                    'bg-gray-50 border-gray-200'
                  }`}
                >
                  <div className="flex items-start gap-3">
                    {getCategoryIcon(insight.category)}
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <Badge variant="outline" className="text-xs capitalize">
                          {insight.category}
                        </Badge>
                        <Badge 
                          variant={insight.impact === 'positive' ? 'default' : 'destructive'}
                          className="text-xs"
                        >
                          {insight.impact === 'positive' ? '+' : ''}{insight.ageImpact} years
                        </Badge>
                      </div>
                      <p className="text-sm text-gray-700">{insight.description}</p>
                      <p className="text-xs text-gray-500 mt-1 capitalize">
                        Trend: {insight.trend}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </Card>

          {/* Optimization Plan */}
          <Card className="p-6">
            <h4 className="text-lg font-semibold mb-4 flex items-center gap-2">
              <Target className="h-5 w-5 text-blue-600" />
              Longevity Optimization Plan
            </h4>
            <div className="space-y-4">
              {biologicalAgeData.optimizationPlan.map((action, index) => (
                <div 
                  key={index}
                  className="p-4 border rounded-lg hover:bg-gray-50 transition-colors"
                >
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <Badge 
                        variant={action.priority === 'high' ? 'destructive' : 
                                action.priority === 'medium' ? 'default' : 'secondary'}
                        className="text-xs"
                      >
                        {action.priority} priority
                      </Badge>
                      {action.doctorConsultation && (
                        <Badge variant="outline" className="text-xs">
                          🩺 Doctor Required
                        </Badge>
                      )}
                    </div>
                    <span className="text-xs text-gray-500">{action.timeframe}</span>
                  </div>
                  <h5 className="font-medium text-gray-800 mb-1">{action.category}</h5>
                  <p className="text-sm text-gray-700 mb-2">{action.action}</p>
                  <p className="text-xs text-green-600 font-medium">
                    Expected Benefit: {action.expectedBenefit}
                  </p>
                </div>
              ))}
            </div>
          </Card>
        </>
      )}
    </div>
  );
};

export default BiologicalAgeAnalysis;