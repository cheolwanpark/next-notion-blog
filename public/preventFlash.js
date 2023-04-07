function isPreferColorSchemeIsDark() {
  return (
    window.matchMedia &&
    window.matchMedia("(prefers-color-scheme: dark)").matches
  );
}
function haveSetDarkMode() {
  if (!localStorage.getItem("mode")) {
    return isPreferColorSchemeIsDark();
  }
  return localStorage.getItem("mode") === "dark";
}
if (haveSetDarkMode()) {
  document.body.setAttribute("data-theme", "dark");
}
