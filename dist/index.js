const https = require('https');
const { URL } = require('url');
const fs = require('fs');

function getInput(name, required = false) {
  const v = process.env[`INPUT_${name.toUpperCase()}`] || '';

  if (required && !v.trim()) {
    throw new Error(`Missing input: ${name}`);
  }

  return v.trim();
}

function request(urlStr, payload, headers) {
  return new Promise((resolve, reject) => {
    const url = new URL(urlStr);

    const options = {
      method: 'PUT',
      hostname: url.hostname,
      path: url.pathname,
      headers
    };

    const req = https.request(options, (res) => {
      let data = '';

      res.on('data', (d) => data += d);

      res.on('end', () => {
        let parsed;

        try {
          parsed = JSON.parse(data);
        } catch {}

        resolve({
          status: res.statusCode,
          body: data,
          parsed
        });
      });
    });

    req.on('error', reject);

    // ✅ Send raw payload string
    req.write(payload, 'utf8');
    req.end();
  });
}

async function run() {
  try {

    const baseUrl = getInput('enov8_url', true).replace(/\/+$/, '');
    const resourceName = getInput('resourceName', true);
    const resourceType = getInput('resourceType', true);

    const version = getInput('version');
    const status = getInput('status');

    const appId = getInput('app_id', true);
    const appKey = getInput('app_key', true);

    // ✅ Required only for MicroService
    const systemInstance = getInput('systemInstance');

    // ✅ Endpoint mappings
    const endpointMap = {
      'Environment Instance': 'SystemInstance',
      'System Component': 'SystemComponent',
      'System Interface': 'SystemInterface',
      'MicroService': 'MicroService'
    };

    const apiPath = endpointMap[resourceType];

    if (!apiPath) {
      throw new Error(`Invalid resourceType: ${resourceType}`);
    }

    // ✅ Validation for MicroService
    if (resourceType === 'MicroService' && !systemInstance) {
      throw new Error('systemInstance is required when resourceType is MicroService');
    }

    const url = `${baseUrl}/api/${apiPath}`;

    // ✅ Dynamic payload handling
    const payloadObj = {};

    if (resourceType === 'MicroService') {

      payloadObj["MicroService Name"] = resourceName;
      payloadObj["SystemInstance"] = systemInstance;

    } else {

      payloadObj["Resource Name"] = resourceName;

    }

    // ✅ Optional fields
    if (status) {
      payloadObj["Status"] = status;
    }

    if (version) {
      payloadObj["Version"] = version;
    }

    const payload = JSON.stringify(payloadObj);

    console.log(`📡 PUT ${url}`);
    console.log(`📦 Payload:\n${payload}`);

    const headers = {
      'Content-Type': 'text/plain',
      'Content-Length': Buffer.byteLength(payload),
      'user-id': appId,
      'app-id': appId,
      'app-key': appKey
    };

    const res = await request(url, payload, headers);

    console.log(`📨 Response:\n${res.body}`);

    // ✅ Smart response handling
    if (res.parsed && res.parsed.total_updated > 0) {

      console.log('✅ Enov8 CMDB updated successfully');

    } else if (res.parsed && res.parsed.success === true) {

      console.log('⚠️ No update applied (already up-to-date or invalid field)');

    } else {

      throw new Error(`❌ API Error: ${res.body}`);

    }

    // ✅ GitHub Action output
    fs.appendFileSync(
      process.env.GITHUB_OUTPUT,
      `result=${JSON.stringify(res.parsed || res.body)}\n`
    );

  } catch (err) {

    console.error(err.message);
    process.exit(1);

  }
}

run();
