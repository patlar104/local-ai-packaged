# n8n Workflow Templates for Email Gateway

This directory contains n8n workflow templates that can be imported into your n8n instance to work with the email gateway database schema.

## Available Workflows

### 1. Email_Gateway_Read_Emails.json
**Purpose**: Automatically read incoming emails from configured IMAP accounts and log them to the database.

**Features**:
- Runs on a schedule (every 5 minutes by default)
- Fetches active email accounts from the database
- Reads emails via IMAP
- Logs incoming emails to `email_logs` table

**Setup**:
1. Import the workflow into n8n
2. Configure Postgres credentials to connect to your Supabase database
3. Configure IMAP credentials for your email account(s)
4. Activate the workflow

### 2. Email_Gateway_Send_Email.json
**Purpose**: Send emails via webhook and log outgoing messages.

**Features**:
- Webhook endpoint: `/send-email`
- Retrieves email account configuration from database
- Sends email via SMTP
- Logs outgoing emails to `email_logs` table
- Returns success response

**Webhook Payload Example**:
```json
{
  "account_id": "uuid-of-email-account",
  "to": "recipient@example.com",
  "subject": "Email Subject",
  "message": "Email body text"
}
```

**Setup**:
1. Import the workflow into n8n
2. Configure Postgres credentials
3. Configure SMTP credentials for sending emails
4. Activate the workflow
5. Use the webhook URL to send emails programmatically

### 3. Workflow_State_Manager.json
**Purpose**: Manage workflow execution state and checkpoints.

**Features**:
- Webhook endpoint: `/workflow-state`
- Get workflow state: Retrieve current execution state
- Update workflow state: Save execution progress and checkpoints
- Supports workflow resumption and fault tolerance

**Webhook Operations**:

Get State:
```json
{
  "operation": "get",
  "workflow_name": "my_workflow"
}
```

Update State:
```json
{
  "operation": "update",
  "workflow_name": "my_workflow",
  "status": "running",
  "checkpoint": {
    "step": 3,
    "data": "any_json_data"
  }
}
```

**Setup**:
1. Import the workflow into n8n
2. Configure Postgres credentials
3. Activate the workflow
4. Call the webhook to manage workflow states

### 4. Email_Gateway_Manage_Accounts.json
**Purpose**: CRUD operations for email accounts via webhook.

**Features**:
- Webhook endpoint: `/email-accounts`
- Create new email accounts
- List all email accounts
- Update existing accounts
- Delete accounts

**Webhook Operations**:

Create Account:
```json
{
  "operation": "create",
  "name": "My Gmail Account",
  "email": "me@gmail.com",
  "imap_host": "imap.gmail.com",
  "imap_port": 993,
  "smtp_host": "smtp.gmail.com",
  "smtp_port": 587,
  "credentials": {
    "username": "me@gmail.com",
    "password": "app_password"
  },
  "active": true
}
```

List Accounts:
```json
{
  "operation": "list"
}
```

Update Account:
```json
{
  "operation": "update",
  "id": "uuid-of-account",
  "name": "Updated Name",
  "active": false
}
```

Delete Account:
```json
{
  "operation": "delete",
  "id": "uuid-of-account"
}
```

**Setup**:
1. Import the workflow into n8n
2. Configure Postgres credentials
3. Activate the workflow
4. Use the webhook to manage email accounts

## How to Import

1. Open your n8n instance
2. Click on "Workflows" in the left sidebar
3. Click "Add Workflow" or the "+" button
4. Click the three dots menu (⋮) and select "Import from File"
5. Select one of the JSON files from this directory
6. Configure the credentials (Postgres, IMAP, SMTP) as needed
7. Activate the workflow

## Database Connection

All workflows use Postgres credentials to connect to your Supabase database. Make sure to:

1. Create Postgres credentials in n8n
2. Use the following connection details:
   - Host: `postgres` (or your Supabase host)
   - Port: `5432`
   - Database: `postgres`
   - User: `postgres`
   - Password: Your `POSTGRES_PASSWORD` from `.env`

## Notes

- Replace `PLACEHOLDER` credential IDs with your actual credential IDs after importing
- Workflows are set to `active: false` by default - activate them after configuration
- All workflows assume the database schema from `supabase/migrations/001_email_gateway.sql` is applied
- Webhook URLs will be generated when you activate the workflows
- For production use, secure your webhooks with authentication

## Workflow Diagram

```
Email Gateway System Flow:

┌─────────────────────┐
│ Email Accounts DB   │
│ (manage accounts)   │
└──────────┬──────────┘
           │
           ├─────────────────────────────┐
           │                             │
           ▼                             ▼
┌──────────────────┐          ┌──────────────────┐
│ Read Emails      │          │ Send Emails      │
│ (scheduled)      │          │ (webhook)        │
└────────┬─────────┘          └────────┬─────────┘
         │                              │
         └──────────┬───────────────────┘
                    ▼
         ┌────────────────────┐
         │  Email Logs DB     │
         │  (audit trail)     │
         └────────────────────┘

         ┌────────────────────┐
         │ Workflow State DB  │
         │ (track progress)   │
         └────────────────────┘
```
