import { Link } from "react-router";

interface Props {
    destination: string;
    name: string;
}

const HeaderLink = ({ destination, name }: Props) => {
    return <Link className="mr-4 text-3xl tracking-wider text-textColor font-montserrat linkStyles" to={destination}>
        {name}
    </Link>;
};

export default HeaderLink
