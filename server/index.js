import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { z } from "zod";

const BASE_URL = "https://api.airtable.com/v0";

// Get API key from environment
const API_KEY = process.env.AIRTABLE_API_KEY;
if (!API_KEY) {
  console.error("AIRTABLE_API_KEY environment variable is required");
  process.exit(1);
}

// Helper for Airtable API requests
async function airtableRequest(path, options = {}) {
  const url = `${BASE_URL}${path}`;
  const response = await fetch(url, {
    ...options,
    headers: {
      Authorization: `Bearer ${API_KEY}`,
      "Content-Type": "application/json",
      ...options.headers,
    },
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({}));
    throw new Error(
      error.error?.message || `Airtable API error: ${response.status}`
    );
  }

  return response.json();
}

const server = new McpServer({
  name: "airtable",
  version: "1.0.0",
});

// Tool 1: List bases
server.registerTool(
  "list_bases",
  {
    description: "List all Airtable bases accessible to your account.",
    inputSchema: {
      placeholder: z.string().optional().describe("Not used"),
    },
  },
  async () => {
    const data = await airtableRequest("/meta/bases");
    return {
      content: [{ type: "text", text: JSON.stringify(data.bases, null, 2) }],
    };
  }
);

// Tool 2: List tables
server.registerTool(
  "list_tables",
  {
    description: "List all tables in an Airtable base.",
    inputSchema: {
      base_id: z.string().describe("The base ID (starts with 'app')"),
    },
  },
  async ({ base_id }) => {
    const data = await airtableRequest(`/meta/bases/${base_id}/tables`);
    return {
      content: [{ type: "text", text: JSON.stringify(data.tables, null, 2) }],
    };
  }
);

// Tool 3: List records
server.registerTool(
  "list_records",
  {
    description: "List records from an Airtable table.",
    inputSchema: {
      base_id: z.string().describe("The base ID (starts with 'app')"),
      table_name: z.string().describe("Table name"),
      max_records: z.number().optional().describe("Max records to return"),
    },
  },
  async ({ base_id, table_name, max_records }) => {
    const params = new URLSearchParams();
    if (max_records) params.set("maxRecords", max_records.toString());
    const query = params.toString() ? `?${params.toString()}` : "";
    const data = await airtableRequest(
      `/${base_id}/${encodeURIComponent(table_name)}${query}`
    );
    return {
      content: [{ type: "text", text: JSON.stringify(data.records, null, 2) }],
    };
  }
);

// Tool 4: Create record
server.registerTool(
  "create_record",
  {
    description: "Create a new record in an Airtable table.",
    inputSchema: {
      base_id: z.string().describe("The base ID (starts with 'app')"),
      table_name: z.string().describe("Table name"),
      fields_json: z.string().describe("Fields as JSON string, e.g. {\"Name\": \"Test\"}"),
    },
  },
  async ({ base_id, table_name, fields_json }) => {
    let fields;
    try {
      fields = JSON.parse(fields_json);
    } catch (e) {
      throw new Error(`Invalid JSON in fields_json: ${e.message}`);
    }
    const data = await airtableRequest(
      `/${base_id}/${encodeURIComponent(table_name)}`,
      {
        method: "POST",
        body: JSON.stringify({ records: [{ fields }] }),
      }
    );
    return {
      content: [{ type: "text", text: JSON.stringify(data.records[0], null, 2) }],
    };
  }
);

// Tool 5: Update record
server.registerTool(
  "update_record",
  {
    description: "Update an existing record in an Airtable table.",
    inputSchema: {
      base_id: z.string().describe("The base ID (starts with 'app')"),
      table_name: z.string().describe("Table name"),
      record_id: z.string().describe("The record ID (starts with 'rec')"),
      fields_json: z.string().describe("Fields to update as JSON string"),
    },
  },
  async ({ base_id, table_name, record_id, fields_json }) => {
    let fields;
    try {
      fields = JSON.parse(fields_json);
    } catch (e) {
      throw new Error(`Invalid JSON in fields_json: ${e.message}`);
    }
    const data = await airtableRequest(
      `/${base_id}/${encodeURIComponent(table_name)}/${record_id}`,
      {
        method: "PATCH",
        body: JSON.stringify({ fields }),
      }
    );
    return {
      content: [{ type: "text", text: JSON.stringify(data, null, 2) }],
    };
  }
);

// Start server
async function main() {
  const transport = new StdioServerTransport();
  await server.connect(transport);
}

main().catch((error) => {
  console.error("Server error:", error);
  process.exit(1);
});
