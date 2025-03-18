
import { useState, useEffect } from 'react';
import { useToast } from '@/components/ui/use-toast';

// Types pour nos jeux
export interface Game {
  id: number;
  name: string;
  background_image: string;
  released: string;
  metacritic: number;
  genres: { id: number; name: string }[];
  platforms: { platform: { id: number; name: string } }[];
  description_raw?: string;
  developers?: { id: number; name: string }[];
  publishers?: { id: number; name: string }[];
  tags?: { id: number; name: string }[];
  esrb_rating?: { id: number; name: string };
}

interface FetchGamesParams {
  search?: string;
  page?: number;
  pageSize?: number;
}

const API_KEY = '3b8bd285389f42b096077dd9c23d976c'; // Clé API publique RAWG
const API_BASE_URL = 'https://api.rawg.io/api';

export const useGames = (params: FetchGamesParams = {}) => {
  const [games, setGames] = useState<Game[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [count, setCount] = useState(0);
  const { toast } = useToast();

  useEffect(() => {
    const fetchGames = async () => {
      setIsLoading(true);
      setError(null);

      try {
        const { search = '', page = 1, pageSize = 20 } = params;
        
        const queryParams = new URLSearchParams({
          key: API_KEY,
          page: page.toString(),
          page_size: pageSize.toString(),
        });
        
        if (search) {
          queryParams.append('search', search);
        }
        
        const response = await fetch(`${API_BASE_URL}/games?${queryParams}`);
        
        if (!response.ok) {
          throw new Error(`Erreur API: ${response.status}`);
        }
        
        const data = await response.json();
        
        setGames(data.results);
        setCount(data.count);
      } catch (err) {
        console.error('Erreur lors de la récupération des jeux:', err);
        setError(err instanceof Error ? err.message : 'Une erreur est survenue');
        toast({
          title: "Erreur de chargement",
          description: "Impossible de charger les jeux. Veuillez réessayer.",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchGames();
  }, [params.search, params.page, params.pageSize, toast]);

  return { games, isLoading, error, count };
};

export const useGameDetails = (gameId: number | null) => {
  const [game, setGame] = useState<Game | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    // Ne rien faire si gameId est null
    if (gameId === null) return;

    const fetchGameDetails = async () => {
      setIsLoading(true);
      setError(null);

      try {
        const response = await fetch(
          `${API_BASE_URL}/games/${gameId}?key=${API_KEY}`
        );

        if (!response.ok) {
          throw new Error(`Erreur API: ${response.status}`);
        }

        const data = await response.json();
        setGame(data);
      } catch (err) {
        console.error('Erreur lors de la récupération des détails du jeu:', err);
        setError(err instanceof Error ? err.message : 'Une erreur est survenue');
        toast({
          title: "Erreur de chargement",
          description: "Impossible de charger les détails du jeu. Veuillez réessayer.",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchGameDetails();
  }, [gameId, toast]);

  return { game, isLoading, error };
};
