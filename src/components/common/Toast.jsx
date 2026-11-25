import toast, { Toaster } from "react-hot-toast";

let toastId = null; // keep track of active toast

export const showToast = (message, type = "success") => {
  if (toastId) {
    toast.dismiss(toastId); // remove current toast
  }

  if (type === "success") {
    toastId = toast.success(message, {
      id: "single-toast",
      position: "top-center",
      duration: 3000,
    });
  } else if (type === "error") {
    toastId = toast.error(message, {
      id: "single-toast",
      position: "top-center",
      duration: 3000,
    });
  } else {
    toastId = toast(message, {
      id: "single-toast",
      position: "top-center",
      duration: 3000,
    });
  }
};

export const Toast = () => (
  <Toaster
    position="top-center"
    reverseOrder={false}
  />
);
