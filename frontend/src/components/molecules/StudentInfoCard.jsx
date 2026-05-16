import React from 'react';

export default function StudentInfoCard({ student }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-6 gap-x-8">
      <div>
        <div className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1">
          Nama Lengkap
        </div>
        <div className="text-sm font-semibold text-gray-900">
          {student.fullName}
        </div>
      </div>

      <div>
        <div className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1">
          NIM
        </div>
        <div className="text-sm font-semibold text-gray-900">
          {student.nim}
        </div>
      </div>

      <div>
        <div className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1">
          Program Studi
        </div>
        <div className="text-sm font-semibold text-gray-900">
          {student.studyProgram}
        </div>
      </div>

      <div>
        <div className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1">
          Fakultas
        </div>
        <div className="text-sm font-semibold text-gray-900">
          {student.faculty}
        </div>
      </div>

      <div>
        <div className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1">
          IPK
        </div>
        <div className="text-sm font-semibold text-gray-900">
          {student.ipk}
        </div>
      </div>

      <div>
        <div className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1">
          No. Telepon
        </div>
        <div className="text-sm font-semibold text-gray-900">
          {student.phone}
        </div>
      </div>

      <div className="sm:col-span-2">
        <div className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1">
          Email
        </div>
        <div className="text-sm font-semibold text-gray-900 break-all">
          {student.email}
        </div>
      </div>

      <div className="sm:col-span-2">
        <div className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">
          Keahlian
        </div>
        <div className="flex flex-wrap gap-2">
          {student.skills.map((skill, idx) => (
            <span
              key={idx}
              className="px-3 py-1 bg-indigo-50 text-indigo-700 rounded-full text-xs font-medium"
            >
              {skill}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}