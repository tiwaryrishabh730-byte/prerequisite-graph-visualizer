import React from 'react';
import { Link, useLocation } from 'react-router-dom';

function Sidebar() {
  const location = useLocation();

  return (
    <aside className="fixed left-0 top-0 h-full w-64 bg-white border-r">
      <div className="text-xl font-bold text-gray-900 p-6 flex items-center gap-2">
        <svg
          className="w-6 h-6 text-blue-600"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          aria-hidden="true"
        >
          <path d="M6 12l6-6 6 6-6 6-6-6z" />
          <circle cx="6" cy="12" r="2" fill="currentColor" />
          <circle cx="12" cy="6" r="2" fill="currentColor" />
          <circle cx="18" cy="12" r="2" fill="currentColor" />
        </svg>
        PreqViz
      </div>
      <nav>
        <Link
          to="/"
          className={`block px-6 py-3 ${
            location.pathname === '/'
              ? 'bg-blue-50 text-blue-600 font-medium'
              : 'text-gray-700 hover:bg-gray-50 hover:text-blue-600'
          }`}
        >
          Student View
        </Link>
        <Link
          to="/teacher"
          className={`block px-6 py-3 ${
            location.pathname === '/teacher'
              ? 'bg-blue-50 text-blue-600 font-medium'
              : 'text-gray-700 hover:bg-gray-50 hover:text-blue-600'
          }`}
        >
          Teacher View
        </Link>
      </nav>
    </aside>
  );
}

export default Sidebar;
