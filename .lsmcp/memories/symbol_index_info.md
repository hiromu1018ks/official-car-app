---
created: 2025-08-18T12:08:01.091Z
updated: 2025-08-18T12:08:01.091Z
---

# Symbol Index Information

This memory contains information about the symbol index used by lsmcp tools for code analysis and navigation.

## Index Status
- Index has been created and is functional
- Used for fast symbol searches across the codebase
- Supports incremental updates when files change

## Usage
- Primary tool for code analysis: `mcp__lsmcp__search_symbol_from_index`
- Project overview: `mcp__lsmcp__get_project_overview`
- Symbol definitions: `mcp__lsmcp__get_definitions`
- Find references: `mcp__lsmcp__find_references`

This memory should be preserved as it's used by the lsmcp system for efficient code navigation and analysis.