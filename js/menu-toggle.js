document.addEventListener("DOMContentLoaded", function () {
    const items = document.querySelectorAll(".inline-detail");
  
    items.forEach(item => {
      const summary = item.querySelector(".summary");
      summary.addEventListener("click", function (e) {
        e.stopPropagation();
  
        // 關閉其他已展開的項目
        items.forEach(other => {
          if (other !== item) other.classList.remove("open");
        });
  
        // 切換當前項目
        item.classList.toggle("open");
      });
    });
  
    // 點其他地方時自動關閉
    document.addEventListener("click", function () {
      items.forEach(item => item.classList.remove("open"));
    });
  });
  