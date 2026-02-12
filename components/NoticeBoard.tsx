
import React, { useState } from 'react';
import { Card } from './common/Card';
import { type Notice, UserRole } from '../types';

interface NoticeBoardProps {
  notices: Notice[];
  onAddNotice: (noticeData: Omit<Notice, 'id' | 'date' | 'issuedBy'>) => void;
}

const audienceOptions = [
    { role: UserRole.Student, label: 'Students' },
    { role: UserRole.Teacher, label: 'Teachers' },
    { role: UserRole.Parent, label: 'Parents' },
];

export const NoticeBoard: React.FC<NoticeBoardProps> = ({ notices, onAddNotice }) => {
    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');
    const [targetAudience, setTargetAudience] = useState<UserRole[]>([]);

    const handleAudienceChange = (role: UserRole) => {
        setTargetAudience(prev => 
            prev.includes(role) 
            ? prev.filter(r => r !== role) 
            : [...prev, role]
        );
    };
    
    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!title.trim() || !content.trim() || targetAudience.length === 0) {
            alert('Please fill all fields and select an audience.');
            return;
        }
        onAddNotice({ title, content, targetAudience });
        setTitle('');
        setContent('');
        setTargetAudience([]);
    };

    return (
        <div className="space-y-6">
            <h1 className="text-3xl font-bold text-gray-800">Issue a Notice</h1>
            <p className="text-gray-500">Create and send notices to different user groups.</p>
            
            <Card>
                <h2 className="text-xl font-bold text-gray-800 mb-4">New Notice Form</h2>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label htmlFor="title" className="block text-sm font-medium text-gray-700">Notice Title</label>
                        <input
                            type="text"
                            id="title"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                            placeholder="e.g., Holiday Announcement"
                            required
                        />
                    </div>
                    <div>
                        <label htmlFor="content" className="block text-sm font-medium text-gray-700">Message</label>
                        <textarea
                            id="content"
                            value={content}
                            onChange={(e) => setContent(e.target.value)}
                            rows={4}
                            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                            placeholder="Enter the full notice details here..."
                            required
                        ></textarea>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Target Audience</label>
                        <div className="flex flex-wrap gap-4">
                            {audienceOptions.map(({ role, label }) => (
                                <label key={role} className="flex items-center space-x-2">
                                    <input
                                        type="checkbox"
                                        checked={targetAudience.includes(role)}
                                        onChange={() => handleAudienceChange(role)}
                                        className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                                    />
                                    <span className="text-sm text-gray-800">{label}</span>
                                </label>
                            ))}
                        </div>
                    </div>
                    <div className="flex justify-end">
                        <button type="submit" className="bg-blue-600 text-white py-2 px-4 rounded-md shadow-sm text-sm font-medium hover:bg-blue-700">
                            Issue Notice
                        </button>
                    </div>
                </form>
            </Card>

            <Card>
                <h2 className="text-xl font-bold text-gray-800 mb-4">Issued Notices</h2>
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead className="border-b bg-gray-50">
                            <tr>
                                <th className="p-3 text-sm font-semibold text-gray-600">Date</th>
                                <th className="p-3 text-sm font-semibold text-gray-600">Title</th>
                                <th className="p-3 text-sm font-semibold text-gray-600 hidden md:table-cell">Audience</th>
                            </tr>
                        </thead>
                        <tbody>
                            {notices.map(notice => (
                                <tr key={notice.id} className="border-b hover:bg-gray-50">
                                    <td className="p-3 text-gray-700 whitespace-nowrap">{new Date(notice.date).toLocaleDateString()}</td>
                                    <td className="p-3 font-medium text-gray-800">{notice.title}</td>
                                    <td className="p-3 text-gray-700 hidden md:table-cell">
                                        <div className="flex flex-wrap gap-1">
                                            {notice.targetAudience.map(role => (
                                                <span key={role} className="bg-gray-200 text-gray-700 text-xs font-medium px-2 py-0.5 rounded-full">
                                                    {role}
                                                </span>
                                            ))}
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </Card>
        </div>
    );
};