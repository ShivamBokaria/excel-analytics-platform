const FeatureCard = ({ title, description, icon, status, comingSoon = false, onClick, primaryCta = 'Open', secondaryCta = 'Learn more' }) => {
  return (
    <div 
      className={`group relative bg-white rounded-xl shadow-md hover:shadow-xl transform hover:-translate-y-2 transition-all duration-300 overflow-hidden ${
        !comingSoon ? 'cursor-pointer' : 'cursor-default'
      }`}
      onClick={!comingSoon ? onClick : undefined}
    >
      <div className="absolute inset-0 bg-gradient-to-br from-blue-500/0 to-purple-500/0 group-hover:from-blue-500/5 group-hover:to-purple-500/5 transition-all duration-300"></div>
      {comingSoon && (
        <div className="absolute top-4 right-4 bg-gradient-to-r from-yellow-400 to-orange-500 text-white text-xs font-bold px-2 py-1 rounded-full">
          Coming Soon
        </div>
      )}
      <div className="relative p-6">
        <div className="flex items-center mb-4">
          <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center text-white text-xl shadow-lg">
            {icon}
          </div>
          <div className="ml-4 flex-1">
            <h3 className="text-lg font-semibold text-gray-900 group-hover:text-blue-600 transition-colors">
              {title}
            </h3>
            {status && (
              <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                {status}
              </span>
            )}
          </div>
        </div>
        <p className="text-gray-600 text-sm leading-relaxed mb-4">{description}</p>
        <div className="flex items-center gap-3">
          <button
            disabled={comingSoon}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
              comingSoon ? 'bg-gray-100 text-gray-400 cursor-not-allowed' : 'bg-blue-600 text-white hover:bg-blue-700'
            }`}
            onClick={(e) => { e.stopPropagation(); if (!comingSoon) onClick?.(); }}
          >
            {primaryCta}
          </button>
          <button
            className="px-4 py-2 rounded-lg text-sm font-medium border border-gray-200 text-gray-700 hover:bg-gray-50"
            onClick={(e) => e.stopPropagation()}
          >
            {secondaryCta}
          </button>
        </div>
      </div>
    </div>
  );
};

export default FeatureCard;