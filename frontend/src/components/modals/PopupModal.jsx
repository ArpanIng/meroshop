import React from "react";
import { Button, Modal } from "flowbite-react";
import PropTypes from "prop-types";
import { HiOutlineTrash } from "react-icons/hi";

function PopupModal({
  openModal,
  setOpenModal,
  onConfirm,
  confirmationText,
  modalID,
}) {
  const customPopupTheme = {
    header: {
      close: {
        base: "absolute right-2.5 top-2.5 ml-auto inline-flex items-center rounded-lg bg-transparent p-1.5 text-sm text-gray-400 hover:bg-gray-200 hover:text-gray-900 dark:hover:bg-gray-600 dark:hover:text-white",
      },
    },
  };

  return (
    <Modal
      id={modalID}
      show={openModal}
      size="md"
      onClose={() => setOpenModal(false)}
      popup
      theme={customPopupTheme}
    >
      <Modal.Header />
      <Modal.Body>
        <div className="text-center">
          <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-gray-100 p-2 dark:bg-gray-700">
            <HiOutlineTrash className="h-8 w-8 text-gray-500 dark:text-gray-400" />
          </div>
          <p className="mb-3.5 text-gray-900 dark:text-white">
            {confirmationText}
          </p>
          <p className="mb-4 text-gray-500 dark:text-gray-300">
            This action cannot be undone.
          </p>
          <div className="flex items-center justify-center space-x-4">
            <Button
              color="light"
              data-modal-hide={modalID}
              onClick={() => setOpenModal(false)}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              color="failure"
              data-modal-hide={modalID}
              onClick={onConfirm}
            >
              Delete
            </Button>
          </div>
        </div>
      </Modal.Body>
    </Modal>
  );
}

PopupModal.propTypes = {
  openModal: PropTypes.bool.isRequired,
  setOpenModal: PropTypes.func.isRequired,
  onConfirm: PropTypes.func.isRequired,
  confirmationText: PropTypes.string.isRequired,
  modalID: PropTypes.string.isRequired,
};

export default PopupModal;
