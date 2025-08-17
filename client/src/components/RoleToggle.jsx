import React from 'react';

function RoleToggle({ selectedRole = 'user', onChange, layout = 'buttons', className = '' }) {
  const options = [
    { key: 'user', label: 'User', emoji: '👤' },
    { key: 'admin', label: 'Admin', emoji: '🛡️' }
  ];

  if (layout === 'cards') {
    return (
      <div className={`grid grid-cols-2 gap-3 ${className}`}>
        {options.map(opt => (
          <button
            key={opt.key}
            type="button"
            onClick={() => onChange?.(opt.key)}
            className={`relative w-full rounded-xl border p-4 text-left transition-all cursor-pointer ${
              selectedRole === opt.key
                ? 'border-blue-600 bg-blue-50 shadow'
                : 'border-gray-200 hover:border-gray-300 bg-white'
            }`}
          >
            <div className="flex items-center gap-3">
              <div className={`w-10 h-10 rounded-lg flex items-center justify-center text-xl ${
                selectedRole === opt.key ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-700'
              }`}>
                {opt.emoji}
              </div>
              <div>
                <div className="font-semibold text-gray-900">{opt.label}</div>
                <div className="text-xs text-gray-500">Continue as {opt.label.toLowerCase()}</div>
              </div>
            </div>
            {selectedRole === opt.key && (
              <span className="absolute top-3 right-3 text-xs font-medium text-blue-700 bg-blue-100 px-2 py-0.5 rounded-full">Selected</span>
            )}
          </button>
        ))}
      </div>
    );
  }

  return (
    <div className={`inline-flex rounded-lg border border-gray-200 bg-white p-1 ${className}`} role="tablist">
      {options.map(opt => (
        <button
          key={opt.key}
          type="button"
          onClick={() => onChange?.(opt.key)}
          className={`px-4 py-2 rounded-md text-sm font-medium transition-colors cursor-pointer ${
            selectedRole === opt.key
              ? 'bg-blue-600 text-white'
              : 'text-gray-700 hover:bg-gray-100'
          }`}
          role="tab"
          aria-selected={selectedRole === opt.key}
        >
          <span className="mr-1">{opt.emoji}</span>{opt.label}
        </button>
      ))}
    </div>
  );
}

export default RoleToggle;
