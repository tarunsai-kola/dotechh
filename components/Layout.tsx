import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { 
  Briefcase, 
  LayoutDashboard, 
  UserCircle, 
  Search, 
  Settings, 
  LogOut, 
  Menu,
  X,
  PlusCircle,
  Users
} from 'lucide-react';
import { UserRole } from '../types';

interface LayoutProps {
  children: React.ReactNode;
  userRole: UserRole | null;
  onLogout: () => void;
}

const Layout: React.FC<LayoutProps> = ({ children, userRole, onLogout }) => {
  const [isSidebarOpen, setIsSidebarOpen] = React.useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);

  // If no user is logged in, show a simple navbar (Landing page style)
  if (!userRole) {
    return (
      <div className="min-h-screen flex flex-col bg-white">
        <header className="border-b border-gray-100 sticky top-0 bg-white/80 backdrop-blur-md z-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
            <div className="flex items-center gap-2 cursor-pointer" onClick={() => navigate('/')}>
              <div className="w-8 h-8 bg-brand-600 rounded-lg flex items-center justify-center text-white font-bold text-xl">D</div>
              <span className="text-xl font-bold text-slate-900 tracking-tight">Doltec</span>
            </div>
            <div className="flex items-center gap-4">
              <Link to="/login" className="text-sm font-medium text-slate-600 hover:text-brand-600 transition-colors">Sign In</Link>
              <Link to="/login" className="text-sm font-medium bg-brand-600 text-white px-4 py-2 rounded-full hover:bg-brand-700 transition-colors">Get Started</Link>
            </div>
          </div>
        </header>
        <main className="flex-grow">
          {children}
        </main>
        <footer className="bg-slate-50 border-t border-slate-100 py-12">
          <div className="max-w-7xl mx-auto px-4 text-center text-slate-500 text-sm">
            © {new Date().getFullYear()} Doltec Inc. Building the future of work.
          </div>
        </footer>
      </div>
    );
  }

  // Logged in Sidebar Navigation
  const studentLinks = [
    { name: 'Dashboard', path: '/student/dashboard', icon: LayoutDashboard },
    { name: 'Find Jobs', path: '/student/jobs', icon: Search },
    { name: 'My Profile', path: '/student/profile', icon: UserCircle },
    { name: 'Settings', path: '/student/settings', icon: Settings },
  ];

  const companyLinks = [
    { name: 'Dashboard', path: '/company/dashboard', icon: LayoutDashboard },
    { name: 'Post a Job', path: '/company/post-job', icon: PlusCircle },
    { name: 'Applicants', path: '/company/applicants', icon: Users },
    { name: 'Company Profile', path: '/company/profile', icon: Briefcase },
  ];

  const links = userRole === UserRole.STUDENT ? studentLinks : companyLinks;

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Mobile Sidebar Overlay */}
      {isSidebarOpen && (
        <div className="fixed inset-0 bg-black/20 z-40 lg:hidden" onClick={toggleSidebar}></div>
      )}

      {/* Sidebar */}
      <aside className={`
        fixed lg:static inset-y-0 left-0 z-50 w-64 bg-white border-r border-gray-200 transform transition-transform duration-200 ease-in-out
        ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
      `}>
        <div className="h-full flex flex-col">
          <div className="h-16 flex items-center px-6 border-b border-gray-100">
            <div className="w-8 h-8 bg-brand-600 rounded-lg flex items-center justify-center text-white font-bold mr-2">D</div>
            <span className="text-xl font-bold text-slate-900">Doltec</span>
          </div>

          <nav className="flex-1 px-4 py-6 space-y-1">
            {links.map((link) => {
              const isActive = location.pathname === link.path;
              const Icon = link.icon;
              return (
                <Link
                  key={link.path}
                  to={link.path}
                  onClick={() => setIsSidebarOpen(false)}
                  className={`
                    flex items-center gap-3 px-4 py-3 text-sm font-medium rounded-lg transition-colors
                    ${isActive 
                      ? 'bg-brand-50 text-brand-700' 
                      : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'}
                  `}
                >
                  <Icon size={20} />
                  {link.name}
                </Link>
              );
            })}
          </nav>

          <div className="p-4 border-t border-gray-100">
            <button 
              onClick={onLogout}
              className="flex items-center gap-3 px-4 py-3 text-sm font-medium text-slate-600 hover:text-red-600 hover:bg-red-50 rounded-lg w-full transition-colors"
            >
              <LogOut size={20} />
              Sign Out
            </button>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-w-0">
        <header className="bg-white border-b border-gray-200 h-16 flex items-center justify-between px-4 sm:px-6 lg:px-8">
          <button 
            onClick={toggleSidebar}
            className="lg:hidden p-2 rounded-md text-slate-400 hover:text-slate-600 hover:bg-slate-100"
          >
            <Menu size={24} />
          </button>
          
          <div className="flex items-center gap-4 ml-auto">
             <div className="hidden sm:block text-right">
                <p className="text-sm font-medium text-slate-900">
                  {userRole === UserRole.STUDENT ? 'Alex Rivera' : 'NeuralFrontier Admin'}
                </p>
                <p className="text-xs text-slate-500 capitalize">{userRole}</p>
             </div>
             <div className="h-10 w-10 rounded-full bg-slate-200 overflow-hidden border border-slate-300">
                <img src={`https://picsum.photos/id/${userRole === UserRole.STUDENT ? '64' : '65'}/100/100`} alt="Avatar" className="h-full w-full object-cover" />
             </div>
          </div>
        </header>

        <main className="flex-1 p-4 sm:p-6 lg:p-8 overflow-y-auto">
          {children}
        </main>
      </div>
    </div>
  );
};

export default Layout;