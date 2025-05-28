document.addEventListener('DOMContentLoaded', () => {
    const setupFormHandler = (formId, subject) => {
      const form = document.getElementById(formId);
      if (!form) return;
  
      form.addEventListener('submit', async function (e) {
        e.preventDefault();
        if (!form.checkValidity()) {
          form.reportValidity();
          return;
        }
  
        const data = new FormData(form);
        data.set('_subject', subject);
  
        try {
          const resp = await fetch(form.action, {
            method: 'POST',
            body: data,
            headers: { 'Accept': 'application/json' }
          });
          const json = await resp.json();
  
          if (resp.ok) {
            form.reset();
            $('#thankYouModal').modal('show');
            setTimeout(() => $('#thankYouModal').modal('hide'), 3000);
          } else {
            alert(json.error || '送出失敗，請稍後再試');
          }
        } catch (err) {
          console.error(err);
          alert('連線錯誤，請稍後再試');
        }
      });
    };
  
    // 處理「折扣碼表單」
    setupFormHandler('offerForm', '新的折扣碼報名');
  
    // 處理「訂購表單」
    setupFormHandler('reservationForm', '新的訂購需求');
  });
  