
import React, { useState } from 'react';
import { Card } from './common/Card';
import { type ClassData, type EContentItem } from '../types';
import { CloseIcon } from './icons/Icons';

interface ManageEContentViewProps {
    classData: ClassData;
    onAddContent: (contentData: Omit<EContentItem, 'id' | 'date' | 'uploadedBy' | 'url'>) => void;
    onDeleteContent: (contentId: string) => void;
}

export const ManageEContentView: React.FC<ManageEContentViewProps> = ({ classData, onAddContent, onDeleteContent }) => {
    const [title, setTitle] = useState('');
    const [type, setType] = useState<'pdf' | 'note' | 'video'>('pdf');
    const sortedContent = [...classData.eContent].sort((a,b) => new Date(b.date).getTime() - new Date(a.date).getTime());

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (title.trim()) {
            onAddContent({ title, type });
            setTitle('');
            setType('pdf');
        }
    };

    return (
        <div className="space-y-6">
            <h1 className="text-3xl font-bold text-gray-800">Manage E-Content</h1>
            <p className="text-gray-500">Upload and manage academic materials for your class.</p>

            <Card>
                <h2 className="text-xl font-bold text-gray-800 mb-4">Upload New Content</h2>
                <form onSubmit={handleSubmit} className="flex flex-col md:flex-row gap-4 items-end p-4 bg-gray-50 rounded-lg border">
                    <div className="flex-1 w-full">
                        <label htmlFor="content-title" className="block text-sm font-medium text-gray-700">Title</label>
                        <input
                            id="content-title"
                            type="text"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            placeholder="e.g., Chapter 5: Fractions - Notes"
                            required
                            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm"
                        />
                    </div>
                     <div className="w-full md:w-auto">
                        <label htmlFor="content-type" className="block text-sm font-medium text-gray-700">Type</label>
                        <select
                            id="content-type"
                            value={type}
                            onChange={(e) => setType(e.target.value as any)}
                            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm"
                        >
                            <option value="pdf">PDF</option>
                            <option value="note">Note</option>
                            <option value="video">Video Link</option>
                        </select>
                    </div>
                    <button type="submit" className="w-full md:w-auto bg-blue-600 text-white py-2 px-5 rounded-md shadow-sm font-medium hover:bg-blue-700">
                        Upload
                    </button>
                </form>
            </Card>

            <Card>
                <h2 className="text-xl font-bold text-gray-800 mb-4">Uploaded Content</h2>
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead className="border-b bg-gray-50">
                            <tr>
                                <th className="p-3 text-sm font-semibold text-gray-600">Title</th>
                                <th className="p-3 text-sm font-semibold text-gray-600 hidden md:table-cell">Type</th>
                                <th className="p-3 text-sm font-semibold text-gray-600 hidden md:table-cell">Date</th>
                                <th className="p-3 text-sm font-semibold text-gray-600 text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {sortedContent.length > 0 ? sortedContent.map(item => (
                                <tr key={item.id} className="border-b hover:bg-gray-50">
                                    <td className="p-3 font-medium text-gray-800">{item.title}</td>
                                    <td className="p-3 text-gray-700 hidden md:table-cell">
                                        <span className="bg-gray-200 text-gray-700 text-xs font-medium px-2 py-1 rounded-full capitalize">{item.type}</span>
                                    </td>
                                    <td className="p-3 text-gray-700 hidden md:table-cell">{new Date(item.date).toLocaleDateString()}</td>
                                    <td className="p-3 text-right">
                                        <button 
                                            onClick={() => onDeleteContent(item.id)}
                                            className="text-red-500 hover:text-red-700 p-1"
                                            aria-label={`Delete ${item.title}`}
                                        >
                                            <CloseIcon className="w-5 h-5" />
                                        </button>
                                    </td>
                                </tr>
                            )) : (
                                <tr>
                                    <td colSpan={4} className="text-center p-8 text-gray-500">
                                        You have not uploaded any content for this class yet.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </Card>
        </div>
    );
};