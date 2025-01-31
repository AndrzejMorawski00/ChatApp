import { useEffect, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faRotateLeft } from "@fortawesome/free-solid-svg-icons";
import { useSelector } from "react-redux";
import { RootState } from "../../store/store";
import { changeSearchBarState } from "../../store/searchBar/searchBarSlice";
import { useAppDispatch } from "../../hooks/useReduxHook";

// Constants
const UPDATE_SEARCHBAR_INTERVAL = 300;

const UserSearchBar = () => {
    const [searchBarInput, setSeachBarInput] = useState<string>("");

    const dispatch = useAppDispatch();
    const { searchBarValue } = useSelector((state: RootState) => state.searchBar);

    useEffect(() => {
        const handler = setTimeout(() => {
            if (searchBarInput !== searchBarValue) {
                dispatch(changeSearchBarState(searchBarInput));
            }
        }, UPDATE_SEARCHBAR_INTERVAL);

        return () => clearTimeout(handler);
    }, [searchBarInput]);

    const handleInputChange = (newValue: string) => {
        if (newValue.length > 10) return;
        setSeachBarInput(newValue);
    };

    const handleButtonClick = () => {
        setSeachBarInput("");
    };

    return (
        <form action="" className="flex flex-row items-center py-1 pr-2 border-b-2 bg-formInputBackgroundColor">
            <input
                type="text"
                placeholder="Search..."
                className="px-2 py-1 text-xl outline-none bg-formInputBackgroundColor text-formInputTextColor"
                maxLength={10}
                value={searchBarInput}
                onChange={(e) => handleInputChange(e.target.value)}
            />
            <button type="button" onClick={handleButtonClick}>
                <FontAwesomeIcon icon={faRotateLeft} className="size-6 text-formInputTextColor" />
            </button>
        </form>
    );
};

export default UserSearchBar;
