export const HEADERS = {
  CITY: "x-open-next-city",
  COUNTRY: "x-open-next-country",
  LATITUDE: "x-open-next-latitude",
  LONGITUDE: "x-open-next-longitude",
} as const;

// Unicode characters for emoji flags start at this number, and run up to 127469.
export const EMOJI_FLAG_UNICODE_STARTING_POSITION = 127397;

// The location information of a given request.
export interface Geo {
  /** The city that the request originated from. */
  city?: string;
  /** The country that the request originated from. */
  country?: string;
  /** The flag emoji for the country the request originated from. */
  flag?: string;
  /** The latitude of the client. */
  latitude?: string;
  /** The longitude of the client. */
  longitude?: string;
}

const getHeader = (request: Request, key: string): string | undefined =>
  request.headers.get(key) ?? undefined;

const getFlag = (countryCode: string | undefined): string | undefined => {
  const regex = /^[A-Z]{2}$/.test(countryCode!);
  if (!countryCode || !regex) {
    return;
  }

  return String.fromCodePoint(
    ...countryCode
      .split("")
      .map((char) => EMOJI_FLAG_UNICODE_STARTING_POSITION + char.charCodeAt(0)),
  );
};

export const geolocation = (request: Request): Geo => ({
  city: getHeader(request, HEADERS.CITY),
  country: getHeader(request, HEADERS.COUNTRY),
  flag: getFlag(getHeader(request, HEADERS.COUNTRY)),
  latitude: getHeader(request, HEADERS.LATITUDE),
  longitude: getHeader(request, HEADERS.LONGITUDE),
});
