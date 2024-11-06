
// import { MovieCarousel } from "@/components/carousel/movie-carousel"
import MovieSlider from '@/components/carousel/movie-slider';
import { useGetMoviesStatus } from '@/features/movies/api/use-get-movies-status';

export const ComingSoon = () => {
  const {data, isLoading} = useGetMoviesStatus({status: "upcoming"})
    return (
        <div
      className=" bg-contain  bg-[#cf256f]"
      style={{ backgroundImage: "url('/crissxcross.png')" }}
    >
      <h1
        className="text-white font-bold text-3xl py-5 text-center "
        style={{
          textShadow:
            "0 0 10px rgba(255, 255, 255, 0.8), 0 0 20px rgba(255, 255, 255, 0.6), 0 0 30px rgba(255, 255, 255, 0.4)",
        }}
      >
       Phim sắp chiếu
      </h1>
      <MovieSlider movies={data} isLoading={isLoading} />
    </div>
    )
}