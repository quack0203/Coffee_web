// js/main.js

document.addEventListener("DOMContentLoaded", function () {
  // 1. 全域購物車陣列
  let cartArr = [];

  // 2. 目前使用者選中的飲品類型： "coffee" / "fruitTea" / null
  let selectedDrink = null;

  // 3. 取得 DOM 元素
  const coffeeCard = document.getElementById("coffeeCard");
  const fruitTeaCard = document.getElementById("fruitTeaCard");
  const toggleCartBtn = document.getElementById("toggleCartBtn");
  const cartItemsTbody = document.getElementById("cartItems");
  const totalQuantityTd = document.getElementById("totalQuantity");
  const totalPriceTd = document.getElementById("totalPrice");
  const discountedPriceSpan = document.getElementById("discountedPrice"); // 如果 HTML 有這一欄
  const orderDetailsInput = document.getElementById("orderDetailsInput");
  const totalAmountInput = document.getElementById("totalAmountInput");
  const submitOrderBtn = document.getElementById("submitOrderBtn");

  // Modal 相關元素
  const cartModal = $("#cartModal");
  const optionsModal = $("#optionsModal");
  const confirmSubmitModal = $("#confirmSubmitModal");
  const modalFormContainer = document.getElementById("modalFormContainer");
  const carouselContainer = document.getElementById("carouselContainer");
  const confirmAddBtn = document.getElementById("confirmAddBtn");
  const submitConfirmBtn = document.getElementById("submitConfirmBtn");
  const orderForm = document.getElementById("orderForm");

  // 4. 冰/熱飲對應的圖片陣列（自行替換為實際路徑）
  const coffeeImages = [
    "img/q2.jpg",
    "img/q3.jpg",
    "img/q4.jpg"
  ];
  const fruitTeaImages = [
    "img/q5.jpg",
    "img/q6.jpg",
    "img/q7.jpg",
    "img/q8.jpg",
    "img/q9.jpg",
  ];

  // ======================
  //  點擊「咖啡」卡片 → 開啟 optionsModal，渲染左表單＋右輪播
  // ======================
  coffeeCard.addEventListener("click", function () {
    selectedDrink = "coffee";
    renderOptionsModal();
    optionsModal.modal("show");
  });

  // ======================
  //  點擊「水果茶」卡片 → 開啟 optionsModal，渲染左表單＋右輪播
  // ======================
  fruitTeaCard.addEventListener("click", function () {
    selectedDrink = "fruitTea";
    renderOptionsModal();
    optionsModal.modal("show");
  });

  // ======================
  // 根據 selectedDrink 動態渲染 optionsModal 左右內容
  // ======================
  function renderOptionsModal() {
    // 4A. 左半：輸入表單
    let formHTML = "";
    if (selectedDrink === "coffee") {
      formHTML = `
        <div class="form-group">
          <label for="coffeeFlavor" class="font-weight-bold">口味：</label>
          <select id="coffeeFlavor" class="form-control">
            <option value="" disabled selected>請選擇口味</option>
            <option value="萊姆口味">萊姆口味</option>
            <option value="蜂蜜口味">蜂蜜口味</option>
            <option value="桂花口味">桂花口味</option>
          </select>
        </div>
        <div class="form-group">
          <label for="drinkQuantity" class="font-weight-bold">數量：</label>
          <input
            type="number"
            id="drinkQuantity"
            class="form-control"
            value="1"
            min="1"
          />
        </div>
      `;
    } else {
      formHTML = `
        <div class="form-group">
          <label for="fruitTeaCombo" class="font-weight-bold">組合：</label>
          <select id="fruitTeaCombo" class="form-control">
            <option value="" disabled selected>請選擇組合</option>
            <option value="美莓組">美莓組</option>
            <option value="顏值組">顏值組</option>
            <option value="白白組">白白組</option>
            <option value="活力組">活力組</option>
            <option value="清潤組">清潤組</option>
          </select>
        </div>
        <div class="form-group">
          <label for="drinkQuantity" class="font-weight-bold">數量：</label>
          <input
            type="number"
            id="drinkQuantity"
            class="form-control"
            value="1"
            min="1"
          />
        </div>
      `;
    }
    modalFormContainer.innerHTML = formHTML;

    // 4B. 右半：輪播圖
    const images = selectedDrink === "coffee" ? coffeeImages : fruitTeaImages;
    let carouselHTML = `
      <div id="modalCarousel" class="carousel slide" data-ride="carousel" data-interval="false">
        <div class="carousel-inner">
    `;
    images.forEach((src, idx) => {
      carouselHTML += `
        <div class="carousel-item${idx === 0 ? " active" : ""}">
          <img src="${src}" class="d-block w-100" alt="第 ${idx + 1} 張">
        </div>
      `;
    });
    carouselHTML += `
        </div>
        <a class="carousel-control-prev" href="#modalCarousel" role="button" data-slide="prev">
          <span class="carousel-control-prev-icon" aria-hidden="true"></span>
          <span class="sr-only">上一張</span>
        </a>
        <a class="carousel-control-next" href="#modalCarousel" role="button" data-slide="next">
          <span class="carousel-control-next-icon" aria-hidden="true"></span>
          <span class="sr-only">下一張</span>
        </a>
      </div>
    `;
    carouselContainer.innerHTML = carouselHTML;

    // 4C. 「確認加入購物車」預設 disabled
    confirmAddBtn.disabled = true;

    // 4D. 綁定表單欄位事件：只要選單或數量改變，就觸發檢查能否啟用 confirmAddBtn
    const selects = modalFormContainer.querySelectorAll("select");
    const qtyInput = document.getElementById("drinkQuantity");

    selects.forEach((sel) => {
      sel.addEventListener("change", checkEnableConfirmBtn);
    });
    qtyInput.addEventListener("input", function () {
      if (parseInt(qtyInput.value) < 1) qtyInput.value = 1;
      checkEnableConfirmBtn();
    });
  }

  // ======================
  // 檢查是否可啟用 Modal 的「確認加入購物車」按鈕
  // ======================
  function checkEnableConfirmBtn() {
    const qtyInput = document.getElementById("drinkQuantity");
    if (!qtyInput) {
      confirmAddBtn.disabled = true;
      return;
    }
    const qty = parseInt(qtyInput.value);
    if (qty < 1) {
      confirmAddBtn.disabled = true;
      return;
    }

    if (selectedDrink === "coffee") {
      const flavor = document.getElementById("coffeeFlavor").value;
      confirmAddBtn.disabled = !(flavor && qty >= 1);
    } else {
      const combo = document.getElementById("fruitTeaCombo").value;
      confirmAddBtn.disabled = !(combo && qty >= 1);
    }
  }

  // ======================
  // Modal 裡按「確認加入購物車」
  // ======================
  confirmAddBtn.addEventListener("click", function () {
    const qty = parseInt(document.getElementById("drinkQuantity").value || "1");
    let item = {
      type: selectedDrink,
      name: selectedDrink === "coffee" ? "咖啡" : "水果茶",
      options: "",
      price: 65,
      quantity: qty,
      subtotal: 65 * qty, // 原始小計
    };

    if (selectedDrink === "coffee") {
      const flavor = document.getElementById("coffeeFlavor").value;
      item.options = `口味：${flavor}`;
    } else {
      const combo = document.getElementById("fruitTeaCombo").value;
      item.options = `組合：${combo}`;
    }

    // 加到 cartArr
    cartArr.push(item);

    // 更新購物車內文 & 隱藏欄位
    renderCart();

    // 關閉 Modal
    optionsModal.modal("hide");
    selectedDrink = null;
  });

  // ======================
  // 點「查看購物車」：開啟 cartModal 
  // ======================
  toggleCartBtn.addEventListener("click", function () {
    renderCart();
    cartModal.modal("show");
  });

  // ======================
  // renderCart(): 把 cartArr 內容渲染到購物車表格，
  // 同時計算「原價總金額」與「折扣後總金額」（只對第一筆品項扣 5 元）
  // ======================
  function renderCart() {
    cartItemsTbody.innerHTML = "";
    let totalQty = 0;

    // 先把 table body 內容清空然後重建
    cartArr.forEach((it, index) => {
      const tr = document.createElement("tr");

      // 原本的 subtotal
      const originalSubtotal = it.subtotal; // it.price * it.quantity

      // 第一筆品項折 5 元，其餘維持原價
      let discountedItemSubtotal = originalSubtotal;
      if (index === 0) {
        discountedItemSubtotal = originalSubtotal - 5;
        if (discountedItemSubtotal < 0) discountedItemSubtotal = 0;
      }

      tr.innerHTML = `
        <td>${it.name}</td>
        <td>${it.options}</td>
        <td>$${it.price}</td>
        <td>${it.quantity}</td>
        <td>$${discountedItemSubtotal}</td>
        <td>
          <button class="btn btn-sm btn-danger delete-btn" data-index="${index}">
            刪除
          </button>
        </td>
      `;
      cartItemsTbody.appendChild(tr);

      totalQty += it.quantity;
    });

    // 計算「原價總金額」和「折扣後總金額」
    let originalTotal = 0;
    let discountedTotal = 0;
    cartArr.forEach((it, idx) => {
      const orig = it.subtotal;
      originalTotal += orig;

      if (idx === 0) {
        let firstSub = orig - 5;
        if (firstSub < 0) firstSub = 0;
        discountedTotal += firstSub;
      } else {
        discountedTotal += orig;
      }
    });

    // 如果沒有任何品項，兩邊都設為 0
    if (cartArr.length === 0) {
      originalTotal = 0;
      discountedTotal = 0;
    }

    // 把「原價總金額」顯示到 totalPriceTd
    totalQuantityTd.textContent = totalQty;
    totalPriceTd.textContent = `$${originalTotal}`;

    // 把「折扣後總金額」顯示到對應的欄位 (如果 HTML 有一欄顯示折後價)
    if (discountedPriceSpan) {
      discountedPriceSpan.textContent = `$${discountedTotal}`;
    }

    // 更新隱藏的訂單明細與送給後端的金額 (用折扣後總金額)
    let detailsStr = "";
    cartArr.forEach((it, idx) => {
      const orig = it.subtotal;
      let sub = orig;
      if (idx === 0) {
        sub = orig - 5;
        if (sub < 0) sub = 0;
      }
      detailsStr += `${idx + 1}. ${it.name} - ${it.options} - 數量：${it.quantity} - 小計：${sub} 元\n`;
    });
    orderDetailsInput.value = detailsStr;
    totalAmountInput.value = discountedTotal;

    // 啟用 / 禁用「送出訂單」按鈕
    submitOrderBtn.disabled = cartArr.length === 0;

    // 綁定「刪除按鈕」，刪掉後再重新渲染
    const deleteButtons = cartItemsTbody.querySelectorAll(".delete-btn");
    deleteButtons.forEach((btn) => {
      btn.addEventListener("click", function () {
        const idx = parseInt(btn.getAttribute("data-index"));
        cartArr.splice(idx, 1); // 從陣列移除
        renderCart();           // 重新渲染
      });
    });
  }

  // ======================
  // 表單 submit 時，先跳出「確認送出」Modal
  // ======================
  orderForm.addEventListener("submit", function (e) {
    e.preventDefault();
    confirmSubmitModal.modal("show");
  });

  // ======================
  // 點「是」後真實提交表單；點「否」只關閉確認 Modal
  // ======================
  submitConfirmBtn.addEventListener("click", function () {
    // 先把「確認送出」Modal 隱藏
    confirmSubmitModal.modal("hide");
    // 再執行真正的表單送出
    orderForm.submit();
  });

  // ======================
  // 初始：一進頁面先隱藏 購物車與「送出」按鈕
  // ======================
  cartModal.modal({ show: false });
  optionsModal.modal({ show: false });
  confirmSubmitModal.modal({ show: false });
  submitOrderBtn.disabled = true;
});
