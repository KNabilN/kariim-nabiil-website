const YOUTUBE_HOSTS = new Set([
  "youtube.com",
  "m.youtube.com",
  "youtube-nocookie.com",
  "youtu.be",
]);

const DRIVE_HOSTS = new Set([
  "drive.google.com",
  "docs.google.com",
]);

function stripWww(hostname: string): string {
  return hostname.toLowerCase().replace(/^www\./, "");
}

/** Extract a Google Drive file ID from common share/open/uc/file URLs. */
export function extractGoogleDriveFileId(url: string): string | null {
  try {
    const parsed = new URL(url.trim());
    const host = stripWww(parsed.hostname);
    if (!DRIVE_HOSTS.has(host)) return null;

    const fileMatch = parsed.pathname.match(/\/file\/d\/([^/]+)/);
    if (fileMatch?.[1]) return fileMatch[1];

    const idParam = parsed.searchParams.get("id");
    if (idParam) return idParam;

    return null;
  } catch {
    return null;
  }
}

/**
 * Normalize stored video URLs so Drive share links become
 * `https://drive.google.com/file/d/{id}/view`. Non-Drive URLs are returned trimmed.
 */
export function normalizeVideoUrl(url: string): string {
  const trimmed = url.trim();
  if (!trimmed) return trimmed;

  const driveId = extractGoogleDriveFileId(trimmed);
  if (driveId) {
    return `https://drive.google.com/file/d/${driveId}/view`;
  }

  return trimmed;
}

/** Build an iframe-ready embed URL for YouTube or Google Drive, or null if unsupported. */
export function getVideoEmbedUrl(url: string): string | null {
  try {
    const trimmed = url.trim();
    if (!trimmed) return null;

    const driveId = extractGoogleDriveFileId(trimmed);
    if (driveId) {
      return `https://drive.google.com/file/d/${encodeURIComponent(driveId)}/preview`;
    }

    const parsed = new URL(trimmed);
    const host = stripWww(parsed.hostname);
    if (!YOUTUBE_HOSTS.has(host)) return null;

    let videoId = parsed.searchParams.get("v");

    if (host === "youtu.be") {
      videoId = parsed.pathname.split("/").filter(Boolean)[0] || null;
    } else {
      const segments = parsed.pathname.split("/").filter(Boolean);
      if (!videoId && ["embed", "shorts", "live"].includes(segments[0] || "")) {
        videoId = segments[1] || null;
      }
    }

    return videoId
      ? `https://www.youtube-nocookie.com/embed/${encodeURIComponent(videoId)}`
      : null;
  } catch {
    return null;
  }
}
