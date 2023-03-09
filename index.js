const https = require('https');
const { exec } = require('child_process');
const fs = require('fs');

const v2rayDownloadUrl = 'https://github.com/v2fly/v2ray-core/releases/latest/download/v2ray-linux-64.zip';
const v2rayConfigUrl = 'https://raw.githubusercontent.com/v2fly/v2ray-core/master/release/config/server/config.json';
const v2rayConfigPath = '/etc/v2ray/config.json';

const downloadAndConfigureV2ray = () => {
  // Download v2ray binary
  https.get(v2rayDownloadUrl, (res) => {
    const v2rayZipPath = '/tmp/v2ray.zip';
    const file = fs.createWriteStream(v2rayZipPath);
    res.pipe(file);
    file.on('finish', () => {
      file.close();

      // Extract v2ray binary
      exec(`unzip ${v2rayZipPath} -d /usr/local/bin`, (err) => {
        if (err) {
          console.error('Failed to extract v2ray binary:', err);
          return;
        }

        console.log('v2ray binary extracted successfully.');

        // Download v2ray config file
        https.get(v2rayConfigUrl, (res) => {
          let configData = '';
          res.on('data', (chunk) => {
            configData += chunk;
          });
          res.on('end', () => {
            // Parse v2ray config file as JSON object
            const config = JSON.parse(configData);

            // Customize v2ray config as desired
            config.inbounds[0].port = 443;
            config.inbounds[0].protocol = 'vmess';
            config.inbounds[0].settings.clients[0].id = 'b831381d-6324-4d53-ad4f-8cda48b30811';
            config.inbounds[0].settings.clients[0].alterId = 64;

            // Write customized v2ray config file
            fs.writeFile(v2rayConfigPath, JSON.stringify(config), (err) => {
              if (err) {
                console.error('Failed to write v2ray config file:', err);
                return;
              }

              console.log('v2ray config file written successfully.');

              // Restart v2ray service to apply new config
              exec('systemctl restart v2ray', (err) => {
                if (err) {
                  console.error('Failed to restart v2ray service:', err);
                  return;
                }

                console.log('v2ray service restarted successfully.');
              });
            });
          });
        });
      });
    });
  });
};

downloadAndConfigureV2ray();
