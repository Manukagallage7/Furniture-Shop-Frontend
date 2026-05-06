import { useState } from "react"

export default function ImageSlider({ images = [] }) {
    const [activeIndex, setActiveIndex] = useState(0)
    const hasImages = images.length > 0
    const currentIndex = hasImages ? Math.min(activeIndex, images.length - 1) : 0

    const goToPrevious = () => {
        if (!hasImages) return
        setActiveIndex((prev) => (prev <= 0 ? images.length - 1 : prev - 1))
    }

    const goToNext = () => {
        if (!hasImages) return
        setActiveIndex((prev) => (prev >= images.length - 1 ? 0 : prev + 1))
    }

    return (
        <div className="w-full max-w-135">
            <div className="relative overflow-hidden rounded-2xl bg-stone-100 shadow-lg">
                {hasImages ? (
                    <img
                        src={images[currentIndex]}
                        alt={`Product image ${currentIndex + 1}`}
                        className="h-95 w-full object-cover sm:h-115"
                    />
                ) : (
                    <div className="flex h-95 w-full items-center justify-center bg-stone-200 text-sm font-medium text-stone-600 sm:h-115">
                        No product images available
                    </div>
                )}

                {hasImages && images.length > 1 && (
                    <>
                        <button
                            type="button"
                            onClick={goToPrevious}
                            aria-label="Show previous image"
                            className="absolute left-3 top-1/2 -translate-y-1/2 rounded-full bg-white/85 px-3 py-2 text-lg font-semibold text-stone-700 shadow transition hover:bg-white"
                        >
                            ‹
                        </button>
                        <button
                            type="button"
                            onClick={goToNext}
                            aria-label="Show next image"
                            className="absolute right-3 top-1/2 -translate-y-1/2 rounded-full bg-white/85 px-3 py-2 text-lg font-semibold text-stone-700 shadow transition hover:bg-white"
                        >
                            ›
                        </button>
                    </>
                )}
            </div>

            {hasImages && (
                <div className="mt-4 flex flex-wrap justify-center gap-3">
                    {images.map((image, index) => (
                        <button
                            key={index}
                            type="button"
                            onClick={() => setActiveIndex(index)}
                            aria-label={`Select image ${index + 1}`}
                            className={`overflow-hidden rounded-xl border-2 transition ${index === currentIndex
                                ? "border-amber-600 shadow-md"
                                : "border-transparent opacity-80 hover:opacity-100"
                                }`}
                        >
                            <img
                                src={image}
                                alt={`Product thumbnail ${index + 1}`}
                                className="h-16 w-16 object-cover sm:h-20 sm:w-20"
                            />
                        </button>
                    ))}
                </div>
            )}
        </div>
    )
}