import { Check, X } from "react-feather";

export const NOTIFICATIONS_CONFIG = {
  success: {
    icon: (
      <div className="ds-notification-icon--success">
        <Check color="#FFF" size={18} />
      </div>
    ),
  },
  error: {
    icon: (
      <div className="ds-notification-icon--error">
        <X color="#FFF" size={18} />
      </div>
    ),
  },
};
