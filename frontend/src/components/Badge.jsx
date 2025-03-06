import React from "react";
import PropTypes from "prop-types";

function Badge({ status, color, children }) {
  if (color) {
    const bgColor = `bg-${color}-100 dark:bg-${color}-900`;
    const textColor = `text-${color}-800 dark:text-${color}-300`;

    return (
      <span
        className={`text-xs font-medium me-2 px-2.5 py-0.5 rounded ${bgColor} ${textColor}`}
      >
        {children}
      </span>
    );
  }

  let badgeColor;

  switch (status) {
    case "Draft":
      badgeColor = "blue";
      break;
    case "Active":
      badgeColor = "green";
      break;
    case "Inactive":
      badgeColor = "red";
      break;
    case "Discontinued":
      badgeColor = "red";
      break;
    default:
      badgeColor = "gray";
  }

  const bgColor = `bg-${badgeColor}-100 dark:bg-${badgeColor}-900`;
  const textColor = `text-${badgeColor}-800 dark:text-${badgeColor}-300`;

  return (
    <span
      className={`text-xs font-medium me-2 px-2.5 py-0.5 rounded ${bgColor} ${textColor}`}
    >
      {status}
    </span>
  );
}

Badge.propTypes = {
  status: PropTypes.string,
  color: PropTypes.string,
  children: PropTypes.node,
};

export default Badge;
