import { McpServer } from "@modelcontextprotocol/server";
import { StdioServerTransport } from "@modelcontextprotocol/server/stdio";
import { createTools } from "./tools/create.js";
import { deleteTools } from "./tools/delete.js";
import { getTools } from "./tools/get.js";

// npx @modelcontextprotocol/inspector node server.js -> command to run the server inspector.

const server = new McpServer({
  name: "logbook",
  version: "1.0.0",
});

const tools = [...createTools, ...getTools, ...deleteTools];

function registerAllTools(server) {
  for (const { name, config, handler } of tools) {
    server.registerTool(name, config, handler);
  }
}

registerAllTools(server);

async function main() {
  const transport = new StdioServerTransport();
  await server.connect(transport);
  console.error("Logbook MCP Server running on stdio");
}

main().catch((error) => {
  console.error("Fatal error in main():", error);
  process.exit(1);
});
