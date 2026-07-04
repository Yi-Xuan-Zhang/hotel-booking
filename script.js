/* =========================
   房型資料 — 以台灣風景命名
========================= */
const rooms = [
    {
        id: 1,
        name: "日月潭映景雙人房",
        price: 3200,
        maxGuest: 2,
        rating: 4.7,
        badge: "熱門房型",
        amenities: ["免費Wi-Fi", "潭景意象牆", "免治馬桶"],
        image: "https://loremflickr.com/500/300/sunmoonlake,room?lock=11",
        description: "以日月潭的湖光山色為靈感，舒適雙人房提供沉靜的城市景觀與高級備品，適合想把行程留白的兩人時光。",
        localTip: "推薦傍晚到附近步道走走，回房前櫃檯常備一壺熱薑茶等你。"
    },
    {
        id: 2,
        name: "九份山城家庭房",
        price: 5200,
        maxGuest: 4,
        rating: 4.8,
        badge: "親子友善",
        amenities: ["雙床房型", "備品加大", "免費早餐"],
        image: "https://loremflickr.com/500/300/jiufen,room?lock=12",
        description: "靈感來自九份的紅燈籠與老街人情，空間寬敞並附贈早餐，帶長輩、小孩同行都自在安心。",
        localTip: "老街晚上七點後遊客變少，是散步拍照、吃芋圓的最佳時機。"
    },
    {
        id: 3,
        name: "太魯閣峽谷商務套房",
        price: 4500,
        maxGuest: 3,
        rating: 4.6,
        badge: null,
        amenities: ["獨立工作區", "快速退房", "迷你吧"],
        image: "https://loremflickr.com/500/300/taroko,room?lock=13",
        description: "如峽谷般俐落沉穩的空間規劃，提供獨立工作區與快速退房服務，商務旅人也能保有片刻寧靜。",
        localTip: "山區步道偶有臨時封閉，入住當天管家會主動更新最新開放資訊。"
    },
    {
        id: 4,
        name: "阿里山日出總統套房",
        price: 9800,
        maxGuest: 6,
        rating: 4.9,
        badge: "尊爵臻選",
        amenities: ["管家服務", "私人陽台", "夜景視野"],
        image: "https://loremflickr.com/500/300/alishan,room?lock=14",
        description: "頂級住宿體驗，專屬管家與私人陽台，如阿里山日出般值得早起守候的城市夜景。",
        localTip: "想追日出記得提前登記叫醒服務，管家會親自敲門確認你已醒來。"
    }
];

/* =========================
   DOM
========================= */

const roomList = document.querySelector("#roomList");
const guestCount = document.querySelector("#guestCount");
const guestLabel = document.querySelector("#guestLabel");

const checkIn = document.querySelector("#checkIn");
const checkOut = document.querySelector("#checkOut");
const searchBtn = document.querySelector("#searchBtn");

const modal = document.querySelector("#modal");
const successModal = document.querySelector("#successModal");
const successText = document.querySelector("#successText");

const roomDetailModal = document.querySelector("#roomDetailModal");
const bookingModal = document.querySelector("#bookingModal");
const viewBookingBtn = document.querySelector("#viewBookingBtn");

let currentRoom = null;
let detailRoom = null;

/* =========================
   日期限制
========================= */

const today = new Date().toISOString().split("T")[0];
checkIn.min = today;
checkOut.min = today;

checkIn.addEventListener("change", () => {
    checkOut.min = checkIn.value;
    validateDate();
});

/* =========================
   計算天數
========================= */

function getStayDays() {
    const start = new Date(checkIn.value);
    const end = new Date(checkOut.value);

    return Math.ceil((end - start) / (1000 * 60 * 60 * 24));
}

/* =========================
   日期驗證
========================= */

function validateDate() {
    if (
        checkIn.value && checkOut.value && checkOut.value <= checkIn.value
    ) {
        alert("退房日期必須晚於入住日期");
        checkOut.value = "";
        return false;
    }

    return true;
}

checkOut.addEventListener("change", validateDate);

/* =========================
   房型渲染（明信片卡片）
========================= */

