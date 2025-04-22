
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Users, Building } from 'lucide-react';

interface DevPublisherDialogProps {
  developers?: { id: number; name: string }[];
  publishers?: { id: number; name: string }[];
}

export const DevPublisherDialog = ({ developers, publishers }: DevPublisherDialogProps) => {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <button className="flex items-center hover:text-primary transition-colors">
          <Users className="w-5 h-5 mr-2 text-primary" />
          <span>Voir les développeurs et éditeurs</span>
        </button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Développeurs et Éditeurs</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-6">
          {developers && developers.length > 0 && (
            <div>
              <h3 className="text-lg font-semibold flex items-center mb-3">
                <Users className="w-5 h-5 mr-2 text-primary" />
                Développeurs
              </h3>
              <div className="flex flex-wrap gap-2">
                {developers.map(dev => (
                  <Badge key={dev.id} variant="secondary">
                    {dev.name}
                  </Badge>
                ))}
              </div>
            </div>
          )}
          
          {publishers && publishers.length > 0 && (
            <div>
              <h3 className="text-lg font-semibold flex items-center mb-3">
                <Building className="w-5 h-5 mr-2 text-primary" />
                Éditeurs
              </h3>
              <div className="flex flex-wrap gap-2">
                {publishers.map(pub => (
                  <Badge key={pub.id} variant="outline">
                    {pub.name}
                  </Badge>
                ))}
              </div>
            </div>
          )}
          
          {(!developers?.length && !publishers?.length) && (
            <p className="text-muted-foreground text-center py-4">
              Aucune information disponible sur les développeurs et éditeurs
            </p>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};
