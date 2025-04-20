const fs = require('fs');
const path = require('path');

function copyImage(sourcePath, destDir, newName) {
  return new Promise((resolve, reject) => {
    try {
      if (!fs.existsSync(destDir)) {
        fs.mkdirSync(destDir, { recursive: true });
      }

      const filename = newName || path.basename(sourcePath);
      const destPath = path.join(destDir, filename);

      fs.copyFile(sourcePath, destPath, (err) => {
        if (err) return reject('Copy failed: ' + err.message);
        resolve(destPath);
      });
    } catch (err) {
      reject('Error: ' + err.message);
    }
  });
}
export default copyImage