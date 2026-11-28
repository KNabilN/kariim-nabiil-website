/** Max devices a student can register for course access. */
export const MAX_STUDENT_DEVICES = 5;

export function getDeviceFingerprint(): string {
  const stored = localStorage.getItem('device_id');
  if (stored) return stored;

  const components = [
    navigator.userAgent,
    `${screen.width}x${screen.height}`,
    Intl.DateTimeFormat().resolvedOptions().timeZone,
    crypto.randomUUID(),
  ];

  const fingerprint = components.join('|');
  localStorage.setItem('device_id', fingerprint);
  return fingerprint;
}

export function getDeviceName(): string {
  const ua = navigator.userAgent;
  if (/iPhone/i.test(ua)) return 'iPhone';
  if (/iPad/i.test(ua)) return 'iPad';
  if (/Android/i.test(ua)) return 'Android Device';
  if (/Mac/i.test(ua)) return 'Mac';
  if (/Windows/i.test(ua)) return 'Windows PC';
  if (/Linux/i.test(ua)) return 'Linux PC';
  return 'Unknown Device';
}
