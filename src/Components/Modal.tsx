import React from "react";
import styles from "./Modal.module.css";

interface ModalProps {
  showModal: boolean;
}

function Modal({ showModal }: ModalProps): JSX.Element {
  return (
    <div
      className={[
        styles.modal,
        showModal ? styles.modalOn : styles.modalOff,
      ].join(" ")}
    ></div>
  );
}

export default Modal;
