import emptyIcon from "../../assets/empty.svg";
import "./no-items-found.component.css";

function NoItemsFound() {
    return (
        <div className="no-items-found">
            <img className="no-items-found__icon" src={emptyIcon} alt="No items found" />
            <p className="faded-text">No results found</p>
        </div>
    );
}

export default NoItemsFound;