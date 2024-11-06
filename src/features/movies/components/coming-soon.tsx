
import { MovieCarousel } from "@/components/carousel/movie-carousel"
export const ComingSoon = () => {
    return (
        <div className="relative mx-auto bg-transparent">
            <div className="absolute top-0 left-0 w-full h-full backdrop-blur-2xl"></div>
            <h1 className="text-white font-bold text-3xl py-5 text-center relative z-10">Coming soon</h1>
            <MovieCarousel />
        </div>
    )
}