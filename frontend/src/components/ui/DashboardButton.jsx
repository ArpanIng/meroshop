import React from "react";
import PropTypes from "prop-types";

function DashboardButton({
  type = "button",
  icon: Icon,
  color = "blue",
  label,
  onClick,
  ...rest
}) {
  const buttonClass = `flex items-center justify-center text-white bg-${color}-700 hover:bg-${color}-800 focus:ring-4 focus:ring-${color}-300 font-medium rounded-lg text-sm px-3 py-2.5 dark:bg-${color}-600 dark:hover:bg-${color}-700 focus:outline-none dark:focus:ring-${color}-800`;
  const iconClass = `h-4 w-4 ${label ? "mr-2" : ""}`;

  return (
    <button type={type} className={buttonClass} onClick={onClick} {...rest}>
      {Icon && <Icon className={iconClass} />}
      {label}
    </button>
  );
}

DashboardButton.propTypes = {
  type: PropTypes.oneOf(["button", "submit"]),
  icon: PropTypes.elementType.isRequired,
  label: PropTypes.string,
  onClick: PropTypes.func.isRequired,
  color: PropTypes.oneOf(["blue", "red"]),
};

export default DashboardButton;
