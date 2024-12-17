import React from "react";
import { Button, Modal } from "flowbite-react";
import PropTypes from "prop-types";
import { HiOutlineExclamation } from "react-icons/hi";

function DeleteConfirmModal({
  isOpen,
  onClose,
  onConfirm,
  modalHeader = "Are you sure you want to delete this data?",
}) {
  return (
    <>
      <Modal show={isOpen} size="md" onClose={onClose} popup>
        <Modal.Header />
        <Modal.Body>
          <div className="text-center">
            <HiOutlineExclamation className="mx-auto mb-2 h-12 w-12 text-gray-400 dark:text-gray-200" />
            <h3 className="mb-5 text-lg font-normal text-gray-500 dark:text-gray-400">
              {modalHeader}
            </h3>
            <div className="flex justify-center gap-4">
              <Button color="gray" onClick={onClose}>
                No, cancel
              </Button>
              <Button color="failure" onClick={onConfirm}>
                Yes, I'm sure
              </Button>
            </div>
          </div>
        </Modal.Body>
      </Modal>
    </>
  );
}

DeleteConfirmModal.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  onConfirm: PropTypes.func.isRequired,
  modalHeader: PropTypes.string,
};

export default DeleteConfirmModal;