function renderRooms() {
    roomList.innerHTML = "";
    const guests = Number(guestCount.value);

    guestLabel.textContent = `${guests} 位旅客`;
    const filteredRooms = rooms.filter(room => room.maxGuest >= guests);

    if (!filteredRooms.length) {
        roomList.innerHTML = `<div class="empty-msg">沒有符合條件房型，試試調整入住人數</div>`;
        return;
    }

    filteredRooms.forEach(room => {
        const amenities = room.amenities
            .map(item => `<span class="amenity-tag">${item}</span>`)
            .join("");

        const badge = room.badge
            ? `<div class="room-badge">${room.badge}</div>`
            : "";

        roomList.innerHTML += `
        <div class="room-card">
            ${badge}
            <img src="${room.image}" alt="${room.name}">
            <h3>${room.name}</h3>
            <div class="room-meta">
                <span>⭐ ${room.rating}</span>
                <span>最多入住 ${room.maxGuest} 人</span>
            </div>
            <div class="amenity-row">${amenities}</div>
            <div class="room-price"><strong>NT$${room.price.toLocaleString()}</strong><span>/ 晚</span></div>
            <div class="room-actions">
                <button class="detail-btn" data-id="${room.id}">查看詳情</button>
                <button class="book-btn" data-id="${room.id}">立即預訂</button>
            </div>
        </div>
        `;
    });
}

renderRooms();

guestCount.addEventListener("change", renderRooms);

/* =========================
   查詢空房
========================= */
searchBtn.addEventListener("click", () => {
    if (!validateDate()) return;

    document.querySelector("#rooms").scrollIntoView({ behavior: "smooth" });
});

/* =========================
   房型詳情（登機證彈窗）
========================= */

roomList.addEventListener("click", e => {
    const detailBtn = e.target.closest(".detail-btn");
    if (detailBtn) {
        openRoomDetail(Number(detailBtn.dataset.id));
        return;
    }

    const bookBtn = e.target.closest(".book-btn");
    if (bookBtn) {
        openModal(Number(bookBtn.dataset.id));
    }
});

function openRoomDetail(roomId) {
    detailRoom = rooms.find(room => room.id === roomId);
    if (!detailRoom) return;

    document.querySelector("#roomDetailImage").src = detailRoom.image;
    document.querySelector("#roomDetailImage").alt = detailRoom.name;
    document.querySelector("#roomDetailName").textContent = detailRoom.name;
    document.querySelector("#roomDetailDescription").textContent = detailRoom.description;
    document.querySelector("#roomDetailAmenities").innerHTML = detailRoom.amenities
        .map(item => `<span class="amenity-tag">${item}</span>`)
        .join("");
    document.querySelector("#roomDetailLocalTip").textContent = detailRoom.localTip;
    document.querySelector("#roomDetailRating").textContent = `⭐ ${detailRoom.rating}`;
    document.querySelector("#roomDetailGuest").textContent = `最多 ${detailRoom.maxGuest} 人`;
    document.querySelector("#roomDetailPrice").innerHTML =
        `NT$${detailRoom.price.toLocaleString()} <small>/ 晚</small>`;

    roomDetailModal.style.display = "flex";
}

document.querySelector("#closeRoomDetail").onclick = () => {
    roomDetailModal.style.display = "none";
};

document.querySelector("#passBookBtn").onclick = () => {
    if (!detailRoom) return;
    roomDetailModal.style.display = "none";
    openModal(detailRoom.id);
};

roomDetailModal.addEventListener("click", e => {
    if (e.target === roomDetailModal) roomDetailModal.style.display = "none";
});

/* =========================
   開啟預訂
========================= */

