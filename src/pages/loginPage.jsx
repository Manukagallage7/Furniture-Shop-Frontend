import {useState} from "react";

export default function LoginPage() {
    const [count, setCount] = useState(0)

    function increment() {
        setCount(count + 1)
    }
    function decrement() {
        setCount(count - 1)
    }
    return (
        <div className="w-full h-screen bg-amber-200 flex justify-center items-center">
            <div className="w-[400px] h-[400px] bg-white flex flex-col justfify-center items-center rounded-lg">
                <h1 className="text-5xl font-bold">{count}</h1>
                <div className="w-full flex justify-center items-center gap-10 mt-10">
                    <button onClick={increment} className="w-[100px] h-[75px] bg-blue-500 justify-center item-center text-white rounded-4xl text-4xl">+</button>
                    <button onClick={decrement} className="w-[100px] h-[75px] bg-blue-500 justify-center item-center text-white rounded-4xl text-4xl">-</button>
                </div>
            </div>
        </div>
    )
}