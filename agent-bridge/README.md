# Agent Bridge API

A lightweight Express.js API that bridges AI agents with n8n workflow webhooks for email gateway operations.

## Overview

This service acts as an intermediary layer between AI agents and n8n workflows, simplifying the integration by providing a single endpoint that routes commands to the appropriate n8n webhook.

## Architecture

```
AI Agent → Agent Bridge API → n8n Webhooks → Email Gateway
```

## Installation

```bash
cd agent-bridge
npm install
```

## Configuration

The service reads webhook URLs from environment variables. Update your `.env` file in the parent directory:

```env
N8N_READ_WEBHOOK=http://localhost:5678/webhook/email-read
N8N_SEND_WEBHOOK=http://localhost:5678/webhook/email-send
N8N_ACCOUNTS_WEBHOOK=http://localhost:5678/webhook/email-accounts
```

## Running

```bash
# Production
npm start

# Development (with auto-reload)
npm run dev
```

The server will start on port 3000.

## CLI Tool

The package includes a command-line interface for testing and interacting with the agent bridge.

### Usage

```bash
# List all email accounts
./email-cli.js list

# Read emails for a specific account
./email-cli.js read work@example.com

# Send an email
./email-cli.js send personal@example.com user@test.com "Subject" "Body"
```

**Commands:**
- `list` - List all email accounts
- `read <account>` - Read emails for the specified account
- `send <account> <to> <subject> <body>` - Send an email from the specified account

**Environment Variables:**
- `API_URL` - Agent bridge API URL (default: `http://localhost:3000`)

**Example:**
```bash
# Use a different API URL
API_URL=http://agent-bridge:3000 ./email-cli.js list
```

## API Endpoint

### POST /email-command

Routes commands to the appropriate n8n workflow webhook.

**Request Body:**
```json
{
  "command": "send",
  "account": "account-uuid",
  "data": {
    "to": "recipient@example.com",
    "subject": "Hello",
    "message": "Email body"
  }
}
```

**Supported Commands:**
- `read` - Trigger email reading workflow
- `send` - Send an email
- `list-accounts` - List all email accounts

**Success Response:**
```json
{
  "success": true,
  "data": {
    "message": "Email sent successfully",
    "email_id": "uuid"
  }
}
```

**Error Response:**
```json
{
  "error": "Error message"
}
```

## Example Usage

### From Command Line

```bash
# Send an email
curl -X POST http://localhost:3000/email-command \
  -H "Content-Type: application/json" \
  -d '{
    "command": "send",
    "account": "account-uuid",
    "data": {
      "to": "user@example.com",
      "subject": "Test Email",
      "message": "This is a test email"
    }
  }'

# List accounts
curl -X POST http://localhost:3000/email-command \
  -H "Content-Type: application/json" \
  -d '{
    "command": "list-accounts",
    "data": {}
  }'
```

### From Python (AI Agent)

```python
import requests

def send_email(account_id, to, subject, message):
    response = requests.post(
        'http://localhost:3000/email-command',
        json={
            'command': 'send',
            'account': account_id,
            'data': {
                'to': to,
                'subject': subject,
                'message': message
            }
        }
    )
    return response.json()

# Use in your agent
result = send_email(
    'account-uuid',
    'recipient@example.com',
    'Important Update',
    'This email was sent via AI agent'
)
print(result)
```

### From Node.js

```javascript
const axios = require('axios');

async function sendEmail(accountId, to, subject, message) {
  const response = await axios.post('http://localhost:3000/email-command', {
    command: 'send',
    account: accountId,
    data: { to, subject, message }
  });
  return response.data;
}

// Use in your agent
sendEmail('account-uuid', 'user@example.com', 'Hello', 'Test message')
  .then(result => console.log(result))
  .catch(err => console.error(err));
```

## Integration with Docker

Add to your `docker-compose.yml`:

```yaml
agent-bridge:
  build: ./agent-bridge
  container_name: agent-bridge
  restart: unless-stopped
  ports:
    - "3000:3000"
  environment:
    - N8N_READ_WEBHOOK=http://n8n:5678/webhook/email-read
    - N8N_SEND_WEBHOOK=http://n8n:5678/webhook/email-send
    - N8N_ACCOUNTS_WEBHOOK=http://n8n:5678/webhook/email-accounts
  depends_on:
    - n8n
```

## Command Mapping

The bridge maps natural language commands to specific n8n webhooks:

| Command | n8n Webhook | Purpose |
|---------|-------------|---------|
| `read` | `/webhook/email-read` | Trigger IMAP email reading |
| `send` | `/webhook/email-send` | Send email via SMTP |
| `list-accounts` | `/webhook/email-accounts` | Get all email accounts |

## Error Handling

The API returns appropriate HTTP status codes:
- `200` - Success
- `500` - Internal server error (webhook failed)

All errors include a descriptive error message in the response body.

## Security Considerations

For production deployments:
1. Add authentication middleware
2. Validate input data
3. Rate limit the endpoint
4. Use HTTPS
5. Restrict CORS to trusted origins

## Development

The service is intentionally simple to facilitate easy debugging and extension. To add new commands:

1. Add the webhook URL to `.env`
2. Add the command mapping in `server.js`
3. Update this README

## License

ISC
