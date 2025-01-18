import React from "react";
import PropTypes from "prop-types";
import { HiClipboardList, HiOfficeBuilding, HiUser } from "react-icons/hi";

function IconBadge({ role }) {
  // Function to determine badge color and icon based on the role
  const getBadgeContent = () => {
    let badgeColor, IconComponent;

    switch (role) {
      case "Administrator":
        badgeColor = "blue";
        IconComponent = HiClipboardList;
        break;
      case "Vendor":
        badgeColor = "indigo";
        IconComponent = HiOfficeBuilding;
        break;
      case "Customer":
        badgeColor = "gray";
        IconComponent = HiUser;
        break;
      default:
        badgeColor = "gray";
        IconComponent = HiUser;
    }

    return {
      badgeColor,
      IconComponent,
    };
  };

  const { badgeColor, IconComponent } = getBadgeContent();

  return (
    <span
      className={`inline-flex items-center px-2.5 py-0.5 rounded text-xs font-medium bg-${badgeColor}-100 dark:bg-${badgeColor}-900 text-${badgeColor}-800 dark:text-${badgeColor}-300`}
    >
      <IconComponent className="w-3.5 h-3.5 me-1.5" />
      {role}
    </span>
  );
}

IconBadge.propTypes = {
  role: PropTypes.string.isRequired,
};

export default IconBadge;
