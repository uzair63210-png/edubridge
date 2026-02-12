


import React, { useState } from 'react';
import { UserRole } from '../types';
import { AdminIcon, TeacherIcon, StudentsIcon, StudentIcon, CloseIcon } from './icons/Icons';
import { Card } from './common/Card';

interface LoginProps {
  onLogin: (role: UserRole, code: string | undefined, name: string | undefined, password?: string) => boolean;
}

const RoleCard: React.FC<{
  icon: React.ReactNode;
  title: string;
  description: string;
  onClick: () => void;
}> = ({ icon, title, description, onClick }) => (
  <Card
    className="text-center transform hover:-translate-y-2 transition-transform duration-300 cursor-pointer"
    onClick={onClick}
  >
    <div className="mx-auto bg-blue-100 text-blue-600 rounded-full h-16 w-16 flex items-center justify-center">
      {icon}
    </div>
    <h3 className="mt-4 text-xl font-bold text-gray-800">{title}</h3>
    <p className="mt-2 text-gray-500">{description}</p>
  </Card>
);

export const Login: React.FC<LoginProps> = ({ onLogin }) => {
  const [selectedRole, setSelectedRole] = useState<UserRole | null>(null);
  const [code, setCode] = useState('');
  const [name, setName] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleRoleSelect = (role: UserRole) => {
    setSelectedRole(role);
    setError('');
    setCode('');
    setName('');
    setPassword('');
  };

  const handleLoginAttempt = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    setTimeout(() => {
      const success = onLogin(selectedRole!, code, name, password);
      if (!success) {
        let errorMessage = 'Login failed.';
        if (selectedRole === UserRole.Admin) errorMessage = 'Invalid Master Password.';
        if (selectedRole === UserRole.Teacher) errorMessage = 'Invalid login code or password.';
        if (selectedRole === UserRole.Student) errorMessage = 'Invalid roll number or password.';
        if (selectedRole === UserRole.Parent) errorMessage = 'Invalid details or password.';
        setError(errorMessage);
      }
      setIsLoading(false);
    }, 500);
  };

  if (!selectedRole) {
    return (
      <div className="min-h-screen bg-gray-100 flex flex-col items-center justify-center p-4">
        <div className="text-center mb-10">
          <h1 className="text-5xl font-bold text-gray-800">Welcome to EduBridge</h1>
          <p className="text-xl text-gray-500 mt-2">The Digital Future of School Management</p>
        </div>
        <div className="max-w-4xl w-full">
          <h2 className="text-2xl font-semibold text-center text-gray-700 mb-6">Please select your role to continue</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <RoleCard
              icon={<AdminIcon className="w-8 h-8" />}
              title="Admin / Management"
              description="Full access with Master Password."
              onClick={() => handleRoleSelect(UserRole.Admin)}
            />
            <RoleCard
              icon={<TeacherIcon className="w-8 h-8" />}
              title="Teacher"
              description="View your class, manage attendance."
              onClick={() => handleRoleSelect(UserRole.Teacher)}
            />
            <RoleCard
              icon={<StudentsIcon className="w-8 h-8" />}
              title="Parent"
              description="Access your child's progress."
              onClick={() => handleRoleSelect(UserRole.Parent)}
            />
            <RoleCard
              icon={<StudentIcon className="w-8 h-8" />}
              title="Student"
              description="View your own profile, scores."
              onClick={() => handleRoleSelect(UserRole.Student)}
            />
          </div>
        </div>
      </div>
    );
  }

  const needsCode = selectedRole === UserRole.Teacher || selectedRole === UserRole.Student || selectedRole === UserRole.Parent;

  return (
     <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
      <Card className="w-full max-w-md relative animate-fade-in">
        <button
          onClick={() => setSelectedRole(null)}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors"
          aria-label="Go back to role selection"
        >
          <CloseIcon className="w-6 h-6" />
        </button>
        <div className="text-center">
            <h2 className="text-2xl font-bold text-gray-800">Login as {selectedRole}</h2>
            <p className="text-gray-500 mt-2">
                {needsCode ? 'Please enter the details below.' : 'Enter Master Password.'}
            </p>
        </div>

        <form onSubmit={handleLoginAttempt} className="mt-8 space-y-6">
            {needsCode && (
                 <div className="space-y-4">
                    {selectedRole === UserRole.Parent && (
                        <div>
                            <label htmlFor="name" className="block text-sm font-medium text-gray-700">Guardian's Full Name</label>
                            <input
                                id="name"
                                type="text"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                required
                                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                                placeholder="Enter your full name as registered"
                                autoFocus
                            />
                        </div>
                    )}
                    <div>
                        <label htmlFor="code" className="block text-sm font-medium text-gray-700">
                            {selectedRole === UserRole.Parent || selectedRole === UserRole.Student ? 'Student Roll Number' : 'Login Code'}
                        </label>
                        <input
                            id="code"
                            type="text"
                            value={code}
                            onChange={(e) => setCode(e.target.value)}
                            required
                            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                            placeholder={selectedRole === UserRole.Parent || selectedRole === UserRole.Student ? 'Enter student roll number' : 'Enter your code'}
                            autoFocus={selectedRole !== UserRole.Parent}
                        />
                    </div>
                 </div>
            )}
            
            <div>
                <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                    Password
                </label>
                <div className="relative mt-1">
                    <input
                        id="password"
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                        className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                        placeholder="Enter password"
                        autoFocus={!needsCode}
                    />
                     {selectedRole !== UserRole.Admin && (
                        <p className="text-xs text-gray-500 mt-1">
                            Use Master Password if you forgot yours.
                        </p>
                     )}
                </div>
            </div>

            {error && <p className="text-sm text-red-600 text-center">{error}</p>}
            <div>
                <button
                    type="submit"
                    disabled={isLoading}
                    className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:bg-gray-400 transition-colors"
                >
                    {isLoading ? 'Verifying...' : 'Login'}
                </button>
            </div>
        </form>
      </Card>
    </div>
  )
};