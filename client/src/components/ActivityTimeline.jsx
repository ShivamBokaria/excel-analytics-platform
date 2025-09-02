/*
ActivityTimeline.jsx - Component
-------------------------------
- Props: activities
- Helper functions:
  - getActivityIcon: Returns emoji for activity type
  - getActivityColor: Returns color for activity type
  - formatActivityTime: Formats time string
- Renders: List of activities with icons, colors, and times
- Exports: ActivityTimeline
*/
const ActivityTimeline = ({ activities }) => {
  const getActivityIcon = (type) => {
    const icons = {
      upload: '📤',
      report: '📊',
      chart: '📈',
      dashboard: '📋',
      analysis: '🔍',
      export: '💾',
      user: '👤',
      delete: '🗑️',
      rename: '✏️',
      download: '⬇️'
    };
    return icons[type] || '📝';
  };

  const getActivityColor = (type) => {
    const colors = {
      upload: 'bg-blue-500',
      report: 'bg-green-500',
      chart: 'bg-purple-500',
      dashboard: 'bg-purple-500',
      analysis: 'bg-yellow-500',
      export: 'bg-red-500',
      user: 'bg-indigo-500',
      delete: 'bg-red-600',
      rename: 'bg-orange-500',
      download: 'bg-green-600'
    };
    return colors[type] || 'bg-gray-500';
  };

  const formatActivityTime = (timeString) => {
    const now = new Date();
    const activityTime = new Date(timeString);
    const diffInMinutes = Math.floor((now - activityTime) / (1000 * 60));
    
    if (diffInMinutes < 1) return 'just now';
    if (diffInMinutes < 60) return `${diffInMinutes}m ago`;
    if (diffInMinutes < 1440) return `${Math.floor(diffInMinutes / 60)}h ago`;
    return activityTime.toLocaleDateString();
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-bold text-white">Recent Activity</h2>
        <button className="text-white/90 hover:text-white text-sm font-medium">
          View All
        </button>
      </div>
      
      <div className="space-y-4">
        {activities.map((activity, index) => (
          <div key={activity.id} className="flex items-start space-x-3 group">
            <div className={`flex-shrink-0 w-8 h-8 ${getActivityColor(activity.type)} rounded-full flex items-center justify-center text-white shadow-md group-hover:scale-110 transition-transform duration-200`}>
              <span className="text-xs">{getActivityIcon(activity.type)}</span>
            </div>
            
            <div className="flex-1 min-w-0">
              <div className="flex flex-col space-y-1">
                <div className="flex items-center justify-between">
                  <p className="text-sm font-medium text-white group-hover:text-white transition-colors truncate">
                    {activity.action}
                  </p>
                  <span className="text-xs text-white/70 ml-2 flex-shrink-0">{formatActivityTime(activity.time)}</span>
                </div>
                
                {activity.details && (
                  <p className="text-xs text-white/70">{activity.details}</p>
                )}
              </div>
              
              {index < activities.length - 1 && (
                <div className="w-px h-4 bg-white/20 ml-4 mt-3"></div>
              )}
            </div>
          </div>
        ))}
        
        {activities.length === 0 && (
          <div className="text-sm text-white/60 text-center py-4">No recent activity</div>
        )}
      </div>
      
      {activities.length > 0 && (
        <div className="mt-6 pt-4 border-t border-white/10">
          <button className="w-full text-center text-sm text-white/90 hover:text-white font-medium py-2 hover:bg-white/10 rounded-lg transition-colors cursor-pointer">
            Load More Activities
          </button>
        </div>
      )}
    </div>
  );
};

export default ActivityTimeline;