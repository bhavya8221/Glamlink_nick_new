"use client";

import React, { useState } from 'react';
import { useAppSelector } from "@/store/hooks";
import { useQuestionnaireData } from '../../hooks/questionnaire/useQuestionnaireData';
import { useFileUpload } from '../../hooks/questionnaire/useFileUpload';
import { useContentGeneration } from '../../hooks/questionnaire/useContentGeneration';
import QuestionnaireWizard from '../questionnaire/QuestionnaireWizard';
import GeneratedContentPreview from '../questionnaire/GeneratedContentPreview';
import { BrandQuestionnaireData } from '../../types';
import GenerationProgressDialog from '../shared/dialogs/GenerationProgressDialog';
import { GenerationStep } from '../../types';


type ContentState = 'questionnaire' | 'preview' | 'completed';

export default function BrainstormQuestionnaireTab() {
  const { user } = useAppSelector((state) => state.auth);
  const [contentState, setContentState] = useState<ContentState>('questionnaire');
  const [useExistingData, setUseExistingData] = useState(true);
  
  // Custom hooks
  const { savedQuestionnaire, isLoading, saveProgress } = useQuestionnaireData(user?.uid);
  const { uploadedData, uploadError, fileInputRef, handleFileUpload, clearUploadedData } = useFileUpload();
  const {
    generatedContent,
    isRegenerating,
    generationSteps,
    currentStepId,
    showProgressDialog,
    generateContent,
    regenerateContent,
    acceptContent,
    resetContent,
    setShowProgressDialog
  } = useContentGeneration();
  
  // Progress dialog state for saving
  const [saveSteps, setSaveSteps] = useState<GenerationStep[]>([]);
  const [showSaveDialog, setShowSaveDialog] = useState(false);

  const handleDownloadSample = () => {
    window.open('/sample-requirements.txt', '_blank');
  };
  
  const handleSaveProgress = async (data: BrandQuestionnaireData) => {
    if (!user?.uid) return;
    
    // Show a simple progress indicator
    setSaveSteps([
      { id: 'save', label: 'Saving your questionnaire progress...', status: 'processing' }
    ]);
    setShowSaveDialog(true);
    
    const success = await saveProgress(data);
    
    if (success) {
      setSaveSteps([
        { id: 'save', label: 'Questionnaire progress saved successfully!', status: 'completed' }
      ]);
    } else {
      setSaveSteps([
        { id: 'save', label: 'Failed to save progress', status: 'error', error: 'Please try again' }
      ]);
    }
    
    // Close dialog after delay
    setTimeout(() => {
      setShowSaveDialog(false);
    }, 1500);
  };
  
  if (!user?.brandId || user.email === 'admin@glamlink.net') {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500">Questionnaire is not available for this account type.</p>
      </div>
    );
  }

  const handleGenerate = async (data: any) => {
    if (!user?.uid || !user?.brandId) {
      // Missing user ID or brand ID - user not properly authenticated
      alert('User not properly authenticated. Please try logging out and back in.');
      return;
    }

    const success = await generateContent({
      brandId: user.brandId, // Now guaranteed to be string
      brandName: user.displayName || 'Your Brand',
      userId: user.uid,
      questionnaireData: data
    });

    if (success) {
      setContentState('preview');
    }
  };

  const handleRegenerate = async (contentType: 'products' | 'providers' | 'training' | 'beforeAfter', feedback: string) => {
    if (!user?.brandId) return;
    await regenerateContent(user.brandId, contentType, feedback);
  };

  const handleAccept = async () => {
    if (!user?.brandId) return;

    const success = await acceptContent(user.brandId);
    if (success) {
      setContentState('completed');
      
      // Reset after a delay
      setTimeout(() => {
        setContentState('questionnaire');
        resetContent();
      }, 3000);
    }
  };

  const handleFileUploadWithToggle = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const success = await handleFileUpload(event);
    if (success) {
      setUseExistingData(false); // Don't use saved data when uploading
    }
  };

  if (contentState === 'completed') {
    return (
      <div className="min-h-[600px] flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h3 className="text-xl font-semibold text-gray-900 mb-2">Content Added Successfully!</h3>
          <p className="text-gray-600">Your brand has been populated with the generated content.</p>
        </div>
      </div>
    );
  }

  if (contentState === 'preview' && generatedContent) {
    return (
      <GeneratedContentPreview
        products={generatedContent.products}
        providers={generatedContent.providers}
        trainingPrograms={generatedContent.trainingPrograms}
        beforeAfters={generatedContent.beforeAfters}
        onAccept={handleAccept}
        onRegenerate={handleRegenerate}
        isRegenerating={isRegenerating}
      />
    );
  }

  if (isLoading) {
    return (
      <div className="min-h-[400px] flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-glamlink-teal mx-auto mb-4"></div>
          <p className="text-gray-600">Loading questionnaire...</p>
        </div>
      </div>
    );
  }

  return (
    <>
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900">Brand Setup Wizard</h2>
        <p className="text-gray-600 mt-1">
          {savedQuestionnaire 
            ? "Continue refining your brand setup or generate new content based on your saved preferences"
            : "Tell us about your brand vision and we'll generate everything you need to get started"}
        </p>
      </div>

      {/* File Upload Section */}
      <div className="bg-gradient-to-r from-purple-50 to-blue-50 border border-purple-200 rounded-lg p-6">
        <div className="flex items-start space-x-4">
          <div className="flex-shrink-0">
            <svg className="w-8 h-8 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
            </svg>
          </div>
          <div className="flex-1">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Quick Start with Requirements File</h3>
            <p className="text-sm text-gray-600 mb-4">
              Upload a requirements.txt file to instantly populate all questionnaire fields. This is perfect for quickly setting up your brand profile.
            </p>
            
            {uploadedData && (
              <div className="bg-green-50 border border-green-200 rounded-lg p-3 mb-4">
                <div className="flex items-center">
                  <svg className="w-5 h-5 text-green-600 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <span className="text-sm text-green-800 font-medium">File uploaded successfully! Data ready to use.</span>
                  <button
                    onClick={clearUploadedData}
                    className="ml-auto text-green-600 hover:text-green-800"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
              </div>
            )}
            
            {uploadError && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-3 mb-4">
                <div className="flex items-start">
                  <svg className="w-5 h-5 text-red-600 mr-2 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <div className="flex-1">
                    <p className="text-sm text-red-800 font-medium">Upload Error</p>
                    <pre className="text-xs text-red-700 mt-1 whitespace-pre-wrap">{uploadError}</pre>
                  </div>
                  <button
                    onClick={() => clearUploadedData()}
                    className="text-red-600 hover:text-red-800"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
              </div>
            )}
            
            <div className="flex items-center space-x-4">
              <label className="flex-1">
                <input
                  ref={fileInputRef}
                  type="file"
                  accept=".txt"
                  onChange={handleFileUploadWithToggle}
                  className="hidden"
                />
                <div className="px-4 py-2 bg-purple-600 text-white rounded-lg font-medium hover:bg-purple-700 transition-colors cursor-pointer text-center">
                  Upload requirements.txt
                </div>
              </label>
              <button
                onClick={handleDownloadSample}
                className="px-4 py-2 bg-white text-purple-600 border border-purple-300 rounded-lg font-medium hover:bg-purple-50 transition-colors"
              >
                Download Sample
              </button>
            </div>
          </div>
        </div>
      </div>

      {savedQuestionnaire && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-4">
          <div className="flex items-start">
            <svg className="w-5 h-5 text-blue-600 mt-0.5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <div className="flex-1">
              <p className="text-sm text-blue-800 mb-3">
                <strong>Previous questionnaire found!</strong> Your answers have been loaded. 
                You can modify them or generate new content based on your existing preferences.
              </p>
              <div className="flex gap-3">
                <button
                  onClick={() => {
                    setUseExistingData(true);
                    clearUploadedData(); // Clear uploaded data when using saved data
                  }}
                  className={`px-4 py-2 text-sm rounded-lg font-medium transition-colors ${
                    useExistingData 
                      ? 'bg-blue-600 text-white' 
                      : 'bg-white text-blue-600 border border-blue-300 hover:bg-blue-50'
                  }`}
                >
                  Continue with saved data
                </button>
                <button
                  onClick={() => setUseExistingData(false)}
                  className={`px-4 py-2 text-sm rounded-lg font-medium transition-colors ${
                    !useExistingData 
                      ? 'bg-blue-600 text-white' 
                      : 'bg-white text-blue-600 border border-blue-300 hover:bg-blue-50'
                  }`}
                >
                  Start fresh
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      <QuestionnaireWizard
        brandId={user.brandId}
        brandName={user.displayName || 'Your Brand'}
        onComplete={handleGenerate}
        onSaveProgress={handleSaveProgress}
        initialData={uploadedData || (savedQuestionnaire && useExistingData ? savedQuestionnaire : null)}
      />
    </div>
    
    <GenerationProgressDialog
      isOpen={showProgressDialog}
      steps={generationSteps}
      currentStep={currentStepId}
      onClose={() => setShowProgressDialog(false)}
      allowClose={generationSteps.some(step => step.status === 'error')}
    />
    
    <GenerationProgressDialog
      isOpen={showSaveDialog}
      steps={saveSteps}
      currentStep="save"
      onClose={() => setShowSaveDialog(false)}
      allowClose={true}
    />
    </>
  );
}