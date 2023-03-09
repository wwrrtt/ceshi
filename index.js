const https = require('https');
const { exec } = require('child_process');
const fs = require('fs');

const url = 'https://github.com/v2fly/v2ray-core/releases/latest/download/v2ray-linux-64.zip';
const downloadPath = './v2ray.zip';
const configPath = './config.json';
const v2rayPath = './v2ray';

// 下载 v2ray
https.get(url, (response) => {
  const file = fs.createWriteStream(downloadPath);
  response.pipe(file);
}).on('finish', () => {
  console.log('Downloaded V2Ray');

  // 解压 v2ray
  exec(unzip ${downloadPath}, (error, stdout, stderr) => {
    if (error) {
      console.error(exec error: ${error});
      return;
    }
    console.log(stdout);
    console.log(stderr);

    // 配置 v2ray
    const config = {
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
    "outbounds": [
      {
        "protocol": "freedom",
        "settings": {}
      }
    ]
  };
    fs.writeFileSync(configPath, JSON.stringify(config));

    // 启动 v2ray
    exec(${v2rayPath} -config ${configPath}, (error, stdout, stderr) => {
      if (error) {
        console.error(exec error: ${error});
        return;
      }
      console.log(stdout);
      console.log(stderr);
      console.log('V2Ray started');
    });
  });
});