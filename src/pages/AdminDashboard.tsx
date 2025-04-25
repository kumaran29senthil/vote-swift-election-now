
import React from 'react';
import { Link } from 'react-router-dom';
import { useElection } from '../context/ElectionContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

const AdminDashboard = () => {
  const { elections } = useElection();

  // Count elections by status
  const upcomingCount = elections.filter(e => e.status === 'upcoming').length;
  const activeCount = elections.filter(e => e.status === 'active').length;
  const completedCount = elections.filter(e => e.status === 'completed').length;

  return (
    <div className="container mx-auto p-4">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Admin Dashboard</h1>
        <Link to="/admin/create-election">
          <Button>Create New Election</Button>
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-5xl text-blue-500">{upcomingCount}</CardTitle>
            <CardDescription>Upcoming Elections</CardDescription>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-5xl text-green-500">{activeCount}</CardTitle>
            <CardDescription>Active Elections</CardDescription>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-5xl text-gray-500">{completedCount}</CardTitle>
            <CardDescription>Completed Elections</CardDescription>
          </CardHeader>
        </Card>
      </div>

      <div className="space-y-6">
        <div>
          <h2 className="text-xl font-semibold mb-4">Active Elections</h2>
          {elections.filter(e => e.status === 'active').map(election => (
            <Card key={election.id} className="mb-4">
              <CardContent className="pt-6">
                <div className="flex justify-between items-center">
                  <div>
                    <h3 className="font-medium">{election.title}</h3>
                    <p className="text-sm text-muted-foreground">
                      Candidates: {election.candidates.length} | 
                      Total Votes: {election.candidates.reduce((sum, c) => sum + c.votes, 0)}
                    </p>
                  </div>
                  <Link to={`/elections/${election.id}`}>
                    <Button variant="outline">Manage</Button>
                  </Link>
                </div>
              </CardContent>
            </Card>
          ))}
          {elections.filter(e => e.status === 'active').length === 0 && (
            <p className="text-muted-foreground">No active elections</p>
          )}
        </div>

        <div>
          <h2 className="text-xl font-semibold mb-4">Upcoming Elections</h2>
          {elections.filter(e => e.status === 'upcoming').map(election => (
            <Card key={election.id} className="mb-4">
              <CardContent className="pt-6">
                <div className="flex justify-between items-center">
                  <div>
                    <h3 className="font-medium">{election.title}</h3>
                    <p className="text-sm text-muted-foreground">
                      Start Date: {new Date(election.startDate).toLocaleDateString()} | 
                      Candidates: {election.candidates.length}
                    </p>
                  </div>
                  <Link to={`/elections/${election.id}`}>
                    <Button variant="outline">Manage</Button>
                  </Link>
                </div>
              </CardContent>
            </Card>
          ))}
          {elections.filter(e => e.status === 'upcoming').length === 0 && (
            <p className="text-muted-foreground">No upcoming elections</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
