const ProgressTracker = () => {
  const milestones = [
    {
      week: 1,
      title: "Authentication & Dashboard",
      description: "User authentication, role management, and dashboard layout",
      status: "completed",
      progress: 100,
      features: ["JWT Authentication", "Role-based Access", "Modern Dashboard", "Admin Panel"]
    },
    {
      week: 2,
      title: "File Upload & Parsing",
      description: "Excel file upload, data parsing, and validation",
      status: "next",
      progress: 0,
      features: ["File Upload", "Excel Parsing", "Data Validation", "Error Handling"]
    },
    {
      week: 3,
      title: "Chart Generation",
      description: "Dynamic chart creation and data visualization",
      status: "planned",
      progress: 0,
      features: ["Chart.js Integration", "Multiple Chart Types", "Data Mapping", "Export Options"]
    },
    {
      week: 4,
      title: "Advanced Analytics",
      description: "Data filtering, analysis, and reporting features",
      status: "planned",
      progress: 0,
      features: ["Data Filtering", "Statistical Analysis", "Report Generation", "Insights"]
    },
    {
      week: 5,
      title: "Deployment & Polish",
      description: "Production deployment and final optimizations",
      status: "planned",
      progress: 0,
      features: ["Production Build", "Performance Optimization", "Testing", "Documentation"]
    }
  ];

  const getStatusColor = (status) => {
    const colors = {
      completed: "bg-green-500",
      next: "bg-blue-500",
      planned: "bg-gray-300"
    };
    return colors[status] || "bg-gray-300";
  };

  const getStatusIcon = (status) => {
    const icons = {
      completed: "✅",
      next: "🔄",
      planned: "⏳"
    };
    return icons[status] || "⏳";
  };

  return (
    <div className="bg-white rounded-xl shadow-lg p-6">
      <div className="mb-6">
        <h2 className="text-xl font-bold text-gray-900 mb-2">Development Roadmap</h2>
        <p className="text-gray-600 text-sm">Track the implementation progress of Excel Analytics Platform</p>
      </div>
      
      <div className="space-y-6">
        {milestones.map((milestone, index) => (
          <div key={milestone.week} className="relative">
            {/* Connection line */}
            {index < milestones.length - 1 && (
              <div className="absolute left-6 top-12 w-px h-16 bg-gray-200"></div>
            )}
            
            <div className="flex items-start space-x-4">
              {/* Status indicator */}
              <div className={`flex-shrink-0 w-12 h-12 ${getStatusColor(milestone.status)} rounded-full flex items-center justify-center text-white font-bold shadow-lg`}>
                <span className="text-lg">{getStatusIcon(milestone.status)}</span>
              </div>
              
              {/* Content */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-lg font-semibold text-gray-900">
                    Week {milestone.week}: {milestone.title}
                  </h3>
                  <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                    milestone.status === 'completed' ? 'bg-green-100 text-green-800' :
                    milestone.status === 'next' ? 'bg-blue-100 text-blue-800' :
                    'bg-gray-100 text-gray-600'
                  }`}>
                    {milestone.status === 'completed' ? 'Completed' :
                     milestone.status === 'next' ? 'Up Next' : 'Planned'}
                  </span>
                </div>
                
                <p className="text-gray-600 text-sm mb-3">{milestone.description}</p>
                
                {/* Progress bar */}
                <div className="mb-3">
                  <div className="flex items-center justify-between text-sm mb-1">
                    <span className="text-gray-500">Progress</span>
                    <span className="font-medium">{milestone.progress}%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className={`h-2 rounded-full transition-all duration-500 ${getStatusColor(milestone.status)}`}
                      style={{ width: `${milestone.progress}%` }}
                    ></div>
                  </div>
                </div>
                
                {/* Features */}
                <div className="flex flex-wrap gap-2">
                  {milestone.features.map((feature, featureIndex) => (
                    <span 
                      key={featureIndex}
                      className={`px-2 py-1 rounded-md text-xs font-medium ${
                        milestone.status === 'completed' ? 'bg-green-50 text-green-700' :
                        milestone.status === 'next' ? 'bg-blue-50 text-blue-700' :
                        'bg-gray-50 text-gray-600'
                      }`}
                    >
                      {feature}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ProgressTracker;