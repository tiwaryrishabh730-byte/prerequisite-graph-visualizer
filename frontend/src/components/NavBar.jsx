import React from 'react';
import { Link } from 'react-router-dom';

function NavBar() {
  return (
    <nav className="bg-white shadow-sm px-6 py-4 flex items-center justify-between">
      <Link to="/" className="font-bold text-gray-900">
        PreqViz
      </Link>
      <div className="flex gap-6">
        <Link to="/" className="text-gray-700 hover:text-blue-600 font-medium">
          Student
        </Link>
        <Link to="/teacher" className="text-gray-700 hover:text-blue-600 font-medium">
          Teacher
        </Link>
      </div>
    </nav>
  );
}

export default NavBar;
