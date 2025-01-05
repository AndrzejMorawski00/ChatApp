import { useEffect, useState } from "react";
import useAppContext from "../../hooks/useAppContextHook";

const UserSearchBar = () => {
    const [searchBarInput, setSeachBarInput] = useState<string>("");

    const { searchBarValue, handleSearchBarValueStateChange } = useAppContext();

    useEffect(() => {
        const handler = setTimeout(() => {
            if (searchBarInput !== searchBarValue) {
                handleSearchBarValueStateChange(searchBarInput);
            }
        }, 300);

        return () => clearTimeout(handler);
    }, [searchBarInput]);

    const handleInputChange = (newValue: string) => {
        setSeachBarInput(newValue);
    };

    const handleButtonClick = () => {
        setSeachBarInput("");
        handleSearchBarValueStateChange("");
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

export default UserSearchBar;
