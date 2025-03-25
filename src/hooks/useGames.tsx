
import { useState, useEffect } from 'react';
import { useToast } from '@/components/ui/use-toast';

// Types adaptés pour l'API RAWG
export interface Game {
  id: number;
  name: string;
  background_image: string;
  released: string;
  metacritic: number | null;
  genres: { id: number; name: string }[];
  platforms: { platform: { id: number; name: string } }[];
  description_raw?: string;
  developers?: { id: number; name: string }[];
  publishers?: { id: number; name: string }[];
  tags?: { id: number; name: string }[];
  esrb_rating?: { id: number; name: string } | null;
  website?: string;
  creators?: Creator[];
}

export interface Creator {
  id: number;
  name: string;
  slug: string;
  image?: string;
  image_background?: string;
  games_count?: number;
  positions?: { id: number; name: string; slug: string }[];
}

interface FetchGamesParams {
  search?: string;
  page?: number;
  pageSize?: number;
}

// Clé API RAWG
const API_KEY = "75a7ef586745446ab5a398c41b62da4d";
const API_BASE_URL = "https://api.rawg.io/api";

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
        
        // Construction de l'URL avec les paramètres
        let url = `${API_BASE_URL}/games?key=${API_KEY}&page=${page}&page_size=${pageSize}`;
        
        if (search) {
          url += `&search=${encodeURIComponent(search)}`;
        }
        
        const response = await fetch(url);
        
        if (!response.ok) {
          throw new Error(`Erreur HTTP: ${response.status}`);
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
        const url = `${API_BASE_URL}/games/${gameId}?key=${API_KEY}`;
        
        const response = await fetch(url);
        
        if (!response.ok) {
          throw new Error(`Erreur HTTP: ${response.status}`);
        }
        
        const data = await response.json();
        
        // Récupérer les créateurs du jeu
        const creatorsUrl = `${API_BASE_URL}/games/${gameId}/development-team?key=${API_KEY}`;
        try {
          const creatorsResponse = await fetch(creatorsUrl);
          if (creatorsResponse.ok) {
            const creatorsData = await creatorsResponse.json();
            data.creators = creatorsData.results || [];
          }
        } catch (creatorErr) {
          console.error('Erreur lors de la récupération des créateurs:', creatorErr);
        }
        
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

export const useCreatorDetails = (creatorId: number | null) => {
  const [creator, setCreator] = useState<Creator | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    // Ne rien faire si creatorId est null
    if (creatorId === null) return;

    const fetchCreatorDetails = async () => {
      setIsLoading(true);
      setError(null);

      try {
        const url = `${API_BASE_URL}/creators/${creatorId}?key=${API_KEY}`;
        
        const response = await fetch(url);
        
        if (!response.ok) {
          throw new Error(`Erreur HTTP: ${response.status}`);
        }
        
        const data = await response.json();
        setCreator(data);
      } catch (err) {
        console.error('Erreur lors de la récupération des détails du créateur:', err);
        setError(err instanceof Error ? err.message : 'Une erreur est survenue');
        toast({
          title: "Erreur de chargement",
          description: "Impossible de charger les détails du créateur. Veuillez réessayer.",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchCreatorDetails();
  }, [creatorId, toast]);

  return { creator, isLoading, error };
};
