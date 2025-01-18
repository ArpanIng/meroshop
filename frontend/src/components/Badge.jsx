import React from "react";
import PropTypes from "prop-types";

function Badge({ color, children }) {
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

Badge.propTypes = {
  color: PropTypes.string.isRequired,
  children: PropTypes.node.isRequired,
};

export default Badge;
