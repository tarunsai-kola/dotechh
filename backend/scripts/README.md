
# Data Cleanup and Duplicate Prevention

This directory contains scripts to detect, export, and clean duplicate data in the MongoDB database, as well as instructions for preventing future duplicates.

## Prerequisites

- Node.js installed
- MongoDB running
- Dependencies installed in `backend` (`npm install`)

## 1. Backup Database

Before running any cleanup scripts, **BACKUP YOUR DATABASE**.

```bash
# Run this in your terminal
mongodump --uri="mongodb://localhost:27017/doltec" --out="backup_$(date +%Y%m%d)"
```

## 2. Detect Duplicates

Run the detection script to identify duplicates across Users, Profiles, Jobs, and Applications.

```bash
node backend/scripts/detect_duplicates.js
```

This will create a `duplicates_found.json` file in the `backend/scripts` directory.

## 3. Export Duplicates

Export the detected duplicates to CSV files for review.

```bash
node backend/scripts/export_duplicates.js
```

This will create CSV files like `duplicates_users_by_email.csv`, etc.

## 4. Clean Duplicates

**WARNING: This will delete data.** Ensure you have a backup.

This script will:
1. Keep the oldest document in each duplicate group.
2. Move duplicates to archive collections (e.g., `users_duplicates_archive`).
3. Delete duplicates from the main collections.

```bash
node backend/scripts/clean_duplicates.js
```

## 5. Create Indexes

Create unique indexes to prevent future duplicates at the database level.

```bash
node backend/scripts/create_indexes.js
```

## 6. API Level Prevention

The backend code has been updated to prevent duplicates:
- **Jobs**: Checks for existing job with same `companyId`, `title` (case-insensitive), and `location`.
- **Profiles**: Checks for duplicate `resumeHash` (if provided).
- **Applications**: Checks if candidate has already applied to the job.
- **Users**: Email uniqueness is enforced by MongoDB index.

## Resume Hash Instruction

To prevent duplicate resume uploads:
1. When a user selects a file on the frontend, compute its SHA256 hash.
2. Send this hash as `resumeHash` in the body when creating/updating a profile.
3. The backend will check if this hash exists for another user.
