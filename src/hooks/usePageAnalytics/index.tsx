import { useCallback } from 'react';
import { trackPageCopy } from '@/services/analytics';
import { PageBuilderElement } from '@/context/PageBuilderContext';

export const usePageAnalytics = (
  pageId: string,
  pageName: string,
  userId: string,
  userName: string,
) => {
  const trackCopy = useCallback(async (pageData: PageBuilderElement[]) => {
    try {
      await trackPageCopy(pageId, pageName, userId, userName, pageData);
    } catch (error) {
      console.error('Error tracking page copy:', error);
    }
  }, [pageId, pageName, userId, userName]);

  return {
    trackCopy,
  };
};
