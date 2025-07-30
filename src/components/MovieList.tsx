import { useState } from "react";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { useMovies, useDeleteMovie, Movie } from "@/hooks/useMovies";
import { MovieCard } from "./MovieCard";
import { MovieForm } from "./MovieForm";

export const MovieList = () => {
  const { data: movies, isLoading, error } = useMovies();
  const deleteMovie = useDeleteMovie();
  
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingMovie, setEditingMovie] = useState<Movie | null>(null);
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);

  const handleEdit = (movie: Movie) => {
    setEditingMovie(movie);
    setIsFormOpen(true);
  };

  const handleDelete = (id: string) => {
    setDeleteConfirm(id);
  };

  const confirmDelete = () => {
    if (deleteConfirm) {
      deleteMovie.mutate(deleteConfirm);
      setDeleteConfirm(null);
    }
  };

  const closeForm = () => {
    setIsFormOpen(false);
    setEditingMovie(null);
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-lg">Loading movies...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-lg text-destructive">Error loading movies</div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Movie Rental Management</h1>
        <Button onClick={() => setIsFormOpen(true)}>
          <Plus className="h-4 w-4 mr-2" />
          Add Movie
        </Button>
      </div>

      {movies && movies.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-lg text-muted-foreground mb-4">No movies found</p>
          <Button onClick={() => setIsFormOpen(true)}>
            <Plus className="h-4 w-4 mr-2" />
            Add Your First Movie
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {movies?.map((movie) => (
            <MovieCard
              key={movie.id}
              movie={movie}
              onEdit={handleEdit}
              onDelete={handleDelete}
            />
          ))}
        </div>
      )}

      <Dialog open={isFormOpen} onOpenChange={closeForm}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>
              {editingMovie ? "Edit Movie" : "Add New Movie"}
            </DialogTitle>
          </DialogHeader>
          <MovieForm movie={editingMovie || undefined} onClose={closeForm} />
        </DialogContent>
      </Dialog>

      <AlertDialog open={!!deleteConfirm} onOpenChange={() => setDeleteConfirm(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the movie from the database.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={confirmDelete}>Delete</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};