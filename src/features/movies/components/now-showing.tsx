import MovieSlider from "@/components/carousel/movie-slider"
export const NowShowing = () => {
    return (
        <div className="relative mx-auto bg-transparent">
            <div className="absolute top-0 left-0 w-full h-full backdrop-blur-2xl"></div>
            <h1 className="text-white font-bold text-3xl py-5 text-center relative z-10">Now Showing</h1>
            <MovieSlider />
        </div>
    )
}