import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { 
  Search, 
  Pill, 
  AlertTriangle, 
  Info, 
  Shield, 
  Clock,
  CheckCircle,
  XCircle,
  Loader2
} from 'lucide-react';
import { drugInteractionService, type DrugInfo } from '@/services/DrugInteractionService';
import { useTranslation } from '@/services/TranslationService';

const MedicineInfoLookup: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [drugInfo, setDrugInfo] = useState<DrugInfo | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { t, language } = useTranslation();

  const handleSearch = async () => {
    if (!searchTerm.trim()) return;

    setLoading(true);
    setError(null);
    setDrugInfo(null);

    try {
      const info = await drugInteractionService.getDrugInfo(searchTerm.trim());
      if (info) {
        setDrugInfo(info);
      } else {
        setError(t('medicine_not_found') || 'Medicine information not found. Please check the spelling or try a different name.');
      }
    } catch (err) {
      setError(t('search_error') || 'An error occurred while searching. Please try again.');
      console.error('Medicine search error:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  return (
    <Card className="border-2 border-blue-200">
      <CardHeader>
        <CardTitle className="flex items-center gap-3">
          <Pill className="h-6 w-6 text-blue-600" />
          {t('medicine_info')}
          <Badge className="bg-blue-500 text-white">
            {t('fda_verified') || 'FDA + AI Powered'}
          </Badge>
        </CardTitle>
        <CardDescription>
          {t('medicine_info_description') || 'Search for any medicine to understand what it\'s used for, side effects, and important warnings'}
        </CardDescription>
      </CardHeader>
      <CardContent>
        {/* Search Section */}
        <div className="flex gap-3 mb-6">
          <div className="flex-1">
            <Input
              placeholder={t('enter_medicine_name') || 'Enter medicine name (e.g., Aspirin, Metformin, Lisinopril)'}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              onKeyPress={handleKeyPress}
              className="text-lg"
            />
          </div>
          <Button 
            onClick={handleSearch}
            disabled={loading || !searchTerm.trim()}
            className="bg-blue-600 hover:bg-blue-700"
          >
            {loading ? (
              <Loader2 className="h-4 w-4 animate-spin mr-2" />
            ) : (
              <Search className="h-4 w-4 mr-2" />
            )}
            {t('search')}
          </Button>
        </div>

        {/* Loading State */}
        {loading && (
          <div className="flex items-center justify-center py-8">
            <div className="flex items-center gap-3">
              <Loader2 className="h-6 w-6 animate-spin text-blue-600" />
              <span className="text-gray-600">
                {t('searching_medicine') || 'Searching medicine database...'}
              </span>
            </div>
          </div>
        )}

        {/* Error State */}
        {error && (
          <Alert className="border-red-200 bg-red-50">
            <AlertTriangle className="h-4 w-4 text-red-600" />
            <AlertDescription className="text-red-700">
              {error}
            </AlertDescription>
          </Alert>
        )}

        {/* Medicine Information Display */}
        {drugInfo && (
          <div className="space-y-6">
            {/* Basic Information */}
            <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-6 rounded-xl border border-blue-200">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h3 className="text-2xl font-bold text-blue-900 mb-2">
                    {drugInfo.brandName || drugInfo.name}
                  </h3>
                  {drugInfo.genericName && drugInfo.brandName && (
                    <p className="text-blue-700 mb-2">
                      <strong>{t('generic_name') || 'Generic Name'}:</strong> {drugInfo.genericName}
                    </p>
                  )}
                  <p className="text-blue-600 text-sm">
                    <strong>{t('drug_class') || 'Drug Class'}:</strong> {drugInfo.drugClass}
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  {drugInfo.fdaApproved ? (
                    <Badge className="bg-green-500 text-white flex items-center gap-1">
                      <CheckCircle className="h-3 w-3" />
                      {t('fda_approved') || 'FDA Approved'}
                    </Badge>
                  ) : (
                    <Badge className="bg-gray-500 text-white flex items-center gap-1">
                      <XCircle className="h-3 w-3" />
                      {t('not_fda_verified') || 'Not FDA Verified'}
                    </Badge>
                  )}
                </div>
              </div>

              {/* What is this medicine for? */}
              <div className="bg-white p-4 rounded-lg border border-blue-100">
                <h4 className="font-semibold text-blue-800 mb-2 flex items-center gap-2">
                  <Info className="h-4 w-4" />
                  {t('what_is_this_medicine_for')}
                </h4>
                <p className="text-gray-700 leading-relaxed">
                  {drugInfo.purpose}
                </p>
              </div>
            </div>

            {/* Detailed Information Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Indications */}
              {drugInfo.indications && drugInfo.indications.length > 0 && (
                <Card className="border-green-200">
                  <CardHeader className="pb-3">
                    <CardTitle className="text-lg flex items-center gap-2 text-green-700">
                      <CheckCircle className="h-5 w-5" />
                      {t('indications') || 'Used For'}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-2">
                      {drugInfo.indications.map((indication, index) => (
                        <li key={index} className="flex items-start gap-2">
                          <div className="w-2 h-2 bg-green-500 rounded-full mt-2 shrink-0"></div>
                          <span className="text-gray-700">{indication}</span>
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>
              )}

              {/* Mechanism of Action */}
              {drugInfo.mechanism && (
                <Card className="border-purple-200">
                  <CardHeader className="pb-3">
                    <CardTitle className="text-lg flex items-center gap-2 text-purple-700">
                      <Clock className="h-5 w-5" />
                      {t('how_it_works') || 'How It Works'}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-gray-700">{drugInfo.mechanism}</p>
                  </CardContent>
                </Card>
              )}

              {/* Side Effects */}
              {drugInfo.sideEffects && drugInfo.sideEffects.length > 0 && (
                <Card className="border-yellow-200">
                  <CardHeader className="pb-3">
                    <CardTitle className="text-lg flex items-center gap-2 text-yellow-700">
                      <AlertTriangle className="h-5 w-5" />
                      {t('side_effects')}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-2">
                      {drugInfo.sideEffects.slice(0, 5).map((effect, index) => (
                        <li key={index} className="flex items-start gap-2">
                          <div className="w-2 h-2 bg-yellow-500 rounded-full mt-2 shrink-0"></div>
                          <span className="text-gray-700">{effect}</span>
                        </li>
                      ))}
                      {drugInfo.sideEffects.length > 5 && (
                        <li className="text-sm text-gray-500 italic">
                          {t('and_more') || `...and ${drugInfo.sideEffects.length - 5} more`}
                        </li>
                      )}
                    </ul>
                  </CardContent>
                </Card>
              )}

              {/* Warnings */}
              {drugInfo.warnings && drugInfo.warnings.length > 0 && (
                <Card className="border-red-200">
                  <CardHeader className="pb-3">
                    <CardTitle className="text-lg flex items-center gap-2 text-red-700">
                      <Shield className="h-5 w-5" />
                      {t('warnings')}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-2">
                      {drugInfo.warnings.slice(0, 3).map((warning, index) => (
                        <li key={index} className="flex items-start gap-2">
                          <AlertTriangle className="h-4 w-4 text-red-500 mt-0.5 shrink-0" />
                          <span className="text-gray-700">{warning}</span>
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>
              )}
            </div>

            {/* Important Notice */}
            <Alert className="border-blue-200 bg-blue-50">
              <Info className="h-4 w-4 text-blue-600" />
              <AlertDescription className="text-blue-800">
                <strong>{t('important_notice') || 'Important Notice'}:</strong>{' '}
                {t('consult_healthcare_provider') || 'This information is for educational purposes only. Always consult your healthcare provider before starting, stopping, or changing any medication. Never self-medicate based on this information.'}
              </AlertDescription>
            </Alert>

            {/* Data Sources */}
            <div className="text-center text-sm text-gray-500 border-t pt-4">
              {t('data_sources') || 'Data Sources'}: FDA Drug Labels, Clinical Guidelines, Medical Literature
            </div>
          </div>
        )}

        {/* Quick Examples */}
        {!drugInfo && !loading && (
          <div className="mt-6 p-4 bg-gray-50 rounded-lg">
            <h4 className="font-medium text-gray-700 mb-3">
              {t('try_searching_for') || 'Try searching for:'}
            </h4>
            <div className="flex flex-wrap gap-2">
              {['Aspirin', 'Metformin', 'Lisinopril', 'Atorvastatin', 'Omeprazole'].map((drug) => (
                <Button
                  key={drug}
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    setSearchTerm(drug);
                    setTimeout(() => handleSearch(), 100);
                  }}
                  className="text-xs"
                >
                  {drug}
                </Button>
              ))}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default MedicineInfoLookup;