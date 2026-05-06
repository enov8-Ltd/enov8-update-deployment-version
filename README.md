# 📦 Enov8 – CMDB Update GitHub Action

Update Enov8 CMDB resources, environments, and microservices directly from your CI/CD pipelines using GitHub Actions.

---

# 🚀 Overview

This GitHub Action enables you to:

- 🔄 Update resource versions
- 🚦 Update environment or component status
- 🎯 Target specific Enov8 resources by name
- ⚡ Automate Enov8 updates as part of deployment pipelines
- 🧩 Update MicroServices linked to System Instances

---

# 🧩 Supported Resource Types

- `Environment Instance`
- `System Component`
- `System Interface`
- `MicroService`

---

# 📥 Inputs

| Name | Required | Description |
|------|------|------|
| `enov8_url` | ✅ | Base Enov8 URL (without `/api`) |
| `app_id` | ✅ | Enov8 App ID |
| `app_key` | ✅ | Enov8 App Key |
| `resourceType` | ✅ | Resource type |
| `resourceName` | ✅ | Exact Enov8 resource name |
| `version` | ❌ | Version value to update |
| `status` | ❌ | Status value to update |
| `systemInstance` | ❌ | Required only for `MicroService` updates |

---

# ⚙️ Setup Guide

## Step 1 — Add GitHub Secrets

Go to your repository:

**Settings → Secrets and variables → Actions**

Click **New repository secret** and add:

| Secret Name | Example Value |
|------|------|
| `ENOV8_BASE_URL` | `https://yourcompany.enov8.cloud/ecosystem` |
| `ENOV8_APP_ID` | `your_app_id` |
| `ENOV8_APP_KEY` | `your_app_key` |

---

# 🔐 Using GitHub Environment Secrets (Recommended)

If your repository uses GitHub Environments, specify the environment in your workflow:

```yaml
environment: dev
```

This ensures GitHub uses the correct environment-specific secrets.

---

# ⚠️ Important

Without specifying the environment, GitHub may use repository-level secrets instead of environment secrets.

---

# 📂 Step 2 — Create Workflow

Create a file:

```bash
.github/workflows/enov8.yml
```

---

# 🚀 Step 3 — Add Action to Workflow

## Example — Environment Instance Update

```yaml
name: Enov8 CMDB Update

on:
  workflow_dispatch:

jobs:
  update-cmdb:
    runs-on: ubuntu-latest

    environment: dev

    steps:
      - name: Enov8 - CMDB Update
        uses: hpashok24/enov8-cmdb-update@v2.0.8
        with:
          enov8_url: ${{ secrets.ENOV8_BASE_URL }}
          app_id: ${{ secrets.ENOV8_APP_ID }}
          app_key: ${{ secrets.ENOV8_APP_KEY }}

          resourceType: "Environment Instance"
          resourceName: "GDW (DEV)"

          version: "18.0.12"
          status: "UnplannedOutage"
```

---

# 🧩 Example — MicroService Update

```yaml
name: Enov8 MicroService Update

on:
  workflow_dispatch:

jobs:
  update-microservice:
    runs-on: ubuntu-latest

    environment: dev

    steps:
      - name: Enov8 - MicroService Update
        uses: hpashok24/enov8-cmdb-update@v2.2.0
        with:
          enov8_url: ${{ secrets.ENOV8_BASE_URL }}
          app_id: ${{ secrets.ENOV8_APP_ID }}
          app_key: ${{ secrets.ENOV8_APP_KEY }}

          resourceType: "MicroService"
          resourceName: "Web Portal"

          systemInstance: "GDW (DEV)"

          version: "4.1"
```

---

# ▶️ Step 4 — Run Workflow

1. Go to the **Actions** tab  
2. Select your workflow  
3. Click **Run workflow**

---

# 🔍 Example Output

```text
📡 PUT https://.../api/SystemInstance
📦 Payload ...
📨 Response ...
✅ Enov8 CMDB updated successfully
```

---

# ⚠️ Important Notes

## ✅ Correct URL Format

```text
https://<your-enov8-instance>/ecosystem
```

## ❌ Do NOT include

```text
/api
```

---

# ⚠️ Resource Name Must Match Exactly

```text
GDW (DEV)   ✅
gdw dev     ❌
```

---

# ⚠️ Status Values

Status values must already exist in your Enov8 configuration.

Examples:

```text
InOperation
PlannedOutage
UnplannedOutage
```

---

# 💡 Usage Examples

## Update only version

```yaml
version: "18.0.12"
```

---

## Update only status

```yaml
status: "UnplannedOutage"
```

---

## Update version and status

```yaml
version: "18.0.12"
status: "UnplannedOutage"
```

---

# 🐛 Troubleshooting

## ❌ No update applied

- Verify resource name spelling
- Check if values are already up-to-date
- Confirm correct GitHub environment secrets are being used

---

## ❌ Authentication failed

- Verify `ENOV8_APP_ID`
- Verify `ENOV8_APP_KEY`
- Verify `ENOV8_BASE_URL`

---

## ❌ Invalid resource type

Supported values:

- `Environment Instance`
- `System Component`
- `System Interface`
- `MicroService`

---

## ❌ MicroService update failed

Ensure `systemInstance` is provided:

```yaml
systemInstance: "GDW (DEV)"
```

---

# 🚀 Common Use Cases

- CI/CD deployment tracking
- Environment status automation
- Automated version management
- DevOps CMDB integration
- MicroService deployment tracking

---

# 📄 License

MIT License
