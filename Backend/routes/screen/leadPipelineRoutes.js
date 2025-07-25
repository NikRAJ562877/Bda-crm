const express = require('express');
const router = express.Router();
const LeadPipeline = require('../../models/LeadPipeline');

console.log('🔌  Loaded leadPipelineRoutes');


// Get all pipelines
router.get('/', async (req, res) => {
  try {
    const all = await LeadPipeline.find();
    return res.json(all);
  } catch (err) {
    console.error('Error fetching pipelines:', err);
    return res.status(500).json({ error: err.message });
  }
});

// Get one pipeline by leadId
router.get('/:leadId', async (req, res) => {
  try {
    const doc = await LeadPipeline.findOne({ leadId: req.params.leadId });
    if (!doc) return res.status(404).json({ error: 'Not found' });
    return res.json(doc);
  } catch (err) {
    console.error('Error fetching pipeline:', err);
    return res.status(500).json({ error: err.message });
  }
});


// Helper function to extract username from any nested stage
const getUsername = (req) => {
  return (
    // top‐level
    req.body.username ||
    // nested under prospecting / outreach / discoveryCall
    req.body.prospecting?.username ||
    req.body.outreach?.username ||
    req.body.discoveryCall?.username ||
    // session / auth
    req.session?.username ||
    req.user?.username
  );
};

// Create new pipeline (Executive 1)
router.post('/', async (req, res) => {
  try {
    const username = getUsername(req);
    if (!username) return res.status(400).json({ error: 'Username is required' });

    const pipeline = new LeadPipeline({
      leadId: req.body.prospecting.leadId,
      prospecting: { ...req.body.prospecting, username },
    });
    await pipeline.save();
    res.status(201).json(pipeline);
  } catch (err) {
    console.error('Error creating pipeline:', err);
    res.status(500).json({ error: err.message });
  }
});

// Update prospecting (Executive 1)
router.put('/:leadId', async (req, res) => {
  try {
    const username = getUsername(req);
    if (!username) return res.status(400).json({ error: 'Username is required' });

    const updated = await LeadPipeline.findOneAndUpdate(
      { leadId: req.params.leadId },
      { prospecting: { ...req.body.prospecting, username } },
      { new: true, upsert: false }
    );
    if (!updated) return res.status(404).json({ error: 'Pipeline not found' });
    res.json(updated);
  } catch (err) {
    console.error('Error updating prospecting:', err);
    res.status(500).json({ error: err.message });
  }
});
 
