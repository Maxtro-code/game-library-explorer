
import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Gamepad, Search } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface HeaderProps {
  onSearch: (query: string) => void;
}

const Header = ({ onSearch }: HeaderProps) => {
  const [query, setQuery] = useState('');
  const [isScrolled, setIsScrolled] = useState(false);
  const navigate = useNavigate();
  
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSearch(query);
  };

  const handleLogoClick = (e: React.MouseEvent) => {
    e.preventDefault();
    navigate('/');
    // Reset search if needed
    if (query) {
      setQuery('');
      onSearch('');
    }
  };

  return (
    <header 
      className={`
        fixed top-0 left-0 right-0 z-50 transition-all duration-500 ease-apple py-4 px-6 
        ${isScrolled ? 'glassmorphism' : 'bg-transparent'} 
      `}
    >
      <div className="container mx-auto max-w-7xl">
        <div className="flex items-center justify-between">
          <Link 
            to="/" 
            onClick={handleLogoClick}
            className="flex items-center space-x-2 transition-transform hover:scale-[1.03] duration-300 ease-apple"
          >
            <Gamepad className="w-8 h-8 text-primary animate-float" strokeWidth={1.5} />
            <span className="text-xl font-medium tracking-tight">
              Bibliothèque de Jeux
            </span>
          </Link>
          
          <form 
            onSubmit={handleSubmit}
            className="relative max-w-md w-full mx-4 transition-all duration-300 ease-apple"
          >
            <div className="relative flex items-center">
              <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Rechercher un jeu..."
                className="pl-10 pr-4 py-2 w-full rounded-full border border-border bg-background/80 backdrop-blur-sm transition-all duration-300 focus:ring-2 focus:ring-primary/20 focus:outline-none"
              />
              <Search className="absolute left-3 w-5 h-5 text-muted-foreground" />
              {query && (
                <Button 
                  type="submit" 
                  size="sm"
                  variant="ghost"
                  className="absolute right-2 px-3 rounded-full hover:bg-primary/10"
                >
                  Rechercher
                </Button>
              )}
            </div>
          </form>
        </div>
      </div>
    </header>
  );
};

export default Header;
