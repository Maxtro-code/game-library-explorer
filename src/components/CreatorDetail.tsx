
import { useState } from 'react';
import { Creator, useCreatorDetails } from '@/hooks/useGames';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { User, X } from 'lucide-react';
import LoadingSpinner from '@/components/LoadingSpinner';

interface CreatorDetailProps {
  creator: Creator;
}

export const CreatorDetailDialog = ({ creator }: CreatorDetailProps) => {
  const [open, setOpen] = useState(false);
  const { creator: creatorDetails, isLoading, error } = useCreatorDetails(open ? creator.id : null);
  
  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map((n) => n[0])
      .join('')
      .toUpperCase();
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <button className="flex items-center gap-2 p-2 rounded-md hover:bg-secondary/50 transition-colors">
          <Avatar className="w-8 h-8">
            {creator.image ? (
              <AvatarImage src={creator.image} alt={creator.name} />
            ) : (
              <AvatarFallback className="bg-primary/10 text-primary">
                {getInitials(creator.name)}
              </AvatarFallback>
            )}
          </Avatar>
          <span className="text-sm font-medium">{creator.name}</span>
        </button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <span>Détails du créateur</span>
          </DialogTitle>
        </DialogHeader>
        
        {isLoading ? (
          <div className="flex justify-center py-8">
            <LoadingSpinner />
          </div>
        ) : error ? (
          <div className="text-center py-8">
            <p className="text-destructive">{error}</p>
          </div>
        ) : creatorDetails ? (
          <div className="mt-4">
            <div className="flex gap-4 items-center mb-6">
              <Avatar className="w-20 h-20">
                {creatorDetails.image ? (
                  <AvatarImage src={creatorDetails.image} alt={creatorDetails.name} />
                ) : (
                  <AvatarFallback className="text-xl bg-primary/10 text-primary">
                    {getInitials(creatorDetails.name)}
                  </AvatarFallback>
                )}
              </Avatar>
              <div>
                <h3 className="text-xl font-semibold">{creatorDetails.name}</h3>
                {creatorDetails.positions && creatorDetails.positions.length > 0 && (
                  <div className="flex flex-wrap gap-2 mt-2">
                    {creatorDetails.positions.map(position => (
                      <Badge key={position.id} variant="outline">
                        {position.name}
                      </Badge>
                    ))}
                  </div>
                )}
              </div>
            </div>
            
            {creatorDetails.games_count && (
              <div className="mb-4">
                <p className="text-sm text-muted-foreground">A contribué à {creatorDetails.games_count} jeux</p>
              </div>
            )}
            
            {creatorDetails.image_background && (
              <div className="rounded-lg overflow-hidden mt-4">
                <img 
                  src={creatorDetails.image_background} 
                  alt="Travaux du créateur" 
                  className="w-full h-40 object-cover"
                />
              </div>
            )}
          </div>
        ) : (
          <div className="text-center py-8">
            <p className="text-muted-foreground">Aucune information disponible</p>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};
