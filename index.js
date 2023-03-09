const https = require('https');
const fs = require('fs');
const { exec } = require('child_process');

const v2rayUrl = 'https://github.com/v2fly/v2ray-core/releases/latest/download/v2ray-linux-64.zip';
const v2rayFile = './v2ray-linux-64.zip';
const v2rayConfig = {
  "inbounds": [
      {
        "protocol": "vmess",
        "listen": "0.0.0.0",
        "port": 8080,
        "settings": {
          "clients": [
            {
              "id": "b831381d-6324-4d53-ad4f-8cda48b30811",
              "alterId": 64
            }
          ]
        },
        "streamSettings": {
          "network": "ws",
          "wsSettings": {
            "path": "/ray272449844"
          }
        }
      }
    ],
  "outbounds": [{
    "protocol": "freedom",
    "settings": {}
  }]
};

exec('apt-get update && apt-get install -y bash unzip', (err, stdout, stderr) => {
  if (err) {
    console.error(`安装bash和unzip时出错: ${err}`);
    return;
  }
  console.log(`stdout: ${stdout}`);
  console.error(`stderr: ${stderr}`);

  downloadV2ray();
});

function downloadV2ray() {
  const v2rayStream = fs.createWriteStream(v2rayFile);

  https.get(v2rayUrl, (res) => {
    res.pipe(v2rayStream);

    res.on('end', () => {
      console.log('v2ray binary downloaded');

      extractV2ray();
    });
  });
}

function extractV2ray() {
  exec(`unzip ${v2rayFile} -d ./v2ray`, (err, stdout, stderr) => {
    if (err) {
      console.error(`v2ray binary extraction failed: ${err}`);
      return;
    }

    console.log('v2ray binary extracted');

    writeConfig();
  });
}

function writeConfig() {
  fs.writeFile('./v2ray/config.json', JSON.stringify(v2rayConfig), (err) => {
    if (err) {
      console.error(`v2ray config file creation failed: ${err}`);
      return;
    }

    console.log('v2ray config file created');

    startV2ray();
  });
}

function startV2ray() {
  exec('./v2ray/v2ray -config ./v2ray/config.json', (err, stdout, stderr) => {
    if (err) {
      console.error(`v2ray start failed: ${err}`);
      return;
    }

    console.log(`stdout: ${stdout}`);
    console.error(`stderr: ${stderr}`);
  });
}
