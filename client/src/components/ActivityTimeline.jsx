const ActivityTimeline = ({ activities }) => {
  const getActivityIcon = (type) => {
    const icons = {
      upload: '📤',
      report: '📊',
      dashboard: '📋',
      analysis: '🔍',
      export: '💾',
      user: '👤'
    };
    return icons[type] || '📝';
  };

  const getActivityColor = (type) => {
    const colors = {
      upload: 'bg-blue-500',
      report: 'bg-green-500',
      dashboard: 'bg-purple-500',
      analysis: 'bg-yellow-500',
      export: 'bg-red-500',
      user: 'bg-indigo-500'
    };
    return colors[type] || 'bg-gray-500';
  };

  return (
    <div className="bg-white rounded-xl shadow-lg p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-bold text-gray-900">Recent Activity</h2>
        <button className="text-blue-600 hover:text-blue-700 text-sm font-medium">
          View All
        </button>
      </div>
      
      <div className="space-y-4">
        {activities.map((activity, index) => (
          <div key={activity.id} className="flex items-start space-x-4 group">
            <div className={`flex-shrink-0 w-10 h-10 ${getActivityColor(activity.type)} rounded-full flex items-center justify-center text-white shadow-md group-hover:scale-110 transition-transform duration-200`}>
              <span className="text-sm">{getActivityIcon(activity.type)}</span>
            </div>
            
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between">
                <p className="text-sm font-medium text-gray-900 group-hover:text-blue-600 transition-colors">
                  {activity.action}
                </p>
                <span className="text-xs text-gray-500">{activity.time}</span>
              </div>
              
              {activity.details && (
                <p className="text-xs text-gray-500 mt-1">{activity.details}</p>
              )}
              
              {index < activities.length - 1 && (
                <div className="w-px h-6 bg-gray-200 ml-5 mt-2"></div>
              )}
            </div>
          </div>
        ))}
      </div>
      
      <div className="mt-6 pt-4 border-t border-gray-100">
        <button className="w-full text-center text-sm text-blue-600 hover:text-blue-700 font-medium py-2 hover:bg-blue-50 rounded-lg transition-colors">
          Load More Activities
        </button>
      </div>
    </div>
  );
};

export default ActivityTimeline;