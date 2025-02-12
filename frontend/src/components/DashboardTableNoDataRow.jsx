import React from "react";
import PropTypes from "prop-types";

function DashboardTableNoDataRow({
  columns,
  message = "No data available.",
  message2,
}) {
  return (
    <tr>
      <td colSpan={columns} className="px-4 py-6 text-center">
        <div>
          <p>{message}</p>
          {message2 && <p>{message2}</p>}
        </div>
      </td>
    </tr>
  );
}

DashboardTableNoDataRow.propTypes = {
  columns: PropTypes.number.isRequired,
  message: PropTypes.string,
  message2: PropTypes.string,
};

export default DashboardTableNoDataRow;
