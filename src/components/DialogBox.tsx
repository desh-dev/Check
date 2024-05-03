import React, { useState, useRef, useEffect } from "react";

interface DialogProps {
  isOpen: boolean;
  onClose?: () => void;
  children?: React.ReactNode;
  title?: string;
}

const Dialog: React.FC<DialogProps> = ({
  isOpen,
  onClose,
  children,
  title,
}) => {
  const [isVisible, setIsVisible] = useState(isOpen); // Manage visibility state
  const dialogRef = useRef<HTMLDivElement>(null); // Ref to access the dialog element

  const handleClose = () => {
    setIsVisible(false);
    onClose?.(); // Call user-provided onClose function (optional chaining)
  };

  const handleOverlayClick = (event: React.MouseEvent<HTMLBodyElement>) => {
    // Close the dialog if clicked outside the dialog content
    if (
      dialogRef.current &&
      !dialogRef.current.contains(event.target as Node)
    ) {
      handleClose();
    }
  };

  useEffect(() => {
    // Update visibility based on isOpen prop
    setIsVisible(isOpen);

    // Add click event listener to the body for closing on overlay click
    document.body.addEventListener(
      "click",
      handleOverlayClick as unknown as (event: MouseEvent) => void
    );

    return () => {
      // Remove event listener on unmount
      document.body.removeEventListener(
        "click",
        handleOverlayClick as unknown as (event: MouseEvent) => void
      );
    };
  }, [isOpen]); // Dependency on isOpen prop

  return (
    <div
      ref={dialogRef}
      className={`dialog fixed top-0 left-0 w-full h-full overflow-auto bg-gray-900 bg-opacity-50 z-50 flex justify-center items-center ${
        isVisible ? "block" : "hidden"
      } `} // Apply Tailwind classes
    >
      <div className="flex flex-col bg-white rounded-lg shadow-lg p-4 w-full max-w-md">
        {title && <h3>{title}</h3>}
        {/* <Button
          className="font-bold text-center items-center"
          onClick={handleClose}
        >
          Start
        </Button> */}
        <div className="dialog-body">{children}</div>
      </div>
    </div>
  );
};

export default Dialog;
