import { Edit, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Movie } from "@/hooks/useMovies";

interface MovieCardProps {
  movie: Movie;
  onEdit: (movie: Movie) => void;
  onDelete: (id: string) => void;
}

export const MovieCard = ({ movie, onEdit, onDelete }: MovieCardProps) => {
  return (
    <Card className="h-full">
      <CardHeader>
        <div className="flex items-start justify-between">
          <CardTitle className="text-lg">{movie.title}</CardTitle>
          <Badge variant={movie.availability_status === "available" ? "default" : "secondary"}>
            {movie.availability_status}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-3">
        {movie.description && (
          <p className="text-sm text-muted-foreground line-clamp-3">
            {movie.description}
          </p>
        )}
        
        <div className="space-y-1">
          <p className="text-sm">
            <span className="font-medium">Genre:</span> {movie.genre}
          </p>
          <p className="text-sm">
            <span className="font-medium">Year:</span> {movie.release_year}
          </p>
          <p className="text-sm">
            <span className="font-medium">Price:</span> ${movie.rental_price}
          </p>
        </div>

        <div className="flex gap-2 pt-2">
          <Button
            size="sm"
            variant="outline"
            onClick={() => onEdit(movie)}
            className="flex-1"
          >
            <Edit className="h-4 w-4 mr-1" />
            Edit
          </Button>
          <Button
            size="sm"
            variant="destructive"
            onClick={() => onDelete(movie.id)}
            className="flex-1"
          >
            <Trash2 className="h-4 w-4 mr-1" />
            Delete
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};