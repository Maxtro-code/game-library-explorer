
import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useGames } from '@/hooks/useGames';
import Header from '@/components/Header';
import GameCard from '@/components/GameCard';
import LoadingSpinner from '@/components/LoadingSpinner';
import { Button } from '@/components/ui/button';

const Index = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 20;
  
  // Récupérer les paramètres de recherche de l'URL au chargement
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const search = params.get('search');
    const page = parseInt(params.get('page') || '1');
    
    if (search) setSearchQuery(search);
    if (page) setCurrentPage(page);
  }, [location.search]);

  // Utiliser le hook pour récupérer les jeux
  const { games, isLoading, error, count } = useGames({
    search: searchQuery,
    page: currentPage,
    pageSize
  });
  
  // Mettre à jour l'URL quand les filtres changent
  useEffect(() => {
    const params = new URLSearchParams();
    
    if (searchQuery) params.set('search', searchQuery);
    if (currentPage > 1) params.set('page', currentPage.toString());
    
    const newUrl = params.toString() ? `?${params.toString()}` : '';
    navigate(newUrl, { replace: true });
  }, [searchQuery, currentPage, navigate]);
  
  // Gérer la recherche
  const handleSearch = (query: string) => {
    setSearchQuery(query);
    setCurrentPage(1); // Réinitialiser à la première page lors d'une nouvelle recherche
  };
  
  // Calculer le nombre total de pages
  const totalPages = Math.ceil(count / pageSize);
  
  // Gérer le changement de page
  const handlePageChange = (page: number) => {
    if (page < 1 || page > totalPages) return;
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen pb-20">
      <Header onSearch={handleSearch} />
      
      <main className="container mx-auto max-w-7xl pt-28 px-4 sm:px-6">
        <div className="opacity-0 animate-fade-in" style={{ animationDelay: '0.1s', animationFillMode: 'forwards' }}>
          <h1 className="text-3xl font-medium tracking-tight mb-1">
            {searchQuery 
              ? `Résultats pour « ${searchQuery} »` 
              : 'Bibliothèque de jeux vidéo'}
          </h1>
          
          {count > 0 && (
            <p className="text-muted-foreground mb-8">
              {count} {count > 1 ? 'jeux trouvés' : 'jeu trouvé'}
            </p>
          )}
        </div>
        
        {isLoading ? (
          <div className="mt-16">
            <LoadingSpinner size="large" />
          </div>
        ) : error ? (
          <div className="flex flex-col items-center justify-center mt-16 p-8 rounded-lg border border-destructive/20 bg-destructive/5">
            <p className="text-destructive mb-4">{error}</p>
            <Button onClick={() => window.location.reload()}>
              Essayer à nouveau
            </Button>
          </div>
        ) : games.length === 0 ? (
          <div className="flex flex-col items-center justify-center mt-16 p-8 rounded-lg border border-muted bg-muted/20">
            <h2 className="text-xl font-medium mb-2">Aucun jeu trouvé</h2>
            <p className="text-muted-foreground mb-4">
              {searchQuery 
                ? "Essayez une autre recherche" 
                : "Il n'y a pas de jeux disponibles actuellement"}
            </p>
            {searchQuery && (
              <Button onClick={() => setSearchQuery('')}>
                Effacer la recherche
              </Button>
            )}
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
              {games.map((game, index) => (
                <div 
                  key={game.id} 
                  className="opacity-0 animate-fade-in" 
                  style={{ 
                    animationDelay: `${0.1 + index * 0.05}s`,
                    animationFillMode: 'forwards'
                  }}
                >
                  <GameCard game={game} />
                </div>
              ))}
            </div>
            
            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex justify-center mt-12">
                <div className="flex items-center space-x-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handlePageChange(currentPage - 1)}
                    disabled={currentPage === 1}
                    className="px-3"
                  >
                    Précédent
                  </Button>
                  
                  <div className="flex items-center space-x-1">
                    {[...Array(Math.min(5, totalPages))].map((_, i) => {
                      // Calculer les pages à afficher autour de la page courante
                      let pageNum;
                      if (totalPages <= 5) {
                        pageNum = i + 1;
                      } else if (currentPage <= 3) {
                        pageNum = i + 1;
                      } else if (currentPage >= totalPages - 2) {
                        pageNum = totalPages - 4 + i;
                      } else {
                        pageNum = currentPage - 2 + i;
                      }
                      
                      return (
                        <Button
                          key={i}
                          variant={currentPage === pageNum ? "default" : "outline"}
                          size="sm"
                          onClick={() => handlePageChange(pageNum)}
                          className="w-10 h-10"
                        >
                          {pageNum}
                        </Button>
                      );
                    })}
                  </div>
                  
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handlePageChange(currentPage + 1)}
                    disabled={currentPage === totalPages}
                    className="px-3"
                  >
                    Suivant
                  </Button>
                </div>
              </div>
            )}
          </>
        )}
      </main>
    </div>
  );
};

export default Index;
