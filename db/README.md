# Quantalyze Database Setup

This folder contains the MySQL database schema and seed data for the Quantalyze Digital Agency application.

## Files

| File | Description |
|------|-------------|
| `schema.sql` | Database table definitions only |
| `seed.sql` | Initial sample data |
| `init.sql` | Combined schema + seed (run this for fresh setup) |

## Railway MySQL Setup

### Option 1: Via Railway Console (Recommended)

1. Go to your Railway project dashboard
2. Click on the **MySQL** service
3. Go to the **Database** tab
4. Click **Connect** or use the **Query** tab
5. Copy and paste the contents of `init.sql`
6. Execute the query

### Option 2: Via MySQL CLI

```bash
# Using the public URL (from local machine)
mysql -h hopper.proxy.rlwy.net -P 19005 -u root -p railway < db/init.sql

# Enter password when prompted: MByStMgRlxYtwoPVPehAhigVyQyOTMyQ
```

### Option 3: Via Node.js Script

```bash
npm run db:init
```

## Tables Overview

| Table | Purpose |
|-------|---------|
| `newsletter_subscribers` | Email newsletter subscriptions |
| `contact_submissions` | Contact form entries |
| `analytics_events` | Page views and user events |
| `services` | Service offerings |
| `admin_users` | Admin panel users |
| `content` | Dynamic content blocks |
| `team_members` | Team member profiles |
| `updates` | Announcements and updates |

## Environment Variables

Make sure these are set in Railway:

```
MYSQL_URL=mysql://root:PASSWORD@mysql.railway.internal:3306/railway
```

For local development, use the public URL:

```
MYSQL_PUBLIC_URL=mysql://root:PASSWORD@hopper.proxy.rlwy.net:19005/railway
```
