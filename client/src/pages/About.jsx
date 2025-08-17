import Navbar from '../components/Navbar';

function About() {
  return (
    <div className="min-h-screen">
      <Navbar />
      <main className="container-padded py-10">
        <section className="mb-6 text-center text-white">
          <h1 className="display-title">About Excel Analytics Platform</h1>
          <p className="mt-3 text-lg heading-subtle">Advanced data analysis and visualization for Excel files.</p>
        </section>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="card-light p-6">
            <h2 className="text-2xl font-bold text-white mb-4">Features</h2>
            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 bg-blue-500/20 rounded-lg flex items-center justify-center text-blue-300 text-sm">📊</div>
                <div>
                  <h3 className="text-lg font-semibold text-white">2D & 3D Charts</h3>
                  <p className="text-white/70">Create beautiful 2D and 3D visualizations including bar charts, line charts, pie charts, and scatter plots.</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 bg-green-500/20 rounded-lg flex items-center justify-center text-green-300 text-sm">📁</div>
                <div>
                  <h3 className="text-lg font-semibold text-white">File Management</h3>
                  <p className="text-white/70">Upload, organize, and manage your Excel files with easy-to-use tools for renaming and downloading.</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 bg-purple-500/20 rounded-lg flex items-center justify-center text-purple-300 text-sm">💾</div>
                <div>
                  <h3 className="text-lg font-semibold text-white">Save & Share</h3>
                  <p className="text-white/70">Save your chart configurations as reports and share them with others or export as PNG/PDF.</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 bg-orange-500/20 rounded-lg flex items-center justify-center text-orange-300 text-sm">🔒</div>
                <div>
                  <h3 className="text-lg font-semibold text-white">Secure & Private</h3>
                  <p className="text-white/70">Your data is secure with user authentication and role-based access control.</p>
                </div>
              </div>
            </div>
          </div>

          <div className="card-light p-6">
            <h2 className="text-2xl font-bold text-white mb-4">Technology Stack</h2>
            <div className="space-y-4">
              <div>
                <h3 className="text-lg font-semibold text-white mb-2">Frontend</h3>
                <div className="flex flex-wrap gap-2">
                  <span className="px-3 py-1 bg-blue-500/20 text-blue-300 rounded-full text-sm">React</span>
                  <span className="px-3 py-1 bg-blue-500/20 text-blue-300 rounded-full text-sm">Tailwind CSS</span>
                  <span className="px-3 py-1 bg-blue-500/20 text-blue-300 rounded-full text-sm">Chart.js</span>
                  <span className="px-3 py-1 bg-blue-500/20 text-blue-300 rounded-full text-sm">Vite</span>
                </div>
              </div>
              <div>
                <h3 className="text-lg font-semibold text-white mb-2">Backend</h3>
                <div className="flex flex-wrap gap-2">
                  <span className="px-3 py-1 bg-green-500/20 text-green-300 rounded-full text-sm">Node.js</span>
                  <span className="px-3 py-1 bg-green-500/20 text-green-300 rounded-full text-sm">Express</span>
                  <span className="px-3 py-1 bg-green-500/20 text-green-300 rounded-full text-sm">MongoDB</span>
                  <span className="px-3 py-1 bg-green-500/20 text-green-300 rounded-full text-sm">JWT</span>
                </div>
              </div>
              <div>
                <h3 className="text-lg font-semibold text-white mb-2">Data Processing</h3>
                <div className="flex flex-wrap gap-2">
                  <span className="px-3 py-1 bg-purple-500/20 text-purple-300 rounded-full text-sm">XLSX</span>
                  <span className="px-3 py-1 bg-purple-500/20 text-purple-300 rounded-full text-sm">Multer</span>
                  <span className="px-3 py-1 bg-purple-500/20 text-purple-300 rounded-full text-sm">Mongoose</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-8 card-light p-6">
          <h2 className="text-2xl font-bold text-white mb-4">Getting Started</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="w-16 h-16 bg-blue-500/20 rounded-full flex items-center justify-center text-blue-300 text-2xl mx-auto mb-4">1</div>
              <h3 className="text-lg font-semibold text-white mb-2">Upload Data</h3>
              <p className="text-white/70">Upload your Excel files (.xlsx, .xls) to get started with data analysis.</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-green-500/20 rounded-full flex items-center justify-center text-green-300 text-2xl mx-auto mb-4">2</div>
              <h3 className="text-lg font-semibold text-white mb-2">Create Charts</h3>
              <p className="text-white/70">Choose from 2D or 3D chart types and select your data columns for visualization.</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-purple-500/20 rounded-full flex items-center justify-center text-purple-300 text-2xl mx-auto mb-4">3</div>
              <h3 className="text-lg font-semibold text-white mb-2">Save & Export</h3>
              <p className="text-white/70">Save your charts as reports and export them as images or PDFs for sharing.</p>
            </div>
          </div>
        </div>

        <div className="mt-8 text-center">
          <p className="text-white/60">Excel Analytics Platform • Built with modern web technologies</p>
          <p className="text-white/40 text-sm mt-2">Version 1.0.0 • {new Date().getFullYear()}</p>
        </div>
      </main>
    </div>
  );
}

export default About; 