import { useState, useEffect } from 'react';

interface ContentData {
  [component: string]: {
    [field: string]: string;
  };
}

interface UseManagedContentReturn {
  content: ContentData;
  loading: boolean;
  error: string | null;
  refresh: () => void;
}

export function useManagedContent(section: string): UseManagedContentReturn {
  const [content, setContent] = useState<ContentData>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchContent = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await fetch(`/api/content?section=${section}`);
      const data = await response.json();
      
      if (data.success) {
        setContent(data.data);
      } else {
        // If no managed content, return empty object (components will use defaults)
        setContent({});
      }
    } catch (error) {
      console.error('Failed to fetch managed content:', error);
      setError('Failed to load content');
      // Set empty content to prevent breaking components
      setContent({});
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchContent();
  }, [section]);

  const refresh = () => {
    fetchContent();
  };

  return { content, loading, error, refresh };
}

// Helper function to get content value with fallback
export function getContentValue(
  content: ContentData,
  component: string,
  field: string,
  fallback: string
): string {
  try {
    return content[component]?.[field] || fallback;
  } catch (error) {
    return fallback;
  }
}
