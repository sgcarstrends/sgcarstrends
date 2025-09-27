import { createSerializer, parseAsString, useQueryState } from "nuqs";

export interface UTMParams {
  source?: string;
  medium?: string;
  campaign?: string;
  term?: string;
  content?: string;
}

export const UTM_PARSERS = {
  utm_source: parseAsString,
  utm_medium: parseAsString,
  utm_campaign: parseAsString,
  utm_term: parseAsString,
  utm_content: parseAsString,
};

export const useUTMParams = () => {
  const [utmSource] = useQueryState("utm_source", UTM_PARSERS.utm_source);
  const [utmMedium] = useQueryState("utm_medium", UTM_PARSERS.utm_medium);
  const [utmCampaign] = useQueryState("utm_campaign", UTM_PARSERS.utm_campaign);
  const [utmTerm] = useQueryState("utm_term", UTM_PARSERS.utm_term);
  const [utmContent] = useQueryState("utm_content", UTM_PARSERS.utm_content);

  return {
    utmSource,
    utmMedium,
    utmCampaign,
    utmTerm,
    utmContent,
  };
};

export const createExternalCampaignURL = (
  baseUrl: string,
  utmParams: UTMParams,
): string => {
  const params: Record<string, string | null> = {};

  if (utmParams.source) params.utm_source = utmParams.source;
  if (utmParams.medium) params.utm_medium = utmParams.medium;
  if (utmParams.campaign) params.utm_campaign = utmParams.campaign;
  if (utmParams.term) params.utm_term = utmParams.term;
  if (utmParams.content) params.utm_content = utmParams.content;

  return createSerializer(UTM_PARSERS)(baseUrl, params);
};
