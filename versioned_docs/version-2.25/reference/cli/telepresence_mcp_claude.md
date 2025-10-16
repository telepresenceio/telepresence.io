---
title: telepresence mcp claude
description: Configure Claude Desktop MCP servers
hide_table_of_contents: true
---

Configure Claude Desktop MCP servers

## Synopsis:

Configure MCP servers for Claude Desktop

### Usage:
```
  telepresence mcp claude [command] [flags]
```

### Available Commands:
| Command | Description |
|---------|-------------|
| [disable](telepresence_mcp_claude_disable) | Remove server from Claude config |
| [enable](telepresence_mcp_claude_enable) | Add server to Claude config |
| [list](telepresence_mcp_claude_list) | Show Claude MCP servers |

### Flags:
```
  -h, --help   help for claude
```

### Global Flags:
```
      --output string     Set the output format, supported values are 'json', 'yaml', and 'default' (default "default")
      --progress string   Set type of progress output (auto, tty, plain, json, quiet) (default "auto")
      --use string        Match expression that uniquely identifies the daemon container
```

Use `telepresence mcp claude [command] --help` for more information about a command.
