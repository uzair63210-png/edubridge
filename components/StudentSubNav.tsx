import React from 'react';
import { View } from '../types';
import { StudentsIcon, DocsIcon, FeesIcon, SkillsIcon } from './icons/Icons';

interface StudentSubNavProps {
    view: View;
    setView: (view: View) => void;
}

const SubNavItem: React.FC<{icon: React.ReactNode, label: string, isActive: boolean, onClick: () => void}> = ({ icon, label, isActive, onClick }) => {
    return (
        <button 
            onClick={onClick}
            className={`flex items-center gap-3 px-4 py-2 rounded-lg font-medium text-sm transition-colors ${isActive ? 'bg-blue-600 text-white shadow' : 'bg-white hover:bg-gray-100 text-gray-700'}`}
        >
            {icon}
            {label}
        </button>
    )
}

export const StudentSubNav: React.FC<StudentSubNavProps> = ({ view, setView }) => {
    const navItems = [
        { view: View.Students, icon: <StudentsIcon className="w-5 h-5" />, label: 'Profile' },
        { view: View.Skills, icon: <SkillsIcon className="w-5 h-5" />, label: 'Skills' },
        { view: View.Documents, icon: <DocsIcon className="w-5 h-5" />, label: 'Documents' },
        { view: View.Fees, icon: <FeesIcon className="w-5 h-5" />, label: 'Fee Payment' },
    ]

    return (
        <div className="mb-6 p-2 bg-gray-200 rounded-xl shadow-sm flex items-center justify-center gap-2 flex-wrap">
            {navItems.map(item => (
                <SubNavItem
                    key={item.label}
                    icon={item.icon}
                    label={item.label}
                    isActive={view === item.view}
                    onClick={() => setView(item.view)}
                />
            ))}
        </div>
    )
}