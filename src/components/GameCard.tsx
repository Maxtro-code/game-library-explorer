
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Badge } from '@/components/ui/badge';
import { Game } from '@/hooks/useGames';

interface GameCardProps {
  game: Game;
}

const GameCard = ({ game }: GameCardProps) => {
  const [imageLoaded, setImageLoaded] = useState(false);
  const [imageError, setImageError] = useState(false);

  const fallbackImage = 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1470&q=80';
  
  const scoreColor = (metacritic: number | undefined) => {
    if (!metacritic) return 'bg-muted text-muted-foreground';
    if (metacritic >= 85) return 'bg-green-500/90 text-white';
    if (metacritic >= 70) return 'bg-yellow-500/90 text-white';
    return 'bg-red-500/90 text-white';
  };

  const formatDate = (dateString: string) => {
    const options: Intl.DateTimeFormatOptions = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString('fr-FR', options);
  };

  return (
    <Link to={`/game/${game.id}`} className="game-card group">
      <div className="relative overflow-hidden aspect-[3/4] bg-muted">
        {!imageLoaded && !imageError && (
          <div className="absolute inset-0 flex items-center justify-center bg-muted animate-pulse">
            <div className="w-16 h-16 rounded-full border-4 border-t-transparent border-primary animate-spin"></div>
          </div>
        )}
        
        <img
          src={imageError ? fallbackImage : game.background_image}
          alt={game.name}
          className={`
            game-card-image object-cover w-full h-full transition-all duration-700 ease-apple
            ${imageLoaded ? 'opacity-100' : 'opacity-0'}
          `}
          onLoad={() => setImageLoaded(true)}
          onError={() => {
            setImageError(true);
            setImageLoaded(true);
          }}
          loading="lazy"
        />
        
        {game.metacritic && (
          <div className="absolute top-3 right-3 z-10">
            <Badge className={`${scoreColor(game.metacritic)} px-2.5 py-1 text-xs font-medium rounded-md`}>
              {game.metacritic}
            </Badge>
          </div>
        )}
      </div>

      <div className="p-4 space-y-2">
        <h3 className="font-medium text-lg line-clamp-1 group-hover:text-primary transition-colors duration-300">
          {game.name}
        </h3>
        
        {game.released && (
          <p className="text-sm text-muted-foreground">
            {formatDate(game.released)}
          </p>
        )}
        
        <div className="flex flex-wrap gap-1 mt-2">
          {game.genres?.slice(0, 3).map((genre) => (
            <Badge 
              key={genre.id} 
              variant="secondary" 
              className="text-xs"
            >
              {genre.name}
            </Badge>
          ))}
        </div>
      </div>

      <div className="absolute bottom-0 left-0 right-0 h-[6px] bg-primary/0 transition-all duration-300 ease-apple group-hover:bg-primary/80"></div>
    </Link>
  );
};

export default GameCard;
