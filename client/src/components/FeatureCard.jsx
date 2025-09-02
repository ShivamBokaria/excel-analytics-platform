const FeatureCard = ({ title, description, icon, status, comingSoon = false, onClick, primaryCta = 'Open' }) => {
  return (
    <div 
      className={`group relative card-light hover:shadow-xl transform hover:-translate-y-2 transition-all duration-300 overflow-hidden ${
        !comingSoon ? 'cursor-pointer' : 'cursor-default'
      }`}
      onClick={!comingSoon ? onClick : undefined}
    >
      <div className="absolute inset-0 bg-gradient-to-br from-white/0 to-white/0 group-hover:from-white/10 group-hover:to-white/10 transition-all duration-300"></div>
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
            <h3 className="text-lg font-semibold text-white group-hover:text-white transition-colors">
              {title}
            </h3>
            {status && (
              <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-500/20 text-green-200">
                {status}
              </span>
            )}
          </div>
        </div>
        <p className="text-white/80 text-sm leading-relaxed mb-4">{description}</p>
        <div className="flex items-center">
          <span
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
              comingSoon ? 'bg-white/10 text-white/50' : 'bg-white/20 text-white hover:bg-white/30'
            }`}
          >
            {primaryCta}
          </span>
        </div>
      </div>
    </div>
  );
};

export default FeatureCard;