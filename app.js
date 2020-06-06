var uiController = (function () {
  var DOMstring = {
    inputType: ".add__type",
    inputDescription: ".add__description",
    inputValue: ".add__value",
    addBtn: ".add__btn",
    incomeList: ".income__list",
    expenseList: ".expenses__list",
    tusuvLabel: ".budget__value",
    incomeLabel: ".budget__income--value",
    expenseLabel: ".budget__expenses--value",
    percentageLabel: ".budget__expenses--percentage",
    containerDiv: ".container",
  };
  return {
    getInput: function () {
      return {
        type: document.querySelector(DOMstring.inputType).value,
        description: document.querySelector(DOMstring.inputDescription).value,
        value: parseInt(document.querySelector(DOMstring.inputValue).value),
      };
    },
    getDOMstring: function () {
      return DOMstring;
    },
    clearFields: function () {
      var fields = document.querySelectorAll(
        DOMstring.inputDescription + ", " + DOMstring.inputValue
      );
      var fieldsArr = Array.prototype.slice.call(fields);
      fieldsArr.forEach(function (el, index, array) {
        array[0].value = "";
        array[1].value = 0;
      });
      fieldsArr[0].focus();
    },
    tusviigUzuuleh: function (tusuv) {
      document.querySelector(DOMstring.tusuvLabel).textContent = tusuv.tusuv;
      document.querySelector(DOMstring.incomeLabel).textContent =
        tusuv.totalInc;
      document.querySelector(DOMstring.expenseLabel).textContent =
        tusuv.totalExp;
      if (tusuv.huvi !== 0) {
        document.querySelector(DOMstring.percentageLabel).textContent =
          tusuv.huvi + "%";
      } else {
        document.querySelector(DOMstring.percentageLabel).textContent =
          tusuv.huvi;
      }
    },
    deleteListItem: function (id) {
      var el = document.getElementById(id);
      el.parentNode.removeChild(el);
    },
    addListItem: function (item, type) {
      var html, list;
      if (type === "inc") {
        list = DOMstring.incomeList;
        html =
          '<div class="item clearfix" id="inc-$$ID$$"><div class="item__description">$$DESCRIPTION$$</div><div class="right clearfix"><div class="item__value">$$VALUE$$</div><div class="item__delete"><button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button></div></div></div>';
      } else {
        list = DOMstring.expenseList;
        html =
          '<div class="item clearfix" id="exp-$$ID$$"><div class="item__description">$$DESCRIPTION$$</div><div class="right clearfix"><div class="item__value">$$VALUE$$</div><div class="item__percentage">21%</div><div class="item__delete"><button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button></div></div></div>';
      }
      html = html.replace("$$ID", item.id);
      html = html.replace("$$DESCRIPTION$$", item.description);
      html = html.replace("$$VALUE$$", item.value);
      document.querySelector(list).insertAdjacentHTML("beforeend", html);
    },
  };
})();
var financeController = (function () {
  var Income = function (id, description, value) {
    this.id = id;
    this.description = description;
    this.value = value;
  };
  var Expense = function (id, description, value) {
    this.id = id;
    this.description = description;
    this.value = value;
  };
  var calculateTotal = function (type) {
    var sum = 0;
    data.items[type].forEach(function (el) {
      sum = sum + el.value;
    });
    data.totals[type] = sum;
  };
  var data = {
    items: {
      inc: [],
      exp: [],
    },
    totals: {
      inc: 0,
      exp: 0,
    },
    tusuv: 0,
    huvi: 0,
  };
  return {
    tusuvTootsooloh: function () {
      calculateTotal("inc");
      calculateTotal("exp");
      data.tusuv = data.totals.inc - data.totals.exp;
      data.huvi = Math.round((data.totals.exp / data.totals.inc) * 100);
    },
    tusviigAvah: function () {
      return {
        tusuv: data.tusuv,
        huvi: data.huvi,
        totalInc: data.totals.inc,
        totalExp: data.totals.exp,
      };
    },
    deleteItem: function (type, id) {
      var ids = data.items[type].map(function (el) {
        return el.id;
      });
      var index = ids.indexOf(id);
      if (index !== -1) {
        data.items[type].splice(index, 1);
      }
    },
    addItem: function (type, desc, val) {
      var item, id;
      if (data.items[type].length === 0) id = 1;
      else {
        id = data.items[type][data.items[type].length - 1].id + 1;
      }
      if (type === "inc") {
        item = new Income(id, desc, val);
      } else {
        item = new Expense(id, desc, val);
      }
      data.items[type].push(item);
      return item;
    },

    seeData: function () {
      return data;
    },
  };
})();
var appController = (function (m1, m2) {
  var ctrlAddItem = function () {
    var input = m1.getInput();

    if (input.description !== "" && input.value !== 0) {
      var item = m2.addItem(input.type, input.description, input.value);
      m1.addListItem(item, input.type);
      m1.clearFields();
      updateTusuv();
    }
  };
  var updateTusuv = function () {
    m2.tusuvTootsooloh();
    var tusuv = m2.tusviigAvah();
    m1.tusviigUzuuleh(tusuv);
    console.log(tusuv);
  };
  var setUpEventListeners = function () {
    var DOM = m1.getDOMstring();
    document.querySelector(DOM.addBtn).addEventListener("click", function () {
      ctrlAddItem();
    });
    document.addEventListener("keypress", function (event) {
      if (event.keyCode === 13 || event.which === 13) {
        ctrlAddItem();
      }
    });
    document
      .querySelector(DOM.containerDiv)
      .addEventListener("click", function (event) {
        var id = event.target.parentNode.parentNode.parentNode.parentNode.id;
        if (id) {
          var arr = id.split("-");
          var type = arr[0];
          var itemId = parseInt(arr[1]);
          console.log(type + "====> " + itemId);
          m2.deleteItem(type, itemId);
          m1.deleteListItem(id);
          updateTusuv();
        }
      });
  };
  return {
    init: function () {
      console.log("app started");
      m1.tusviigUzuuleh({
        tusuv: 0,
        huvi: 0,
        totalInc: 0,
        totalExp: 0,
      });
      return setUpEventListeners();
    },
  };
})(uiController, financeController);
appController.init();
