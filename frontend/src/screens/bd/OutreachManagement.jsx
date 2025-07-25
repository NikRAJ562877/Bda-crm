import React, { useState, useEffect } from 'react';
import {
  Box, Button, TextField, Typography, Paper, MenuItem, Select,
  FormControl, InputLabel, InputAdornment, CircularProgress
} from '@mui/material';
import { Person, Message, NoteAlt } from '@mui/icons-material';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import apiClient from '../../api/auth';
import { useParams } from 'react-router-dom';
import dayjs from 'dayjs';

const scripts = {
  linkedin: {
    initial: `Hi [First Name], ...`,
    followUp1: `Hey [First Name], thanks for connecting! ...`,
    followUp2: `Hey [First Name], Busy, right? ...`,
    followUp3: `Hey [First Name], Not sure if you saw this, ...`
  },
  instagram: {
    initial: `Hey [Brand Name], your brand is amazing! ...`,
    followUp1: `Hey [Brand Name], dropping in with a game-changing UX tip: ...`,
    followUp2: `Hey [Brand Name], brands in your space ...`,
    followUp3: ``,
  },
  whatsapp: {
    initial: `Hey [First Name], We help D2C brands ...`,
    followUp1: `Hey [First Name], Quick one! We helped ...`,
    followUp2: `Hey [First Name], We’re offering free UX ...`,
    followUp3: ``,
  },
  coldemail: {
    initial: `Subject: Small Fixes, Big Wins for [Brand Name] ...`,
    followUp1: `Subject: Quick Wins for [Brand Name] ...`,
    followUp2: `Subject: Free UX Audit for [Brand Name] ...`,
    followUp3: `Subject: Last Chance: Free UX Audit for [Brand Name] ...`
  }
};

