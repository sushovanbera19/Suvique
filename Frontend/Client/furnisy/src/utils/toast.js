import Swal from "sweetalert2";

const baseConfig = {
  toast: true,
  position: "top-end",
  showConfirmButton: false,
  timer: 3000,
  timerProgressBar: true,
  didOpen: (toast) => {
    toast.onmouseenter = Swal.stopTimer;
    toast.onmouseleave = Swal.resumeTimer;
  },
};

export const toastSuccess = (message = "Success!") => {
  Swal.fire({
    ...baseConfig,
    icon: "success",
    title: message,
    background: "#f0fdf4",
    iconColor: "#16a34a",
    customClass: { popup: "swal-toast-custom" },
  });
};

export const toastError = (message = "Something went wrong") => {
  Swal.fire({
    ...baseConfig,
    icon: "error",
    title: message,
    background: "#fef2f2",
    iconColor: "#dc2626",
    customClass: { popup: "swal-toast-custom" },
  });
};

export const toastInfo = (message = "Info") => {
  Swal.fire({
    ...baseConfig,
    icon: "info",
    title: message,
    background: "#eff6ff",
    iconColor: "#2563eb",
    customClass: { popup: "swal-toast-custom" },
  });
};

export const toastWarning = (message = "Warning") => {
  Swal.fire({
    ...baseConfig,
    icon: "warning",
    title: message,
    background: "#fffbeb",
    iconColor: "#d97706",
    customClass: { popup: "swal-toast-custom" },
  });
};

export const toastLoginRequired = () => {
  Swal.fire({
    ...baseConfig,
    icon: "warning",
    title: "Please login first",
    background: "#fffbeb",
    iconColor: "#d97706",
    timer: 2500,
    customClass: { popup: "swal-toast-custom" },
  });
};

export const toastConfirm = async (title = "Are you sure?", text = "") => {
  const result = await Swal.fire({
    title,
    text,
    icon: "question",
    showCancelButton: true,
    confirmButtonColor: "#111",
    cancelButtonColor: "#888",
    confirmButtonText: "Yes",
    cancelButtonText: "Cancel",
    customClass: { popup: "swal-popup-custom" },
  });
  return result.isConfirmed;
};
