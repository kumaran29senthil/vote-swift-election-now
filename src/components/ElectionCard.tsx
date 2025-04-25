
import React from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Election } from '../context/ElectionContext';
import { Badge } from '@/components/ui/badge';

interface ElectionCardProps {
  election: Election;
}

const ElectionCard: React.FC<ElectionCardProps> = ({ election }) => {
  const getStatusBadge = () => {
    switch (election.status) {
      case 'upcoming':
        return <Badge className="bg-blue-500">Upcoming</Badge>;
      case 'active':
        return <Badge className="bg-green-500">Active</Badge>;
      case 'completed':
        return <Badge className="bg-gray-500">Completed</Badge>;
      default:
        return null;
    }
  };

  const formatDate = (date: Date) => {
    return new Date(date).toLocaleDateString();
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <div className="flex justify-between items-start">
          <CardTitle>{election.title}</CardTitle>
          {getStatusBadge()}
        </div>
        <CardDescription>{election.description}</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col gap-2 text-sm">
          <p>Start: {formatDate(election.startDate)}</p>
          <p>End: {formatDate(election.endDate)}</p>
          <p>Candidates: {election.candidates.length}</p>
        </div>
      </CardContent>
      <CardFooter className="flex justify-end">
        <Link to={`/elections/${election.id}`}>
          <Button>View Details</Button>
        </Link>
      </CardFooter>
    </Card>
  );
};

export default ElectionCard;
