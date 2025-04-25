
import React, { createContext, useState, useContext, ReactNode } from 'react';

export interface Candidate {
  id: string;
  name: string;
  position: string;
  votes: number;
}

export interface Election {
  id: string;
  title: string;
  description: string;
  startDate: Date;
  endDate: Date;
  status: 'upcoming' | 'active' | 'completed';
  candidates: Candidate[];
}

interface ElectionVote {
  electionId: string;
  candidateId: string;
  voterId: string;
}

interface ElectionContextType {
  elections: Election[];
  addElection: (election: Omit<Election, 'id'>) => void;
  addCandidate: (electionId: string, candidate: Omit<Candidate, 'id' | 'votes'>) => void;
  castVote: (vote: Omit<ElectionVote, 'id'>) => void;
  userVotes: ElectionVote[];
}

// Create context
const ElectionContext = createContext<ElectionContextType | undefined>(undefined);

// Create mock data
const mockElections: Election[] = [
  {
    id: '1',
    title: 'Class President Election',
    description: 'Election for class president position for the 2025 school year',
    startDate: new Date('2025-05-01'),
    endDate: new Date('2025-05-07'),
    status: 'upcoming',
    candidates: [
      { id: '1', name: 'John Smith', position: 'President', votes: 0 },
      { id: '2', name: 'Emily Johnson', position: 'President', votes: 0 },
    ],
  },
  {
    id: '2',
    title: 'Student Council',
    description: 'Vote for your student council representatives',
    startDate: new Date('2025-04-20'),
    endDate: new Date('2025-04-30'),
    status: 'active',
    candidates: [
      { id: '3', name: 'Michael Brown', position: 'Treasurer', votes: 5 },
      { id: '4', name: 'Sarah Davis', position: 'Secretary', votes: 8 },
      { id: '5', name: 'David Wilson', position: 'Vice President', votes: 3 },
    ],
  },
  {
    id: '3',
    title: 'Homecoming Committee',
    description: 'Select the committee members for homecoming',
    startDate: new Date('2025-03-01'),
    endDate: new Date('2025-03-15'),
    status: 'completed',
    candidates: [
      { id: '6', name: 'Jessica Martinez', position: 'Committee Chair', votes: 12 },
      { id: '7', name: 'Robert Taylor', position: 'Committee Member', votes: 7 },
      { id: '8', name: 'Jennifer Garcia', position: 'Committee Member', votes: 10 },
    ],
  },
];

// Create provider component
export const ElectionProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [elections, setElections] = useState<Election[]>(mockElections);
  const [userVotes, setUserVotes] = useState<ElectionVote[]>([]);

  const addElection = (election: Omit<Election, 'id'>) => {
    const newElection = {
      ...election,
      id: Math.random().toString(36).substr(2, 9),
    };
    setElections([...elections, newElection as Election]);
  };

  const addCandidate = (electionId: string, candidate: Omit<Candidate, 'id' | 'votes'>) => {
    const newCandidate = {
      ...candidate,
      id: Math.random().toString(36).substr(2, 9),
      votes: 0,
    };

    setElections(
      elections.map((election) => {
        if (election.id === electionId) {
          return {
            ...election,
            candidates: [...election.candidates, newCandidate],
          };
        }
        return election;
      })
    );
  };

  const castVote = (vote: Omit<ElectionVote, 'id'>) => {
    // Check if user already voted in this election
    const alreadyVoted = userVotes.some(v => v.electionId === vote.electionId && v.voterId === vote.voterId);
    
    if (alreadyVoted) {
      alert('You have already voted in this election');
      return;
    }

    // Add vote to user votes
    setUserVotes([...userVotes, vote]);

    // Update candidate vote count
    setElections(
      elections.map((election) => {
        if (election.id === vote.electionId) {
          return {
            ...election,
            candidates: election.candidates.map((candidate) => {
              if (candidate.id === vote.candidateId) {
                return {
                  ...candidate,
                  votes: candidate.votes + 1,
                };
              }
              return candidate;
            }),
          };
        }
        return election;
      })
    );
  };

  return (
    <ElectionContext.Provider
      value={{
        elections,
        addElection,
        addCandidate,
        castVote,
        userVotes,
      }}
    >
      {children}
    </ElectionContext.Provider>
  );
};

// Create custom hook
export const useElection = () => {
  const context = useContext(ElectionContext);
  if (context === undefined) {
    throw new Error('useElection must be used within an ElectionProvider');
  }
  return context;
};
