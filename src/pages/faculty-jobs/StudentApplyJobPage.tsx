import React, { useContext } from 'react';
import { useState, useEffect } from 'react';
import { Link as RouterLink, useNavigate } from 'react-router-dom';

import { Container, Typography, Avatar, Box, Input, TextField, FormHelperText, Button, Card, CardContent, IconButton } from '@mui/material';
import { LoadingButton } from '@mui/lab';
import EditIcon from '@mui/icons-material/Edit';

import api from '../../services/faculty-job';
import { UserContext } from '../../provider';


const ViewJobsStudent: React.FC = () => {

  // Type definition for formatting jobs
  type Job = {
    id: number;
    title: string;
    courseId: number;
    courseSchedule: string;
    totalHoursPerWeek: number;
    maxNumberOfTAs: number;
    requiredCourses: string;
    requiredSkills: string;
    TAStats: string;
    notes: string;
    deadlineToApply: string;
    facultyId: number;
  };
  const userContext = useContext(UserContext);
  if (!userContext) {
    return <div>Loading...</div>; // or any other fallback UI
  }
  const {user} = userContext;
  const [jobs, setJobs] = useState<Job[]>([]);

  useEffect(() => {
    api.getJobs().then(res => {
      if (res !== undefined) {
        setJobs(res);
      }
    });
  }, []);

  const navigate = useNavigate();

  return (
    <Container>
      <Box sx={{ my: 4 }}>
        <Typography variant="h4" gutterBottom>
          Jobs
        </Typography>
        {
          jobs.map((job, index) => (
            <Card key={index} sx={{ mb: 2 }}>
              <CardContent>
                <Typography variant="h6">{job.title}</Typography>
                <Typography><strong>Course ID:</strong> {job.courseId}</Typography>
                <Typography><strong>Schedule:</strong> {job.courseSchedule}</Typography>
                <Typography><strong>Total Hours/Week:</strong> {job.totalHoursPerWeek}</Typography>
                <Typography><strong>Max TAs:</strong> {job.maxNumberOfTAs}</Typography>
                <Typography><strong>Required Courses:</strong> {job.requiredCourses}</Typography>
                <Typography><strong>Required Skills:</strong> {job.requiredSkills}</Typography>
                <Typography><strong>TA Stats:</strong> {job.TAStats}</Typography>
                <Typography><strong>Notes:</strong> {job.notes}</Typography>
                <Typography><strong>Apply By: </strong> 
                  {new Date(job.deadlineToApply).toLocaleDateString()}</Typography>
                <Button
                  variant="contained"
                  onClick={() => navigate('/application-form/?id='+ job.id + '&title=' + job.courseId)}
                >
                  Apply
                </Button>
              </CardContent>
            </Card>
          ))
        }
      </Box>
      {user?.role === 'faculty' ?
        (<Button variant="contained" onClick={() => navigate('/post-job')}>Post Job</Button>)
        : ''
      }
    </Container>
  );
};

export default ViewJobsStudent;
