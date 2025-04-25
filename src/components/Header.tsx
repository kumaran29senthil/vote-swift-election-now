
import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Button } from '@/components/ui/button';

const Header = () => {
  const { user, logout } = useAuth();

  return (
    <header className="bg-primary text-primary-foreground shadow-md">
      <div className="container mx-auto p-4 flex justify-between items-center">
        <Link to="/" className="text-xl font-bold">VoteSwift</Link>
        <nav>
          <ul className="flex gap-6">
            <li>
              <Link to="/elections" className="hover:underline">Elections</Link>
            </li>
            {user?.role === 'admin' && (
              <li>
                <Link to="/admin" className="hover:underline">Admin Panel</Link>
              </li>
            )}
            {user?.role === 'candidate' && (
              <li>
                <Link to="/candidate" className="hover:underline">Candidate Portal</Link>
              </li>
            )}
            {user ? (
              <>
                <li className="ml-4">
                  <span className="mr-2">Hello, {user.name}</span>
                  <Button variant="outline" onClick={logout}>Logout</Button>
                </li>
              </>
            ) : (
              <li>
                <Link to="/login">
                  <Button variant="outline">Login</Button>
                </Link>
              </li>
            )}
          </ul>
        </nav>
      </div>
    </header>
  );
};

export default Header;
