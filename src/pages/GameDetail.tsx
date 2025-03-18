
import { useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Calendar, Star, Users, Gamepad } from 'lucide-react';
import { useGameDetails } from '@/hooks/useGames';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import LoadingSpinner from '@/components/LoadingSpinner';

const GameDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const gameId = id ? parseInt(id) : null;
  const { game, isLoading, error } = useGameDetails(gameId);
  
  // Remonter au haut de la page au chargement
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [id]);
  
  // Formatage de la date
  const formatDate = (dateString?: string) => {
    if (!dateString) return 'Date inconnue';
    const options: Intl.DateTimeFormatOptions = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString('fr-FR', options);
  };
  
  // Récupérer le score Metacritic
  const getMetacriticColor = (score?: number) => {
    if (!score) return 'bg-muted text-muted-foreground';
    if (score >= 85) return 'bg-green-500/90 text-white';
    if (score >= 70) return 'bg-yellow-500/90 text-white';
    return 'bg-red-500/90 text-white';
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="h-[70vh] relative">
        {/* Bouton de retour */}
        <Button
          variant="secondary"
          size="sm"
          className="absolute top-6 left-6 z-50 rounded-full shadow-md glassmorphism"
          onClick={() => navigate(-1)}
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Retour
        </Button>
        
        {isLoading && (
          <div className="absolute inset-0 flex items-center justify-center bg-muted/50">
            <LoadingSpinner size="large" />
          </div>
        )}
        
        {error && (
          <div className="absolute inset-0 flex flex-col items-center justify-center bg-muted/50 p-6">
            <h2 className="text-xl font-medium mb-4 text-destructive">Une erreur est survenue</h2>
            <p className="mb-6 text-muted-foreground">{error}</p>
            <Button onClick={() => navigate('/')}>
              Retour à l'accueil
            </Button>
          </div>
        )}
        
        {game && (
          <>
            {/* Image d'arrière-plan avec dégradé */}
            <div className="absolute inset-0 overflow-hidden">
              <div className="absolute inset-0 bg-black/40 z-10"></div>
              <img 
                src={game.background_image} 
                alt={game.name}
                className="w-full h-full object-cover scale-105 animate-scale-in"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-background via-background/80 to-transparent z-20"></div>
            </div>
            
            {/* Informations du jeu (superposées à l'image) */}
            <div className="container mx-auto max-w-5xl relative z-30 h-full flex flex-col justify-end pb-16 px-6">
              <div className="opacity-0 animate-slide-up" style={{ animationDelay: '0.2s', animationFillMode: 'forwards' }}>
                {game.genres && game.genres.length > 0 && (
                  <div className="flex flex-wrap gap-2 mb-4">
                    {game.genres.map(genre => (
                      <Badge key={genre.id} variant="secondary" className="bg-black/30 text-white border-none">
                        {genre.name}
                      </Badge>
                    ))}
                  </div>
                )}
                
                <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-6">
                  {game.name}
                </h1>
                
                <div className="flex flex-wrap gap-6">
                  {game.released && (
                    <div className="flex items-center">
                      <Calendar className="w-5 h-5 mr-2 text-primary" />
                      <span>{formatDate(game.released)}</span>
                    </div>
                  )}
                  
                  {game.metacritic && (
                    <div className="flex items-center">
                      <Star className="w-5 h-5 mr-2 text-primary" />
                      <Badge className={`${getMetacriticColor(game.metacritic)} px-2.5 py-1`}>
                        {game.metacritic}
                      </Badge>
                    </div>
                  )}
                  
                  {game.developers && game.developers.length > 0 && (
                    <div className="flex items-center">
                      <Users className="w-5 h-5 mr-2 text-primary" />
                      <span>
                        {game.developers.map(d => d.name).join(', ')}
                      </span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </>
        )}
      </div>
      
      {game && (
        <main className="container mx-auto max-w-5xl px-6 py-10">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
            <div className="lg:col-span-2 opacity-0 animate-fade-in" style={{ animationDelay: '0.4s', animationFillMode: 'forwards' }}>
              <h2 className="text-2xl font-medium mb-4">À propos</h2>
              
              <div className="prose prose-lg max-w-none">
                <p className="whitespace-pre-line text-muted-foreground leading-relaxed">
                  {game.description_raw?.trim() || "Aucune description disponible."}
                </p>
              </div>
              
              <Separator className="my-8" />
              
              {game.tags && game.tags.length > 0 && (
                <div className="mb-8">
                  <h3 className="text-xl font-medium mb-4">Tags</h3>
                  <div className="flex flex-wrap gap-2">
                    {game.tags.map(tag => (
                      <Badge key={tag.id} variant="outline" className="px-3 py-1">
                        {tag.name}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}
            </div>
            
            <div className="opacity-0 animate-fade-in" style={{ animationDelay: '0.6s', animationFillMode: 'forwards' }}>
              <div className="rounded-xl glassmorphism p-6 sticky top-6">
                <h3 className="text-xl font-medium mb-4">Informations</h3>
                
                {game.platforms && game.platforms.length > 0 && (
                  <div className="mb-6">
                    <h4 className="text-sm font-medium text-muted-foreground mb-2">Plateformes</h4>
                    <div className="flex flex-wrap gap-2">
                      {game.platforms.map(({ platform }) => (
                        <div key={platform.id} className="flex items-center">
                          <Gamepad className="w-4 h-4 mr-1 text-primary" />
                          <span className="text-sm">{platform.name}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
                
                {game.publishers && game.publishers.length > 0 && (
                  <div className="mb-6">
                    <h4 className="text-sm font-medium text-muted-foreground mb-2">Éditeurs</h4>
                    <div>
                      {game.publishers.map(publisher => (
                        <div key={publisher.id} className="text-sm mb-1">
                          {publisher.name}
                        </div>
                      ))}
                    </div>
                  </div>
                )}
                
                {game.esrb_rating && (
                  <div className="mb-6">
                    <h4 className="text-sm font-medium text-muted-foreground mb-2">Âge recommandé</h4>
                    <Badge variant="outline" className="px-3 py-1">
                      {game.esrb_rating.name}
                    </Badge>
                  </div>
                )}
                
                <Separator className="my-6" />
                
                <div className="flex justify-center">
                  <Button className="w-full" size="lg">
                    Visiter le site officiel
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </main>
      )}
    </div>
  );
};

export default GameDetail;
