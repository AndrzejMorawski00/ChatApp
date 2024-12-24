import { useSelector } from "react-redux"
import useGetRequest from "../../api/useGetRequest/useGetRequest"
import { StoreState } from "../../redux/store"
import { useEffect, useState } from "react"
import FriendItem from "./UserItem"
import { UserData } from "../../types/Users"

const FriendList = () => {
    const {searchBarValue} = useSelector((store : StoreState) => store.friendsSearch)
    const [debouncesSearchValue, setDebouncedSearchValue] = useState(searchBarValue)

    useEffect(() => {
        const handler = setTimeout(() => {
            setDebouncedSearchValue(searchBarValue);
        }, 300); 

        return () => clearTimeout(handler); 
    }, [searchBarValue]);


    const {data, isLoading, isError} = useGetRequest<UserData[]>({queryKeys: ['users', 'potentialFirends', debouncesSearchValue], endpoint: `/api/UserData/GetAll?searchParameter=${debouncesSearchValue}`, keepData: true})




    if (isLoading) {
        return <div>
            <p>Loading...</p>
        </div>
    }

    if (isError) {
        return <div>
            <p>Error</p>
        </div>
    }

    const users  = data ? data : []
    return <ul>{users.map((friend, idx) => <FriendItem key={idx} friend={friend}/>)}</ul>
}

export default FriendList