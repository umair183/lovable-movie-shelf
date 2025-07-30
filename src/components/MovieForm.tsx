import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useCreateMovie, useUpdateMovie, Movie } from "@/hooks/useMovies";

interface MovieFormProps {
  movie?: Movie;
  onClose: () => void;
}

const GENRES = [
  "Action",
  "Adventure",
  "Comedy",
  "Drama",
  "Horror",
  "Romance",
  "Sci-Fi",
  "Thriller",
  "Documentary",
  "Animation"
];

export const MovieForm = ({ movie, onClose }: MovieFormProps) => {
  const [formData, setFormData] = useState({
    title: movie?.title || "",
    description: movie?.description || "",
    genre: movie?.genre || "",
    release_year: movie?.release_year || new Date().getFullYear(),
    rental_price: movie?.rental_price || 0,
    availability_status: movie?.availability_status || "available",
  });

  const createMovie = useCreateMovie();
  const updateMovie = useUpdateMovie();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (movie) {
      updateMovie.mutate(
        { id: movie.id, ...formData },
        { onSuccess: onClose }
      );
    } else {
      createMovie.mutate(formData, { onSuccess: onClose });
    }
  };

  const isLoading = createMovie.isPending || updateMovie.isPending;

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <Label htmlFor="title">Title</Label>
        <Input
          id="title"
          value={formData.title}
          onChange={(e) => setFormData({ ...formData, title: e.target.value })}
          required
        />
      </div>

      <div>
        <Label htmlFor="description">Description</Label>
        <Textarea
          id="description"
          value={formData.description}
          onChange={(e) => setFormData({ ...formData, description: e.target.value })}
        />
      </div>

      <div>
        <Label htmlFor="genre">Genre</Label>
        <Select value={formData.genre} onValueChange={(value) => setFormData({ ...formData, genre: value })}>
          <SelectTrigger>
            <SelectValue placeholder="Select a genre" />
          </SelectTrigger>
          <SelectContent>
            {GENRES.map((genre) => (
              <SelectItem key={genre} value={genre}>
                {genre}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div>
        <Label htmlFor="release_year">Release Year</Label>
        <Input
          id="release_year"
          type="number"
          min="1900"
          max={new Date().getFullYear() + 5}
          value={formData.release_year}
          onChange={(e) => setFormData({ ...formData, release_year: parseInt(e.target.value) })}
          required
        />
      </div>

      <div>
        <Label htmlFor="rental_price">Rental Price ($)</Label>
        <Input
          id="rental_price"
          type="number"
          min="0"
          step="0.01"
          value={formData.rental_price}
          onChange={(e) => setFormData({ ...formData, rental_price: parseFloat(e.target.value) })}
          required
        />
      </div>

      <div>
        <Label htmlFor="availability_status">Availability Status</Label>
        <Select value={formData.availability_status} onValueChange={(value) => setFormData({ ...formData, availability_status: value })}>
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="available">Available</SelectItem>
            <SelectItem value="rented">Rented</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="flex gap-2 pt-4">
        <Button type="submit" disabled={isLoading}>
          {isLoading ? "Saving..." : movie ? "Update Movie" : "Add Movie"}
        </Button>
        <Button type="button" variant="outline" onClick={onClose}>
          Cancel
        </Button>
      </div>
    </form>
  );
};