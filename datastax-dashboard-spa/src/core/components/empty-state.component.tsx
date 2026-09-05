import emptyIcon from "../../assets/empty.svg";
import "./empty-state.component.css";

type EmptyStateProps = {
  message?: string;
};

function EmptyState({ message = "It's quiet here!" }: EmptyStateProps) {
  return (
    <div className="empty-state">
      <img className="empty-state__icon" src={emptyIcon} alt={message} />
      <p className="faded-text">{message}</p>
    </div>
  );
}

export default EmptyState;
