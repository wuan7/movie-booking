"use client";

import { useEffect, useState } from "react";
import { CreateCompanyModal } from "@/features/companies/components/create-company-modal";
import { CreateRoomModal } from "@/features/rooms/components/create-room-modal";
import { CreateRowModal } from "@/features/rows/components/create-row-modal";
import { CreateSeatModal } from "@/features/seats/components/create-seat-modal";
import { CreateShowtimeModal } from "@/features/showtimes/components/create-showtime-modal";
import { MovieTrailerModal } from "@/features/movies/components/movie-trailer-modal";
export const Modals = () => {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) {
    return null;
  }
  return (
    <>
      <MovieTrailerModal />
      <CreateCompanyModal />
      <CreateRoomModal />
      <CreateRowModal />
      <CreateSeatModal />
      <CreateShowtimeModal />
    </>
  );
};