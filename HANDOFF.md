# Airtable MCP Extension - Handoff Notes

## Status: WORKING ✅
The extension installs and runs in Claude Desktop.

## What's Done
- [x] Hello world extension (proof of concept)
- [x] Airtable extension with 5 tools:
  - `list_bases` - List all bases
  - `list_tables` - List tables in a base
  - `list_records` - Get records from a table
  - `create_record` - Create new record (takes fields_json string)
  - `update_record` - Update existing record (takes fields_json string)
- [x] One-click install via .mcpb file
- [x] API key prompt on install (user_config)

## Key Files
- `C:\Users\drane\airtable-mcpb\` - Extension source
- `C:\Users\drane\airtable-mcpb\airtable-mcpb.mcpb` - Installable extension
- `C:\Users\drane\hello-world-node\` - Working hello world reference

## What's Left for Tomorrow
1. **Test write operations** - Create/update records in Airtable
2. **Update GitHub repo** - Push extension code to ldraney/airtable-mcp-server
3. **Update README** - Document one-click install with .mcpb
4. **Record Loom** - 2-min demo showing install + usage
5. **Submit proposal**

## Technical Notes
- Uses Node.js (not Python) - better mcpb support
- Schemas use zod: `z.string()`, `z.number().optional()`, etc.
- Empty schemas need placeholder: `{ placeholder: z.string().optional() }`
- `z.record(z.any())` doesn't work - use `fields_json` string instead
- Version bumps force fresh install when debugging

## API Key Scopes Needed
User's Airtable token needs:
- data.records:read
- data.records:write
- schema.bases:read

## Commands
```bash
# Repack after changes
cd C:\Users\drane\airtable-mcpb && mcpb pack

# Check logs
tail -50 "%APPDATA%\Claude\logs\mcp-server-airtable.log"
```
