import { useEffect, useState } from "react";
import useAppContext from "../../hooks/useAppContextHook";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faRotateLeft } from "@fortawesome/free-solid-svg-icons";

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
        if (newValue.length > 10) return;
        setSeachBarInput(newValue);
    };

    const handleButtonClick = () => {
        setSeachBarInput("");
        handleSearchBarValueStateChange("");
    };

    return (
        <form action="" className="flex flex-row  items-center border-b-2 bg-formInputBackgroundColor py-1 pr-2">
            <input
                type="text"
                placeholder="Search..."
                className="bg-formInputBackgroundColor text-xl text-formInputTextColor outline-none px-2 py-1"
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
