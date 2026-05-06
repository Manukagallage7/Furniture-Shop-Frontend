export default function ImageSlider(props) {
    const images = props.images
    const [activeIndex, setActiveIndex] = useState(0)
    return (
        <div className="w-[400px] h-[500px] ">
            <img src={images[activeIndex]} className="w-full h-[400px] object-cover"/>
            <div className="w-full h-[100px] flex flex-row justify-center items-center gap-4 mt-4">
                {images.map((image, index) => (
                    <img
                        key={index}
                        src={image}
                        alt={`Product image ${index + 1}`}
                        className={`w-20 h-20 object-cover rounded-md cursor-pointer ${index === activeIndex ? 'ring-2 ring-blue-500' : ''}`}
                        onClick={() => setActiveIndex(index)}
                    />
                ))}
            </div>
        </div>
    )
}