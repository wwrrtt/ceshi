const https = require('https');
const fs = require('fs');
const exec = require('child_process').exec;
// 安装bash和unzip
exec('sudo apt-get update && sudo apt-get install -y bash unzip', (err, stdout, stderr) => {
  if (err) {
    console.error(`执行命令时出错: ${err}`);
    return;
  }
  console.log(`stdout: ${stdout}`);
  console.error(`stderr: ${stderr}`);

// 下载v2ray二进制文件
const v2rayUrl = 'https://github.com/v2fly/v2ray-core/releases/latest/download/v2ray-linux-64.zip';
const v2rayFile = './v2ray-linux-64.zip';
const v2rayStream = fs.createWriteStream(v2rayFile);

https.get(v2rayUrl, (res) => {
  res.pipe(v2rayStream);

  res.on('end', () => {
    console.log('v2ray binary downloaded');

    // 解压v2ray二进制文件
    exec(`unzip ${v2rayFile} -d ./v2ray`, (err, stdout, stderr) => {
      if (err) {
        console.error(`v2ray binary extraction failed: ${err}`);
        return;
      }

      console.log('v2ray binary extracted');

      // 写入配置文件
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

      fs.writeFile('./v2ray/config.json', JSON.stringify(config), (err) => {
        if (err) {
          console.error(`v2ray config file creation failed: ${err}`);
          return;
        }

        console.log('v2ray config file created');

        // 启动v2ray代理
        exec('./v2ray/v2ray', (err, stdout, stderr) => {
          if (err) {
            console.error(`v2ray proxy start failed: ${err}`);
            return;
          }

          console.log('v2ray proxy started');
        });
      });
    });
  });
});
