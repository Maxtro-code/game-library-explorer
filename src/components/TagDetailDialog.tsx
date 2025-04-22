
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';

interface TagDetailDialogProps {
  tag: {
    id: number;
    name: string;
    games_count?: number;
    image_background?: string;
  };
}

export const TagDetailDialog = ({ tag }: TagDetailDialogProps) => {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <button className="hover:opacity-80 transition-opacity">
          <Badge variant="outline" className="px-3 py-1">
            {tag.name}
          </Badge>
        </button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>{tag.name}</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4">
          {tag.image_background && (
            <div className="relative h-40 rounded-lg overflow-hidden">
              <div className="absolute inset-0 bg-black/40 z-10" />
              <img 
                src={tag.image_background} 
                alt={tag.name}
                className="w-full h-full object-cover"
              />
            </div>
          )}
          
          {tag.games_count && (
            <p className="text-muted-foreground">
              {tag.games_count.toLocaleString('fr-FR')} jeux avec ce tag
            </p>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};
