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
    expensePercentageLabel: ".item__percentage",
    dateLabel: ".budget__title--month",
  };
  var nodeListForeach = function (list, callback) {
    for (var i = 0; i < list.length; i++) {
      callback(list[i], i);
    }
  };
  var formatMoney = function (too, type) {
    too = "" + too;
    var x = too.split("").reverse().join("");
    var y = "";
    var count = 1;
    for (var i = 0; i < x.length; i++) {
      y = y + x[i];
      if (count % 3 === 0) y = y + ".";
      count++;
    }
    var z = y.split("").reverse().join("");
    if (z[0] === ".") z = z.substr(1, z.length - 1);
    if (type === "inc") z = "+ " + z;
    else z = "- " + z;
    return z;
  };
  return {
    displayDate: function () {
      var unuudur = new Date();
      document.querySelector(DOMstring.dateLabel).textContent =
        unuudur.getFullYear() + " оны " + unuudur.getMonth() + " сарын ";
    },
    changeType: function () {
      var fields = document.querySelectorAll(
        DOMstring.inputType +
          ", " +
          DOMstring.inputDescription +
          ", " +
          DOMstring.inputValue
      );
      nodeListForeach(fields, function (el) {
        el.classList.toggle("red-focus");
      });
      document.querySelector(DOMstring.addBtn).classList.toggle("red");
    },
    getInput: function () {
      return {
        type: document.querySelector(DOMstring.inputType).value,
        description: document.querySelector(DOMstring.inputDescription).value,
        value: parseInt(document.querySelector(DOMstring.inputValue).value),
      };
    },
    displayPercentages: function (allPercentages) {
      var elements = document.querySelectorAll(
        DOMstring.expensePercentageLabel
      );
      nodeListForeach(elements, function (el, index) {
        if (allPercentages[index] > 0)
          el.textContent = allPercentages[index] + "%";
        else el.textContent = 0;
      });
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
      var type;
      if (tusuv.tusuv > 0) type = "inc";
      else type = "exp";

      document.querySelector(DOMstring.tusuvLabel).textContent = formatMoney(
        tusuv.tusuv,
        type
      );
      document.querySelector(DOMstring.incomeLabel).textContent = formatMoney(
        tusuv.totalInc,
        "inc"
      );
      document.querySelector(DOMstring.expenseLabel).textContent = formatMoney(
        tusuv.totalExp,
        "exp"
      );
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
      html = html.replace("$$VALUE$$", formatMoney(item.value, type));
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
    this.percentage = -1;
  };
  Expense.prototype.calcPercentage = function (totalIncome) {
    if (totalIncome > 0)
      this.percentage = Math.round((this.value / totalIncome) * 100);
    else this.percentage = 0;
  };
  Expense.prototype.getPercentage = function () {
    return this.percentage;
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
      if (data.totals.inc > 0)
        data.huvi = Math.round((data.totals.exp / data.totals.inc) * 100);
      else data.huvi = 0;
    },
    calculataPercentages: function () {
      data.items.exp.forEach(function (el) {
        el.calcPercentage(data.totals.inc);
      });
    },
    getPercentages: function () {
      var allPercentages = data.items.exp.map(function (el) {
        return el.getPercentage();
      });
      return allPercentages;
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
    m2.calculataPercentages();
    var allPercentages = m2.getPercentages();
    m1.displayPercentages(allPercentages);
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
      .querySelector(DOM.inputType)
      .addEventListener("change", m1.changeType);
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
      m1.displayDate();
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
