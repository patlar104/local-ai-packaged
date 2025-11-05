const express = require('express');
const axios = require('axios');
require('dotenv').config();

const app = express();
app.use(express.json());

// Webhook endpoint your agent calls
app.post('/email-command', async (req, res) => {
  const { command, account, data } = req.body;
  
  // Map commands to n8n workflow webhooks
  const workflows = {
    'read': process.env.N8N_READ_WEBHOOK,
    'send': process.env.N8N_SEND_WEBHOOK,
    'list-accounts': process.env.N8N_ACCOUNTS_WEBHOOK
  };
  
  try {
    const result = await axios.post(workflows[command], { account, ...data });
    res.json({ success: true, data: result.data });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.listen(3000, () => console.log('Agent bridge running on :3000'));
