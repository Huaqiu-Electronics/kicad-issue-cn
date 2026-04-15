commit 9deab6d3e2a2be37a9d96fe1807995a5c70b92cc
Author: Ethan Chien <liangtie.qian@gmail.com>
Date:   Wed Apr 15 11:36:25 2026 +0800

    feat: add database configuration and Prisma ORM setup
    
    - Add DATABASE_URL to .env.example for PostgreSQL connection
    - Integrate Prisma ORM with new database schema
    - Replace SQLite dependencies with PostgreSQL client
    - Add Prisma-related scripts for migration and deployment
    - Update dependencies to include @prisma/client and pg

diff --git a/.env.example b/.env.example
index 34d5e2c..d10ec6d 100644
--- a/.env.example
+++ b/.env.example
@@ -2,3 +2,4 @@
 GITLAB_TOKEN=glpat-xxx
 GITLAB_PROJECT_ID=52152403
 GITLAB_BASE_URL=https://gitlab.com/api/v4
+DATABASE_URL="postgresql://postgres:postgres@localhost:5432/kicad"
diff --git a/package.json b/package.json
index 4457b82..1130a24 100644
--- a/package.json
+++ b/package.json
@@ -6,25 +6,29 @@
     "dev": "next dev",
     "build": "next build",
     "start": "next start",
-    "lint": "eslint"
+    "lint": "eslint",
+    "prisma:generate": "prisma generate",
+    "prisma:migrate": "prisma migrate dev",
+    "prisma:deploy": "prisma migrate deploy",
+    "prisma:studio": "prisma studio"
   },
   "dependencies": {
+    "@prisma/client": "^7.7.0",
     "lucide-react": "^1.8.0",
     "next": "16.2.3",
+    "pg": "^8.11.5",
     "react": "19.2.4",
     "react-dom": "19.2.4",
-
-    "sqlite3": "5.1.6",
-    "sqlite": "^5.1.1"
+    "zod": "^4.3.6"
   },
   "devDependencies": {
     "@tailwindcss/postcss": "^4",
     "@types/node": "^20",
     "@types/react": "^19",
     "@types/react-dom": "^19",
-    "@types/sqlite3": "^5.1.0",
     "eslint": "^9",
     "eslint-config-next": "16.2.3",
+    "prisma": "^7.7.0",
     "tailwindcss": "^4",
     "typescript": "^5"
   }