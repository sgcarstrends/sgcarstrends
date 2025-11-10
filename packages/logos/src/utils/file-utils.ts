export const getContentType = (filename: string): string => {
  const extension = filename.split(".").pop()?.toLowerCase();
  switch (extension) {
    case "png":
      return "image/png";
    case "jpg":
    case "jpeg":
      return "image/jpeg";
    case "gif":
      return "image/gif";
    case "svg":
      return "image/svg+xml";
    case "webp":
      return "image/webp";
    default:
      return "image/png";
  }
};

export const getFileExtension = (contentType: string): string => {
  const type = contentType.toLowerCase();
  if (type.includes("png")) return "png";
  if (type.includes("jpeg") || type.includes("jpg")) return "jpg";
  if (type.includes("gif")) return "gif";
  if (type.includes("svg")) return "svg";
  if (type.includes("webp")) return "webp";
  return "png"; // default
};

export const extractFileExtension = (url: string): string => {
  const match = url.match(/\.([a-z0-9]+)(?:\?.*)?$/i);
  return match?.[1]?.toLowerCase() ?? "png";
};
