
import React from 'react';
import { Link } from 'react-router-dom';
import { useElection } from '../context/ElectionContext';
import { useAuth } from '../context/AuthContext';
import ElectionCard from '../components/ElectionCard';
import { Button } from '@/components/ui/button';

const ElectionsList = () => {
  const { elections } = useElection();
  const { user } = useAuth();

  return (
    <div className="container mx-auto p-4">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Elections</h1>
        {user?.role === 'admin' && (
          <Link to="/admin/create-election">
            <Button>Create New Election</Button>
          </Link>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {elections.map((election) => (
          <ElectionCard key={election.id} election={election} />
        ))}
      </div>
    </div>
  );
};

export default ElectionsList;
