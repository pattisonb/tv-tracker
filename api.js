import axios from 'axios';
import { TMDB_API_KEY, OPENAI_API_KEY, OPENAI_PROJECT_ID } from '@env';

const tmdb = axios.create({
  baseURL: 'https://api.themoviedb.org/3',
  params: {
    api_key: TMDB_API_KEY,
  },
});

// Helper to safely call TMDB endpoints
const safeCall = async (apiCall) => {
  try {
    const response = await apiCall();
    return { data: response.data, error: null };
  } catch (error) {
    console.error('API Error:', error.message || error);
    return { data: null, error: error.message || 'Something went wrong' };
  }
};

// Search TV Shows
export const searchTVShows = (query, page = 1) => {
    return safeCall(() => tmdb.get('/search/tv', {
      params: {
        query,
        page,
        sort_by: 'popularity.desc', // TMDB auto-sorts search results mostly by relevance/popularity
      },
    }));
  };
  

// Get full TV show details
export const getTVShowDetails = (id) => {
  return safeCall(() => tmdb.get(`/tv/${id}`));
};

//start of openai calls

export const getReleaseRumor = async (showName) => {
    try {
      const prompt = `Provide a short 1-sentence rumor or expected release information for the next season of the TV show "${showName}". If nothing is known, say "No information about new seasons or episodes available."`;
  
      const response = await axios.post(
        'https://api.openai.com/v1/chat/completions',
        {
          model: 'gpt-3.5-turbo', // or 'gpt-3.5-turbo'
          messages: [
            { role: 'system', content: 'You are a helpful TV news assistant.' },
            { role: 'user', content: prompt },
          ],
          max_tokens: 60,
          temperature: 0.7,
        },
        {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${OPENAI_API_KEY}`,
            'OpenAI-Project': OPENAI_PROJECT_ID,
            'OpenAI-Beta': 'assistants=v2',  // <<< REQUIRED
          },
        }
      );
  
      return response.data.choices[0].message.content.trim();
    } catch (error) {
      console.error('OpenAI API error:', error.response?.data || error.message);
      return null;
    }
  };