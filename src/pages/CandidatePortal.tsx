
import React from 'react';
import { useElection } from '../context/ElectionContext';
import { useAuth } from '../context/AuthContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';

const CandidatePortal = () => {
  const { user } = useAuth();
  const { elections } = useElection();
  
  // Get all elections where the current user is listed as a candidate
  // In a real app, this would filter based on the actual user ID
  // For demo purposes, we'll just assume the candidate name matches the user name
  const myElections = elections.filter(election => 
    election.candidates.some(candidate => 
      candidate.name.toLowerCase() === user?.name.toLowerCase()
    )
  );
  
  // Calculate stats
  const totalVotes = myElections.reduce((total, election) => {
    const candidateInElection = election.candidates.find(
      candidate => candidate.name.toLowerCase() === user?.name.toLowerCase()
    );
    return total + (candidateInElection?.votes || 0);
  }, 0);
  
  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-6">Candidate Portal</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">My Elections</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-4xl font-bold">{myElections.length}</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Total Votes Received</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-4xl font-bold">{totalVotes}</p>
          </CardContent>
        </Card>
      </div>
      
      <h2 className="text-xl font-semibold mb-4">My Elections</h2>
      
      {myElections.length > 0 ? (
        <div className="space-y-4">
          {myElections.map(election => {
            const candidateInElection = election.candidates.find(
              candidate => candidate.name.toLowerCase() === user?.name.toLowerCase()
            );
            
            const totalElectionVotes = election.candidates.reduce((sum, c) => sum + c.votes, 0);
            const votePercentage = totalElectionVotes > 0 && candidateInElection 
              ? Math.round((candidateInElection.votes / totalElectionVotes) * 100) 
              : 0;
            
            return (
              <Card key={election.id}>
                <CardContent className="pt-6">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="font-medium">{election.title}</h3>
                      <p className="text-sm text-gray-500">
                        Status: {election.status.charAt(0).toUpperCase() + election.status.slice(1)}
                      </p>
                      <p className="text-sm text-gray-500">
                        Position: {candidateInElection?.position}
                      </p>
                      <div className="mt-2">
                        <p>Your votes: {candidateInElection?.votes || 0} ({votePercentage}%)</p>
                        <div className="w-full bg-gray-200 h-2 rounded-full mt-1">
                          <div 
                            className="bg-primary h-2 rounded-full" 
                            style={{ width: `${votePercentage}%` }}
                          ></div>
                        </div>
                      </div>
                    </div>
                    <Link to={`/elections/${election.id}`}>
                      <Button variant="outline">View Election</Button>
                    </Link>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      ) : (
        <Card>
          <CardContent className="p-6 text-center text-muted-foreground">
            <p>You are not registered as a candidate in any elections yet.</p>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default CandidatePortal;
