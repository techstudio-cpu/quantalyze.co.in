interface Project {
  id: number;
  name: string;
  status: 'In Progress' | 'Completed' | 'Pending';
  progress?: number;
}

const projects: Project[] = [
  { id: 1, name: 'Website Redesign', status: 'In Progress', progress: 75 },
  { id: 2, name: 'Mobile App Development', status: 'Completed', progress: 100 },
  { id: 3, name: 'UI/UX Design', status: 'In Progress', progress: 45 },
  { id: 4, name: 'SEO Optimization', status: 'Pending', progress: 10 },
];

const statusColors = {
  'In Progress': 'bg-blue-100 text-blue-800',
  'Completed': 'bg-green-100 text-green-800',
  'Pending': 'bg-yellow-100 text-yellow-800',
};

export default function ProjectList() {
  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-semibold text-gray-900">Projects</h3>
        <a href="#" className="text-sm text-blue-600 hover:text-blue-700 font-medium">
          View All →
        </a>
      </div>
      
      <div className="space-y-4">
        {projects.map((project) => (
          <div key={project.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
            <div className="flex-1">
              <h4 className="font-medium text-gray-900">{project.name}</h4>
              {project.progress !== undefined && (
                <div className="mt-2">
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-gray-600">Progress</span>
                    <span className="text-gray-900">{project.progress}%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                      style={{ width: `${project.progress}%` }}
                    />
                  </div>
                </div>
              )}
            </div>
            <span className={`px-3 py-1 rounded-full text-xs font-medium ${statusColors[project.status]}`}>
              {project.status}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
