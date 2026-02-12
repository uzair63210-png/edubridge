
import React from 'react';
import { Card } from './common/Card';
import { type ClassData } from '../types';
import { DocsIcon } from './icons/Icons';

interface EContentViewProps {
    classData: ClassData;
}

const getIconForType = (type: 'pdf' | 'note' | 'video') => {
    switch(type) {
        case 'pdf': return '📄';
        case 'video': return '🎥';
        case 'note': return '📝';
        default: return '🔗';
    }
}

export const EContentView: React.FC<EContentViewProps> = ({ classData }) => {
    const sortedContent = [...classData.eContent].sort((a,b) => new Date(b.date).getTime() - new Date(a.date).getTime());

    return (
        <div className="space-y-6">
            <h1 className="text-3xl font-bold text-gray-800">E-Content</h1>
            <p className="text-gray-500">Here you can find all the notes, documents, and links shared by your teachers.</p>
            
            <Card>
                <div className="space-y-4">
                    {sortedContent.length > 0 ? sortedContent.map(item => (
                        <div key={item.id} className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50 transition-colors">
                           <div className="flex items-center gap-4">
                             <span className="text-2xl">{getIconForType(item.type)}</span>
                             <div>
                                <p className="font-semibold text-gray-800">{item.title}</p>
                                <p className="text-sm text-gray-500">
                                    Shared by {item.uploadedBy} on {new Date(item.date).toLocaleDateString()}
                                </p>
                             </div>
                           </div>
                           <a 
                             href={item.url} 
                             download 
                             className="bg-blue-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-blue-700 transition-colors shadow text-sm"
                           >
                             Download
                           </a>
                        </div>
                    )) : (
                        <div className="text-center py-12 text-gray-500">
                            <DocsIcon className="w-12 h-12 mx-auto text-gray-400" />
                            <h3 className="mt-2 text-lg font-medium">No Content Yet</h3>
                            <p className="mt-1 text-sm">Your teacher hasn't shared any E-Content for this class.</p>
                        </div>
                    )}
                </div>
            </Card>
        </div>
    );
};