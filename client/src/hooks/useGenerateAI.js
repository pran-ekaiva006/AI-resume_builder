// client/src/hooks/useGenerateAI.js
//
// Routes AI generation through the shared axiosClient so the 401 → refresh →
// retry interceptor (defined in GlobalApi.js) applies here too. This means an
// expired access token will be silently refreshed rather than surfacing a 401
// error to the user mid-generation.

import { useState } from 'react';
import { axiosClient } from '../../service/GlobalApi';

export function useGenerateAI() {
  const [loading, setLoading] = useState(false);

  /**
   * Send a generation request to POST /api/ai/generate.
   *
   * @param {string} prompt   The prompt text to send to the AI.
   * @param {{ format?: string }} options  Optional config; format defaults to "html".
   * @returns {Promise<string>}  The generated content string.
   */
  const generate = async (prompt, { format = 'html' } = {}) => {
    setLoading(true);
    try {
      const response = await axiosClient.post('/ai/generate', { prompt, format });
      return response.data.content;
    } finally {
      setLoading(false);
    }
  };

  return { generate, loading };
}