// Executive 2 – Outreach Update (append new entries)
router.put('/:leadId/outreach', async (req, res) => {
  try {
    const username = getUsername(req);
    if (!username) return res.status(400).json({ error: 'Username is required' });

    // pull in exactly what the front-end is sending
    const {
      contactName,
      selectedChannels,
      channelData,    // this is an array of { channel, entries: [ { status, messageScript, date, remarks } ] }
    } = req.body.outreach;

    // must have at least one channelData item
    if (!Array.isArray(channelData) || channelData.length === 0) {
      return res.status(400).json({ error: 'channelData must be a non-empty array' });
    }

    // validate each channelData item
    const validChannels = ['whatsapp','dm','email','linkedin','instagram','coldemail'];
    const validStatuses = ['initial','followUp1','followUp2','followUp3'];
    for (const cd of channelData) {
      if (!cd.channel || !validChannels.includes(cd.channel)) {
        return res.status(400).json({
          error: `Invalid channel "${cd.channel}". Must be one of: ${validChannels.join(', ')}`
        });
      }
      if (!Array.isArray(cd.entries) || cd.entries.length === 0) {
        return res.status(400).json({ error: `Entries for channel "${cd.channel}" must be a non-empty array` });
      }
      for (const entry of cd.entries) {
        if (!entry.status || !validStatuses.includes(entry.status)) {
          return res.status(400).json({
            error: `Invalid status "${entry.status}" for channel "${cd.channel}". Must be one of: ${validStatuses.join(', ')}`
          });
        }
        if (!entry.messageScript) {
          return res.status(400).json({ error: 'messageScript is required for every entry' });
        }
      }
    }

    // fetch the pipeline
    const pipeline = await LeadPipeline.findOne({ leadId: req.params.leadId });
    if (!pipeline) return res.status(404).json({ error: 'Pipeline not found' });

    // update contactName & username & timestamp
    pipeline.outreach.contactName = contactName || pipeline.outreach.contactName;
    pipeline.outreach.username = username;
    pipeline.outreach.entryDateTime = new Date();

    // update selectedChannels (avoid duplicates)
    selectedChannels?.forEach(ch => {
      if (!pipeline.outreach.selectedChannels.includes(ch)) {
        pipeline.outreach.selectedChannels.push(ch);
      }
    });

    // for each incoming channelData block, append its entries
    for (const cd of channelData) {
      const existing = pipeline.outreach.channelData.find(c => c.channel === cd.channel);
      if (existing) {
        // append each entry
        existing.entries.push(...cd.entries.map(e => ({
          status: e.status,
          messageScript: e.messageScript,
          date: e.date ? new Date(e.date) : Date.now(),
          remarks: e.remarks || ''
        })));
      } else {
        // create new channel entry
        pipeline.outreach.channelData.push({
          channel: cd.channel,
          entries: cd.entries.map(e => ({
            status: e.status,
            messageScript: e.messageScript,
            date: e.date ? new Date(e.date) : Date.now(),
            remarks: e.remarks || ''
          }))
        });
      }
    }
    // Optional: update discoveryCall inside outreach if provided
if (req.body.outreach.discoveryCall) {
  pipeline.outreach.discoveryCall = {
    scheduledDateTime: req.body.outreach.discoveryCall.scheduledDateTime,
    calendarEventId: req.body.outreach.discoveryCall.calendarEventId,
  };
}

    await pipeline.save();
    return res.json(pipeline);

  } catch (err) {
    console.error('Error updating outreach:', err);
    if (err.name === 'ValidationError') {
      return res.status(400).json({ error: 'Validation error: ' + err.message });
    }
    return res.status(500).json({ error: 'Internal server error: ' + err.message });
  }
});

 
// Update discovery (Executive 3)
router.put('/:leadId/discovery', async (req, res) => {
  try {
    const username = getUsername(req);
    if (!username) return res.status(400).json({ error: 'Username is required' });

    const {
      servicesDiscussed,
      outcome,
      followUpDate,
      remarks
    } = req.body.discoveryCall;

    // Validate outcome value against the allowed outcomes
    const validOutcomes = ['interested', 'follow_up', 'rejected', 'not_interested']; // Add 'not_interested'
    if (outcome && !validOutcomes.includes(outcome)) {
      return res.status(400).json({ error: 'Invalid outcome value' });
    }

    // Build the discovery call update object
    const discoveryCallUpdate = {
      servicesDiscussed: Array.isArray(servicesDiscussed) ? servicesDiscussed : [],
      outcome,
      remarks,
      username,
      entryDateTime: new Date()
    };

    // Include follow-up date only if the outcome is 'follow_up'
    if (outcome === 'follow_up' && followUpDate) {
      discoveryCallUpdate.followUpDate = followUpDate;
    }

    // Update the lead pipeline with the new discovery call data
    const updated = await LeadPipeline.findOneAndUpdate(
      { leadId: req.params.leadId },
      { $set: { discoveryCall: discoveryCallUpdate } },
      { new: true, runValidators: true }
    );

    if (!updated) return res.status(404).json({ error: 'Lead not found' });
    res.json(updated);
  } catch (err) {
    console.error('Error updating discovery call:', err);
    res.status(500).json({ error: err.message });
  }
});
// Retrieve events from the Google Calendar
router.get('/events', async (req, res) => {
  if (!req.session.tokens) {
    return res.status(403).send('Unauthorized');
  }

  oauth2Client.setCredentials(req.session.tokens);

  const calendar = google.calendar({ version: 'v3', auth: oauth2Client });

  try {
    const events = await calendar.events.list({
      calendarId: 'primary',
      timeMin: (new Date()).toISOString(),
      maxResults: 10,
      singleEvents: true,
      orderBy: 'startTime',
    });

    res.status(200).json(events.data.items);
  } catch (err) {
    console.error('Error fetching events:', err);
    res.status(500).send('Error fetching events');
  }
});





module.exports = router;
