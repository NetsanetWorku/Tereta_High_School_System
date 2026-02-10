# Fix PlusIcon Error

## The Problem
You're seeing: `ReferenceError: PlusIcon is not defined`

## The Cause
This is a Next.js Turbopack cache issue. The import is correct in the code, but the build cache is stale.

## The Solution

### Option 1: Clear Next.js Cache (Recommended)
```bash
cd hsms-frontend
rm -rf .next
npm run dev
```

### Option 2: Force Rebuild
```bash
cd hsms-frontend
npm run build
npm run dev
```

### Option 3: Restart Dev Server
1. Stop the dev server (Ctrl+C)
2. Start it again: `npm run dev`

## Verification
After clearing the cache, visit the teacher messages page. The error should be gone and the "New Conversation" button should appear with the plus icon.

---

**Note**: This is a common Next.js issue when files are updated while the dev server is running. The import statement is correct - it's just a cache problem.
