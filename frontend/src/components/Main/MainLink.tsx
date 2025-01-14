import { Link } from "react-router";

interface Props {
    destination: string;
    buttonText: string;
}

const MainLink = ({ destination, buttonText }: Props) => {
    return (
        <Link to={destination}>
            <button className="font-montserrat text-textColor bg-mainButtonBackground text-4xl px-4 py-2 border-2 rounded-md transform duration-300 hover:scale-105">{buttonText}</button>
        </Link>
    );
};

export default MainLink;
