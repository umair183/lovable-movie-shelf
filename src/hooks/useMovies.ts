import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

export type Movie = {
  id: string;
  title: string;
  description: string | null;
  genre: string;
  release_year: number;
  availability_status: string;
  rental_price: number;
  created_at: string;
  updated_at: string;
};

export type MovieInsert = {
  title: string;
  description?: string;
  genre: string;
  release_year: number;
  availability_status?: string;
  rental_price: number;
};

export const useMovies = () => {
  return useQuery({
    queryKey: ["movies"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("movies")
        .select("*")
        .order("created_at", { ascending: false });
      
      if (error) throw error;
      return data as Movie[];
    },
  });
};

export const useCreateMovie = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async (movie: MovieInsert) => {
      const { data, error } = await supabase
        .from("movies")
        .insert([movie])
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["movies"] });
      toast({
        title: "Success",
        description: "Movie added successfully!",
      });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: "Failed to add movie: " + error.message,
        variant: "destructive",
      });
    },
  });
};

export const useUpdateMovie = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async ({ id, ...updates }: Partial<Movie> & { id: string }) => {
      const { data, error } = await supabase
        .from("movies")
        .update(updates)
        .eq("id", id)
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["movies"] });
      toast({
        title: "Success",
        description: "Movie updated successfully!",
      });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: "Failed to update movie: " + error.message,
        variant: "destructive",
      });
    },
  });
};

export const useDeleteMovie = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from("movies")
        .delete()
        .eq("id", id);
      
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["movies"] });
      toast({
        title: "Success",
        description: "Movie deleted successfully!",
      });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: "Failed to delete movie: " + error.message,
        variant: "destructive",
      });
    },
  });
};