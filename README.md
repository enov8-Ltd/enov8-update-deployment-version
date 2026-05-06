# 📦 Enov8 – Deployment Version Update GitHub Action

Update the deployed version for an Environment Instance or Microservice in Enov8 directly using GitHub Actions.

---

## 🚀 Overview

This GitHub Action automatically updates deployed version information in Enov8 after a successful deployment.

Use this action to:

- 🔄 Update the deployed version for an Environment Instance
- 🧩 Update the deployed version for a Microservice linked to a System Instance

---

## 🧩 Supported Resource Types

- `Environment Instance`
- `MicroService`

---

## 📥 Inputs

| Name | Required | Description |
|------|----------|-------------|
| `enov8_url` | ✅ | Base Enov8 URL, without `/api` |
| `app_id` | ✅ | Enov8 App ID |
| `app_key` | ✅ | Enov8 App Key |
| `resourceType` | ✅ | Resource type to update. Supported values: `Environment Instance` or `MicroService` |
| `resourceName` | ✅ | Exact Enov8 resource name |
| `version` | ✅ | Deployed version value to update |
| `systemInstance` | ❌ | Required only when updating a `MicroService` |

---

## ⚙️ Setup Guide

### Step 1 — Add GitHub Secrets

Go to your repository:

**Settings → Secrets and variables → Actions**

Click **New environment secret** and add:

| Secret Name | Example Value |
|------------|---------------|
| `ENOV8_BASE_URL` | `https://yourcompany.enov8.cloud/ecosystem` |
| `ENOV8_APP_ID` | `your_app_id` |
| `ENOV8_APP_KEY` | `your_app_key` |

---

## 🔐 Using GitHub Environment Secrets

If your repository uses GitHub Environments, specify the environment in your workflow:

```yaml
environment: dev
```

This ensures GitHub uses the correct environment-specific secrets.

> **Important:** Without specifying the environment, GitHub may use repository-level secrets instead of environment-specific secrets.

---

## 🚀 Step 2 — Add Action to Workflow

### Example — Update Environment Instance Version

```yaml
name: Enov8 Deployment Version Update

on:
  workflow_dispatch:

jobs:
  update-version:
    runs-on: ubuntu-latest

    environment: dev

    steps:
      - name: Enov8 - Update Environment Instance Version
        uses: enov8-Ltd/enov8-update-deployment-version@v1.0.0
        with:
          enov8_url: ${{ secrets.ENOV8_BASE_URL }}
          app_id: ${{ secrets.ENOV8_APP_ID }}
          app_key: ${{ secrets.ENOV8_APP_KEY }}
          resourceType: "Environment Instance"
          resourceName: "GDW (DEV)"
          version: "18.0.12"
```

---

### Example — Update Microservice Version

```yaml
name: Enov8 Microservice Version Update

on:
  workflow_dispatch:

jobs:
  update-microservice-version:
    runs-on: ubuntu-latest

    environment: dev

    steps:
      - name: Enov8 - Update Microservice Version
        uses: enov8-Ltd/enov8-update-deployment-version@v1.0.0
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

## ▶️ Step 3 — Run Workflow

1. Go to the **Actions** tab
2. Select your workflow
3. Click **Run workflow**

---

## 🔍 Example Output

```text
📡 Updating Enov8 resource version
📦 Resource Type: Environment Instance
📦 Resource Name: GDW (DEV)
🏷️ Version: 18.0.12
✅ Enov8 deployed version updated successfully
```

---

## ⚠️ Important Notes

### ✅ Correct URL Format

Use the base Enov8 application URL:

```text
https://<your-enov8-instance>/ecosystem
```

### ❌ Do Not Include

```text
/api
```

---

### ⚠️ Resource Name Must Match Exactly

The resource name must match the Enov8 record name exactly.

```text
GDW (DEV)   ✅
gdw dev     ❌
```

---

### ⚠️ Microservice Updates

When updating a Microservice version, `systemInstance` must be provided so the action can identify the correct Microservice linked to the correct Environment Instance.

```yaml
resourceType: "MicroService"
resourceName: "Web Portal"
systemInstance: "GDW (DEV)"
version: "4.1"
```

---


## 🐛 Troubleshooting

### ❌ No update applied

- Verify the resource name spelling
- Confirm the version value is provided
- Check whether the version is already up to date
- Confirm the correct GitHub environment secrets are being used

---

### ❌ Authentication failed

- Verify `ENOV8_APP_ID`
- Verify `ENOV8_APP_KEY`
- Verify `ENOV8_BASE_URL`

---

### ❌ Invalid resource type

Supported values:

```text
Environment Instance
MicroService
```

---

### ❌ Microservice update failed

Ensure `systemInstance` is provided:

```yaml
systemInstance: "GDW (DEV)"
```

---

## 📩 Support

If you experience any issues or need assistance, please contact:

```text
support@enov8.com
