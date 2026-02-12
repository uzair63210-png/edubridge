
import React, { useState, useRef, useEffect } from 'react';
import { MenuIcon, BellIcon, FullscreenIcon } from './icons/Icons';
import { UserRole, type Notice } from '../types';

interface HeaderProps {
  onToggleSidebar: () => void;
  userRole: UserRole;
  notices: Notice[];
}

export const Header: React.FC<HeaderProps> = ({ onToggleSidebar, userRole, notices }) => {
  const [showNotifications, setShowNotifications] = useState(false);
  const notificationRef = useRef<HTMLDivElement>(null);

  const isActionableUser = userRole === UserRole.Student || userRole === UserRole.Teacher || userRole === UserRole.Parent;

  const relevantNotices = notices
    .filter(notice => notice.targetAudience.includes(userRole))
    .slice(0, 5); // Show latest 5

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (notificationRef.current && !notificationRef.current.contains(event.target as Node)) {
        setShowNotifications(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [notificationRef]);

  return (
    <header className="bg-white shadow-md text-gray-800 flex-shrink-0 z-20">
      <div className="flex items-center justify-between h-16 px-4">
        <div className="flex items-center">
          <button onClick={onToggleSidebar} className="text-gray-600 md:hidden mr-4">
            <MenuIcon className="w-6 h-6" />
          </button>
          <h1 className="text-xl font-semibold">EduBridge School Management</h1>
        </div>

        <div className="flex items-center gap-4">
          {isActionableUser && (
             <div className="relative" ref={notificationRef}>
                <button 
                  onClick={() => setShowNotifications(!showNotifications)} 
                  className="text-gray-600 hover:text-gray-900 transition-colors relative"
                  aria-label="Toggle notifications"
                >
                  <BellIcon className="w-6 h-6" />
                  {relevantNotices.length > 0 && <span className="absolute top-0 right-0 block h-2 w-2 rounded-full bg-blue-500 ring-2 ring-white"></span>}
                </button>
                {showNotifications && (
                    <div className="absolute right-0 mt-2 w-80 bg-white rounded-md shadow-lg text-gray-800 origin-top-right">
                        <div className="p-3 border-b">
                            <h3 className="font-semibold text-sm">Notifications</h3>
                        </div>
                        <div className="py-1 max-h-80 overflow-y-auto">
                            {relevantNotices.length > 0 ? (
                                relevantNotices.map(notice => (
                                    <div key={notice.id} className="px-4 py-2 border-b hover:bg-gray-50">
                                        <p className="font-bold text-sm">{notice.title}</p>
                                        <p className="text-xs text-gray-600 truncate">{notice.content}</p>
                                        <p className="text-xs text-gray-400 mt-1">{new Date(notice.date).toLocaleDateString()}</p>
                                    </div>
                                ))
                            ) : (
                                <p className="text-center text-sm text-gray-500 py-4">No new notifications.</p>
                            )}
                        </div>
                    </div>
                )}
            </div>
          )}
          <button className="text-gray-600 hover:text-gray-900 transition-colors">
            <FullscreenIcon className="w-5 h-5" />
          </button>
        </div>
      </div>
    </header>
  );
};