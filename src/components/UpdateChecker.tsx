import { useInfoToast } from '@/lib/customToast';
import { useEffect } from 'react';

const UpdateChecker = () => {
  const currentVersion = process.env.CONFIG_CURRENT_VERSION || '0.0.0';
  const infoToast = useInfoToast();

  useEffect(() => {
    fetch('https://raw.githubusercontent.com/Cyronlee/zBoard/main/package.json')
      .then((res) => res.json())
      .then((data) => {
        const latestVersion = data.version;
        if (compareVersions(latestVersion, currentVersion)) {
          infoToast('New update available', 'Please update.');
        }
      })
      .catch(() => console.warn('Fetch latest version failed.'));
  }, []);
  return <></>;
};

const compareVersions = (v1: string, v2: string) => {
  let v1parts = v1.split('.');
  let v2parts = v2.split('.');

  function isValidPart(x: string) {
    return /^\d+$/.test(x);
  }

  if (!v1parts.every(isValidPart) || !v2parts.every(isValidPart)) {
    return NaN;
  }

  while (v1parts.length < v2parts.length) v1parts.push('0');
  while (v2parts.length < v1parts.length) v2parts.push('0');

  let v1partsNumbered = v1parts.map(Number);
  let v2partsNumbered = v2parts.map(Number);

  for (let i = 0; i < v1partsNumbered.length; ++i) {
    if (v2partsNumbered.length == i) {
      return 1;
    }

    if (v1partsNumbered[i] == v2partsNumbered[i]) {
    } else if (v1partsNumbered[i] > v2partsNumbered[i]) {
      return 1;
    } else {
      return -1;
    }
  }

  if (v1parts.length != v2parts.length) {
    return -1;
  }

  return 0;
};

export default UpdateChecker;
