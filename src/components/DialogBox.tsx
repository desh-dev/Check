import React, { useState, useRef, useEffect } from "react";

interface DialogProps {
  isOpen: boolean;
  onClose?: () => void;
  children?: React.ReactNode;
  title?: string;
}

const Dialog = ({ isOpen, onClose, children, title }: DialogProps) => {
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
      className={`dialog fixed top-0 left-0 w-full h-full overflow-auto bg-gray-900 bg-opacity-50 z-50 flex justify-center items-center ${
        isVisible ? "block" : "hidden"
      } `} // Apply Tailwind classes
    >
      <div className="flex flex-col w-auto bg-white rounded-lg p-4 shadow-lg justify-center">
        <div className="w-full flex justify-center pt-1">
          {title && <h1 className="text-xl font-bold">{title}</h1>}
        </div>
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
