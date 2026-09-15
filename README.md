# 📦 Enov8 - Deployment Version Update GitHub Action

## 🚀 Overview

This action updates the deployed version for an Environment Instance, System Component, System Interface, or MicroService in Enov8 directly from GitHub Actions. If the target resource does not yet exist, the action can create it, resolving any related System, Environment, or System Instance records by name.

## ✨ Key Features

- Updates deployed version information for Environment Instances, System Components, System Interfaces, and MicroServices
- Creates a resource automatically when it does not already exist, resolving referenced records by name instead of requiring internal Enov8 IDs
- Cascades creation through dependent records where needed — a MicroService can create its System Instance, which can create its System
- Supports four resource types: Environment Instance, System Component, System Interface, and MicroService

## 🧩 Supported Resource Types

- `Environment Instance`
- `System Component`
- `System Interface`
- `MicroService`

## 📥 Required Inputs

| Name | Required | Description |
|---|---|---|
| `enov8_url` | ✅ | Base Enov8 URL, excluding `/api` |
| `app_id` | ✅ | Enov8 App ID credential |
| `app_key` | ✅ | Enov8 App Key credential |
| `resourceType` | ✅ | One of the resource types listed above |
| `resourceName` | ✅ | Exact resource name, matching Enov8 exactly |
| `version` | ✅ | The version value to set |

## 📥 Optional Inputs