function OutreachManagement() {
  const { leadId } = useParams();
  const [exec1, setExec1] = useState({});
  const [form, setForm] = useState({
    contactName: '',
    selectedChannel: '',
    selectedStatus: '',
    messageScript: '',
    date: null,
    remarks: ''
  });
  const [loading, setLoading] = useState(false);  // Loading state for API calls

  useEffect(() => {
    apiClient({ endpoint: `/leads/${leadId}`, method: 'GET' })
      .then(data => {
        if (data.prospecting) setExec1(data.prospecting);
        if (data.outreach) {
          setForm(prev => ({
            ...prev,
            contactName: data.outreach.contactName || ''
          }));
        }
      })
      .catch(console.error);
  }, [leadId]);

  const handleChange = (field, value) => {
    let script = form.messageScript;
    if (field === 'selectedChannel' || field === 'selectedStatus') {
      const channel = field === 'selectedChannel' ? value : form.selectedChannel;
      const status = field === 'selectedStatus' ? value : form.selectedStatus;
      script = scripts[channel]?.[status] || '';
    }
    setForm(prev => ({ ...prev, [field]: value, messageScript: script }));
  };

const bookDiscoveryCall = async (formData) => {
  if (!formData.date) {
    console.log('Date is missing!');
    return;
  }

  const startTime = dayjs(formData.date);
  const endTime = startTime.add(30, 'minute');
  const username = sessionStorage.getItem('name') || 'Unknown';

  const payload = {
    leadId,
    summary: `Discovery Call with ${formData.contactName}`,
    description: `Discovery call scheduled via Outreach Management for ${formData.selectedChannel}`,
    start: startTime.toISOString(),
    end: endTime.toISOString(),
  };

  try {
    const response = await apiClient({
      endpoint: '/calendar/create-event',
      method: 'POST',
      body: payload
    });

    if (response && response.event && response.event.id) {
      const eventId = response.event.id;

      const updatePayload = {
        outreach: {
          contactName: formData.contactName,
          selectedChannels: [formData.selectedChannel],
          channelData: [{
            channel: formData.selectedChannel,
            entries: [
              {
                status: formData.selectedStatus,
                messageScript: formData.messageScript,
                date: formData.date ? formData.date.toISOString() : null,
                remarks: formData.remarks
              }
            ]
          }],
          discoveryCall: {
            scheduledDateTime: startTime.toISOString(),
            calendarEventId: eventId
          }
        },
        username
      };

      await apiClient({
        endpoint: `/leads/${leadId}/outreach`,
        method: 'PUT',
        body: updatePayload
      });

      console.log('Outreach updated with calendar event ID');
    } else {
      console.error('Unexpected response structure from calendar API:', response);
    }
  } catch (err) {
    console.error('Google Calendar Error:', err);
    alert('Outreach saved, but failed to create Google Calendar event.');
  }
};

const handleSubmit = async (e) => {
  e.preventDefault();

  if (!form.selectedChannel || !form.selectedStatus || !form.messageScript) {
    alert('Please fill in all required fields: Channel, Status, and Message Script.');
    return;
  }

  // Retrieve username from sessionStorage
  const username = sessionStorage.getItem('name') || 'Unknown';
  console.log('Username:', username);  // Log to debug if username is retrieved correctly

  const newEntry = {
    status: form.selectedStatus,
    messageScript: form.messageScript,
    date: form.date ? form.date.toISOString() : null,
    remarks: form.remarks
  };

  const payload = {
    outreach: {
      contactName: form.contactName,
      selectedChannels: [form.selectedChannel],
      channelData: [{
        channel: form.selectedChannel,
        entries: [newEntry]
      }],
      
      entryDateTime: new Date().toISOString()
    },
    username,
  };

  try {
    const response = await apiClient({
      endpoint: `/leads/${leadId}/outreach`,
      method: 'PUT',
      body: payload
    });

    if (response.error) {
      alert('Error saving outreach info');
    } else {
      await bookDiscoveryCall(form);  // ✅ Book Google Calendar event
      alert('Outreach info and discovery call saved successfully!');
      setForm({
        contactName: form.contactName,
        selectedChannel: '',
        selectedStatus: '',
        messageScript: '',
        date: null,
        remarks: ''
      });
    }
  } catch (err) {
    console.error('API error:', err);
    alert('Error saving outreach info');
  }
};

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <Box p={6}>
        <Typography variant="h4" align="center" gutterBottom>Outreach Management</Typography>
        <Button
          variant="outlined"
          color="secondary"
          onClick={() => window.open('http://localhost:5000/api/calendar/auth', '_blank')}
          sx={{ mb: 2 }}
        >
          Authenticate Google Calendar
        </Button>
        <Paper sx={{ p: 3 }}>
          <Typography variant="h6">Executive 1: Lead Prospecting</Typography>
          <Box mb={2}>
            <TextField label="Brand Name" value={exec1.brandName || ''} fullWidth InputProps={{ readOnly: true }} />
            <TextField label="Instagram Handle" value={exec1.instagramHandle || ''} fullWidth InputProps={{ readOnly: true }} sx={{ mt: 1 }} />
            <TextField label="Website URL" value={exec1.websiteUrl || ''} fullWidth InputProps={{ readOnly: true }} sx={{ mt: 1 }} />
            <TextField label="Location" value={exec1.location || ''} fullWidth InputProps={{ readOnly: true }} sx={{ mt: 1 }} />
            <TextField label="Remarks" value={exec1.remarks || ''} fullWidth InputProps={{ readOnly: true }} sx={{ mt: 1 }} />
          </Box>

          <Typography variant="h6">Executive 2: Outreach</Typography>
          <form onSubmit={handleSubmit}>
            <Box display="grid" gap={2}>
              <TextField
                label="Contact Name"
                value={form.contactName}
                onChange={(e) => handleChange('contactName', e.target.value)}
                fullWidth
                InputProps={{ startAdornment: <InputAdornment position="start"><Person /></InputAdornment> }}
                required
              />

              <FormControl fullWidth>
                <InputLabel>Channel</InputLabel>
                <Select
                  value={form.selectedChannel}
                  onChange={(e) => handleChange('selectedChannel', e.target.value)}
                  label="Channel"
                  required
                >
                  <MenuItem value="linkedin">LinkedIn</MenuItem>
                  <MenuItem value="instagram">Instagram</MenuItem>
                  <MenuItem value="whatsapp">WhatsApp</MenuItem>
                  <MenuItem value="coldemail">Cold Email</MenuItem>
                </Select>
              </FormControl>

              <FormControl fullWidth>
                <InputLabel>Status</InputLabel>
                <Select
                  value={form.selectedStatus}
                  onChange={(e) => handleChange('selectedStatus', e.target.value)}
                  label="Status"
                  required
                >
                  <MenuItem value="initial">Initial Message</MenuItem>
                  <MenuItem value="followUp1">Follow-Up 1</MenuItem>
                  <MenuItem value="followUp2">Follow-Up 2</MenuItem>
                  <MenuItem value="followUp3">Follow-Up 3</MenuItem>
                </Select>
              </FormControl>

              <TextField
                label="Message Script"
                value={form.messageScript}
                onChange={(e) => handleChange('messageScript', e.target.value)}
                multiline
                rows={4}
                fullWidth
                InputProps={{ startAdornment: <InputAdornment position="start"><Message /></InputAdornment> }}
                required
              />

              <DatePicker
                label="Date and Time"
                value={form.date}
                onChange={(date) => handleChange('date', date)}
                renderInput={(params) => <TextField {...params} fullWidth />}
              />

              <TextField
                label="Remarks"
                value={form.remarks}
                onChange={(e) => handleChange('remarks', e.target.value)}
                multiline
                rows={2}
                fullWidth
                InputProps={{ startAdornment: <InputAdornment position="start"><NoteAlt /></InputAdornment> }}
              />

              <Button type="submit" variant="contained" color="primary" fullWidth disabled={loading}>
                {loading ? <CircularProgress size={24} color="inherit" /> : 'Save Outreach'}
              </Button>
            </Box>
          </form>
        </Paper>
      </Box>
    </LocalizationProvider>
  );
}

export default OutreachManagement;
