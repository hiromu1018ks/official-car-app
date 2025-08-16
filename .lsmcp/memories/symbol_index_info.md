---
created: 2025-08-16T11:09:44.034Z
updated: 2025-08-16T11:09:44.034Z
---

# LSMCP Symbol Index Configuration

## Project Overview
- **Project Type**: Next.js 15 TypeScript application with App Router
- **Language**: TypeScript/TSX
- **Main Source Directory**: `src/`
- **Key Files**: React components in `src/app/`, utilities in `src/lib/`

## Indexing Configuration
- **Successful Pattern**: `**/*.tsx` for React components, `**/*.ts` for TypeScript files
- **Note**: The brace syntax `**/*.{ts,tsx}` doesn't work - need separate patterns
- **Total Files Indexed**: 2 (layout.tsx, page.tsx)
- **Total Symbols**: 2 (RootLayout, Home functions)

## Working Search Examples
- Search by name: `Home`, `RootLayout`
- Search by kind: `Function` finds both React components
- All searches work correctly

## File Structure Indexed
- `src/app/layout.tsx` - RootLayout function (React component)
- `src/app/page.tsx` - Home function (React component)

## Next Steps for Full Indexing
To index additional files:
1. TypeScript utilities: `src/lib/*.ts`
2. Configuration files: `next.config.ts`
3. Future components in `src/app/**/*.tsx`

## LSP Support
- TypeScript LSP server is working correctly
- Symbol detection working for React functional components
- Incremental updates working (detects git changes)

## Issues Encountered
- Glob pattern `**/*.{ts,tsx}` returns "No files found"
- Solution: Use separate patterns `**/*.ts` and `**/*.tsx`
- Average indexing time: ~250ms per file (good performance)