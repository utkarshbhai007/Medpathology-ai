import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { 
  Shield, 
  AlertTriangle, 
  Plus, 
  X, 
  Search,
  Loader2,
  CheckCircle,
  XCircle,
  Info
} from 'lucide-react';
import { drugInteractionService, type DrugInteraction } from '@/services/DrugInteractionService';
import { useTranslation } from '@/services/TranslationService';

const DrugInteractionChecker: React.FC = () => {
  const [drugList, setDrugList] = useState<string[]>(['']);
  const [interactions, setInteractions] = useState<DrugInteraction[]>([]);
  const [loading, setLoading] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);
  const { t, translateSeverity } = useTranslation();

  const addDrugInput = () => {
    setDrugList([...drugList, '']);
  };

  const removeDrugInput = (index: number) => {
    if (drugList.length > 1) {
      const newList = drugList.filter((_, i) => i !== index);
      setDrugList(newList);
    }
  };

  const updateDrug = (index: number, value: string) => {
    const newList = [...drugList];
    newList[index] = value;
    setDrugList(newList);
  };

  const checkInteractions = async () => {
    const validDrugs = drugList.filter(drug => drug.trim() !== '');
    
    if (validDrugs.length < 2) {
      alert(t('need_two_drugs') || 'Please enter at least 2 medications to check for interactions.');
      return;
    }

    setLoading(true);
    setHasSearched(true);

    try {
      const foundInteractions = await drugInteractionService.checkInteractions(validDrugs);
      setInteractions(foundInteractions);
    } catch (error) {
      console.error('Interaction check error:', error);
      alert(t('interaction_check_error') || 'An error occurred while checking interactions. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const getSeverityColor = (severity: string) => {
    return drugInteractionService.getSeverityColor(severity);
  };

  const getSeverityIcon = (severity: string) => {
    return drugInteractionService.getSeverityIcon(severity);
  };

  const getRiskLevelColor = (riskLevel: number) => {
    if (riskLevel >= 8) return 'text-red-600';
    if (riskLevel >= 6) return 'text-orange-600';
    if (riskLevel >= 4) return 'text-yellow-600';
    return 'text-green-600';
  };

  return (
    <Card className="border-2 border-orange-200">
      <CardHeader>
        <CardTitle className="flex items-center gap-3">
          <Shield className="h-6 w-6 text-orange-600" />
          {t('drug_interactions')}
          <Badge className="bg-orange-500 text-white">
            {t('clinical_grade') || 'Clinical Grade'}
          </Badge>
        </CardTitle>
        <CardDescription>
          {t('drug_interaction_description') || 'Check for potentially dangerous interactions between your medications'}
        </CardDescription>
      </CardHeader>
      <CardContent>
        {/* Drug Input Section */}
        <div className="space-y-4 mb-6">
          <h4 className="font-semibold text-gray-700 flex items-center gap-2">
            <Plus className="h-4 w-4" />
            {t('enter_medications') || 'Enter Your Medications'}
          </h4>
          
          {drugList.map((drug, index) => (
            <div key={index} className="flex gap-3 items-center">
              <div className="flex-1">
                <Input
                  placeholder={`${t('medication') || 'Medication'} ${index + 1} (${t('example') || 'e.g.'} Aspirin, Warfarin, Metformin)`}
                  value={drug}
                  onChange={(e) => updateDrug(index, e.target.value)}
                  className="text-lg"
                />
              </div>
              {drugList.length > 1 && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => removeDrugInput(index)}
                  className="text-red-600 hover:text-red-700 hover:bg-red-50"
                >
                  <X className="h-4 w-4" />
                </Button>
              )}
            </div>
          ))}

          <div className="flex gap-3">
            <Button
              variant="outline"
              onClick={addDrugInput}
              className="flex items-center gap-2"
            >
              <Plus className="h-4 w-4" />
              {t('add_medication') || 'Add Another Medication'}
            </Button>
            
            <Button
              onClick={checkInteractions}
              disabled={loading}
              className="bg-orange-600 hover:bg-orange-700 flex items-center gap-2"
            >
              {loading ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Search className="h-4 w-4" />
              )}
              {t('check_interactions')}
            </Button>
          </div>
        </div>

        {/* Loading State */}
        {loading && (
          <div className="flex items-center justify-center py-8">
            <div className="flex items-center gap-3">
              <Loader2 className="h-6 w-6 animate-spin text-orange-600" />
              <span className="text-gray-600">
                {t('checking_interactions') || 'Analyzing drug interactions...'}
              </span>
            </div>
          </div>
        )}

        {/* Results Section */}
        {hasSearched && !loading && (
          <div className="space-y-4">
            {interactions.length === 0 ? (
              <Alert className="border-green-200 bg-green-50">
                <CheckCircle className="h-4 w-4 text-green-600" />
                <AlertDescription className="text-green-800">
                  <strong>{t('no_interactions_found') || 'No Major Interactions Found'}</strong>
                  <br />
                  {t('no_interactions_message') || 'Based on our database, no significant interactions were found between the entered medications. However, always consult your healthcare provider.'}
                </AlertDescription>
              </Alert>
            ) : (
              <>
                <div className="flex items-center justify-between">
                  <h4 className="font-semibold text-gray-700 flex items-center gap-2">
                    <AlertTriangle className="h-5 w-5 text-orange-600" />
                    {t('interactions_found') || `${interactions.length} Interaction(s) Found`}
                  </h4>
                  <Badge variant="outline" className="text-orange-600 border-orange-300">
                    {t('review_with_doctor') || 'Review with Doctor'}
                  </Badge>
                </div>

                <div className="space-y-4">
                  {interactions.map((interaction, index) => (
                    <Card key={index} className={`border-l-4 ${
                      interaction.severity === 'CONTRAINDICATED' ? 'border-l-red-600 bg-red-50' :
                      interaction.severity === 'MAJOR' ? 'border-l-red-500 bg-red-50' :
                      interaction.severity === 'MODERATE' ? 'border-l-yellow-500 bg-yellow-50' :
                      'border-l-green-500 bg-green-50'
                    }`}>
                      <CardHeader className="pb-3">
                        <div className="flex items-start justify-between">
                          <div>
                            <CardTitle className="text-lg flex items-center gap-2">
                              <span className="text-2xl">{getSeverityIcon(interaction.severity)}</span>
                              {interaction.drug1.charAt(0).toUpperCase() + interaction.drug1.slice(1)} + {interaction.drug2.charAt(0).toUpperCase() + interaction.drug2.slice(1)}
                            </CardTitle>
                            <div className="flex items-center gap-3 mt-2">
                              <Badge className={getSeverityColor(interaction.severity)}>
                                {translateSeverity(interaction.severity)}
                              </Badge>
                              <div className="flex items-center gap-1">
                                <span className="text-sm text-gray-600">{t('risk_level') || 'Risk Level'}:</span>
                                <span className={`font-bold ${getRiskLevelColor(interaction.riskLevel)}`}>
                                  {interaction.riskLevel}/10
                                </span>
                              </div>
                            </div>
                          </div>
                        </div>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        {/* Description */}
                        <div>
                          <h5 className="font-semibold text-gray-700 mb-2">
                            {t('interaction_description') || 'What happens?'}
                          </h5>
                          <p className="text-gray-700">{interaction.description}</p>
                        </div>

                        {/* Clinical Effect */}
                        <div>
                          <h5 className="font-semibold text-gray-700 mb-2">
                            {t('clinical_effect') || 'Clinical Effect'}
                          </h5>
                          <p className="text-gray-700">{interaction.clinicalEffect}</p>
                        </div>

                        {/* Mechanism */}
                        {interaction.mechanism && (
                          <div>
                            <h5 className="font-semibold text-gray-700 mb-2">
                              {t('mechanism') || 'How it happens'}
                            </h5>
                            <p className="text-gray-700">{interaction.mechanism}</p>
                          </div>
                        )}

                        {/* Management */}
                        <div className="bg-white p-4 rounded-lg border border-gray-200">
                          <h5 className="font-semibold text-blue-700 mb-2 flex items-center gap-2">
                            <Info className="h-4 w-4" />
                            {t('management_advice') || 'What to do'}
                          </h5>
                          <p className="text-gray-700">{interaction.management}</p>
                        </div>

                        {/* Sources */}
                        {interaction.sources && interaction.sources.length > 0 && (
                          <div className="text-xs text-gray-500">
                            <strong>{t('sources') || 'Sources'}:</strong> {interaction.sources.join(', ')}
                          </div>
                        )}
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </>
            )}

            {/* Important Disclaimer */}
            <Alert className="border-blue-200 bg-blue-50 mt-6">
              <Shield className="h-4 w-4 text-blue-600" />
              <AlertDescription className="text-blue-800">
                <strong>{t('medical_disclaimer') || 'Medical Disclaimer'}:</strong>{' '}
                {t('interaction_disclaimer') || 'This tool provides general information about drug interactions. It does not replace professional medical advice. Always consult your healthcare provider or pharmacist before making any changes to your medications.'}
              </AlertDescription>
            </Alert>
          </div>
        )}

        {/* Quick Examples */}
        {!hasSearched && (
          <div className="mt-6 p-4 bg-gray-50 rounded-lg">
            <h4 className="font-medium text-gray-700 mb-3">
              {t('common_interactions') || 'Common Interaction Examples:'}
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
              <div className="flex items-center gap-2">
                <Badge className="bg-red-500 text-white text-xs">MAJOR</Badge>
                <span>Warfarin + Aspirin</span>
              </div>
              <div className="flex items-center gap-2">
                <Badge className="bg-yellow-500 text-white text-xs">MODERATE</Badge>
                <span>Metformin + Alcohol</span>
              </div>
              <div className="flex items-center gap-2">
                <Badge className="bg-red-500 text-white text-xs">MAJOR</Badge>
                <span>Simvastatin + Grapefruit</span>
              </div>
              <div className="flex items-center gap-2">
                <Badge className="bg-yellow-500 text-white text-xs">MODERATE</Badge>
                <span>Lisinopril + Potassium</span>
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default DrugInteractionChecker;