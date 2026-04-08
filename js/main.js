document.addEventListener("DOMContentLoaded", () => {
  // 1. COUNTDOWN TIMER logic
  const targetDate = new Date("2026-04-11T19:00:00+07:00").getTime();

  const daysEl = document.getElementById("cd-days");
  const hoursEl = document.getElementById("cd-hours");
  const minutesEl = document.getElementById("cd-minutes");
  const secondsEl = document.getElementById("cd-seconds");

  function updateCountdown() {
    const now = new Date().getTime();
    const distance = targetDate - now;

    if (distance < 0) {
      daysEl.innerText = "00";
      hoursEl.innerText = "00";
      minutesEl.innerText = "00";
      secondsEl.innerText = "00";
      return;
    }

    const days = Math.floor(distance / (1000 * 60 * 60 * 24));
    const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((distance % (1000 * 60)) / 1000);

    daysEl.innerText = days.toString().padStart(2, "0");
    hoursEl.innerText = hours.toString().padStart(2, "0");
    minutesEl.innerText = minutes.toString().padStart(2, "0");
    secondsEl.innerText = seconds.toString().padStart(2, "0");
  }

  // Cập nhật mỗi giây
  setInterval(updateCountdown, 1000);
  updateCountdown();

  // 2. SCROLL ANIMATION (Intersection Observer cho class fade-in)
  const fadeElements = document.querySelectorAll('.fade-in');
  
  const appearOptions = {
    threshold: 0.15,
    rootMargin: "0px 0px -50px 0px"
  };

  const appearOnScroll = new IntersectionObserver(function(entries, observer) {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      entry.target.classList.add('is-visible');
      observer.unobserve(entry.target);
    });
  }, appearOptions);

  fadeElements.forEach(el => {
    appearOnScroll.observe(el);
  });

  // 3. BACKGROUND MUSIC LOGIC
  const welcomeBtn = document.getElementById("guest-welcome");
  const bgMusic = document.getElementById("bg-music");
  let isPlaying = false;

  if(welcomeBtn && bgMusic) {
    welcomeBtn.addEventListener("click", () => {
      if(!isPlaying) {
        bgMusic.play().then(() => {
          isPlaying = true;
          welcomeBtn.innerHTML = "✦ Âm nhạc đang phát ✦";
          showToast("🎵 Đã bật nhạc nền sự kiện!");
          
          // Tự động cuộn xuống phần nội dung chính
          document.getElementById('main-content').scrollIntoView({ behavior: 'smooth' });
        }).catch(err => {
          console.log("Trình duyệt chặn tự động phát nhạc:", err);
          showToast("Trình duyệt của bạn đang chặn phát nhạc tự động.");
        });
      }
    });
  }
});

// 4. ADD TO CALENDAR FUNCTION
function addToCalendar() {
  // Tạo link Google Calendar tự động điền thông tin sự kiện
  const title = encodeURIComponent("CCV Birthday Party");
  const details = encodeURIComponent("Birthday invitation for the Vinh University Youth Union Media Team");
  const location = encodeURIComponent("Duy Tan Hotel, Vinh City, Vietnam");
  
  // Format thời gian: YYYYMMDDTHHMMSSZ
  const startDate = "20260411T120000Z"; // Đã convert giờ UTC (19:00 +07:00 = 12:00 UTC)
  const endDate = "20260411T150000Z"; // Giả định kết thúc lúc 22:00 (+07:00) = 15:00 UTC

  const googleCalendarUrl = `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${title}&dates=${startDate}/${endDate}&details=${details}&location=${location}`;
  
  window.open(googleCalendarUrl, '_blank');
}

// 5. TOAST NOTIFICATION FUNCTION
function showToast(message) {
  const toast = document.getElementById("toast");
  if(toast) {
    toast.innerText = message;
    toast.className = "toast show";
    setTimeout(function(){ 
      toast.className = toast.className.replace("show", ""); 
    }, 3000);
  }
}
// ==========================================
  // IMAGE SLIDER LOGIC
  // ==========================================
  const track = document.getElementById('carousel-track');
  const prevBtn = document.getElementById('carousel-prev');
  const nextBtn = document.getElementById('carousel-next');
  const indicators = document.querySelectorAll('.indicator');
  
  if(track && prevBtn && nextBtn) {
    let currentIndex = 0;
    const slides = Array.from(track.children);
    const slideCount = slides.length;
    let slideInterval;

    // Hàm cập nhật vị trí trượt và dấu chấm
    function updateSlider(index) {
      track.style.transform = `translateX(-${index * 100}%)`;
      indicators.forEach(ind => ind.classList.remove('active'));
      if(indicators[index]) indicators[index].classList.add('active');
      currentIndex = index;
    }

    // Sang ảnh tiếp theo
    function nextSlide() {
      let nextIndex = (currentIndex + 1) % slideCount;
      updateSlider(nextIndex);
    }

    // Lùi lại ảnh trước
    function prevSlide() {
      let prevIndex = (currentIndex - 1 + slideCount) % slideCount;
      updateSlider(prevIndex);
    }

    // Lắng nghe sự kiện click nút
    nextBtn.addEventListener('click', () => {
      nextSlide();
      resetInterval(); // Bấm tay thì khởi động lại bộ đếm thời gian
    });

    prevBtn.addEventListener('click', () => {
      prevSlide();
      resetInterval();
    });

    // Lắng nghe sự kiện click vào dấu chấm
    indicators.forEach((indicator, i) => {
      indicator.addEventListener('click', () => {
        updateSlider(i);
        resetInterval();
      });
    });

    // Tự động chuyển slide sau 4 giây (4000ms)
    function startInterval() {
      slideInterval = setInterval(nextSlide, 4000);
    }

    function resetInterval() {
      clearInterval(slideInterval);
      startInterval();
    }

    // Bắt đầu chạy tự động
    startInterval();
  }