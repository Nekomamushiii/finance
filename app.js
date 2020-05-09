var uiController = (function () {})();

var financeController = (function () {})();

var appController = (function (m1, m2) {
  document.querySelector(".add__btn").addEventListener("click", function () {
    console.log("ажилж байна");
  });
  document.addEventListener("keypress", function (event) {
    if (event.keyCode === 13) {
      console.log("enter darlaa");
    } else console.log("өөр товч дарсан байна: " + event.keyCode);
  });
})(uiController, financeController);
