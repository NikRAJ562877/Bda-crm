const mongoose = require('mongoose');

// Sub-schema for individual outreach entries
const outreachEntrySchema = new mongoose.Schema({
  status: {
    type: String,
    enum: ['initial', 'followUp1', 'followUp2', 'followUp3'],
    required: true
  },
  messageScript: { type: String, required: true },
  date: { type: Date, default: Date.now },
  remarks: { type: String, default: '' }
}, { _id: false });

// Sub-schema for each channel
const outreachChannelSchema = new mongoose.Schema({
  channel: {
    type: String,
    enum: ['whatsapp', 'dm', 'email', 'linkedin', 'instagram', 'coldemail'],
    required: true
  },
  entries: {
    type: [outreachEntrySchema],
    default: []
  }
}, { _id: false });

// Main schema
const leadPipelineSchema = new mongoose.Schema({
  leadId: { type: Number, required: true, unique: true },

  // Executive 1 – Prospecting (still required)
  prospecting: {
    username:   { type: String, required: true },
    brandName:  String,
    instagramHandle: String,
    websiteUrl: String,
    email:      String,
    phoneNumber:String,
    industry:   String,
    location:   String,
    remarks:    String,
    checklist: {
      verifiedEmail: Boolean,
      verifiedPhone: Boolean,
      checkedWebsite: Boolean,
      qualifiedLead: Boolean,
    },
    entryDateTime: { type: Date, default: Date.now },
  },

  // Executive 2 – Outreach
  outreach: {
    username: { type: String }, // Optional, no longer required
    contactName: { type: String },
    selectedChannels: {
      type: [String],
      enum: ['whatsapp', 'dm', 'email', 'linkedin', 'instagram', 'coldemail'],
      default: [],
    },
    channelData: { type: [outreachChannelSchema], default: [] },
    discoveryCall: {
      // Fields to store discovery call info
      scheduledDateTime: { type: Date },
      calendarEventId: { type: String },
    },
    entryDateTime: { type: Date, default: Date.now },
  },


  // Executive 3 – Discovery Call (all optional now)
  discoveryCall: {
    username:         { type: String },     // no longer required
    servicesDiscussed:{ type: [String] },   // no longer required
    outcome: {
      type: String,
      enum: ['interested','follow_up','rejected','not_interested']
      // no `required: true`
    },
    entryDateTime:    { type: Date, default: Date.now }
  }

}, { timestamps: true });

module.exports = mongoose.model('LeadPipeline', leadPipelineSchema);
