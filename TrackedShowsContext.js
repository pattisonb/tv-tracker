import { createContext, useContext, useState } from 'react';
import { getReleaseRumor } from './api';

const TrackedShowsContext = createContext();

export const TrackedShowsProvider = ({ children }) => {
  const [trackedShows, setTrackedShows] = useState([]);

  const addShow = async (show) => {
    // First, fetch rumor separately if needed
    let rumor = null;
    if (show.in_production && !show.next_episode_to_air) {
      // rumor = await getReleaseRumor(show.name);
    }
  
    // Then set tracked shows normally (not async inside setTrackedShows!)
    setTrackedShows((prev) => {
      if (prev.find((s) => s.id === show.id)) return prev;
      return [...prev, { ...show, rumor }];
    });
  };
  
  
  const removeShow = (id) => {
    setTrackedShows((prev) => prev.filter((show) => show.id !== id));
  };

  return (
    <TrackedShowsContext.Provider value={{ trackedShows, addShow, removeShow }}>
      {children}
    </TrackedShowsContext.Provider>
  );
};

export const useTrackedShows = () => useContext(TrackedShowsContext);
