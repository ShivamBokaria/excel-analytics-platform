const GradientCard = ({ title, value, icon, gradient, trend = null, subtitle }) => {
  return (
    <div className={`${gradient} rounded-xl p-6 text-white shadow-lg hover:shadow-xl transform hover:-translate-y-1 transition-all duration-300`}>
      <div className="flex items-center justify-between">
        <div className="flex-1">
          <div className="flex items-center mb-2">
            <span className="text-2xl mr-3">{icon}</span>
            <h3 className="text-white/90 text-sm font-medium uppercase tracking-wider">{title}</h3>
          </div>
          <div className="space-y-1">
            <p className="text-3xl font-bold">{value}</p>
            {subtitle && <p className="text-white/80 text-sm">{subtitle}</p>}
          </div>
        </div>
        {trend && (
          <div className={`flex items-center px-3 py-1 rounded-full text-sm font-semibold ${
            trend > 0 ? 'bg-white/20 text-white' : 'bg-red-500/20 text-red-100'
          }`}>
            <span className="mr-1">{trend > 0 ? '↗' : '↘'}</span>
            {Math.abs(trend)}%
          </div>
        )}
      </div>
    </div>
  );
};

export default GradientCard;