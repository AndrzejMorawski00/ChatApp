import useGetRequest from "../../api/useGetRequest/useGetRequest";

const Profile = () => {
    const { data, isError, isLoading } = useGetRequest({ queryKeys: [], endpoint: "api/userdata", keepData: true });

    if (isLoading) {
        return <p>loading...</p>;
    }

    if (isError) {
        return <p>error</p>;
    }

    return <div>
        <p>profile</p>
    </div>;
};

export default Profile;
