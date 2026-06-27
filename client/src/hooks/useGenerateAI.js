import { useState } from 'react';
import axios from 'axios';

export function useGenerateAI() {
  const [loading, setLoading] = useState(false);

  const generate = async (prompt, { format = "html" } = {}) => {
    setLoading(true);
    try {
      const response = await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/api/ai/generate`,
        { prompt, format },
        { withCredentials: true }
      );
      return response.data.content;
    } finally {
      setLoading(false);
    }
  };

  return { generate, loading };
}