| Name | Required | Description |
|---|---|---|
| `systemInstance` | Only for `MicroService` | Name of the parent System Instance |
| `autocreate` | ❌ (default `false`) | When `true`, creates `resourceName` if it does not already exist, using `metadata`. A not-found resource always fails the run unless this is set. |
| `metadata` | Only when `autocreate` is used and the resource is missing | JSON object describing how to create the resource — see [Configuring metadata](#-configuring-metadata) |

## ⚙️ Setup Guide

### Step 1 — Add GitHub Secrets

Go to your repository:

**Settings → Secrets and variables → Actions**

Click **New repository secret** and add:

| Secret Name | Example Value |
|---|---|
| `ENOV8_BASE_URL` | `https://yourcompany.enov8.cloud/ecosystem` |
| `ENOV8_APP_ID` | `your_app_id` |
| `ENOV8_APP_KEY` | `your_app_key` |

## 🔐 Using GitHub Environment Secrets (Recommended)

If your repository uses GitHub Environments, specify the environment in your workflow:

```yaml
environment: dev
```

This ensures GitHub uses the correct environment-specific secrets.

> ⚠️ **Important:** Without specifying the environment, GitHub may use repository-level secrets instead of environment secrets.

### Step 2 — Create Workflow

Create a file:

```bash
.github/workflows/enov8.yml
```

### Step 3 — Add Action to Workflow

There is no tagged release yet, so workflows should reference `@main`.

## 💡 Usage Examples

### 🔄 Update an existing resource

```yaml
name: Enov8 CMDB Update

on:
  workflow_dispatch:

jobs:
  update-cmdb:
    runs-on: ubuntu-latest
    environment: dev

    steps:
      - name: Enov8 - Deployment Version Update
        uses: enov8-Ltd/enov8-update-deployment-version@main
        with:
          enov8_url: ${{ secrets.ENOV8_BASE_URL }}
          app_id: ${{ secrets.ENOV8_APP_ID }}
          app_key: ${{ secrets.ENOV8_APP_KEY }}
          resourceType: "Environment Instance"
          resourceName: "GDW (DEV)"
          version: "18.0.12"
```

### 🔄 Update an existing MicroService

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
        uses: enov8-Ltd/enov8-update-deployment-version@main
        with:
          enov8_url: ${{ secrets.ENOV8_BASE_URL }}
          app_id: ${{ secrets.ENOV8_APP_ID }}
          app_key: ${{ secrets.ENOV8_APP_KEY }}
          resourceType: "MicroService"
          resourceName: "Web Portal"
          systemInstance: "GDW (DEV)"
          version: "4.1"
```

### 🆕 Create the resource if it does not exist

```yaml
      - name: Enov8 - Deployment Version Update
        uses: enov8-Ltd/enov8-update-deployment-version@main
        with:
          enov8_url: ${{ secrets.ENOV8_BASE_URL }}
          app_id: ${{ secrets.ENOV8_APP_ID }}
          app_key: ${{ secrets.ENOV8_APP_KEY }}
          resourceType: "Environment Instance"
          resourceName: "GDW (DEV)"
          version: "18.0.12"
          autocreate: true
          metadata: |
            {
              "System": "GDW",
              "Environment": "DEV Env"
            }
```

### 🆕 Create the resource and its System, if the System also does not exist

```yaml
      - name: Enov8 - Deployment Version Update
        uses: enov8-Ltd/enov8-update-deployment-version@main
        with:
          enov8_url: ${{ secrets.ENOV8_BASE_URL }}
          app_id: ${{ secrets.ENOV8_APP_ID }}
          app_key: ${{ secrets.ENOV8_APP_KEY }}
          resourceType: "Environment Instance"
          resourceName: "NewSystem (DEV)"
          version: "1.0.0"
          autocreate: true
          metadata: |
            {
              "System": "NewSystem",
              "Environment": "DEV Env",
              "Business Unit": "IT",
              "Type": "Cloud",
              "Core": "True"
            }
```

`Business Unit`, `Type`, and `Core` are only used if `System` needs to be created, and are ignored otherwise.

### 🧩 MicroService, cascading through System Instance and System

```yaml
      - name: Enov8 - Deployment Version Update
        uses: enov8-Ltd/enov8-update-deployment-version@main
        with:
          enov8_url: ${{ secrets.ENOV8_BASE_URL }}
          app_id: ${{ secrets.ENOV8_APP_ID }}
          app_key: ${{ secrets.ENOV8_APP_KEY }}
          resourceType: "MicroService"
          resourceName: "Web Portal"
          systemInstance: "GDW (DEV)"
          version: "4.1"
          autocreate: true
          metadata: |
            {
              "System": "GDW",
              "Environment": "DEV Env",
              "Business Unit": "IT",
              "Type": "Cloud",
              "Core": "True"
            }
```

If `systemInstance` already exists, `metadata` can be `{}` — nothing below the MicroService needs creating.

### 🆕 System Component

```yaml
      - name: Enov8 - Deployment Version Update
        uses: enov8-Ltd/enov8-update-deployment-version@main
        with:
          enov8_url: ${{ secrets.ENOV8_BASE_URL }}
          app_id: ${{ secrets.ENOV8_APP_ID }}
          app_key: ${{ secrets.ENOV8_APP_KEY }}
          resourceType: "System Component"
          resourceName: "AppServer_PROD_NewApp"
          version: "1.0"
          autocreate: true
          metadata: |
            {
              "Type": "Server",
              "Monitored": "True"
            }
```

System Component has no System or Environment dependency. Unlike other resource types, `Type` has no default here and must be supplied.

### Step 4 — Run Workflow

1. Go to the **Actions** tab
2. Select your workflow
3. Click **Run workflow**

## 🔍 Example Output

```text
📡 PUT https://.../api/SystemInstance
📦 Payload ...
📨 Response ...
✅ Enov8 CMDB updated successfully
```

## ⚠️ Important Notes

**✅ Correct URL format**

```text
https://<your-enov8-instance>/ecosystem
```

**❌ Do NOT include**

```text
/api
```

## ⚠️ Resource Name Must Match Exactly

```text
GDW (DEV)   ✅
gdw dev     ❌
```

## 🔧 Configuring `metadata`

`metadata` is only read when `autocreate` is `true` and `resourceName` does not already exist. Its shape depends on `resourceType`.

### `Environment Instance`, `System Interface`, `MicroService`

| Key | Default | Notes |
|---|---|---|
| `Status` | `InOperation` | Applied to every record created in one run. |
| `Environment` | — (required if needed) | Resolved by name. Not created automatically — the named Environment must already exist. |
| `System` | — (omit if not needed) | Resolved by name. Created automatically if it does not exist. |
| `Business Unit` | `Other` | Used only if `System` is being created. |
| `Type` | `Other` | The System's Type. Used only if `System` is being created. Must match a value already configured in the tenant's System Type picklist. |
| `Core` | `False` | Used only if `System` is being created. |

For `MicroService`, the same rules apply one level down: `systemInstance` is resolved first, and if it does not exist, it is created using `Environment`/`System`/`Business Unit`/`Type`/`Core` from `metadata`.

`Assigned To` and `Organisation` are always resolved automatically and should not be included in `metadata`.

### `System Component`

| Key | Default | Notes |
|---|---|---|
| `Status` | `InOperation` | |
| `Type` | Required, no default | A tenant-specific Component Type picklist, separate from System's Type. Check existing components for valid values (for example `Server`, `Database`, `Module`, `Integration`). |
| `Monitored` | `False` | |

## 🐛 Troubleshooting

**❌ No update applied**

- Verify resource name spelling
- Check if the version is already up-to-date
- Confirm correct GitHub environment secrets are being used

**❌ Create failed / could not resolve a name in `metadata`**

- Verify `autocreate` is set to `true` — without it, a not-found resource is always an error
- Verify the `System` or `Environment` name in `metadata` matches exactly (these are looked up by name against Enov8)
- If `System` also needs creating and you overrode `Business Unit`, verify it matches an existing Business Unit name
- Do not include `Assigned To` or `Organisation` in `metadata` — both are resolved automatically

**❌ System Component create failed — "metadata.Type is required"**

- `System Component` has no default `Type` — you must supply one in `metadata` (e.g. `{"Type": "Server"}`)
- The value must match an existing Component Type in your tenant — this is a different picklist from System's `Type`

**❌ Authentication failed**

- Verify `ENOV8_APP_ID`
- Verify `ENOV8_APP_KEY`
- Verify `ENOV8_BASE_URL`

**❌ Invalid resource type**

Supported values:

- `Environment Instance`
- `System Component`
- `System Interface`
- `MicroService`

**❌ MicroService update failed**

Ensure `systemInstance` is provided:

```yaml
systemInstance: "GDW (DEV)"
```

## 🚀 Common Use Cases

- CI/CD deployment tracking
- Automated version management
- DevOps CMDB integration
- MicroService deployment tracking
- Auto-provisioning environment instances on first deploy

## 🆘 Support

For assistance, contact support@enov8.com.

## 📄 License

[MIT](LICENSE)
