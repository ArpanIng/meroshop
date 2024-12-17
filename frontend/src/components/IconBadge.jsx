import React from "react";
import PropTypes from "prop-types";

function IconBadge({ color, children }) {
  const bgColor = `bg-${color}-100 dark:bg-${color}-900`;
  const textColor = `text-${color}-800 dark:text-${color}-300`;

  return (
    <span
      className={`inline-flex items-center px-2.5 py-0.5 rounded text-xs font-medium ${bgColor} ${textColor}`}
    >
      {children}
    </span>
  );
}

IconBadge.propTypes = {
  color: PropTypes.string.isRequired,
  children: PropTypes.node.isRequired,
};

export default IconBadge;
