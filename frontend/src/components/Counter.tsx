
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../redux/store";
import { decrement, increment, incrementByAmount, incremenetAsync } from "../redux/counter/counterSlice";


const Counter = () => {
    const count = useSelector((state : RootState) => state.counter.value)
    const dispatch = useDispatch<AppDispatch>();



    return <div>
        <h2>{count}</h2>
        <div>
        <button onClick={() => dispatch(incremenetAsync(2))}>Increment</button>
        <button onClick={() => dispatch(decrement())}>Decrement</button>
        <button onClick={() => dispatch(incrementByAmount(2))}>Decrement By Two</button>
        </div>
    </div>

};

export default Counter;
