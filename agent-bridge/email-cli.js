#!/usr/bin/env node
const axios = require('axios');

const [,, command, account, ...args] = process.argv;
const API_URL = process.env.API_URL || 'http://localhost:3000';

const commands = {
  read: async (account) => {
    const res = await axios.post(`${API_URL}/email-command`, 
      { command: 'read', account });
    console.log(`📧 Emails for ${account}:`, res.data);
  },
  send: async (account, to, subject, body) => {
    const res = await axios.post(`${API_URL}/email-command`, {
      command: 'send',
      account,
      data: { to, subject, body }
    });
    console.log(`✅ Sent from ${account}:`, res.data);
  },
  list: async () => {
    const res = await axios.post(`${API_URL}/email-command`, 
      { command: 'list-accounts' });
    console.log('📋 Accounts:', res.data);
  }
};

if (!commands[command]) {
  console.log('Usage: email-cli [read|send|list] [account] [args...]');
  process.exit(1);
}

commands[command](account, ...args).catch(err => 
  console.error('❌', err.response?.data || err.message));
