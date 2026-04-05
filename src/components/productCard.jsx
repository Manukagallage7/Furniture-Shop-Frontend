export default function ProductCard(props){
    return(
        <div>
            <h3 className="bg-red-600">{props.productName}</h3>
            <p>${props.price}</p>
        </div>
    )
}

