
import React, { useState } from 'react';
import { View, UserRole, type Student, type SchoolData, type Teacher } from '../types';
import { DashboardIcon, StudentsIcon, DocsIcon, FeesIcon, CloseIcon, BuildingIcon, InboxIcon, LogoutIcon, TeacherIcon, BellIcon, UserCircleIcon } from './icons/Icons';

interface SidebarProps {
  displayedStudents: Student[];
  schoolData: SchoolData;
  selectedStudent: Student | null;
  onSelectStudent: (student: Student) => void;
  onSelectClass: (className: string) => void;
  selectedClass: string | null;
  view: View;
  setView: (view: View) => void;
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
  userRole: UserRole;
  isCollapsed: boolean;
  setIsCollapsed: (isCollapsed: boolean) => void;
  pendingRequests: number;
  loggedInTeacher: Teacher | null;
  onLogout: () => void;
  onChangePassword: () => void;
  adminProfilePic?: string;
  onUpdateAdminPic?: (newUrl: string) => void;
}

const NavItem: React.FC<{ icon: React.ReactNode; label: string; isActive: boolean; onClick: () => void; }> = ({ icon, label, isActive, onClick }) => (
    <button
        onClick={onClick}
        className={`flex items-center w-full px-4 py-2.5 text-left text-sm font-medium rounded-md transition-all duration-200 ${
        isActive
            ? 'bg-slate-900 text-white'
            : 'text-slate-300 hover:bg-slate-700 hover:text-white'
        }`}
    >
        {icon}
        <span className="ml-3">{label}</span>
    </button>
);

const LockIcon: React.FC<{className?: string}> = ({className}) => (
    <svg className={className} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect>
        <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
    </svg>
);

