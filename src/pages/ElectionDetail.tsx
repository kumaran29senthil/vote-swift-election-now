
import React, { useState } from 'react';
import { useParams, Navigate } from 'react-router-dom';
import { useElection } from '../context/ElectionContext';
import { useAuth } from '../context/AuthContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

const ElectionDetail = () => {
  const { id } = useParams<{ id: string }>();
  const { elections, castVote, userVotes } = useElection();
  const { user } = useAuth();
  const [selectedCandidate, setSelectedCandidate] = useState<string | null>(null);
  const [voteSubmitted, setVoteSubmitted] = useState(false);

  if (!id) return <Navigate to="/elections" />;

  const election = elections.find((e) => e.id === id);
  if (!election) return <Navigate to="/elections" />;

  const hasVoted = user ? userVotes.some(
    (vote) => vote.electionId === election.id && vote.voterId === user.id
  ) : false;

  const canVote = user?.role === 'voter' && election.status === 'active' && !hasVoted;
  
  const handleVote = () => {
    if (!user || !selectedCandidate) return;
    
    castVote({
      electionId: election.id,
      candidateId: selectedCandidate,
      voterId: user.id,
    });
    
    setVoteSubmitted(true);
  };

  const formatDate = (date: Date) => {
    return new Date(date).toLocaleDateString();
  };

  // Calculate total votes
  const totalVotes = election.candidates.reduce((sum, candidate) => sum + candidate.votes, 0);

  return (
    <div className="container mx-auto p-4">
      <div className="mb-6">
        <h1 className="text-2xl font-bold mb-2">{election.title}</h1>
        <p className="text-gray-600 mb-2">{election.description}</p>
        <div className="flex gap-4 mb-4">
          <Badge className={
            election.status === 'upcoming' ? 'bg-blue-500' : 
            election.status === 'active' ? 'bg-green-500' : 'bg-gray-500'
          }>
            {election.status.charAt(0).toUpperCase() + election.status.slice(1)}
          </Badge>
          <p className="text-sm">Start: {formatDate(election.startDate)}</p>
          <p className="text-sm">End: {formatDate(election.endDate)}</p>
        </div>
      </div>

      {voteSubmitted && (
        <div className="mb-6 p-4 bg-green-100 text-green-700 rounded-md">
          Your vote has been successfully submitted!
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Candidate Cards */}
        <div className="space-y-4">
          <h2 className="text-xl font-semibold">Candidates</h2>
          {election.candidates.map((candidate) => (
            <Card 
              key={candidate.id} 
              className={`${selectedCandidate === candidate.id ? 'ring-2 ring-primary' : ''}`}
            >
              <CardHeader>
                <CardTitle>{candidate.name}</CardTitle>
                <p className="text-sm text-gray-500">{candidate.position}</p>
              </CardHeader>
              <CardContent>
                {canVote ? (
                  <Button 
                    variant={selectedCandidate === candidate.id ? "default" : "outline"}
                    className="w-full"
                    onClick={() => setSelectedCandidate(candidate.id)}
                  >
                    Select Candidate
                  </Button>
                ) : (
                  <div className="flex justify-between items-center">
                    <span>Votes: {candidate.votes}</span>
                    <span className="text-sm">
                      {totalVotes > 0 ? Math.round((candidate.votes / totalVotes) * 100) : 0}%
                    </span>
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
          
          {canVote && (
            <Button 
              className="w-full mt-4" 
              disabled={!selectedCandidate} 
              onClick={handleVote}
            >
              Submit Vote
            </Button>
          )}
          
          {hasVoted && !voteSubmitted && (
            <p className="text-center text-muted-foreground mt-2">
              You have already voted in this election.
            </p>
          )}
        </div>

        {/* Results Section */}
        {(election.status === 'completed' || user?.role === 'admin') && (
          <div>
            <h2 className="text-xl font-semibold mb-4">Results</h2>
            <Card>
              <CardContent className="pt-6">
                <div className="space-y-4">
                  {election.candidates.map((candidate) => (
                    <div key={candidate.id} className="space-y-1">
                      <div className="flex justify-between text-sm">
                        <span>{candidate.name}</span>
                        <span>{candidate.votes} votes ({totalVotes > 0 ? Math.round((candidate.votes / totalVotes) * 100) : 0}%)</span>
                      </div>
                      <div className="w-full bg-secondary h-2 rounded-full">
                        <div 
                          className="bg-primary h-2 rounded-full"
                          style={{ width: totalVotes > 0 ? `${(candidate.votes / totalVotes) * 100}%` : '0%' }}
                        ></div>
                      </div>
                    </div>
                  ))}
                  <p className="text-sm text-center pt-2">Total votes: {totalVotes}</p>
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
};

export default ElectionDetail;
