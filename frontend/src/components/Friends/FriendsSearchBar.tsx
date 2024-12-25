import { useDispatch } from "react-redux";
import { handleSearchBarChange } from "../../redux/friends/friendsSearchSlice";
import { useEffect, useState } from "react";

const FriendsSearchBar = () => {
    const dispatch = useDispatch();
    const [searchBarInput, setSeachBarInput] = useState<string>("");

    useEffect(() => {
        const handler = setTimeout(() => {
            dispatch(handleSearchBarChange({ searchBarValue: searchBarInput }));
        }, 300);

        return () => clearTimeout(handler);
    }, [searchBarInput]);

    const handleInputChange = (newValue: string) => {
        setSeachBarInput(newValue);
    };

    const handleButtonClick = () => {
        setSeachBarInput("");
        dispatch(handleSearchBarChange({ searchBarValue: "" }));
    };

    return (
        <form action="">
            <input type="text" value={searchBarInput} onChange={(e) => handleInputChange(e.target.value)} />
            <button type="button" onClick={handleButtonClick}>
                Clear
            </button>
        </form>
    );
};

export default FriendsSearchBar;
