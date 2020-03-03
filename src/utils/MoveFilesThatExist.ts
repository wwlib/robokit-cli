const fs = require('fs-extra');
const crs = require('crypto-random-string');

export async function moveFileIfItExists(filePath: string) {
  const exists = await fs.exists(filePath);
  if (exists) {
    const randomString = crs({ length: 5, type: 'url-safe' });
    await fs.move(filePath, `${filePath}.${randomString}.bak`);
  }
}

export async function moveFilesThatExist(filePaths: string[]) {
  const promises: any[] = [];
  filePaths.forEach((filePath) => {
    promises.push(moveFileIfItExists(filePath));
  });
  await Promise.all(promises);
}