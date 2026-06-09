"use client";

import { useState, useEffect, useCallback } from "react";
import { gamesApi } from "@/lib/api";
import { useStore } from "@/lib/store";
import type { ApiGame, ApiGameDetail, GameQuery, PaginatedResult } from "@/lib/types";

export function useGames(query: GameQuery = {}) {
  const { setApiGames } = useStore();
  const [data, setData] = useState<PaginatedResult<ApiGame> | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const queryKey = JSON.stringify(query);

  const fetch = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const result = await gamesApi.list(query);
      setData(result);
      setApiGames(result.items);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Erro ao carregar jogos");
    } finally {
      setLoading(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [queryKey]);

  useEffect(() => {
    fetch();
  }, [fetch]);

  return { data, games: data?.items ?? [], loading, error, refetch: fetch };
}

export function useGame(id: string) {
  const [game, setGame] = useState<ApiGameDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!id) return;
    setLoading(true);
    gamesApi
      .getById(id)
      .then(setGame)
      .catch((e) => setError(e instanceof Error ? e.message : "Jogo não encontrado"))
      .finally(() => setLoading(false));
  }, [id]);

  return { game, loading, error };
}
