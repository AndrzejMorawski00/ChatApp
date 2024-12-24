import { useDispatch, useSelector } from "react-redux";
import { StoreState } from "../../redux/store";
import { handleSearchBarChange } from "../../redux/friends/friendsSearchSlice";

const FriendsSearchBar = () => {
    const dispatch = useDispatch();
    const searchBarValue = useSelector((state: StoreState) => state.friendsSearch.searchBarValue);

    const handleInputChange = (newValue: string) => {
        dispatch(handleSearchBarChange({ searchBarValue: newValue }));
    };

    const handleButtonClick = () => {
        dispatch(handleSearchBarChange({ searchBarValue: "" }));
    };

    return (
        <form action="">
            <input type="text" value={searchBarValue} onChange={(e) => handleInputChange(e.target.value)} />
            <button type="button" onClick={handleButtonClick}>Clear</button>
        </form>
    );
};

export default FriendsSearchBar;
