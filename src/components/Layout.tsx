import React from 'react';
import { Outlet, Link, useLocation } from 'react-router-dom';
import { Home, Clock, FileText, Settings, Shield, User, Info, PieChart, BarChart } from 'lucide-react';
export function Layout() {
  const location = useLocation();
  const navItems = [{
    path: '/',
    icon: PieChart
  }, {
    path: '/home',
    icon: Home
  }, {
    path: '/analytics',
    icon: BarChart
  }, {
    path: '/reports',
    icon: FileText
  }, {
    path: '/settings',
    icon: Settings
  }, {
    path: '/security',
    icon: Shield
  }];
  return <div className="flex min-h-screen bg-white">
      {/* Sidebar */}
      <div className="w-16 border-r border-gray-200 flex flex-col items-center py-6 bg-white">
        <nav className="flex flex-col items-center gap-6 h-full">
          {navItems.map((item, index) => {
          const Icon = item.icon;
          const isActive = location.pathname === item.path;
          return <Link key={index} to={item.path} className="relative group">
                <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${isActive ? 'bg-black text-white' : 'bg-white text-gray-500 hover:bg-gray-100'}`}>
                  <Icon size={20} />
                </div>
              </Link>;
        })}
          <div className="mt-auto">
            <Link to="/profile" className="relative group">
              <div className="w-10 h-10 rounded-lg flex items-center justify-center bg-white text-gray-500 hover:bg-gray-100">
                <User size={20} />
              </div>
            </Link>
          </div>
        </nav>
      </div>
      {/* Main content */}
      <div className="flex-1">
        <Outlet />
      </div>
    </div>;
}