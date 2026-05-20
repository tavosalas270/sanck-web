import fs from 'fs';
import path from 'path';
import { Readable } from 'stream';

export async function GET() {
  try {
    const installerDir = path.join(process.cwd(), 'installer');
    
    if (!fs.existsSync(installerDir)) {
      return new Response('Installer directory not found', { status: 404 });
    }

    const files = fs.readdirSync(installerDir);
    const apkFile = files.find(file => file.endsWith('.apk'));

    if (!apkFile) {
      return new Response('No APK file found', { status: 404 });
    }

    const apkPath = path.join(installerDir, apkFile);
    const stat = fs.statSync(apkPath);
    const fileStream = fs.createReadStream(apkPath);
    
    // Convert Node.js readable stream to Web standard ReadableStream
    const webStream = Readable.toWeb(fileStream);

    return new Response(webStream as unknown as ReadableStream, {
      headers: {
        'Content-Type': 'application/vnd.android.package-archive',
        'Content-Disposition': `attachment; filename="${apkFile}"`,
        'Content-Length': stat.size.toString(),
      },
    });
  } catch (error) {
    console.error('Error downloading APK:', error);
    return new Response('Internal Server Error', { status: 500 });
  }
}
