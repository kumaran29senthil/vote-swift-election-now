
import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useElection } from '../context/ElectionContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';

const Home = () => {
  const { user } = useAuth();
  const { elections } = useElection();

  // Get active elections
  const activeElections = elections.filter(election => election.status === 'active');
  
  return (
    <div className="container mx-auto p-4">
      <div className="text-center mb-12 mt-8">
        <h1 className="text-4xl font-bold mb-4">Welcome to VoteSwift</h1>
        <p className="text-lg text-gray-600 max-w-2xl mx-auto">
          A simple and secure platform for managing and participating in elections.
        </p>
        
        {!user && (
          <Link to="/login">
            <Button size="lg" className="mt-6">
              Login to Get Started
            </Button>
          </Link>
        )}
      </div>

      {user && (
        <div className="mb-12">
          <div className="bg-primary/10 p-6 rounded-lg">
            <h2 className="text-xl font-semibold mb-2">Welcome back, {user.name}!</h2>
            <p className="mb-4">You are logged in as: <span className="font-medium capitalize">{user.role}</span></p>
            
            <div className="space-x-4">
              <Link to="/elections">
                <Button>Browse Elections</Button>
              </Link>
              
              {user.role === 'admin' && (
                <Link to="/admin">
                  <Button variant="outline">Go to Admin Dashboard</Button>
                </Link>
              )}
              
              {user.role === 'candidate' && (
                <Link to="/candidate">
                  <Button variant="outline">Go to Candidate Portal</Button>
                </Link>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Active Elections Section */}
      <div className="mb-12">
        <h2 className="text-2xl font-semibold mb-4">Active Elections</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {activeElections.length > 0 ? (
            activeElections.slice(0, 3).map(election => (
              <Card key={election.id}>
                <CardContent className="pt-6">
                  <h3 className="font-semibold mb-2">{election.title}</h3>
                  <p className="text-sm text-gray-600 mb-4">{election.description}</p>
                  <p className="text-sm mb-3">
                    Candidates: <span className="font-medium">{election.candidates.length}</span>
                  </p>
                  <Link to={`/elections/${election.id}`}>
                    <Button variant="outline" className="w-full">View Details</Button>
                  </Link>
                </CardContent>
              </Card>
            ))
          ) : (
            <p className="text-muted-foreground col-span-3">No active elections at the moment.</p>
          )}
        </div>
        
        {activeElections.length > 3 && (
          <div className="text-center mt-6">
            <Link to="/elections">
              <Button variant="ghost">View All Elections</Button>
            </Link>
          </div>
        )}
      </div>

      {/* App Features Section */}
      <div className="mb-12">
        <h2 className="text-2xl font-semibold mb-4">How It Works</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="p-4 border rounded-lg text-center">
            <h3 className="font-semibold text-lg mb-2">Create Elections</h3>
            <p className="text-gray-600">
              Admins can create and manage elections with customizable settings.
            </p>
          </div>
          
          <div className="p-4 border rounded-lg text-center">
            <h3 className="font-semibold text-lg mb-2">Register Candidates</h3>
            <p className="text-gray-600">
              Candidates can register and track their performance in elections.
            </p>
          </div>
          
          <div className="p-4 border rounded-lg text-center">
            <h3 className="font-semibold text-lg mb-2">Secure Voting</h3>
            <p className="text-gray-600">
              Voters can securely cast their votes and view election results.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
