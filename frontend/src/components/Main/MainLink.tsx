import { Link } from "react-router";

interface Props {
    linkPath: string;
    buttonText: string;
}

const MainLink = ({ linkPath, buttonText }: Props) => {
    return (
        <Link to={linkPath}>
            <button>{buttonText}</button>
        </Link>
    );
};

export default MainLink;
