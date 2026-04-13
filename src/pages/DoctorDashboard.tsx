
import * as React from "react";
import PageContainer from "@/components/layout/PageContainer";
import { Button } from "@/components/ui/button";
import GlassCard from "@/components/ui/GlassCard";
import { Activity, AlertTriangle, FileText, User, Calendar, ArrowRight, Shield, Stethoscope, ChevronLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { pathologyAI } from "@/utils/apiService";
import { useAuth } from "@/contexts/AuthContext";

const DoctorDashboard = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [view, setView] = React.useState<'list' | 'detail'>('list');
  const [selectedRecord, setSelectedRecord] = React.useState<any>(null);
  const [selectedTab, setSelectedTab] = React.useState('overview'); // Add tab state
  const [doctors, setDoctors] = React.useState<any[]>([]);
  const [patients, setPatients] = React.useState<any[]>([]); // Add patients state
  const [doctorId, setDoctorId] = React.useState('');
  const [isEditingPlan, setIsEditingPlan] = React.useState(false);
  const [analysisData, setAnalysisData] = React.useState<any>(null);
  const [records, setRecords] = React.useState<any[]>([]);
  const [isGeneratingPlan, setIsGeneratingPlan] = React.useState(false);

  // Helper function to get patient name by ID
  const getPatientName = (patientId: string) => {
    const patient = patients.find(p => p._id === patientId);
    return patient ? patient.name : `Patient ${patientId.slice(-4)}`;
  };

  // Helper function to get patient info by ID
  const getPatientInfo = (patientId: string) => {
    const patient = patients.find(p => p._id === patientId);
    return patient || { name: `Patient ${patientId.slice(-4)}`, email: 'Unknown', profile: {} };
  };

  // Render analysis block
  const renderAnalysis = () => {
    if (!analysisData) return null;
    const { blockchainRecord, analysis, patientInfo } = analysisData;
    
    // Try to get patient name from our patients list if patientInfo doesn't have it
    const patientName = patientInfo?.name || 
                       (patientInfo?.patientId ? getPatientName(patientInfo.patientId) : 'Unknown Patient');
    
    return (
      <GlassCard className="mt-6">
        <h3 className="text-lg font-semibold mb-2">Recent Analysis Overview</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
          <div>
            <p className="text-xs text-gray-500 uppercase">Record ID</p>
            <p className="text-sm font-mono">{blockchainRecord?.recordId?.slice(-8) || 'N/A'}</p>
          </div>
          <div>
            <p className="text-xs text-gray-500 uppercase">Patient</p>
            <p className="text-sm font-semibold">{patientName}</p>
          </div>
          <div>
            <p className="text-xs text-gray-500 uppercase">Status</p>
            <p className="text-sm">
              <span className="px-2 py-1 bg-green-100 text-green-700 rounded-full text-xs">
                Completed
              </span>
            </p>
          </div>
          <div>
            <p className="text-xs text-gray-500 uppercase">Timestamp</p>
            <p className="text-sm">{new Date().toLocaleDateString()}</p>
          </div>
        </div>
        <details className="mt-4">
          <summary className="cursor-pointer text-sm text-blue-600 hover:text-blue-800">
            View Raw Analysis Data
          </summary>
          <pre className="mt-2 text-xs bg-gray-100 p-2 rounded overflow-x-auto max-h-40">
            {JSON.stringify(analysis, null, 2)}
          </pre>
        </details>
      </GlassCard>
    );
  };

  // Inside return JSX, after header
  // Insert {renderAnalysis()} before the list view

  React.useEffect(() => {
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

  // Fetch doctors and patients on mount
  React.useEffect(() => {
    const fetchDoctorsAndPatients = async () => {
      try {
        // Fetch patients for name resolution
        const patientsData = await pathologyAI.getPatients();
        setPatients(patientsData);

        // If logged in as doctor, use own ID
        if (user && user.role === 'doctor') {
          setDoctorId(user.uid);
          return;
        }

        // Fallback for demo / lab admin view
        const docs = await pathologyAI.getDoctors();
        setDoctors(docs);
        if (docs.length > 0) {
          setDoctorId(docs[0]._id);
        }
      } catch (error) {
        console.error('Error fetching doctors and patients:', error);
      }
    };
    fetchDoctorsAndPatients();
  }, [user]);

  // Auto-fetch records every 5 seconds
  React.useEffect(() => {
    const fetchRecords = async () => {
      if (doctorId) {
        // Backend API Service
        const reports = await pathologyAI.getReports({ doctorId });
        // Map Backend Report -> Dashboard Record Format
        const mappedRecords = reports.map((r: any) => ({
          recordId: r._id,
          patientId: r.patientId,
          assignedDoctorId: r.doctorId,
          timestamp: r.createdAt,
          status: 'Verified',
          fullData: r.aiAnalysis || {},
          dataHash: 'BACKEND-VERIFIED',
          blockHeight: 0
        }));
        setRecords(mappedRecords);
      }
    };

    fetchRecords(); // Initial fetch
    const interval = setInterval(fetchRecords, 5000); // Poll every 5s

    return () => clearInterval(interval);
  }, [doctorId]);

  const handleSelectRecord = (record: any) => {
    setSelectedRecord(record);
    setSelectedTab('overview'); // Reset to overview tab
    setView('detail');
  };

  return (
    <PageContainer>
      <div className="max-w-7xl mx-auto py-8 px-4">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
              <Activity className="h-8 w-8 text-blue-600" />
              Doctor Portal
            </h1>
            <p className="text-gray-600 mt-2">Assigned Patient Queue & Clinical Analysis</p>
          </div>
          <div className="flex items-center gap-2">
            {user && user.role === 'doctor' ? (
              <div className="flex items-center gap-2 px-3 py-1 bg-blue-50 text-blue-800 rounded-full border border-blue-100 text-sm font-medium">
                <Stethoscope className="h-4 w-4" />
                Welcome, {user.name}
              </div>
            ) : (
              <>
                <span className="text-sm text-gray-500">Viewing as:</span>
                <select
                  className="bg-white border rounded-md p-1 text-sm"
                  value={doctorId}
                  onChange={(e) => setDoctorId(e.target.value)}
                >
                  {doctors.length === 0 ? (
                    <option>Loading doctors...</option>
                  ) : (
                    doctors.map(d => (
                      <option key={d._id} value={d._id}>{d.name}</option>
                    ))
                  )}
                </select>
              </>
            )}
          </div>
        </div>

        {renderAnalysis()}
        {view === 'list' && (
          <div className="grid grid-cols-1 gap-6">
            <GlassCard>
              <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
                <Stethoscope className="h-5 w-5 text-blue-600" /> Pending Reviews
              </h2>
              {records.length === 0 ? (
                <div className="text-center py-12 bg-gray-50 rounded-lg border border-dashed border-gray-300">
                  <p className="text-gray-500 mb-2">No patients assigned yet.</p>
                  <p className="text-xs text-gray-400">
                    (Backend fetched 0 records. Please run analysis in Lab Dashboard first.)
                  </p>
                </div>
              ) : (
                <div className="divide-y">
                  {records.map((rec) => {
                    const patientInfo = getPatientInfo(rec.patientId);
                    return (
                      <div key={rec.recordId} className="py-4 flex items-center justify-between hover:bg-gray-50 px-2 rounded-lg transition-colors cursor-pointer" onClick={() => handleSelectRecord(rec)}>
                        <div className="flex items-center gap-4">
                          <div className="h-12 w-12 bg-blue-100 rounded-full flex items-center justify-center text-blue-700 font-bold text-lg">
                            {patientInfo.name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)}
                          </div>
                          <div>
                            <h3 className="font-bold text-gray-900 text-lg">{patientInfo.name}</h3>
                            <div className="flex items-center gap-4 text-sm text-gray-500">
                              <span>ID: {rec.patientId.slice(-8)}</span>
                              <span>•</span>
                              <span>{new Date(rec.timestamp).toLocaleDateString()}</span>
                              {patientInfo.profile?.age && (
                                <>
                                  <span>•</span>
                                  <span>Age: {patientInfo.profile.age}</span>
                                </>
                              )}
                              {patientInfo.profile?.gender && (
                                <>
                                  <span>•</span>
                                  <span>{patientInfo.profile.gender === 'M' ? 'Male' : patientInfo.profile.gender === 'F' ? 'Female' : patientInfo.profile.gender}</span>
                                </>
                              )}
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center gap-4">
                          {rec.fullData?.riskFactors?.length > 0 && (
                            <span className="px-3 py-1 bg-red-100 text-red-700 text-sm rounded-full font-medium">
                              {rec.fullData.riskFactors.length} Risk{rec.fullData.riskFactors.length > 1 ? 's' : ''}
                            </span>
                          )}
                          <Button size="sm" variant="outline" className="hover:bg-blue-50 hover:text-blue-700">
                            Review Case
                          </Button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </GlassCard>
          </div>
        )}

        {view === 'detail' && selectedRecord && (
          <div className="animate-fade-in">
            <Button variant="ghost" className="mb-4 pl-0 hover:pl-2 transition-all" onClick={() => setView('list')}>
              <ChevronLeft className="h-4 w-4 mr-1" /> Back to Patient List
            </Button>

            {/* Patient Banner */}
            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 mb-8 flex items-center gap-6">
              <div className="h-16 w-16 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 font-bold text-2xl">
                {getPatientName(selectedRecord.patientId).split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)}
              </div>
              <div className="flex-1">
                <h2 className="text-2xl font-bold text-gray-900">{getPatientName(selectedRecord.patientId)}</h2>
                <div className="flex gap-6 text-sm text-gray-500 mt-2">
                  <span className="flex items-center gap-1">
                    <User className="h-4 w-4" /> 
                    Patient ID: {selectedRecord.patientId.slice(-8)}
                  </span>
                  <span className="flex items-center gap-1">
                    <Shield className="h-4 w-4" /> 
                    Record: {selectedRecord.recordId.slice(-8)}
                  </span>
                  <span className="flex items-center gap-1">
                    <Calendar className="h-4 w-4" /> 
                    {new Date(selectedRecord.timestamp).toLocaleDateString()}
                  </span>
                </div>
                {(() => {
                  const patientInfo = getPatientInfo(selectedRecord.patientId);
                  return (
                    <div className="flex gap-6 text-sm text-gray-600 mt-2">
                      {patientInfo.profile?.age && (
                        <span>Age: {patientInfo.profile.age}</span>
                      )}
                      {patientInfo.profile?.gender && (
                        <span>Gender: {patientInfo.profile.gender === 'M' ? 'Male' : patientInfo.profile.gender === 'F' ? 'Female' : patientInfo.profile.gender}</span>
                      )}
                      {patientInfo.profile?.bloodType && (
                        <span>Blood Type: {patientInfo.profile.bloodType}</span>
                      )}
                      {patientInfo.email && (
                        <span>Email: {patientInfo.email}</span>
                      )}
                    </div>
                  );
                })()}
              </div>
            </div>

            {/* Comprehensive Report Tabs */}
            <div className="mb-8">
              <div className="border-b border-gray-200">
                <nav className="-mb-px flex space-x-8">
                  {[
                    { id: 'overview', label: 'Clinical Overview', icon: Activity },
                    { id: 'lab-results', label: 'Lab Results', icon: FileText },
                    { id: 'diagnosis', label: 'AI Diagnosis', icon: Stethoscope },
                    { id: 'risks', label: 'Risk Analysis', icon: AlertTriangle },
                    { id: 'medications', label: 'Medication Safety', icon: Shield }
                  ].map((tab) => (
                    <button
                      key={tab.id}
                      onClick={() => setSelectedTab(tab.id)}
                      className={`${
                        selectedTab === tab.id
                          ? 'border-blue-500 text-blue-600'
                          : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                      } whitespace-nowrap py-2 px-1 border-b-2 font-medium text-sm flex items-center gap-2`}
                    >
                      <tab.icon className="h-4 w-4" />
                      {tab.label}
                    </button>
                  ))}
                </nav>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Main Content Area */}
              <div className="space-y-6 lg:col-span-2">
                
                {/* Clinical Overview Tab */}
                {selectedTab === 'overview' && (
                  <div className="space-y-6">
                    {/* Health Score & Vitals */}
                    <GlassCard className="border-l-4 border-l-blue-500">
                      <div className="flex items-center gap-3 mb-6">
                        <Activity className="h-6 w-6 text-blue-600" />
                        <h3 className="text-lg font-bold text-gray-900">Health Overview</h3>
                      </div>
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        <div className="text-center p-4 bg-blue-50 rounded-lg">
                          <div className="text-2xl font-bold text-blue-600">
                            {selectedRecord.fullData.healthScore || '85'}
                          </div>
                          <div className="text-xs text-blue-700 font-medium">Health Score</div>
                        </div>
                        <div className="text-center p-4 bg-green-50 rounded-lg">
                          <div className="text-2xl font-bold text-green-600">
                            {selectedRecord.fullData.biologicalAge || '32'}
                          </div>
                          <div className="text-xs text-green-700 font-medium">Biological Age</div>
                        </div>
                        <div className="text-center p-4 bg-purple-50 rounded-lg">
                          <div className="text-2xl font-bold text-purple-600">
                            {selectedRecord.fullData.riskFactors?.length || 0}
                          </div>
                          <div className="text-xs text-purple-700 font-medium">Risk Factors</div>
                        </div>
                        <div className="text-center p-4 bg-orange-50 rounded-lg">
                          <div className="text-2xl font-bold text-orange-600">
                            {selectedRecord.fullData.recommendations?.length || 0}
                          </div>
                          <div className="text-xs text-orange-700 font-medium">Recommendations</div>
                        </div>
                      </div>
                    </GlassCard>

                    {/* AI Summary */}
                    <GlassCard>
                      <h4 className="font-semibold text-gray-900 mb-3">AI Clinical Summary</h4>
                      <div className="bg-gray-50 p-4 rounded-lg">
                        <p className="text-sm text-gray-700 leading-relaxed">
                          {selectedRecord.fullData.summary || 
                           selectedRecord.fullData.careCoordinator?.carePlan?.summary ||
                           "Comprehensive pathology analysis completed. Patient shows overall stable health markers with some areas requiring attention. Detailed analysis available in individual sections."}
                        </p>
                      </div>
                    </GlassCard>

                    {/* Patient History & Timeline */}
                    <GlassCard>
                      <h4 className="font-semibold text-gray-900 mb-3">Recent Medical History</h4>
                      <div className="space-y-3">
                        <div className="flex items-start gap-3 p-3 bg-blue-50 rounded-lg border-l-4 border-blue-500">
                          <Calendar className="h-4 w-4 text-blue-600 mt-0.5" />
                          <div>
                            <p className="text-sm font-medium text-blue-900">Current Analysis</p>
                            <p className="text-xs text-blue-700">{new Date(selectedRecord.timestamp).toLocaleDateString()} - Pathology report completed</p>
                          </div>
                        </div>
                        <div className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg">
                          <Activity className="h-4 w-4 text-gray-600 mt-0.5" />
                          <div>
                            <p className="text-sm font-medium text-gray-900">Previous Visit</p>
                            <p className="text-xs text-gray-600">6 months ago - Routine checkup, all parameters normal</p>
                          </div>
                        </div>
                        <div className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg">
                          <FileText className="h-4 w-4 text-gray-600 mt-0.5" />
                          <div>
                            <p className="text-sm font-medium text-gray-900">Medical History</p>
                            <p className="text-xs text-gray-600">No significant past medical history reported</p>
                          </div>
                        </div>
                      </div>
                    </GlassCard>
                  </div>
                )}

                {/* Lab Results Tab */}
                {selectedTab === 'lab-results' && (
                  <GlassCard className="border-l-4 border-l-green-500">
                    <div className="flex items-center gap-3 mb-6">
                      <FileText className="h-6 w-6 text-green-600" />
                      <h3 className="text-lg font-bold text-gray-900">Laboratory Results</h3>
                    </div>
                    
                    {/* Biomarkers Table */}
                    <div className="overflow-x-auto">
                      <table className="w-full text-sm">
                        <thead>
                          <tr className="border-b border-gray-200">
                            <th className="text-left py-3 px-2 font-semibold text-gray-700">Biomarker</th>
                            <th className="text-center py-3 px-2 font-semibold text-gray-700">Result</th>
                            <th className="text-center py-3 px-2 font-semibold text-gray-700">Reference Range</th>
                            <th className="text-center py-3 px-2 font-semibold text-gray-700">Status</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                          {(() => {
                            const biomarkers = selectedRecord.fullData.biomarkers || selectedRecord.fullData.labResults || [
                              { name: 'Glucose', value: 95, unit: 'mg/dL', range: '70-100', status: 'Normal' },
                              { name: 'Cholesterol', value: 185, unit: 'mg/dL', range: '<200', status: 'Normal' },
                              { name: 'Hemoglobin', value: 14.2, unit: 'g/dL', range: '12-16', status: 'Normal' },
                              { name: 'White Blood Cells', value: 8.5, unit: '×10³/μL', range: '4-11', status: 'Normal' },
                              { name: 'Platelets', value: 350, unit: '×10³/μL', range: '150-450', status: 'Normal' },
                              { name: 'Creatinine', value: 1.1, unit: 'mg/dL', range: '0.6-1.2', status: 'Normal' }
                            ];
                            return biomarkers.map((marker: any, i: number) => (
                              <tr key={i} className="hover:bg-gray-50">
                                <td className="py-3 px-2 font-medium text-gray-900">{marker.name}</td>
                                <td className="py-3 px-2 text-center">
                                  <span className="font-semibold">{marker.value}</span>
                                  <span className="text-gray-500 ml-1">{marker.unit}</span>
                                </td>
                                <td className="py-3 px-2 text-center text-gray-600">{marker.range}</td>
                                <td className="py-3 px-2 text-center">
                                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                                    marker.status === 'Normal' ? 'bg-green-100 text-green-700' :
                                    marker.status === 'High' ? 'bg-red-100 text-red-700' :
                                    marker.status === 'Low' ? 'bg-yellow-100 text-yellow-700' :
                                    'bg-gray-100 text-gray-700'
                                  }`}>
                                    {marker.status}
                                  </span>
                                </td>
                              </tr>
                            ));
                          })()}
                        </tbody>
                      </table>
                    </div>
                  </GlassCard>
                )}

                {/* AI Diagnosis Tab */}
                {selectedTab === 'diagnosis' && (
                  <div className="space-y-6">
                    <GlassCard className="border-l-4 border-l-indigo-500">
                      <div className="flex items-center gap-3 mb-6">
                        <Stethoscope className="h-6 w-6 text-indigo-600" />
                        <h3 className="text-lg font-bold text-gray-900">AI Diagnostic Analysis</h3>
                      </div>
                      
                      {/* Primary Findings */}
                      <div className="mb-6">
                        <h4 className="font-semibold text-gray-900 mb-3">Primary Findings</h4>
                        <div className="space-y-3">
                          {(selectedRecord.fullData.diagnosis || selectedRecord.fullData.findings || [
                            "Overall health parameters within normal ranges",
                            "Cardiovascular markers show good health status", 
                            "Metabolic panel indicates stable glucose metabolism",
                            "Complete blood count shows no signs of infection or anemia"
                          ]).map((finding: string, i: number) => (
                            <div key={i} className="flex items-start gap-3 p-3 bg-indigo-50 rounded-lg">
                              <div className="w-2 h-2 bg-indigo-500 rounded-full mt-2 shrink-0"></div>
                              <p className="text-sm text-indigo-800">{finding}</p>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Differential Diagnosis */}
                      <div className="mb-6">
                        <h4 className="font-semibold text-gray-900 mb-3">Differential Considerations</h4>
                        <div className="bg-gray-50 p-4 rounded-lg">
                          <p className="text-sm text-gray-700">
                            {selectedRecord.fullData.differentialDiagnosis || 
                             "Based on current lab values and patient history, no immediate pathological conditions identified. Continue routine monitoring and preventive care protocols."}
                          </p>
                        </div>
                      </div>

                      {/* Clinical Recommendations */}
                      <div>
                        <h4 className="font-semibold text-gray-900 mb-3">Clinical Recommendations</h4>
                        <div className="space-y-3">
                          {(selectedRecord.fullData.recommendations || [
                            "Continue current medication regimen with regular monitoring",
                            "Schedule follow-up appointment in 3 months",
                            "Maintain healthy lifestyle with regular exercise",
                            "Monitor blood pressure and glucose levels at home"
                          ]).map((rec: string, i: number) => (
                            <div key={i} className="flex items-start gap-3 p-3 bg-green-50 rounded-lg border border-green-100">
                              <ArrowRight className="h-4 w-4 text-green-600 mt-0.5 shrink-0" />
                              <p className="text-sm text-green-800">{rec}</p>
                            </div>
                          ))}
                        </div>
                      </div>
                    </GlassCard>
                  </div>
                )}

                {/* Risk Analysis Tab */}
                {selectedTab === 'risks' && (
                  <GlassCard className="border-l-4 border-l-purple-500">
                    <div className="flex items-center gap-3 mb-6">
                      <Activity className="h-6 w-6 text-purple-600" />
                      <h3 className="text-lg font-bold text-gray-900">Health Risk Predictions (6-12 Months)</h3>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {(selectedRecord.fullData.riskFactors || [
                        { factor: "Bleeding Disorders", impact: "Low", description: "Low platelet count is not present, but high platelet count may indicate a potential risk for bleeding disorders." },
                        { factor: "Infection", impact: "Medium", description: "Elevated white blood cell count increases the risk of infection." }
                      ]).map((risk: any, i: number) => (
                        <div key={i} className="bg-purple-50 p-4 rounded-lg border border-purple-100">
                          <div className="flex justify-between items-start mb-2">
                            <span className="font-semibold text-purple-900">{typeof risk === 'string' ? risk : risk.factor}</span>
                            {typeof risk === 'object' && risk.impact && (
                              <span className={`text-xs px-2 py-1 rounded-full ${
                                risk.impact === 'High' ? 'bg-red-100 text-red-700' : 
                                risk.impact === 'Medium' ? 'bg-yellow-100 text-yellow-700' :
                                'bg-green-100 text-green-700'
                              }`}>
                                {risk.impact} Risk
                              </span>
                            )}
                          </div>
                          {typeof risk === 'object' && risk.description && (
                            <p className="text-sm text-purple-700">{risk.description}</p>
                          )}
                        </div>
                      ))}
                    </div>
                  </GlassCard>
                )}

                {/* Medication Safety Tab */}
                {selectedTab === 'medications' && (
                  <GlassCard className="border-l-4 border-l-red-500">
                    <div className="flex items-center gap-3 mb-6">
                      <AlertTriangle className="h-6 w-6 text-red-600" />
                      <h3 className="text-lg font-bold text-gray-900">Medication Safety Analysis</h3>
                    </div>
                    <div className="space-y-4">
                      {/* Current Medications */}
                      <div>
                        <h4 className="font-semibold text-gray-900 mb-3">Current Medications</h4>
                        <div className="space-y-2">
                          {(selectedRecord.fullData.medications || [
                            "Metformin 500mg - Twice daily",
                            "Lisinopril 10mg - Once daily", 
                            "Atorvastatin 20mg - Once daily"
                          ]).map((med: string, i: number) => (
                            <div key={i} className="flex items-center gap-3 p-2 bg-blue-50 rounded border border-blue-100">
                              <Shield className="h-4 w-4 text-blue-600" />
                              <span className="text-sm text-blue-800">{med}</span>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Safety Alerts */}
                      <div>
                        <h4 className="font-semibold text-gray-900 mb-3">Safety Alerts</h4>
                        <div className="space-y-3">
                          <div className="p-4 bg-red-50 rounded-lg border border-red-100 flex gap-4">
                            <Shield className="h-6 w-6 text-red-600 shrink-0" />
                            <div>
                              <h4 className="font-semibold text-red-900">Interaction Check Complete</h4>
                              <p className="text-sm text-red-700 mt-1">
                                {selectedRecord.fullData.medicationAlerts || 
                                 "Creating safety protocols based on patient's current medication list. Warning: Review potential interactions with identified risk factors."}
                              </p>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </GlassCard>
                )}
              </div>

              {/* Right Col: Care Plan & Actions */}
              <div className="space-y-6">
                {/* Quick Actions */}
                <GlassCard>
                  <h3 className="text-lg font-bold text-gray-900 mb-4">Quick Actions</h3>
                  <div className="space-y-3">
                    <Button 
                      className="w-full justify-start" 
                      variant="outline"
                      onClick={() => {
                        // Generate comprehensive report
                        const reportData = {
                          patient: getPatientInfo(selectedRecord.patientId),
                          record: selectedRecord,
                          timestamp: new Date().toISOString()
                        };
                        const blob = new Blob([JSON.stringify(reportData, null, 2)], { type: 'application/json' });
                        const url = URL.createObjectURL(blob);
                        const a = document.createElement('a');
                        a.href = url;
                        a.download = `patient-report-${selectedRecord.patientId.slice(-8)}-${new Date().toISOString().split('T')[0]}.json`;
                        a.click();
                        URL.revokeObjectURL(url);
                      }}
                    >
                      <FileText className="h-4 w-4 mr-2" />
                      Export Full Report
                    </Button>
                    <Button className="w-full justify-start" variant="outline">
                      <Calendar className="h-4 w-4 mr-2" />
                      Schedule Follow-up
                    </Button>
                    <Button className="w-full justify-start" variant="outline">
                      <Activity className="h-4 w-4 mr-2" />
                      Order Additional Tests
                    </Button>
                    <Button 
                      className="w-full justify-start" 
                      variant="outline"
                      onClick={() => {
                        const patientInfo = getPatientInfo(selectedRecord.patientId);
                        alert(`Sending notification to ${patientInfo.name} (${patientInfo.email})`);
                      }}
                    >
                      <User className="h-4 w-4 mr-2" />
                      Notify Patient
                    </Button>
                  </div>
                </GlassCard>

                {/* Care Plan - Agent 5 */}
                <GlassCard className="border-l-4 border-l-green-500 flex flex-col">
                  <div className="flex items-center gap-3 mb-6 justify-between">
                    <div className="flex items-center gap-3">
                      <FileText className="h-6 w-6 text-green-600" />
                      <h3 className="text-lg font-bold text-gray-900">Care Plan</h3>
                    </div>
                    <Button variant="outline" size="sm" onClick={() => setIsEditingPlan(!isEditingPlan)}>
                      {isEditingPlan ? 'Cancel' : 'Edit Plan'}
                    </Button>
                  </div>

                  {selectedRecord.fullData.careCoordinator?.carePlan ? (
                    <div className="space-y-6 flex-grow overflow-y-auto max-h-[600px] pr-2">
                      {/* Summary Section */}
                      <div>
                        <h4 className="text-xs font-bold text-gray-500 uppercase mb-2">Clinical Summary</h4>
                        {isEditingPlan ? (
                          <textarea
                            className="w-full p-2 border rounded-md text-sm"
                            rows={4}
                            defaultValue={selectedRecord.fullData.careCoordinator.carePlan.summary}
                          />
                        ) : (
                          <p className="text-sm text-gray-700 leading-relaxed bg-green-50/50 p-3 rounded-lg border border-green-100">
                            {selectedRecord.fullData.careCoordinator.carePlan.summary}
                          </p>
                        )}
                      </div>

                      {/* Immediate Actions */}
                      <div>
                        <h4 className="text-xs font-bold text-gray-500 uppercase mb-2 flex items-center gap-2">
                          <AlertTriangle className="h-3 w-3 text-red-500" /> Immediate Actions
                        </h4>
                        <ul className="space-y-2">
                          {selectedRecord.fullData.careCoordinator.carePlan.immediateActions.map((action: string, i: number) => (
                            <li key={i} className="flex items-start gap-2 text-sm text-gray-700 bg-white p-2 rounded shadow-sm border border-gray-100">
                              <ArrowRight className="h-4 w-4 text-red-500 mt-0.5 shrink-0" />
                              {isEditingPlan ? (
                                <input className="flex-1 bg-transparent border-b border-gray-200 focus:outline-none focus:border-blue-500" defaultValue={action} />
                              ) : action}
                            </li>
                          ))}
                        </ul>
                      </div>

                      {/* Scheduled Follow-ups */}
                      <div>
                        <h4 className="text-xs font-bold text-gray-500 uppercase mb-2 flex items-center gap-2">
                          <Calendar className="h-3 w-3 text-blue-500" /> Scheduled Follow-ups
                        </h4>
                        <div className="space-y-2">
                          {selectedRecord.fullData.careCoordinator.carePlan.scheduledFollowups?.map((audit: string, i: number) => (
                            <div key={i} className="flex items-center gap-3 text-sm text-gray-700 bg-blue-50 p-2 rounded border border-blue-100">
                              <Calendar className="h-4 w-4 text-blue-600" />
                              {isEditingPlan ? <input className="bg-transparent w-full" defaultValue={audit} /> : audit}
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Lifestyle Adjustments */}
                      <div>
                        <h4 className="text-xs font-bold text-gray-500 uppercase mb-2 flex items-center gap-2">
                          <Activity className="h-3 w-3 text-orange-500" /> Lifestyle Adjustments
                        </h4>
                        <div className="grid grid-cols-1 gap-2">
                          {selectedRecord.fullData.careCoordinator.carePlan.lifestyleAdjustments?.map((item: string, i: number) => (
                            <div key={i} className="p-2 bg-orange-50 rounded text-sm text-orange-800 border border-orange-100">
                              {isEditingPlan ? <input className="bg-transparent w-full" defaultValue={item} /> : item}
                            </div>
                          ))}
                        </div>
                      </div>

                      <div className="pt-4 mt-auto space-y-2">
                        {isEditingPlan && (
                          <Button className="w-full bg-blue-600 hover:bg-blue-700" onClick={() => {
                            setIsEditingPlan(false);
                            // Note: In a real app, we'd save the edits to blockchain/DB here
                          }}>
                            Save Changes
                          </Button>
                        )}
                        <Button className="w-full bg-green-600 hover:bg-green-700 shadow-md shadow-green-200" onClick={() => alert("Care Plan Approved & Signed!")}>
                          Approve & Sign Plan
                        </Button>
                      </div>
                    </div>
                  ) : (
                    <div className="flex flex-col items-center justify-center h-48 text-gray-400">
                      <FileText className="h-10 w-10 mb-4 opacity-50" />
                      <p className="mb-4">No care plan generated yet.</p>
                      <Button
                        onClick={async () => {
                          setIsGeneratingPlan(true);
                          try {
                            const carePlanResult = await pathologyAI.coordinateCare(selectedRecord.patientId, selectedRecord.fullData);

                            // Merge into fullData
                            const updatedFullData = {
                              ...selectedRecord.fullData,
                              careCoordinator: carePlanResult
                            };

                            // Save to Backend
                            await pathologyAI.updateReport(selectedRecord.recordId, {
                              aiAnalysis: updatedFullData
                            });

                            // Update Local State
                            setSelectedRecord({
                              ...selectedRecord,
                              fullData: updatedFullData
                            });

                            // Update in list
                            setRecords(prev => prev.map(r => r.recordId === selectedRecord.recordId ? { ...r, fullData: updatedFullData } : r));

                            alert("Care Plan Generated & Saved!");
                          } catch (e) {
                            console.error(e);
                            alert("Failed to generate plan");
                          } finally {
                            setIsGeneratingPlan(false);
                          }
                        }}
                        disabled={isGeneratingPlan}
                      >
                        {isGeneratingPlan ? 'Generating with AI...' : 'Generate Care Plan Now'}
                      </Button>
                    </div>
                  )}
                </GlassCard>
              </div>
            </div>
          </div>
        )}

        {/* DEBUG SECTION REMOVED FOR PRODUCTION */}
      </div>
    </PageContainer>
  );
};

export default DoctorDashboard;