import React from "react";
import PropTypes from "prop-types";

function DashboardTableNoDataRow({ columns, message = "No data available." }) {
  return (
    <tr>
      <td colSpan={columns} className="px-4 py-6 text-center">
        {message}
      </td>
    </tr>
  );
}

DashboardTableNoDataRow.propTypes = {
  columns: PropTypes.number.isRequired,
};

export default DashboardTableNoDataRow;
