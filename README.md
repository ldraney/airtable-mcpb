# Airtable MCP Server

A standalone MCP server extension for Claude Desktop that enables natural language interaction with your Airtable bases.

**One-click install. No JSON config editing. API key prompted during setup.**

## Features

- **list_bases** - List all accessible Airtable bases
- **list_tables** - List tables in a specific base
- **list_records** - Retrieve records from a table
- **create_record** - Create new records
- **update_record** - Update existing records

## Installation

1. Download the `.mcpb` file from [Releases](https://github.com/ldraney/airtable-mcpb/releases)
2. In Claude Desktop: Settings → Extensions → Install Extension
3. Select the `.mcpb` file
4. Enter your Airtable API key when prompted

## Airtable API Key Setup

1. Go to [airtable.com/create/tokens](https://airtable.com/create/tokens)
2. Create a personal access token with these scopes:
   - `data.records:read`
   - `data.records:write`
   - `schema.bases:read`
3. Grant access to the bases you want to use

## Usage Examples

Once installed, just chat naturally with Claude:

> "List my Airtable bases"

> "What tables are in my Projects base?"

> "Show me all records from the Tasks table"

> "Create a new record in Tasks with Name='Review PR' and Status='Todo'"

> "Update record rec123 - set Status to 'Done'"

## Demo

[Video demo coming soon]

## License

MIT
