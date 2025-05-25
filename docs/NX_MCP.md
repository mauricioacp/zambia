# Nx MCP (Model Context Protocol) Documentation

## 🎯 Overview

Nx MCP is a Model Context Protocol server that provides AI assistants with deep access to your Nx monorepo structure. It enables LLMs to understand project relationships, file mappings, runnable tasks, ownership info, tech stacks, and Nx generators - moving beyond file-level understanding to architectural awareness.

## 🚀 Key Benefits

### **Architectural Awareness**

- Understands project relationships and dependencies
- Provides context about tech stacks and ownership
- Enables impact analysis across the monorepo
- Generates code tailored to your specific stack

### **Enhanced Capabilities**

- **Impact Analysis**: "If I change the public API of feat-product-detail, which projects might be affected?"
- **Smart Code Generation**: Generate code that follows your workspace patterns
- **Documentation Integration**: Access relevant Nx documentation contextually
- **Generator Awareness**: Understand available code generators and their schemas

## 🛠️ Available Tools

The Nx MCP server provides these essential tools:

| Tool                   | Description                                                    |
| ---------------------- | -------------------------------------------------------------- |
| `nx_workspace`         | Annotated representation of Nx configuration and project graph |
| `nx_project_details`   | Comprehensive configuration for any specific Nx project        |
| `nx_docs`              | Relevant documentation sections based on queries               |
| `nx_generators`        | List of all available code generators in workspace             |
| `nx_generator_schema`  | Detailed schema information for specific generators            |
| `nx_visualize_graph`   | Opens interactive project/task graph visualizations            |
| `nx_available_plugins` | Nx plugins available from npm registry                         |

## 📦 Installation & Setup

### Method 1: Package Manager (Recommended)

```bash
# Via npx (most flexible)
npx nx-mcp@latest /path/to/workspace

# For VS Code with Copilot
code --add-mcp '{"name":"nx-mcp","command":"npx","args":["nx-mcp", "/path/to/workspace"]}'
```

### Method 2: Nx Console Extension

For Cursor IDE users, the Nx Console extension automatically manages the MCP server.

### Method 3: Server Mode

```bash
# Run as server with custom port
npx nx-mcp@latest --sse --port 3001 /path/to/workspace
```

## 🔧 Configuration Options

| Option   | Description                    |
| -------- | ------------------------------ |
| `--sse`  | Enable Server-Sent Events mode |
| `--port` | Specify custom server port     |
| `--help` | Show help information          |

## 🎮 Supported AI Clients

- **VS Code with GitHub Copilot** (official MCP support)
- **Cursor IDE** (via Nx Console extension)
- **Claude Code** (this environment!)
- **Any MCP-compatible AI assistant**

## 💡 Usage Examples

### Basic Project Analysis

```
// Ask your AI assistant:
"What's the structure of my Nx workspace?"
"Show me the dependencies for the feat-dashboard project"
"Which projects use Angular signals?"
```

### Impact Analysis

```
"If I modify the AuthService, which projects will be affected?"
"What would happen if I change the API in shared/data-access-auth?"
```

### Code Generation

```
"Generate a new feature module for user management following our workspace patterns"
"Create a smart component for the countries feature"
"Add a new service to the shared data-access layer"
```

### Generator Discovery

```
"What generators are available in this workspace?"
"Show me the schema for the Angular component generator"
"How do I generate a new library with the correct tags?"
```

## 🔍 Technical Details

### **Protocol Foundation**

- Built on official Model Context Protocol TypeScript SDK
- Communicates via Server-Sent Events (SSE)
- Runs on random localhost port to avoid conflicts

### **Performance Benefits**

- **Efficient Data Access**: Direct access to pre-computed workspace metadata
- **Reduced File Scanning**: No need to analyze numerous files to infer relationships
- **Cached Information**: Workspace graph and project data are cached for performance

### **Security**

- Local-only server (localhost)
- No external network access required
- Single concurrent connection support

## 🛡️ Best Practices

1. **Keep Workspace Clean**: Ensure your `nx.json` and project configurations are up-to-date
2. **Use Descriptive Tags**: Tag your projects appropriately for better AI understanding
3. **Maintain Documentation**: Keep your project READMEs current for better context
4. **Regular Updates**: Keep the MCP server updated: `npx nx-mcp@latest`

## 🐛 Troubleshooting

### Common Issues

**MCP Server Not Starting**

```bash
# Check if port is available
netstat -an | grep :3001

# Try different port
npx nx-mcp@latest --port 3002 /path/to/workspace
```

**AI Assistant Not Recognizing Workspace**

- Ensure you're in the correct workspace directory
- Verify `nx.json` exists and is valid
- Restart the MCP server

**Performance Issues**

```bash
# Clear Nx cache
npx nx reset

# Rebuild dependency graph
npx nx graph --watch
```

## 🔗 Related Resources

- [Model Context Protocol Official Docs](https://modelcontextprotocol.io/)
- [Nx Console Extension](https://marketplace.visualstudio.com/items?itemName=nrwl.angular-console)
- [MCP Inspector Tool](https://modelcontextprotocol.io/docs/tools/inspector)
- [Nx Official Blog on MCP](https://nx.dev/blog/nx-made-cursor-smarter)

## 📝 Development

For contributors:

```bash
# Build the MCP server
nx run nx-mcp:build

# Test with MCP Inspector
npm install -g @modelcontextprotocol/inspector
mcp-inspector npx nx-mcp@latest /path/to/workspace
```

---

**Note**: This documentation is for Nx MCP integration. The server provides deep workspace context to AI assistants, enabling more intelligent code generation and analysis in Nx monorepos.
