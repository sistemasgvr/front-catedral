import { useMutation, useQuery, useQueryClient } from "@tanstack/vue-query";
import {
  obtenerTodasNoticias,
  obtenerNoticiaPorId,
  crearNoticia,
  actualizarNoticia,
  eliminarNoticia,
} from "../actions/noticias.action";
// "@/modules/admin/actions/noticias.action";
import type { INoticiaForm } from "@/interfaces/noticia.interface";

const QUERY_KEY = "noticias-admin";

// ──────────────────────────────────────────────
// QUERIES
// ──────────────────────────────────────────────

export const useNoticiasQuery = () => {
  return useQuery({
    queryKey: [QUERY_KEY],
    queryFn: obtenerTodasNoticias,
    staleTime: 1000 * 60 * 2, // 2 minutos
    refetchOnWindowFocus: true,
  });
};

export const useNoticiaByIdQuery = (id: number) => {
  return useQuery({
    queryKey: [QUERY_KEY, id],
    queryFn: () => obtenerNoticiaPorId(id),
    enabled: !!id,
  });
};

// ──────────────────────────────────────────────
// MUTATIONS
// ──────────────────────────────────────────────

export const useCrearNoticia = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (form: INoticiaForm) => crearNoticia(form),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEY] });
    },
  });
};

export const useActualizarNoticia = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, form }: { id: number; form: INoticiaForm }) =>
      actualizarNoticia(id, form),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEY] });
    },
  });
};

export const useEliminarNoticia = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => eliminarNoticia(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEY] });
    },
  });
};