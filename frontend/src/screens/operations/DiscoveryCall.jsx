import React, { useState, useEffect } from 'react';
import {
  Box, TextField, Typography, Button,
  CircularProgress, Paper, FormControl, InputLabel, Select, MenuItem, OutlinedInput, Checkbox, ListItemText
} from '@mui/material';
import { useParams } from 'react-router-dom';
import apiClient from '../../api/auth';

const servicesList = [
  "Landing page design",
  "Website development",
  "Website optimization",
  "Website maintenance and support",
  "Ad strategy",
  "Ad creative development",
  "Video production",
  "Social media integration",
  "Reporting & Analysis",
  "UGC strategy",
  "Social proof"
];

function DiscoveryCall() {
  const { leadId } = useParams();
  const [form, setForm] = useState({
    servicesDiscussed: [],
    outcome: '',
    followUpDate: '',
    remarks: ''
  });
  const [exec1, setExec1] = useState({});
  const [exec2, setExec2] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        const lead = await apiClient({
          endpoint: `/leads/${leadId}`,
          method: 'GET'
        });

        setExec1(lead.prospecting || {});
        setExec2(lead.outreach || {});

        if (lead.discoveryCall) {
          setForm({
            servicesDiscussed: lead.discoveryCall.servicesDiscussed || [],
            outcome: lead.discoveryCall.outcome || '',
            followUpDate: lead.discoveryCall.followUpDate || '',
            remarks: lead.discoveryCall.remarks || ''
          });
        }
      } catch (err) {
        console.error('Error fetching lead data:', err);
      } finally {
        setLoading(false);
      }
    })();
  }, [leadId]);

  const handleChange = e => {
    const { name, value } = e.target;
    setForm(f => ({ ...f, [name]: value }));
  };

  const handleSubmit = async e => {
    e.preventDefault();
    
    // Fetch username from sessionStorage
    const username = sessionStorage.getItem('name') || "Unknown";  // Assuming 'name' is stored in sessionStorage
    if (username === "Unknown") {
      alert('Username not found. Please log in again.');
      return;
    }

    // Ensure outcome is one of the valid values
    const validOutcomes = ['interested', 'not_interested', 'follow_up']; // Adjust according to your valid outcomes
    if (!validOutcomes.includes(form.outcome)) {
      alert('Invalid outcome selected');
      return;
    }

    // If outcome is 'follow_up', ensure the follow-up date is filled
    if (form.outcome === 'follow_up' && !form.followUpDate) {
      alert('Please provide a follow-up date');
      return;
    }

    // Prepare the services discussed data
    const servicesDiscussedArray = Array.isArray(form.servicesDiscussed) ? form.servicesDiscussed : [];

    // Create the payload for the discovery call
    const payload = {
      discoveryCall: {
        servicesDiscussed: servicesDiscussedArray,
        outcome: form.outcome || '',  // Ensure this is a valid outcome
        followUpDate: form.followUpDate || '',
        remarks: form.remarks || '',
        username,  // Add username here
        entryDateTime: new Date().toISOString()
      }
    };

    console.log("Payload to send:", payload);

    try {
      const response = await apiClient({
        endpoint: `/leads/${leadId}/discovery`,
        method: 'PUT',
        body: payload
      });

      if (response.error) {
        alert('Error saving discovery call info');
      } else {
        alert('Discovery call info saved successfully!');
      }
    } catch (err) {
      console.error('API error:', err);
      alert('Error saving discovery call info');
    }
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" mt={5}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box p={8}>
      <Typography variant="h4" align="center" gutterBottom>Discovery Call</Typography>
      <Paper sx={{ p: 3 }}>
        <form onSubmit={handleSubmit}>
          <Box display="grid" gap={2}>

            {/* Executive 1 - Prospecting */}
            <TextField label="Brand Name" value={exec1.brandName || ''} fullWidth InputProps={{ readOnly: true }} />
            <TextField label="Instagram Handle" value={exec1.instagramHandle || ''} fullWidth InputProps={{ readOnly: true }} />
            <TextField label="Website URL" value={exec1.websiteUrl || ''} fullWidth InputProps={{ readOnly: true }} />
            <TextField label="Location" value={exec1.location || ''} fullWidth InputProps={{ readOnly: true }} />
            <TextField label="Remarks" value={exec1.remarks || ''} fullWidth InputProps={{ readOnly: true }} />

            {/* Executive 2 - Outreach */}
            <Typography variant="h6">Executive 2: Outreach</Typography>
            <TextField label="Contact Name" value={exec2.contactName || ''} fullWidth InputProps={{ readOnly: true }} />
            <TextField label="Channels Used" value={(exec2.selectedChannels || []).join(', ')} fullWidth InputProps={{ readOnly: true }} />

            {/* Executive 3 - Discovery Input */}
            <Typography variant="h6">Executive 3: Your Input</Typography>

            {/* Multi-select services */}
            <FormControl fullWidth>
              <InputLabel id="services-label">Services Discussed</InputLabel>
              <Select
                labelId="services-label"
                multiple
                name="servicesDiscussed"
                value={form.servicesDiscussed}
                onChange={e => setForm(f => ({ ...f, servicesDiscussed: e.target.value }))}
                input={<OutlinedInput label="Services Discussed" />}
                renderValue={(selected) => selected.join(', ')}
              >
                {servicesList.map((service) => (
                  <MenuItem key={service} value={service}>
                    <Checkbox checked={form.servicesDiscussed.indexOf(service) > -1} />
                    <ListItemText primary={service} />
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            {/* Outcome Select */}
            <FormControl fullWidth required>
              <InputLabel id="outcome-label">Outcome</InputLabel>
              <Select
                labelId="outcome-label"
                name="outcome"
                value={form.outcome}
                onChange={handleChange}
              >
                <MenuItem value="interested">Interested</MenuItem>
                <MenuItem value="not_interested">Not Interested</MenuItem>
                <MenuItem value="follow_up">Follow-Up - When?</MenuItem>
              </Select>
            </FormControl>

            {/* Follow-up Date Picker */}
            {form.outcome === 'follow_up' && (
              <TextField
                label="Follow-Up Date"
                type="datetime-local"
                name="followUpDate"
                value={form.followUpDate}
                onChange={handleChange}
                fullWidth
                InputLabelProps={{ shrink: true }}
              />
            )}

            <TextField
              label="Remarks"
              name="remarks"
              value={form.remarks}
              onChange={handleChange}
              fullWidth multiline rows={3}
            />

            <Button variant="contained" color="primary" type="submit">
              Save Discovery Call Info
            </Button>
          </Box>
        </form>
      </Paper>
    </Box>
  );
}

export default DiscoveryCall;
