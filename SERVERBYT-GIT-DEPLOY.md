# ServerByt Static Deployment via Git + SSH

This guide links ServerByt hosting (ServerByt/20i StackCP) with the GitHub
repository `git@github.com:techstudio-cpu/quantalyze.co.in.git` so that the
static build (`static-deploy/`) can be pulled directly via SSH.

> **Important**: Never store private keys inside the repo. Upload the public
> key (`ssh-ed25519 AAAAC3...`) into StackCP and keep the private key only on
> your workstation/CI machine.

---

## 1. Configure SSH Access in StackCP

1. Log in to StackCP.
2. Open the package that hosts `quantalyze.co.in`.
3. Go to **Security → SSH Access** (or “SSH Keys”).
4. Add a new key:
   - **Name**: `Git Deployment` (any label)
   - **Type**: `ssh-ed25519`
   - **Public Key**: `ssh-ed25519 AAAAC3NzaC1lZDI1NTE5AAAAIOvnt7V9N2ijyDMKAQ0bU28n8XvHUWyN+404hIFwr9CY tech.studio.st@gmail.com`
5. Save. StackCP now accepts SSH connections for `techstudio.co.in@ssh.gb.stackcp.com`.

## 2. Prepare Git on ServerByt

```bash
# SSH into ServerByt
ssh techstudio.co.in@ssh.gb.stackcp.com

# Create a folder to hold the repo (outside public_html)
mkdir -p ~/repos
cd ~/repos

# Clone via SSH (first time)
git clone git@github.com:techstudio-cpu/quantalyze.co.in.git quantalyze-site
cd quantalyze-site
```

If asked to trust GitHub’s host key, type `yes` once.

## 3. Build Static Files Locally (recommended)

To keep builds consistent, run the static build **locally**, commit, and push:

```bash
# On your development machine
npm run build:static
# Commit the generated static-deploy folder
# (either on main or a dedicated branch like static-build)
git add static-deploy
git commit -m "Update static build"
git push
```

This way the ServerByt server only needs to copy files from `static-deploy/` and
does not have to run Node/Next.js builds.

## 4. Deploy on ServerByt

```bash
# On ServerByt (after git pull)
cd ~/repos/quantalyze-site

git fetch origin
# Choose the branch that contains up-to-date static-deploy/ (e.g. main)
git checkout main
# Optionally pull latest
git pull origin main

# Clear old public_html files (make a backup first!)
rm -rf ~/public_html/*

# Copy static build
cp -a static-deploy/. ~/public_html/

# Verify .htaccess is present
ls ~/public_html/.htaccess
```

## 5. Automate with a Deploy Script (optional)

Create `~/deploy-static.sh` on ServerByt:

```bash
#!/bin/bash
set -e
cd ~/repos/quantalyze-site

git fetch origin
branch=${1:-main}
git checkout "$branch"
git pull origin "$branch"

rm -rf ~/public_html/*
cp -a static-deploy/. ~/public_html/

echo "Deployment complete: $(date)"
```

```bash
chmod +x ~/deploy-static.sh
```

Deploy with:

```bash
./deploy-static.sh main
```

## 6. (Alternative) Build on ServerByt

If you prefer to build on the server:

```bash
ssh techstudio.co.in@ssh.gb.stackcp.com
cd ~/repos/quantalyze-site

git pull origin main
npm install
RAILWAY_API_URL=https://quantalyze.up.railway.app npm run build:static
rm -rf ~/public_html/*
cp -a static-deploy/. ~/public_html/
```

> **Note**: This requires Node 20+ on the server and may take longer. The local
> build approach is usually faster and safer.

## 7. Summary Workflow

1. Develop features locally.
2. Run `npm run build:static`.
3. Commit & push the updated `static-deploy/` directory.
4. SSH to ServerByt and run `./deploy-static.sh` (or the manual steps).
5. Static site updated on https://quantalyze.co.in
6. Admin/API continue to run on Railway at https://quantalyze.up.railway.app

---

Happy deploying! Keep your private key secure and rotate it if compromised.
