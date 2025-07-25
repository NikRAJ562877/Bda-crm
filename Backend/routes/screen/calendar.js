const express = require('express');
const router = express.Router();
const { google } = require('googleapis'); // ✅ REQUIRED
const GoogleToken = require('../../models/GoogleToken');
const {
  getAuthUrl,
  oauth2Client,
} = require('../../utils/googleCalendar');

// Step 1: Redirect user to Google Auth page
router.get('/auth', (req, res) => {
  return res.redirect(getAuthUrl());
});

// Step 2: Handle Google OAuth callback and save token
router.get('/callback', async (req, res) => {
  try {
    const { code } = req.query;
    const { tokens } = await oauth2Client.getToken(code);
    oauth2Client.setCredentials(tokens);

    // Remove old tokens to avoid duplicates
    await GoogleToken.deleteMany();

    // Store new token
    await GoogleToken.create({
      access_token: tokens.access_token,
      refresh_token: tokens.refresh_token,
      scope: tokens.scope,
      token_type: tokens.token_type,
      expiry_date: tokens.expiry_date,
    });

    return res.send('✅ Google Calendar authenticated and token saved! You can close this tab.');
  } catch (err) {
    console.error('OAuth callback error:', err.message);
    return res.status(500).send('❌ Failed to authenticate with Google.');
  }
});

// Step 3: Create Calendar Event
router.post('/create-event', async (req, res) => {
  try {
    const { leadId, summary, description, start, end } = req.body;

    // Validate input
    if (!leadId || !summary || !start || !end) {
      return res.status(400).json({ error: 'Missing required fields.' });
    }

    // Get the latest token (assuming single-user setup)
    const tokenData = await GoogleToken.findOne().sort({ createdAt: -1 });
    if (!tokenData) {
      return res.status(404).json({ error: 'No tokens found for user.' });
    }

    // Set credentials
    oauth2Client.setCredentials({
      access_token: tokenData.access_token,
      refresh_token: tokenData.refresh_token,
      scope: tokenData.scope,
      token_type: tokenData.token_type,
      expiry_date: tokenData.expiry_date,
    });

    const calendar = google.calendar({ version: 'v3', auth: oauth2Client });

    const event = {
      summary,
      description,
      start: {
        dateTime: start,
        timeZone: 'Asia/Kolkata',
      },
      end: {
        dateTime: end,
        timeZone: 'Asia/Kolkata',
      },
    };

    const response = await calendar.events.insert({
      calendarId: 'primary',
      resource: event,
    });

    return res.status(200).json({ message: '✅ Event created successfully.', event: response.data });
  } catch (error) {
    console.error('❌ Calendar Event Creation Error:', error);
    return res.status(500).json({
      error: '❌ Failed to create calendar event.',
      details: error.message,
    });
  }
});

module.exports = router;
