// Comprehensive asset map for Nandani's Birthday Universe
// All 13 photos are statically imported so Vite guarantees inclusion in build,
// content hashing, and production edge caching on Vercel/GitHub.

import manifestData from '../assets/photos/manifest.json';

// WebP static imports
import pMirrorWebp from '../assets/photos/IMG_20260916_170735_226b54cd.webp';
import pClassicWebp from '../assets/photos/IMG_20261016_172724_b1e65ff8.webp';
import pQueenWebp from '../assets/photos/IMG_20261016_172913_712abeea.webp';
import pWaistWebp from '../assets/photos/IMG_20261016_173024_a86a6cdf.webp';
import pSunlitWebp from '../assets/photos/IMG_20261016_173029_07cb2d2f.webp';
import pWalkWebp from '../assets/photos/IMG_20261016_173217_87f12ba0.webp';
import pBackHugWebp from '../assets/photos/IMG_20261016_173330_113efbba.webp';
import pHandsWebp from '../assets/photos/IMG_20261016_173333_6c55bc9a.webp';
import pTogetherWebp from '../assets/photos/IMG_20261016_173607_ce4da072.webp';
import pGazeWebp from '../assets/photos/IMG_20261016_173632_cbec2db8.webp';
import pCheeksWebp from '../assets/photos/IMG_20261027_154641_50522cb1.webp';
import pSnapCarnivalWebp from '../assets/photos/Snapchat-1915208999_ea37ff72.webp';
import pSnapDogWebp from '../assets/photos/Snapchat-812592320_4a5a2997.webp';

// JPG fallback static imports
import pMirrorJpg from '../assets/photos/IMG_20260916_170735_226b54cd.jpg';
import pClassicJpg from '../assets/photos/IMG_20261016_172724_b1e65ff8.jpg';
import pQueenJpg from '../assets/photos/IMG_20261016_172913_712abeea.jpg';
import pWaistJpg from '../assets/photos/IMG_20261016_173024_a86a6cdf.jpg';
import pSunlitJpg from '../assets/photos/IMG_20261016_173029_07cb2d2f.jpg';
import pWalkJpg from '../assets/photos/IMG_20261016_173217_87f12ba0.jpg';
import pBackHugJpg from '../assets/photos/IMG_20261016_173330_113efbba.jpg';
import pHandsJpg from '../assets/photos/IMG_20261016_173333_6c55bc9a.jpg';
import pTogetherJpg from '../assets/photos/IMG_20261016_173607_ce4da072.jpg';
import pGazeJpg from '../assets/photos/IMG_20261016_173632_cbec2db8.jpg';
import pCheeksJpg from '../assets/photos/IMG_20261027_154641_50522cb1.jpg';
import pSnapCarnivalJpg from '../assets/photos/Snapchat-1915208999_ea37ff72.jpg';
import pSnapDogJpg from '../assets/photos/Snapchat-812592320_4a5a2997.jpg';

interface ManifestItem {
  file: string;
  baseName: string;
  initialSizeKB: string;
  webpSizeKB: string;
  jpgSizeKB: string;
  placeholderUrl: string;
  isSnapchat: boolean;
}

const manifestMap = new Map<string, ManifestItem>();
(manifestData as ManifestItem[]).forEach((item) => {
  manifestMap.set(item.baseName, item);
});

export interface PhotoAssetBundle {
  baseName: string;
  webp: string;
  jpg: string;
  placeholder: string;
  publicWebp: string;
  publicJpg: string;
  isNativelyUpright: boolean;
}