function openModal(roomId) {

    if (!checkIn.value || !checkOut.value) {
        alert("請先選擇入住日期");
        return;
    }
    if (!validateDate()) return;

    currentRoom = rooms.find(room => room.id === roomId);

    const days = getStayDays();
    const total = days * currentRoom.price;

    document.querySelector("#detailRoom").innerHTML = `房型：${currentRoom.name}`;
    document.querySelector("#detailDate").innerHTML = `日期：${checkIn.value} ~ ${checkOut.value}`;
    document.querySelector("#detailDays").innerHTML = `住宿天數：${days} 晚`;
    document.querySelector("#detailGuest").innerHTML = `入住人數：${guestCount.value} 人`;
    document.querySelector("#detailPrice").innerHTML = `總價：NT$${total.toLocaleString()}`;

    modal.style.display = "flex";
}

/* =========================
   關閉視窗
========================= */

document.querySelector("#cancelBtn").onclick = () => modal.style.display = "none";

modal.addEventListener("click", e => {
    if (e.target === modal) modal.style.display = "none";
});

/* =========================
   確認預訂
========================= */

document.querySelector("#confirmBtn").onclick = () => {

    const days = getStayDays();
    const total = days * currentRoom.price;

    const booking = {
        orderId: "OD" + Date.now(),
        room: currentRoom.name,
        roomId: currentRoom.id,
        guest: guestCount.value,
        checkIn: checkIn.value,
        checkOut: checkOut.value,
        days, total,
        image: currentRoom.image,
        createdAt: new Date().toLocaleString()
    };

    const bookings = JSON.parse(localStorage.getItem("bookings")) || [];
    bookings.push(booking);

    localStorage.setItem("bookings", JSON.stringify(bookings));
    localStorage.setItem("latestBooking", JSON.stringify(booking));

    modal.style.display = "none";

    successText.innerHTML = `
    訂單編號： ${booking.orderId}<br><br>
    房型： ${booking.room}<br>
    入住日期： ${booking.checkIn}<br>
    退房日期： ${booking.checkOut}<br>
    住宿： ${booking.days} 晚<br>
    總金額： NT$${booking.total.toLocaleString()}
    `;

    successModal.style.display = "flex";
    renderBookings();
};

/* =========================
   完成
========================= */
document.querySelector("#finishBtn").onclick = () => {
    successModal.style.display = "none";

    checkIn.value = "";
    checkOut.value = "";
    guestCount.value = 2;

    renderRooms();
};

/* =========================
   我的預訂頁面
========================= */

viewBookingBtn.addEventListener("click", () => {
    renderBookings();
    bookingModal.style.display = "flex";
});

document.querySelector("#closeBookingModal").onclick = () => {
    bookingModal.style.display = "none";
};

bookingModal.addEventListener("click", e => {
    if (e.target === bookingModal) bookingModal.style.display = "none";
});

function renderBookings() {

    const container = document.querySelector("#bookingList");
    if (!container) return;

    const bookings = JSON.parse(localStorage.getItem("bookings")) || [];

    if (!bookings.length) {
        container.innerHTML = "<p style='color:var(--ink-60);text-align:center;padding:20px 0;'>尚無訂房紀錄</p>";
        return;
    }

    container.innerHTML = bookings
        .map(booking => `
            <div class="booking-card">
                <img src="${booking.image}" alt="${booking.room}">
                <div>
                    <h3>${booking.room}</h3>
                    <p>訂單：${booking.orderId}</p>
                    <p>${booking.checkIn} ~ ${booking.checkOut}（${booking.days} 晚）</p>
                    <p>NT$${booking.total.toLocaleString()}</p>
                </div>
                <button onclick="deleteBooking('${booking.orderId}')">取消訂單</button>
            </div>
        `)
        .join("");
}

/* =========================
   刪除訂單
========================= */

function deleteBooking(id) {

    let bookings = JSON.parse(localStorage.getItem("bookings")) || [];
    bookings = bookings.filter(booking => booking.orderId !== id);

    localStorage.setItem("bookings", JSON.stringify(bookings));

    renderBookings();
}

/* =========================
   Header 滾動陰影
========================= */

const siteHeader = document.querySelector("#siteHeader");

window.addEventListener("scroll", () => {
    if (!siteHeader) return;

    siteHeader.style.boxShadow = window.scrollY > 10
        ? "0 6px 20px rgba(22,48,46,.12)"
        : "none";
});

/* =========================
   頁面載入
========================= */

renderBookings();