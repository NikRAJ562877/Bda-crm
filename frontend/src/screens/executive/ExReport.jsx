import React, { useEffect, useState } from 'react';
import {
  Box, Typography, Paper, Table, TableBody, TableCell,
  TableContainer, TableHead, TableRow, Button, Dialog,
  DialogTitle, DialogContent, Divider
} from '@mui/material';
import apiClient from '../../api/auth';

function ExReport() {
  const [pipelines, setPipelines] = useState([]);
  const [selectedPipeline, setSelectedPipeline] = useState(null);

  useEffect(() => {
    apiClient({ endpoint: '/leads', method: 'GET' })
      .then(setPipelines)
      .catch(console.error);
  }, []);

  const handleViewDetails = (pipeline) => {
    setSelectedPipeline(pipeline);
  };

  // Generic renderer for simple scalar or array fields
  const renderField = (label, value) => (
    <Box mb={1}>
      <strong>{label}:</strong>&nbsp;
      {Array.isArray(value)
        ? value.join(', ')
        : String(value ?? 'N/A')}
    </Box>
  );

  return (
    <Box p={4}>
      <Typography variant="h4" gutterBottom>Executive Report</Typography>

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Lead ID</TableCell>
              <TableCell>Brand Name</TableCell>
              <TableCell>Prospecting User</TableCell>
              <TableCell>Outreach User</TableCell>
              <TableCell>Discovery User</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {pipelines.map(row => (
              <TableRow key={row.leadId}>
                <TableCell>{row.leadId}</TableCell>
                <TableCell>{row.prospecting?.brandName}</TableCell>
                <TableCell>{row.prospecting?.username}</TableCell>
                <TableCell>{row.outreach?.username}</TableCell>
                <TableCell>{row.discoveryCall?.username}</TableCell>
                <TableCell>
                  <Button variant="outlined" onClick={() => handleViewDetails(row)}>
                    View Full Report
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <Dialog
        open={Boolean(selectedPipeline)}
        onClose={() => setSelectedPipeline(null)}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>Lead ID: {selectedPipeline?.leadId}</DialogTitle>
        <DialogContent dividers>
          {/* Executive 1 */}
          <Box mb={3}>
            <Typography variant="h6">Executive 1 - Prospecting</Typography>
            {renderField('User', selectedPipeline?.prospecting?.username)}
            {renderField('Brand Name', selectedPipeline?.prospecting?.brandName)}
            {renderField('Instagram Handle', selectedPipeline?.prospecting?.instagramHandle)}
            {renderField('Website URL', selectedPipeline?.prospecting?.websiteUrl)}
            {renderField('Location', selectedPipeline?.prospecting?.location)}
            {renderField('Remarks', selectedPipeline?.prospecting?.remarks)}
          </Box>

          <Divider />

          {/* Executive 2 */}
          <Box my={3}>
            <Typography variant="h6">Executive 2 - Outreach</Typography>
            {renderField('User', selectedPipeline?.outreach?.username)}
            {renderField('Contact Name', selectedPipeline?.outreach?.contactName)}
            {renderField('Channels Used', selectedPipeline?.outreach?.selectedChannels)}
            {/* Now unpack channelData */}
            {selectedPipeline?.outreach?.channelData?.map((ch, idx) => (
              <Box key={idx} mb={2} pl={2} sx={{ borderLeft: '2px solid #ccc' }}>
                <Typography><strong>Channel:</strong> {ch.channel}</Typography>
                {ch.entries.map((entry, eidx) => (
                  <Box key={eidx} ml={2} my={1}>
                    {renderField('Status', entry.status)}
                    {renderField('Script', entry.messageScript)}
                    {renderField('Date', (new Date(entry.date)).toLocaleString())}
                    {renderField('Remarks', entry.remarks)}
                  </Box>
                ))}
              </Box>
            ))}
          </Box>

          <Divider />

          {/* Executive 3 */}
          <Box mt={3}>
            <Typography variant="h6">Executive 3 - Discovery Call</Typography>
            {renderField('User', selectedPipeline?.discoveryCall?.username)}
            {renderField('Services Discussed', selectedPipeline?.discoveryCall?.servicesDiscussed)}
            {renderField('Outcome', selectedPipeline?.discoveryCall?.outcome)}
            {renderField(
              'Entry Date',
              (new Date(selectedPipeline?.discoveryCall?.entryDateTime)).toLocaleString()
            )}
          </Box>
        </DialogContent>
      </Dialog>
    </Box>
  );
}

export default ExReport;
