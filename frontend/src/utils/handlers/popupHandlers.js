export function handleOpenPopup(setPopup, popup) {
  setPopup(popup);
  document.querySelector(".overlay")?.classList.add("visible");
}

export function handleClosePopup(setPopup) {
  setPopup(null);
  document.querySelector(".overlay")?.classList.remove("visible");
}
