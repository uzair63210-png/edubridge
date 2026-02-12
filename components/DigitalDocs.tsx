
import React, { useState } from 'react';
import { UserRole, View, type Student, type DigitalDocument } from '../types';
import { Card } from './common/Card';
import { StudentSubNav } from './StudentSubNav';

interface DigitalDocsProps {
  student: Student;
  userRole: UserRole;
  view: View;
  setView: (view: View) => void;
  onAddDocument?: (docData: Omit<DigitalDocument, 'id' | 'date' | 'uploadedBy' | 'url'>) => void;
}

type DocView = 'official' | 'generate' | 'request';

const DocumentGenerator: React.FC<{ 
  student: Student;
  onAddDocument?: (docData: Omit<DigitalDocument, 'id' | 'date' | 'uploadedBy' | 'url'>) => void;
}> = ({ student, onAddDocument }) => {
    const [docType, setDocType] = useState<'transfer' | 'report' | null>(null);
    const today = new Date().toLocaleDateString('en-CA');

    const handleGenerateAndSave = (docTypeToSave: 'transfer' | 'report') => {
        if (onAddDocument) {
            const docTypeLabel = docTypeToSave === 'transfer' ? 'Transfer Certificate' : 'Report Card';
            onAddDocument({
                title: `${docTypeLabel} - ${student.name}`,
                documentType: docTypeToSave === 'transfer' ? 'Marksheet' : 'Other'
            });
            // Show success message
            alert(`${docTypeLabel} has been generated and added to Official Documents!`);
        } else {
            alert('Unable to save document. Please try again.');
        }
    };

    const renderDocument = () => {
        if (!docType) {
            return (
                <div className="text-center text-gray-500 py-12">
                    <p>Select a document type to generate.</p>
                </div>
            );
        }

        const docContent = (
          <div className="bg-white p-8 md:p-12 border-4 border-blue-200 min-h-[600px] font-serif">
              <div className="text-center mb-8">
                  <h1 className="text-3xl font-bold text-blue-800">GOVERNMENT SENIOR SECONDARY SCHOOL</h1>
                  <p className="text-gray-600">District Education Office, Capital City</p>
                  <hr className="my-4"/>
                  <h2 className="text-2xl font-semibold tracking-widest uppercase">
                    {docType === 'transfer' ? 'Transfer Certificate' : 'Student Report Card'}
                  </h2>
              </div>

              {docType === 'transfer' && (
                  <div className="space-y-6 text-lg">
                      <p>This is to certify that <span className="font-bold">{student.name}</span>, Roll Number <span className="font-bold">{student.rollNumber}</span>, was a bonafide student of this school in Class <span className="font-bold">{student.class}</span>.</p>
                      <p>According to the school records, their date of birth is not available on file. Their guardian is <span className="font-bold">{student.guardianName}</span>.</p>
                      <p>They have paid all school dues up to date and their character and conduct have been satisfactory.</p>
                      <p>We wish them all the best for their future endeavors.</p>
                      <div className="flex justify-between items-end pt-16">
                            <div>
                                <p>Date: {today}</p>
                            </div>
                            <div className="text-center">
                                <p className="border-t-2 border-gray-600 pt-2">Signature of Principal</p>
                            </div>
                      </div>
                  </div>
              )}
              
              {docType === 'report' && (
                  <div>
                      <div className="grid grid-cols-2 gap-4 mb-8 text-lg">
                          <p><strong>Student Name:</strong> {student.name}</p>
                          <p><strong>Class:</strong> {student.class}</p>
                          <p><strong>Roll Number:</strong> {student.rollNumber}</p>
                          <p><strong>Academic Year:</strong> 2023-2024</p>
                      </div>
                      <table className="w-full border-collapse border border-gray-400">
                          <thead>
                              <tr className="bg-blue-100">
                                  <th className="border border-gray-400 p-3 text-left">Subject</th>
                                  <th className="border border-gray-400 p-3 text-center">Marks Obtained</th>
                                  <th className="border border-gray-400 p-3 text-center">Total Marks</th>
                                  <th className="border border-gray-400 p-3 text-left">Remarks</th>
                              </tr>
                          </thead>
                          <tbody>
                              {student.scores.map(s => (
                                  <tr key={s.subject}>
                                      <td className="border border-gray-400 p-3">{s.subject}</td>
                                      <td className="border border-gray-400 p-3 text-center">{s.score}</td>
                                      <td className="border border-gray-400 p-3 text-center">100</td>
                                      <td className="border border-gray-400 p-3">{s.score >= 90 ? 'Excellent' : s.score >= 75 ? 'Good' : s.score >= 50 ? 'Satisfactory' : 'Needs Improvement'}</td>
                                  </tr>
                              ))}
                          </tbody>
                      </table>
                       <div className="flex justify-between items-end pt-16">
                            <div className="text-center">
                                <p className="border-t-2 border-gray-600 pt-2">Class Teacher's Signature</p>
                            </div>
                            <div className="text-center">
                                <p className="border-t-2 border-gray-600 pt-2">Principal's Signature</p>
                            </div>
                      </div>
                  </div>
              )}
          </div>
        );

        return (
            <Card>
                {docContent}
                <div className="flex gap-4 justify-center mt-6">
                    <button onClick={() => window.print()} className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors">
                        Print / Download PDF
                    </button>
                    <button onClick={() => handleGenerateAndSave(docType)} className="bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700 transition-colors">
                        Save to Official Documents
                    </button>
                </div>
            </Card>
        );
    };

    return (
        <div className="space-y-4">
             <div className="flex space-x-4">
                <button onClick={() => setDocType('transfer')} className={`px-5 py-2 rounded-lg font-medium ${docType === 'transfer' ? 'bg-blue-600 text-white' : 'bg-white shadow'}`}>
                    Transfer Certificate
                </button>
                <button onClick={() => setDocType('report')} className={`px-5 py-2 rounded-lg font-medium ${docType === 'report' ? 'bg-blue-600 text-white' : 'bg-white shadow'}`}>
                    Report Card
                </button>
            </div>
            {renderDocument()}
        </div>
    )
}