export const PHOTO_ASSETS: Record<string, PhotoAssetBundle> = {
  'IMG_20261016_172913_712abeea': {
    baseName: 'IMG_20261016_172913_712abeea',
    webp: pQueenWebp,
    jpg: pQueenJpg,
    placeholder: manifestMap.get('IMG_20261016_172913_712abeea')?.placeholderUrl || '',
    publicWebp: '/assets/photos/IMG_20261016_172913_712abeea.webp',
    publicJpg: '/assets/photos/IMG_20261016_172913_712abeea.jpg',
    isNativelyUpright: true,
  },
  'IMG_20261027_154641_50522cb1': {
    baseName: 'IMG_20261027_154641_50522cb1',
    webp: pCheeksWebp,
    jpg: pCheeksJpg,
    placeholder: manifestMap.get('IMG_20261027_154641_50522cb1')?.placeholderUrl || '',
    publicWebp: '/assets/photos/IMG_20261027_154641_50522cb1.webp',
    publicJpg: '/assets/photos/IMG_20261027_154641_50522cb1.jpg',
    isNativelyUpright: true,
  },
  'IMG_20260916_170735_226b54cd': {
    baseName: 'IMG_20260916_170735_226b54cd',
    webp: pMirrorWebp,
    jpg: pMirrorJpg,
    placeholder: manifestMap.get('IMG_20260916_170735_226b54cd')?.placeholderUrl || '',
    publicWebp: '/assets/photos/IMG_20260916_170735_226b54cd.webp',
    publicJpg: '/assets/photos/IMG_20260916_170735_226b54cd.jpg',
    isNativelyUpright: true,
  },
  'IMG_20261016_173632_cbec2db8': {
    baseName: 'IMG_20261016_173632_cbec2db8',
    webp: pGazeWebp,
    jpg: pGazeJpg,
    placeholder: manifestMap.get('IMG_20261016_173632_cbec2db8')?.placeholderUrl || '',
    publicWebp: '/assets/photos/IMG_20261016_173632_cbec2db8.webp',
    publicJpg: '/assets/photos/IMG_20261016_173632_cbec2db8.jpg',
    isNativelyUpright: true,
  },
  'IMG_20261016_173330_113efbba': {
    baseName: 'IMG_20261016_173330_113efbba',
    webp: pBackHugWebp,
    jpg: pBackHugJpg,
    placeholder: manifestMap.get('IMG_20261016_173330_113efbba')?.placeholderUrl || '',
    publicWebp: '/assets/photos/IMG_20261016_173330_113efbba.webp',
    publicJpg: '/assets/photos/IMG_20261016_173330_113efbba.jpg',
    isNativelyUpright: true,
  },
  'IMG_20261016_173607_ce4da072': {
    baseName: 'IMG_20261016_173607_ce4da072',
    webp: pTogetherWebp,
    jpg: pTogetherJpg,
    placeholder: manifestMap.get('IMG_20261016_173607_ce4da072')?.placeholderUrl || '',
    publicWebp: '/assets/photos/IMG_20261016_173607_ce4da072.webp',
    publicJpg: '/assets/photos/IMG_20261016_173607_ce4da072.jpg',
    isNativelyUpright: true,
  },
  'IMG_20261016_173333_6c55bc9a': {
    baseName: 'IMG_20261016_173333_6c55bc9a',
    webp: pHandsWebp,
    jpg: pHandsJpg,
    placeholder: manifestMap.get('IMG_20261016_173333_6c55bc9a')?.placeholderUrl || '',
    publicWebp: '/assets/photos/IMG_20261016_173333_6c55bc9a.webp',
    publicJpg: '/assets/photos/IMG_20261016_173333_6c55bc9a.jpg',
    isNativelyUpright: true,
  },
  'IMG_20261016_173024_a86a6cdf': {
    baseName: 'IMG_20261016_173024_a86a6cdf',
    webp: pWaistWebp,
    jpg: pWaistJpg,
    placeholder: manifestMap.get('IMG_20261016_173024_a86a6cdf')?.placeholderUrl || '',
    publicWebp: '/assets/photos/IMG_20261016_173024_a86a6cdf.webp',
    publicJpg: '/assets/photos/IMG_20261016_173024_a86a6cdf.jpg',
    isNativelyUpright: true,
  },
  'IMG_20261016_173029_07cb2d2f': {
    baseName: 'IMG_20261016_173029_07cb2d2f',
    webp: pSunlitWebp,
    jpg: pSunlitJpg,
    placeholder: manifestMap.get('IMG_20261016_173029_07cb2d2f')?.placeholderUrl || '',
    publicWebp: '/assets/photos/IMG_20261016_173029_07cb2d2f.webp',
    publicJpg: '/assets/photos/IMG_20261016_173029_07cb2d2f.jpg',
    isNativelyUpright: true,
  },
  'IMG_20261016_172724_b1e65ff8': {
    baseName: 'IMG_20261016_172724_b1e65ff8',
    webp: pClassicWebp,
    jpg: pClassicJpg,
    placeholder: manifestMap.get('IMG_20261016_172724_b1e65ff8')?.placeholderUrl || '',
    publicWebp: '/assets/photos/IMG_20261016_172724_b1e65ff8.webp',
    publicJpg: '/assets/photos/IMG_20261016_172724_b1e65ff8.jpg',
    isNativelyUpright: true,
  },
  'IMG_20261016_173217_87f12ba0': {
    baseName: 'IMG_20261016_173217_87f12ba0',
    webp: pWalkWebp,
    jpg: pWalkJpg,
    placeholder: manifestMap.get('IMG_20261016_173217_87f12ba0')?.placeholderUrl || '',
    publicWebp: '/assets/photos/IMG_20261016_173217_87f12ba0.webp',
    publicJpg: '/assets/photos/IMG_20261016_173217_87f12ba0.jpg',
    isNativelyUpright: true,
  },
  'Snapchat-812592320_4a5a2997': {
    baseName: 'Snapchat-812592320_4a5a2997',
    webp: pSnapDogWebp,
    jpg: pSnapDogJpg,
    placeholder: manifestMap.get('Snapchat-812592320_4a5a2997')?.placeholderUrl || '',
    publicWebp: '/assets/photos/Snapchat-812592320_4a5a2997.webp',
    publicJpg: '/assets/photos/Snapchat-812592320_4a5a2997.jpg',
    isNativelyUpright: true,
  },
  'Snapchat-1915208999_ea37ff72': {
    baseName: 'Snapchat-1915208999_ea37ff72',
    webp: pSnapCarnivalWebp,
    jpg: pSnapCarnivalJpg,
    placeholder: manifestMap.get('Snapchat-1915208999_ea37ff72')?.placeholderUrl || '',
    publicWebp: '/assets/photos/Snapchat-1915208999_ea37ff72.webp',
    publicJpg: '/assets/photos/Snapchat-1915208999_ea37ff72.jpg',
    isNativelyUpright: true,
  },
};
