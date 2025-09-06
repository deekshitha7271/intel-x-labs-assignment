"use client";

import { useInfiniteQuery } from "@tanstack/react-query";
import axios from "axios";
import { useEffect, useRef } from "react";

type Character = {
  id: number;
  name: string;
  image: string;
};

type ApiResponse = {
  info: { next: string | null };
  results: Character[];
};

async function fetchCharacters({ pageParam = "https://rickandmortyapi.com/api/character" }): Promise<ApiResponse> {
  const res = await axios.get(pageParam);
  return res.data;
}

export default function HomePage() {
  const { data, fetchNextPage, hasNextPage, isFetchingNextPage } = useInfiniteQuery({
    queryKey: ["characters"],
    queryFn: fetchCharacters,
    getNextPageParam: (lastPage) => lastPage.info.next ?? undefined,
    initialPageParam: "1",
  });

  const loadMoreRef = useRef<HTMLDivElement | null>(null);

  // Intersection Observer → auto fetch when scrolled to bottom
  useEffect(() => {
    if (!hasNextPage || !loadMoreRef.current) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          fetchNextPage();
        }
      },
      { threshold: 1.0 }
    );

    observer.observe(loadMoreRef.current);
    return () => observer.disconnect();
  }, [hasNextPage, fetchNextPage]);

  return (
    <main className="p-6">
      <h1 className="text-2xl font-bold mb-4">Rick & Morty Characters</h1>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {data?.pages.map((page, i) =>
          page.results.map((char) => (
            <div key={char.id} className="rounded-lg shadow-md p-3 bg-white">
              <img src={char.image} alt={char.name} className="rounded-md mb-2" />
              <p className="text-sm font-medium">{char.name}</p>
            </div>
          ))
        )}
      </div>

      <div ref={loadMoreRef} className="h-10 flex justify-center items-center">
        {isFetchingNextPage && <p>Loading more...</p>}
        {!hasNextPage && <p>No more characters ✨</p>}
      </div>
    </main>
  );
}