export const Sidebar: React.FC<SidebarProps> = ({ displayedStudents, schoolData, selectedStudent, onSelectStudent, onSelectClass, selectedClass, view, setView, isOpen, setIsOpen, userRole, isCollapsed, setIsCollapsed, pendingRequests, loggedInTeacher, onLogout, onChangePassword, adminProfilePic, onUpdateAdminPic }) => {
  const [isEditingAdminPic, setIsEditingAdminPic] = useState(false);
  const [tempAdminPic, setTempAdminPic] = useState(adminProfilePic || '');

  const adminNavs = [
      { view: View.Dashboard, icon: <DashboardIcon className="w-5 h-5" />, label: 'Dashboard' },
      { view: View.Classes, icon: <BuildingIcon className="w-5 h-5" />, label: 'Classes' },
      { view: View.Attendance, icon: <StudentsIcon className="w-5 h-5" />, label: 'Mark Attendance' },
      { view: View.Requests, icon: <InboxIcon className="w-5 h-5" />, label: 'Requests', badge: pendingRequests },
      { view: View.Notices, icon: <BellIcon className="w-5 h-5" />, label: 'Issue Notice' },
  ];
  const teacherNavs = [
      { view: View.Dashboard, icon: <DashboardIcon className="w-5 h-5" />, label: 'Class Dashboard' },
      { view: View.Students, icon: <StudentsIcon className="w-5 h-5" />, label: 'Student Details' },
      { view: View.Attendance, icon: <StudentsIcon className="w-5 h-5" />, label: 'Manage Attendance' },
      { view: View.Academics, icon: <DocsIcon className="w-5 h-5" />, label: 'Manage Scores' },
      { view: View.ManageEContent, icon: <DocsIcon className="w-5 h-5" />, label: 'Manage E-Content' },
  ];
  const studentNavs = [
      { view: View.Dashboard, icon: <DashboardIcon className="w-5 h-5" />, label: 'Dashboard' },
      { view: View.Students, icon: <StudentsIcon className="w-5 h-5" />, label: 'My Profile' },
      { view: View.EContent, icon: <DocsIcon className="w-5 h-5" />, label: 'E-Content' },
      { view: View.Documents, icon: <DocsIcon className="w-5 h-5" />, label: 'My Documents' },
      { view: View.Fees, icon: <FeesIcon className="w-5 h-5" />, label: 'Fees Payment' },
  ];
  const parentNavs = [
       { view: View.Students, icon: <StudentsIcon className="w-5 h-5" />, label: 'My Child\'s Profile' },
       { view: View.Dashboard, icon: <DashboardIcon className="w-5 h-5" />, label: 'Dashboard' },
      { view: View.Documents, icon: <DocsIcon className="w-5 h-5" />, label: 'Digital Docs' },
      { view: View.Fees, icon: <FeesIcon className="w-5 h-5" />, label: 'Fee Payment' },
  ];

  const navItems = {
    [UserRole.Admin]: adminNavs,
    [UserRole.Teacher]: teacherNavs,
    [UserRole.Parent]: parentNavs,
    [UserRole.Student]: studentNavs,
  };

  const getProfileData = () => {
    if (userRole === UserRole.Admin) {
        return { name: 'Admin', imageUrl: adminProfilePic, details: 'Administrator' };
    }
    if (userRole === UserRole.Teacher && loggedInTeacher) {
      return {
        name: loggedInTeacher.name,
        imageUrl: loggedInTeacher.profilePicUrl,
        details: 'Class Teacher'
      };
    }
    if ((userRole === UserRole.Student || userRole === UserRole.Parent) && selectedStudent) {
        return {
          name: selectedStudent.name,
          imageUrl: selectedStudent.profilePicUrl,
          details: `Class ${selectedStudent.class} | Roll No: ${selectedStudent.rollNumber}`
        };
    }
    return null;
  }

  const profileData = getProfileData();
  
  const handleSaveAdminPic = () => {
      if (onUpdateAdminPic) {
          onUpdateAdminPic(tempAdminPic);
          setIsEditingAdminPic(false);
      }
  }

  return (
    <>
      <div className={`fixed inset-y-0 left-0 z-30 bg-slate-800 text-slate-100 transform ${isOpen ? 'translate-x-0' : '-translate-x-full'} transition-transform duration-300 md:relative md:translate-x-0 md:flex md:flex-col w-64`}>
        <div className="flex items-center justify-center h-16 flex-shrink-0 bg-white text-gray-800">
             <h1 className="text-lg font-bold">EduBridge</h1>
        </div>

        {profileData && (
             <div className="p-4 my-2">
                <div className="flex items-center w-full text-left relative group">
                    {profileData.imageUrl ? (
                        <img src={profileData.imageUrl} alt={profileData.name} className="w-12 h-12 rounded-full border-2 border-slate-500 object-cover" />
                    ) : (
                        <div className="w-12 h-12 rounded-full border-2 border-slate-500 bg-slate-600 flex items-center justify-center text-slate-300">
                             <UserCircleIcon className="w-8 h-8"/>
                        </div>
                    )}
                    
                    {userRole === UserRole.Admin && (
                        <button 
                            onClick={() => {
                                setTempAdminPic(adminProfilePic || '');
                                setIsEditingAdminPic(true);
                            }}
                            className="absolute left-0 w-12 h-12 rounded-full bg-black bg-opacity-50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity text-xs text-white"
                        >
                            Edit
                        </button>
                    )}

                    <div className="ml-3 overflow-hidden">
                        <p className="text-sm font-semibold text-white whitespace-nowrap truncate">{profileData.name}</p>
                        <p className="text-xs text-slate-400 truncate">{profileData.details}</p>
                    </div>
                </div>
                
                {isEditingAdminPic && userRole === UserRole.Admin && (
                     <div className="mt-2 p-2 bg-slate-700 rounded-md">
                        <input 
                            type="text" 
                            className="w-full text-xs p-1 text-black rounded mb-2" 
                            placeholder="Image URL" 
                            value={tempAdminPic} 
                            onChange={(e) => setTempAdminPic(e.target.value)}
                        />
                        <div className="flex justify-end gap-2">
                            <button onClick={() => setIsEditingAdminPic(false)} className="text-xs text-slate-300 hover:text-white">Cancel</button>
                            <button onClick={handleSaveAdminPic} className="text-xs bg-blue-600 px-2 py-1 rounded text-white hover:bg-blue-500">Save</button>
                        </div>
                     </div>
                )}
            </div>
        )}

        <nav className="flex-1 p-4 space-y-1.5 overflow-y-auto">
          {navItems[userRole].map(item => (
            <NavItem 
              key={item.label}
              icon={item.icon}
              label={item.label}
              isActive={view === item.view}
              onClick={() => item.view && setView(item.view)}
            />
          ))}
          {userRole === UserRole.Admin && (
             <div className="pt-4 mt-4 border-t border-slate-700">
                <h2 className={`text-xs font-semibold text-slate-400 uppercase tracking-wider mb-3`}>
                    Classes
                </h2>
                <div className="space-y-1">
                    {Object.keys(schoolData).sort((a, b) => {
                        const aNum = parseInt(a.match(/^\d+/)?.[0] || '0');
                        const bNum = parseInt(b.match(/^\d+/)?.[0] || '0');
                        if (aNum !== bNum) return aNum - bNum;
                        return a.localeCompare(b);
                    }).map(className => {
                        const match = className.match(/^(\d+)\w*\s*([A-Z]?)$/);
                        const classNum = match ? match[1] : className;
                        const division = match ? match[2] : '';
                        return (
                        <button
                            key={className}
                            onClick={() => onSelectClass(className)}
                            className={`flex items-center w-full px-2 py-2 text-left rounded-md transition-colors duration-200 text-sm ${selectedClass === className ? 'bg-blue-600' : 'hover:bg-slate-700'}`}
                        >
                            <span className="font-semibold text-white">{classNum}{division && `-${division}`}</span>
                            <span className="ml-auto text-xs text-slate-300 px-2 py-0.5 bg-slate-700 rounded">{division || 'Main'}</span>
                        </button>
                    );
                    })}
                </div>
             </div>
        )}
        </nav>
        
        <div className="p-4 mt-auto border-t border-slate-700 flex-shrink-0 space-y-2">
             <button
                onClick={onChangePassword}
                className="flex items-center w-full px-4 py-2 text-left text-sm font-medium rounded-md text-slate-300 hover:bg-slate-700 hover:text-white"
            >
                <LockIcon className="w-5 h-5" />
                <span className="ml-3">Change Password</span>
            </button>
             <button
                onClick={onLogout}
                className="flex items-center w-full px-4 py-2 text-left text-sm font-medium rounded-md text-slate-300 hover:bg-slate-700 hover:text-white"
            >
                <LogoutIcon className="w-5 h-5" />
                <span className="ml-3">Sign Out</span>
            </button>
        </div>
      </div>
      {isOpen && <div className="fixed inset-0 bg-black opacity-50 z-20 md:hidden" onClick={() => setIsOpen(false)}></div>}
    </>
  );
};
