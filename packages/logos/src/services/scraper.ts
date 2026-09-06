import { BASE_URL } from "../config";
import { extractFileExtension, getContentType } from "../utils/file-utils";
import { normaliseMake } from "../utils/normalise-make";
import { uploadLogo } from "./blob";

export type ScrapeResult =
  | {
      success: true;
      make: string;
      url: string;
      pathname: string;
      sourceUrl: string;
    }
  | {
      success: false;
      make: string;
      sourceUrl: string;
      error: string;
      /** The source has no logo for this make; do not retry. */
      notFound: boolean;
    };

/**
 * Fetch a logo from the external source and store it. Does not check whether
 * one already exists; the manifest is the source of truth for that.
 */
export const downloadLogo = async (make: string): Promise<ScrapeResult> => {
  const normalisedMake = normaliseMake(make);
  const sourceUrl = `${BASE_URL}/${normalisedMake}-logo.png`;

  try {
    const response = await fetch(sourceUrl);
    if (!response.ok) {
      return {
        success: false,
        make: normalisedMake,
        sourceUrl,
        error: `Failed to fetch logo: ${response.status}`,
        notFound: response.status === 404,
      };
    }

    // The source redirects unknown makes to its homepage with a 200, so a
    // non-image body means there is no logo rather than a transient failure.
    const responseType = response.headers.get("content-type") ?? "";
    if (!responseType.startsWith("image/")) {
      return {
        success: false,
        make: normalisedMake,
        sourceUrl,
        error: `Source returned ${responseType || "no content type"}, not an image`,
        notFound: true,
      };
    }

    const arrayBuffer = await response.arrayBuffer();

    if (arrayBuffer.byteLength < 100) {
      return {
        success: false,
        make: normalisedMake,
        sourceUrl,
        error: "Downloaded image is too small, likely corrupted",
        notFound: false,
      };
    }

    const extension = extractFileExtension(sourceUrl);
    const contentType = getContentType(`${normalisedMake}.${extension}`);
    const stored = await uploadLogo(normalisedMake, arrayBuffer, contentType);

    return {
      success: true,
      make: normalisedMake,
      url: stored.url,
      pathname: stored.pathname,
      sourceUrl,
    };
  } catch (error) {
    return {
      success: false,
      make: normalisedMake,
      sourceUrl,
      error: error instanceof Error ? error.message : "Unknown error",
      notFound: false,
    };
  }
};
