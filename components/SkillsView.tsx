import React, { useState } from 'react';
import { UserRole, type Student, type Skill, type Teacher } from '../types';
import { Card } from './common/Card';

interface SkillsViewProps {
  student: Student;
  userRole: UserRole;
  onUpdateSkills?: (studentId: string, newSkills: Skill[]) => void;
  loggedInTeacher?: Teacher | null;
}

const StarRating: React.FC<{
  rating: number;
  interactive?: boolean;
  onRate?: (rating: number) => void;
  size?: 'sm' | 'md' | 'lg';
}> = ({ rating, interactive = false, onRate, size = 'md' }) => {
  const sizeMap = {
    sm: 'w-4 h-4',
    md: 'w-5 h-5',
    lg: 'w-6 h-6',
  };
  
  return (
    <div className="flex gap-1">
      {[1, 2, 3, 4, 5].map(star => (
        <button
          key={star}
          onClick={() => interactive && onRate?.(star)}
          disabled={!interactive}
          className={`${sizeMap[size]} transition-colors ${
            star <= rating ? 'text-yellow-400' : 'text-gray-300'
          } ${interactive ? 'cursor-pointer hover:text-yellow-300' : 'cursor-default'}`}
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-full w-full fill-current" viewBox="0 0 20 20">
            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
          </svg>
        </button>
      ))}
    </div>
  );
};

