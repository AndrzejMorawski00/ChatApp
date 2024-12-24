import { Link } from "react-router";

interface Props {
    destination: string;
    buttonText: string;
}

const MainLink = ({ destination, buttonText }: Props) => {
    return (
        <Link to={destination}>
            <button>{buttonText}</button>
        </Link>
    );
};

export default MainLink;
