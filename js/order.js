document.addEventListener("DOMContentLoaded", function () {
  let cartArr = [];
  let selectedDrink = null;

  const coffeeCard = document.getElementById("coffeeCard");
  const fruitTeaCard = document.getElementById("fruitTeaCard");
  const toggleCartBtn = document.getElementById("toggleCartBtn");
  const cartItemsTbody = document.getElementById("cartItems");
  const totalQuantityTd = document.getElementById("totalQuantity");
  const totalPriceTd = document.getElementById("totalPrice");
  const discountedText = document.getElementById("discountedText");
  const discountedAmountSpan = document.getElementById("discountedAmount");
  const orderDetailsInput = document.getElementById("orderDetailsInput");
  const totalAmountInput = document.getElementById("totalAmountInput");
  const submitOrderBtn = document.getElementById("submitOrderBtn");

  const cartModal = $("#cartModal");
  const optionsModal = $("#optionsModal");
  const confirmSubmitModal = $("#confirmSubmitModal");
  const modalFormContainer = document.getElementById("modalFormContainer");
  const carouselContainer = document.getElementById("carouselContainer");
  const confirmAddBtn = document.getElementById("confirmAddBtn");
  const submitConfirmBtn = document.getElementById("submitConfirmBtn");
  const orderForm = document.getElementById("orderForm");

  const coffeeImages = ["img/q2.jpg","img/q3.jpg","img/q4.jpg"];
  const fruitTeaImages = ["img/q5.jpg","img/q6.jpg","img/q7.jpg","img/q8.jpg","img/q9.jpg"];

  // 點咖啡
  coffeeCard.addEventListener("click", function () {
    selectedDrink = "coffee";
    renderOptionsModal();
    optionsModal.modal("show");
  });

  // 點水果茶
  fruitTeaCard.addEventListener("click", function () {
    selectedDrink = "fruitTea";
    renderOptionsModal();
    optionsModal.modal("show");
  });

  // 動態渲染 Modal 內容（左：表單；右：輪播）
  function renderOptionsModal() {
    let formHTML = "";
    if (selectedDrink === "coffee") {
      // 已經去掉烘焙度，只保留口味與數量
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
          <input type="number" id="drinkQuantity" class="form-control" value="1" min="1" />
        </div>
      `;
    } else {
      // 水果茶表單保持不變
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
          <input type="number" id="drinkQuantity" class="form-control" value="1" min="1" />
        </div>
      `;
    }
    modalFormContainer.innerHTML = formHTML;

    // 右側輪播不動
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

    confirmAddBtn.disabled = true;

    // 只綁定「口味」或「組合」 + 數量的事件，不再有烘焙度
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
      // 只檢查 flavor，不再檢查 roast
      confirmAddBtn.disabled = !(flavor && qty >= 1);
    } else {
      const combo = document.getElementById("fruitTeaCombo").value;
      confirmAddBtn.disabled = !(combo && qty >= 1);
    }
  }

  // Modal 「確認加入購物車」也要改成只讀 flavor
  confirmAddBtn.addEventListener("click", function () {
    const qty = parseInt(document.getElementById("drinkQuantity").value || "1");
    let item = {
      type: selectedDrink,
      name: selectedDrink === "coffee" ? "咖啡" : "水果茶",
      options: "",
      price: 65,
      quantity: qty,
      subtotal: 65 * qty,
    };

    if (selectedDrink === "coffee") {
      // 只讀 coffeeFlavor
      const flavor = document.getElementById("coffeeFlavor").value;
      item.options = `口味：${flavor}`;
    } else {
      const combo = document.getElementById("fruitTeaCombo").value;
      item.options = `組合：${combo}`;
    }

    cartArr.push(item);
    renderCart();
    optionsModal.modal("hide");
    selectedDrink = null;
  });

  // 「查看購物車」開 cartModal 不變
  toggleCartBtn.addEventListener("click", function () {
    renderCart();
    cartModal.modal("show");
  });

  function renderCart() {
    cartItemsTbody.innerHTML = "";
    let totalQty = 0;
    let totalAmt = 0;

    cartArr.forEach((it, index) => {
      const tr = document.createElement("tr");
      tr.innerHTML = `
        <td>${it.name}</td>
        <td>${it.options}</td>
        <td>$${it.price}</td>
        <td>${it.quantity}</td>
        <td>$${it.subtotal}</td>
        <td>
          <button class="btn btn-sm btn-danger delete-btn" data-index="${index}">
            刪除
          </button>
        </td>
      `;
      cartItemsTbody.appendChild(tr);
      totalQty += it.quantity;
      totalAmt += it.subtotal;
    });

    totalQuantityTd.textContent = totalQty;
    totalPriceTd.textContent = `$${totalAmt}`;

    // ===== 加入折扣顯示，固定扣 5 元 =====
    if (totalAmt > 0) {
      const discountedTotal = totalAmt - 5;
      discountedAmountSpan.textContent = discountedTotal;
      discountedText.style.display = "block";
    } else {
      discountedText.style.display = "none";
    }

    let detailsStr = "";
    cartArr.forEach((it, idx) => {
      detailsStr += `${idx + 1}. ${it.name} - ${it.options} - 數量：${it.quantity} - 小計：${it.subtotal} 元\n`;
    });
    orderDetailsInput.value = detailsStr;
    totalAmountInput.value = totalAmt;

    submitOrderBtn.disabled = cartArr.length === 0;

    const deleteButtons = cartItemsTbody.querySelectorAll(".delete-btn");
    deleteButtons.forEach((btn) => {
      btn.addEventListener("click", function () {
        const idx = parseInt(btn.getAttribute("data-index"));
        cartArr.splice(idx, 1);
        renderCart();
      });
    });
  }

  orderForm.addEventListener("submit", function (e) {
    e.preventDefault();
    confirmSubmitModal.modal("show");
  });

  submitConfirmBtn.addEventListener("click", function () {
    orderForm.submit();
  });

  cartModal.modal({ show: false });
  optionsModal.modal({ show: false });
  confirmSubmitModal.modal({ show: false });
  submitOrderBtn.disabled = true;
});
