import { Link } from "react-router";

interface Props {
    destination: string;
    buttonText: string;
}

const MainLink = ({ destination, buttonText }: Props) => {
    return (
        <Link to={destination}>
            <button className="px-4 py-2 text-4xl duration-300 transform border-2 rounded-md font-montserrat text-textColor bg-mainButtonBackground hover:scale-105">{buttonText}</button>
        </Link>
    );
};

export default MainLink;