const SkillCard: React.FC<{
  skill: Skill;
  isEditing: boolean;
  onUpdate?: (skill: Skill) => void;
  editingSkill?: Skill | null;
  setEditingSkill?: (skill: Skill | null) => void;
  userRole?: UserRole;
}> = ({ skill, isEditing, onUpdate, editingSkill, setEditingSkill, userRole }) => {
  const isCurrentlyEditing = editingSkill?.id === skill.id;
  const canEdit = userRole === UserRole.Teacher || userRole === UserRole.Admin;

  if (isCurrentlyEditing && editingSkill) {
    return (
      <Card>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Skill Name</label>
            <input
              type="text"
              value={editingSkill.name}
              onChange={(e) => setEditingSkill?.({ ...editingSkill, name: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
            <select
              value={editingSkill.category}
              onChange={(e) =>
                setEditingSkill?.({
                  ...editingSkill,
                  category: e.target.value as Skill['category'],
                })
              }
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="Academic">Academic</option>
              <option value="Sports">Sports</option>
              <option value="Creative">Creative</option>
              <option value="Technical">Technical</option>
              <option value="Other">Other</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Rating</label>
            <StarRating
              rating={editingSkill.rating}
              interactive={true}
              onRate={(rating) => setEditingSkill?.({ ...editingSkill, rating })}
              size="lg"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Teacher Remarks</label>
            <textarea
              value={editingSkill.remarks || ''}
              onChange={(e) => setEditingSkill?.({ ...editingSkill, remarks: e.target.value })}
              placeholder="Add your feedback here..."
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              rows={3}
            />
          </div>

          <div className="flex gap-2">
            <button
              onClick={() => {
                onUpdate?.(editingSkill);
                setEditingSkill?.(null);
              }}
              className="flex-1 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 font-medium transition-colors"
            >
              Save
            </button>
            <button
              onClick={() => setEditingSkill?.(null)}
              className="flex-1 bg-gray-200 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-300 font-medium transition-colors"
            >
              Cancel
            </button>
          </div>
        </div>
      </Card>
    );
  }

  return (
    <Card>
      <div className="flex justify-between items-start">
        <div className="flex-1">
          <div className="flex items-center gap-3 mb-2">
            <h3 className="text-lg font-semibold text-gray-800">{skill.name}</h3>
            <span className="px-2 py-1 bg-blue-100 text-blue-700 text-xs font-medium rounded">
              {skill.category}
            </span>
          </div>

          <div className="mb-3">
            <div className="flex items-center gap-2">
              <span className="text-sm text-gray-600">Rating:</span>
              <StarRating rating={skill.rating} size="sm" />
              <span className="text-sm font-medium text-gray-700">{skill.rating}/5</span>
            </div>
          </div>

          {skill.remarks && (
            <div className="mb-2">
              <p className="text-sm text-gray-600 font-medium mb-1">Teacher's Feedback:</p>
              <p className="text-sm text-gray-700 bg-yellow-50 p-2 rounded border border-yellow-200">
                {skill.remarks}
              </p>
            </div>
          )}

          {skill.updatedBy && (
            <div className="text-xs text-gray-500">
              <p>Updated by: {skill.updatedBy}</p>
              {skill.updatedAt && <p>Date: {new Date(skill.updatedAt).toLocaleDateString()}</p>}
            </div>
          )}
        </div>

        {canEdit && isEditing && (
          <button
            onClick={() => setEditingSkill?.(skill)}
            className="ml-2 p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" viewBox="0 0 20 20" fill="currentColor">
              <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
            </svg>
          </button>
        )}
      </div>
    </Card>
  );
};

const AddSkillForm: React.FC<{
  onAdd: (skill: Skill) => void;
  onCancel: () => void;
  teacherName?: string;
}> = ({ onAdd, onCancel, teacherName }) => {
  const [newSkill, setNewSkill] = useState<Skill>({
    id: Date.now().toString(),
    name: '',
    category: 'Academic',
    rating: 3,
    remarks: '',
    updatedBy: teacherName || 'Teacher',
    updatedAt: new Date().toISOString(),
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (newSkill.name.trim()) {
      onAdd(newSkill);
      setNewSkill({
        id: Date.now().toString(),
        name: '',
        category: 'Academic',
        rating: 3,
        remarks: '',
        updatedBy: teacherName || 'Teacher',
        updatedAt: new Date().toISOString(),
      });
    }
  };

  return (
    <Card>
      <form onSubmit={handleSubmit} className="space-y-4">
        <h3 className="text-lg font-semibold text-gray-800">Add New Skill</h3>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Skill Name</label>
          <input
            type="text"
            value={newSkill.name}
            onChange={(e) => setNewSkill({ ...newSkill, name: e.target.value })}
            placeholder="e.g., Problem Solving, Public Speaking"
            required
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
          <select
            value={newSkill.category}
            onChange={(e) =>
              setNewSkill({ ...newSkill, category: e.target.value as Skill['category'] })
            }
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="Academic">Academic</option>
            <option value="Sports">Sports</option>
            <option value="Creative">Creative</option>
            <option value="Technical">Technical</option>
            <option value="Other">Other</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Initial Rating</label>
          <StarRating
            rating={newSkill.rating}
            interactive={true}
            onRate={(rating) => setNewSkill({ ...newSkill, rating })}
            size="lg"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Initial Remarks</label>
          <textarea
            value={newSkill.remarks || ''}
            onChange={(e) => setNewSkill({ ...newSkill, remarks: e.target.value })}
            placeholder="Describe the student's current level in this skill..."
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            rows={3}
          />
        </div>

        <div className="flex gap-2">
          <button
            type="submit"
            className="flex-1 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 font-medium transition-colors"
          >
            Add Skill
          </button>
          <button
            type="button"
            onClick={onCancel}
            className="flex-1 bg-gray-200 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-300 font-medium transition-colors"
          >
            Cancel
          </button>
        </div>
      </form>
    </Card>
  );
};

export const SkillsView: React.FC<SkillsViewProps> = ({
  student,
  userRole,
  onUpdateSkills,
  loggedInTeacher,
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [isAddingSkill, setIsAddingSkill] = useState(false);
  const [editingSkill, setEditingSkill] = useState<Skill | null>(null);
  const [skills, setSkills] = useState<Skill[]>(student.skills || []);

  const canManageSkills = userRole === UserRole.Teacher || userRole === UserRole.Admin;

  const handleUpdateSkill = (updatedSkill: Skill) => {
    const updatedSkills = skills.map(s => (s.id === updatedSkill.id ? updatedSkill : s));
    setSkills(updatedSkills);
    onUpdateSkills?.(student.id, updatedSkills);
  };

  const handleAddSkill = (newSkill: Skill) => {
    const skillWithId = {
      ...newSkill,
      id: newSkill.id || Date.now().toString(),
      updatedBy: loggedInTeacher?.name || 'Teacher',
      updatedAt: new Date().toISOString(),
    };
    const updatedSkills = [...skills, skillWithId];
    setSkills(updatedSkills);
    onUpdateSkills?.(student.id, updatedSkills);
    setIsAddingSkill(false);
  };

  const skillsByCategory = {
    Academic: skills.filter(s => s.category === 'Academic'),
    Sports: skills.filter(s => s.category === 'Sports'),
    Creative: skills.filter(s => s.category === 'Creative'),
    Technical: skills.filter(s => s.category === 'Technical'),
    Other: skills.filter(s => s.category === 'Other'),
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-800">Skills & Competencies</h2>
          <p className="text-gray-600 text-sm mt-1">Track diverse skills across academics, sports, and creative abilities</p>
        </div>
        {canManageSkills && (
          <div className="flex gap-2">
            {!isEditing && !isAddingSkill && (
              <button
                onClick={() => setIsEditing(true)}
                className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 font-medium transition-colors flex items-center gap-2"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" viewBox="0 0 20 20" fill="currentColor">
                  <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
                </svg>
                Edit Skills
              </button>
            )}
            {isEditing && (
              <button
                onClick={() => setIsEditing(false)}
                className="bg-gray-600 text-white px-4 py-2 rounded-lg hover:bg-gray-700 font-medium transition-colors"
              >
                Done Editing
              </button>
            )}
            {!isAddingSkill && (
              <button
                onClick={() => setIsAddingSkill(true)}
                className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 font-medium transition-colors flex items-center gap-2"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" />
                </svg>
                Add Skill
              </button>
            )}
          </div>
        )}
      </div>

      {/* Add Skill Form */}
      {isAddingSkill && (
        <AddSkillForm
          onAdd={handleAddSkill}
          onCancel={() => setIsAddingSkill(false)}
          teacherName={loggedInTeacher?.name}
        />
      )}

      {/* Skills by Category */}
      {Object.entries(skillsByCategory).map(([category, categorySkills]) => (
        <div key={category}>
          <h3 className="text-lg font-semibold text-gray-800 mb-3 flex items-center gap-2">
            <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm font-medium">
              {category}
            </span>
            <span className="text-gray-600 text-sm">({categorySkills.length})</span>
          </h3>

          {categorySkills.length === 0 ? (
            <Card>
              <p className="text-gray-500 text-center py-8">No {category.toLowerCase()} skills added yet.</p>
            </Card>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {categorySkills.map(skill => (
                <SkillCard
                  key={skill.id}
                  skill={skill}
                  isEditing={isEditing}
                  onUpdate={handleUpdateSkill}
                  editingSkill={editingSkill}
                  setEditingSkill={setEditingSkill}
                  userRole={userRole}
                />
              ))}
            </div>
          )}
        </div>
      ))}

      {/* Empty State */}
      {skills.length === 0 && (
        <Card>
          <div className="text-center py-12">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="w-16 h-16 text-gray-400 mx-auto mb-4"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4"
              />
            </svg>
            <h3 className="text-lg font-semibold text-gray-800 mb-2">No skills tracked yet</h3>
            <p className="text-gray-600 mb-4">Skills will appear here once teachers add them.</p>
            {canManageSkills && (
              <button
                onClick={() => setIsAddingSkill(true)}
                className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 font-medium transition-colors inline-flex items-center gap-2"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" />
                </svg>
                Add First Skill
              </button>
            )}
          </div>
        </Card>
      )}
    </div>
  );
};
