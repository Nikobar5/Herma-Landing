import { trackDownload, trackError } from '../services/analyticsTracker';

/**
 * Handles app downloads for different platforms
 * @param {string} platform - The platform ('windows' or 'mac')
 */
const handleDownload = (platform) => {
  trackDownload(platform);

  const downloadUrls = {
    windows: 'https://github.com/NicholasPianfetti/Herma-Landing/releases/download/v0.1.0/Herma-0.1.0.msi',
    mac: 'https://github.com/NicholasPianfetti/Herma-Landing/releases/download/v0.1.0/Herma-0.1.0.dmg',
  };

  const downloadUrl = downloadUrls[platform];

  if (!downloadUrl) {
    console.error(`Invalid platform: ${platform}`);
    trackError(`Invalid download platform: ${platform}`, 'handleDownload');
    return;
  }

  const link = document.createElement('a');
  link.href = downloadUrl;
  link.download = platform === 'windows' ? 'Herma-0.1.0.exe' : 'Herma-0.1.0.dmg';
  link.style.display = 'none';

  document.body.appendChild(link);
  link.click();

  setTimeout(() => {
    document.body.removeChild(link);
  }, 1000);

  return false;
};

export default handleDownload;
