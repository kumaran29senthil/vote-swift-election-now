
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useElection } from '../context/ElectionContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

const CreateElection = () => {
  const navigate = useNavigate();
  const { addElection } = useElection();
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [status, setStatus] = useState<'upcoming' | 'active' | 'completed'>('upcoming');
  
  const [candidates, setCandidates] = useState<{ name: string; position: string }[]>([
    { name: '', position: '' }
  ]);

  const addCandidateField = () => {
    setCandidates([...candidates, { name: '', position: '' }]);
  };

  const updateCandidate = (index: number, field: 'name' | 'position', value: string) => {
    const updatedCandidates = [...candidates];
    updatedCandidates[index][field] = value;
    setCandidates(updatedCandidates);
  };

  const removeCandidate = (index: number) => {
    if (candidates.length > 1) {
      const updatedCandidates = candidates.filter((_, i) => i !== index);
      setCandidates(updatedCandidates);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Basic validation
    if (!title.trim() || !description.trim() || !startDate || !endDate) {
      alert('Please fill in all required fields');
      return;
    }
    
    // Filter out empty candidates
    const validCandidates = candidates.filter(c => c.name.trim() && c.position.trim());
    
    if (validCandidates.length === 0) {
      alert('Please add at least one candidate');
      return;
    }
    
    // Create election object
    const newElection = {
      title,
      description,
      startDate: new Date(startDate),
      endDate: new Date(endDate),
      status,
      candidates: validCandidates.map((c, index) => ({
        id: `temp-${index}`,
        name: c.name,
        position: c.position,
        votes: 0,
      })),
    };
    
    addElection(newElection);
    navigate('/admin');
  };

  return (
    <div className="container mx-auto p-4">
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl">Create New Election</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="title">Election Title</Label>
              <Input
                id="title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Enter election title"
                required
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Enter election description"
                required
              />
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="startDate">Start Date</Label>
                <Input
                  id="startDate"
                  type="date"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                  required
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="endDate">End Date</Label>
                <Input
                  id="endDate"
                  type="date"
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                  required
                />
              </div>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="status">Status</Label>
              <Select value={status} onValueChange={(value: 'upcoming' | 'active' | 'completed') => setStatus(value)}>
                <SelectTrigger id="status">
                  <SelectValue placeholder="Select status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="upcoming">Upcoming</SelectItem>
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="completed">Completed</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <Label>Candidates</Label>
                <Button type="button" variant="outline" onClick={addCandidateField} size="sm">
                  Add Candidate
                </Button>
              </div>
              
              {candidates.map((candidate, index) => (
                <div key={index} className="p-4 border rounded-md space-y-4">
                  <div className="flex justify-between">
                    <h4>Candidate {index + 1}</h4>
                    <Button 
                      type="button" 
                      variant="ghost" 
                      onClick={() => removeCandidate(index)}
                      size="sm"
                      disabled={candidates.length <= 1}
                    >
                      Remove
                    </Button>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor={`candidate-name-${index}`}>Name</Label>
                      <Input
                        id={`candidate-name-${index}`}
                        value={candidate.name}
                        onChange={(e) => updateCandidate(index, 'name', e.target.value)}
                        placeholder="Candidate name"
                        required
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor={`candidate-position-${index}`}>Position</Label>
                      <Input
                        id={`candidate-position-${index}`}
                        value={candidate.position}
                        onChange={(e) => updateCandidate(index, 'position', e.target.value)}
                        placeholder="Position applying for"
                        required
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
            
            <div className="flex justify-end space-x-2">
              <Button type="button" variant="outline" onClick={() => navigate('/admin')}>
                Cancel
              </Button>
              <Button type="submit">Create Election</Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default CreateElection;