const RequestDocumentsView: React.FC = () => {
    const [requestedDocs, setRequestedDocs] = useState<string[]>([]);

    const documentOptions = [
        { id: 'transfer', label: 'Transfer Certificate', description: 'For school transfer purposes' },
        { id: 'report', label: 'Report Card', description: 'Academic performance report' },
        { id: 'bonafide', label: 'Bonafide Certificate', description: 'For higher education applications' },
    ];

    const handleRequestDocument = (docId: string) => {
        if (!requestedDocs.includes(docId)) {
            setRequestedDocs([...requestedDocs, docId]);
        }
    };

    const handleCancelRequest = (docId: string) => {
        setRequestedDocs(requestedDocs.filter(d => d !== docId));
    };

    return (
        <Card>
            <div className="space-y-4">
                <div className="bg-blue-50 border border-blue-200 p-4 rounded-lg">
                    <h3 className="font-semibold text-blue-900 mb-2">Request Documents</h3>
                    <p className="text-sm text-blue-700">Select the documents you need. Teachers and admins will review and generate them, then they will appear in your Official Documents section.</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {documentOptions.map(doc => (
                        <div key={doc.id} className="border border-gray-300 rounded-lg p-4 hover:shadow-md transition-shadow">
                            <h4 className="font-semibold text-gray-800">{doc.label}</h4>
                            <p className="text-sm text-gray-600 mb-3">{doc.description}</p>
                            {requestedDocs.includes(doc.id) ? (
                                <div className="flex items-center gap-2">
                                    <svg className="w-5 h-5 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                    </svg>
                                    <button onClick={() => handleCancelRequest(doc.id)} className="text-sm text-green-600 hover:text-green-700 font-medium">
                                        Cancel Request
                                    </button>
                                </div>
                            ) : (
                                <button onClick={() => handleRequestDocument(doc.id)} className="w-full bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium">
                                    Request Document
                                </button>
                            )}
                        </div>
                    ))}
                </div>

                {requestedDocs.length > 0 && (
                    <div className="bg-green-50 border border-green-200 p-4 rounded-lg">
                        <p className="text-sm text-green-700">
                            You have requested {requestedDocs.length} document{requestedDocs.length !== 1 ? 's' : ''}. Your requests will be reviewed by the school administration.
                        </p>
                    </div>
                )}
            </div>
        </Card>
    );
};

export const OfficialDocumentsView: React.FC<{student: Student}> = ({ student }) => (
    <Card>
        <ul className="space-y-3">
            {student.digitalDocuments.length > 0 ? student.digitalDocuments.map(doc => (
                <li key={doc.id} className="flex justify-between items-center p-4 bg-white rounded-md border border-l-4 border-l-blue-500">
                    <div>
                        <p className="font-semibold text-gray-800">{doc.title}</p>
                        <p className="text-sm text-gray-500">{doc.documentType} - Uploaded on {new Date(doc.date).toLocaleDateString()}</p>
                    </div>
                    <a href={doc.url} download className="bg-blue-100 text-blue-700 px-4 py-1.5 rounded-md text-sm font-medium hover:bg-blue-200">
                        Download
                    </a>
                </li>
            )) : (
                <p className="text-center text-gray-500 py-10">No official documents have been uploaded by the administration yet.</p>
            )}
        </ul>
    </Card>
);

export const DigitalDocs: React.FC<DigitalDocsProps> = ({ student, userRole, view, setView, onAddDocument }) => {
    const [docView, setDocView] = useState<DocView>('official');
    const canGenerate = userRole === UserRole.Admin || userRole === UserRole.Teacher;
    const canRequest = userRole === UserRole.Parent;
    
    return (
        <div className="space-y-6">
            {userRole === UserRole.Admin && <StudentSubNav view={view} setView={setView} />}
            <h1 className="text-3xl font-bold text-gray-800">My Documents</h1>

            <div className="border-b border-gray-200">
                <nav className="-mb-px flex space-x-6">
                    <button
                        onClick={() => setDocView('official')}
                        className={`py-3 px-1 border-b-2 font-medium text-sm ${docView === 'official' ? 'border-blue-500 text-blue-600' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}`}
                    >
                        Official Documents
                    </button>
                    {canGenerate && (
                        <button
                            onClick={() => setDocView('generate')}
                            className={`py-3 px-1 border-b-2 font-medium text-sm ${docView === 'generate' ? 'border-blue-500 text-blue-600' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}`}
                        >
                            Generate Documents
                        </button>
                    )}
                    {canRequest && (
                        <button
                            onClick={() => setDocView('request')}
                            className={`py-3 px-1 border-b-2 font-medium text-sm ${docView === 'request' ? 'border-blue-500 text-blue-600' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}`}
                        >
                            Request Documents
                        </button>
                    )}
                </nav>
            </div>

            {docView === 'official' && <OfficialDocumentsView student={student} />}
            {docView === 'generate' && canGenerate && <DocumentGenerator student={student} onAddDocument={onAddDocument} />}
            {docView === 'request' && canRequest && <RequestDocumentsView />}
        </div>
    );
};