import { createSerializer, parseAsString, useQueryStates } from "nuqs";

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
  const params = useQueryStates(UTM_PARSERS);

  return {
    utmSource: params.utm_source,
    utmMedium: params.utm_medium,
    utmCampaign: params.utm_campaign,
    utmTerm: params.utm_term,
    utmContent: params.utm_content,
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
