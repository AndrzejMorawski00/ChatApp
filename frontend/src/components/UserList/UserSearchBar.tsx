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
