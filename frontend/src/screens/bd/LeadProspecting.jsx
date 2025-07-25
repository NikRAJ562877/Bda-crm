import React, { useState, useEffect } from 'react';
import {
  Box,
  Button,
  TextField,
  Typography,
  Paper,
  FormControlLabel,
  Checkbox,
  InputAdornment
} from '@mui/material';
import {
  Email,
  Phone,
  Web,
  LocationOn,
  NoteAlt,
  FilterList,
  BadgeOutlined,
  Instagram,
  BrandingWatermark,
  Business
} from '@mui/icons-material';
import apiClient from '../../api/auth';
import { useParams, useNavigate } from 'react-router-dom';

function LeadProspecting() {
  const { leadId: paramId } = useParams();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    leadId: '',
    brandName: '',
    instagramHandle: '',
    websiteUrl: '',
    email: '',
    phoneNumber: '',
    location: '',
    industry: '',
    remarks: '',
  });

  const [checklist, setChecklist] = useState({
    verifiedEmail: false,
    verifiedPhone: false,
    checkedWebsite: false,
    qualifiedLead: false,
  });

  useEffect(() => {
    if (paramId) {
      apiClient({ endpoint: `/leads/${paramId}`, method: 'GET' })
        .then(data => {
          if (data.prospecting) {
            const { username, checklist = {}, ...rest } = data.prospecting;
            setForm({ leadId: paramId, ...rest });
            setChecklist(checklist);
          }
        })
        .catch(console.error);
    } else {
      const randomId = Math.floor(1000 + Math.random() * 9000).toString();
      setForm(f => ({ ...f, leadId: randomId }));
    }
  }, [paramId]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleChecklistChange = (e) => {
    setChecklist({ ...checklist, [e.target.name]: e.target.checked });
  };

  const handleManualSubmit = async (e) => {
    e.preventDefault();
    const username = sessionStorage.getItem("name") || "Unknown";

    const payload = {
      prospecting: {
        ...form,
        checklist,
        username
      }
    };

    const method = paramId ? 'PUT' : 'POST';
    const endpoint = paramId ? `/leads/${paramId}` : '/leads';

    try {
      await apiClient({ endpoint, method, body: payload });
      alert('Lead saved successfully!');
    } catch (err) {
      console.error(err);
      alert('Error saving lead');
    }
  };

  const getIconForField = (fieldName) => {
    switch (fieldName) {
      case 'email': return <Email />;
      case 'phoneNumber': return <Phone />;
      case 'websiteUrl': return <Web />;
      case 'location': return <LocationOn />;
      case 'remarks': return <NoteAlt />;
      case 'instagram': return <Instagram />;
      case 'brandName': return <BrandingWatermark />;
      case 'leadId': return <BadgeOutlined />;
      case 'industry': return <Business />;
      default: return <FilterList />;
    }
  };

  return (
    <Box p={10}>
      <Typography variant="h4" align="center" gutterBottom>Lead Prospecting</Typography>
      <Paper sx={{ p: 6, mb: 4 }}>
        <Typography variant="h6" gutterBottom>Manual Lead Entry</Typography>
        <form onSubmit={handleManualSubmit}>
          <Box display="grid" gap={2}>
            <TextField
              label="Lead ID"
              name="leadId"
              value={form.leadId}
              fullWidth
              InputProps={{
                readOnly: true,
                startAdornment: (
                  <InputAdornment position="start">
                    <BadgeOutlined />
                  </InputAdornment>
                ),
              }}
            />

            {Object.keys(form).filter(key => key !== 'leadId').map((key) => (
              <TextField
                key={key}
                label={key.replace(/([A-Z])/g, ' $1').toUpperCase()}
                name={key}
                value={form[key]}
                onChange={handleChange}
                fullWidth
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      {getIconForField(key)}
                    </InputAdornment>
                  ),
                }}
              />
            ))}

            <Typography variant="subtitle1">Lead Qualification Checklist:</Typography>
            {Object.keys(checklist).map((key) => (
              <FormControlLabel
                key={key}
                control={
                  <Checkbox
                    name={key}
                    checked={checklist[key]}
                    onChange={handleChecklistChange}
                  />
                }
                label={key.replace(/([A-Z])/g, ' $1')}
              />
            ))}

            <Button variant="contained" color="primary" type="submit">
              Save Lead
            </Button>
          </Box>
        </form>
      </Paper>
    </Box>
  );
}

export default LeadProspecting;
