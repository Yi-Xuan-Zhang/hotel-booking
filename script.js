/* =========================
   房型資料
========================= */
const rooms = [
    {
        id: 1,
        name: "豪華雙人房",
        price: 3200,
        maxGuest: 2,
        rating: 4.7,
        badge: "熱門",
        amenities: ["免費Wi-Fi", "市景", "免治馬桶"],
        image: "https://picsum.photos/500/300?room1",
        description:
            "舒適雙人房，提供城市景觀與高級備品。"
    },
    {
        id: 2,
        name: "家庭四人房",
        price: 5200,
        maxGuest: 4,
        rating: 4.8,
        badge: "親子友善",
        amenities: ["雙床房型", "備品加大", "免費早餐"],
        image: "https://picsum.photos/500/300?room2",
        description:
            "適合親子家庭入住，附贈早餐。"
    },
    {
        id: 3,
        name: "商務套房",
        price: 4500,
        maxGuest: 3,
        rating: 4.6,
        badge: null,
        amenities: ["獨立工作區", "快速退房", "迷你吧"],
        image: "https://picsum.photos/500/300?room3",
        description:
            "商務旅客最佳選擇，提供工作空間。"
    },
    {
        id: 4,
        name: "總統套房",
        price: 9800,
        maxGuest: 6,
        rating: 4.9,
        badge: "尊爵",
        amenities: ["管家服務", "私人陽台", "夜景視野"],
        image: "https://picsum.photos/500/300?room4",
        description:
            "頂級住宿體驗，享受專屬服務。"
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

let currentRoom = null;

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
   房型渲染
========================= */

function renderRooms() {
    roomList.innerHTML = "";
    const guests = Number(guestCount.value);

    guestLabel.textContent = `${guests} 位旅客`;
    const filteredRooms =
        rooms.filter(
            room => room.maxGuest >= guests
        );

    if (!filteredRooms.length) {
        roomList.innerHTML =
            `<div class="empty-msg">
                沒有符合條件房型
            </div>`;
        return;
    }

    filteredRooms.forEach(room => {
        const amenities =
            room.amenities
                .map(item =>
                    `<span class="amenity-tag">${item}</span>`)
                .join("");

        roomList.innerHTML += `
        <div class="room-card">
            <img src="${room.image}">
            <h3>${room.name}</h3>
            <p>⭐ ${room.rating}</p>
            <p>最多入住 ${room.maxGuest} 人</p>
            <div>${amenities}</div>
            <h4>NT$${room.price.toLocaleString()}/ 晚</h4>
            <button class="detail-btn"
                data-id="${room.id}">查看詳情</button>
            <button class="book-btn" data-id="${room.id}">立即預訂</button>
        </div>
        `;
    });
}

renderRooms();

guestCount.addEventListener(
    "change",
    renderRooms
);

/* =========================
   查詢空房
========================= */
searchBtn.addEventListener(
    "click",
    () => {
        if (!validateDate())
            return;

        document.querySelector("#rooms").scrollIntoView({
            behavior: "smooth"
        });
    }
);

/* =========================
   房型詳情
========================= */

roomList.addEventListener(
    "click",
    e => {
        const detail =
            e.target.closest(
                ".detail-btn");

        if (detail) {
            const room = rooms.find(
                r =>
                    r.id == detail.dataset.id
            );

            alert(
                `${room.name}
                ${room.description}
                設施：${room.amenities.join("、")}
                價格：NT$${room.price.toLocaleString()}/晚`
            );
            return;
        }
        const book = e.target.closest(".book-btn");

        if (book) {
            openModal(Number(
                book.dataset.id)
            );
        }
    }
);

/* =========================
   開啟預訂
========================= */

function openModal(roomId) {

    if (
        !checkIn.value || !checkOut.value
    ) {
        alert(
            "請先選擇入住日期"
        );
        return;
    }

    currentRoom =
        rooms.find(
            room =>
                room.id === roomId
        );

    const days =
        getStayDays();

    const total =
        days *
        currentRoom.price;

    document.querySelector(
        "#detailRoom"
    ).innerHTML =
        `房型：${currentRoom.name}`;

    document.querySelector(
        "#detailDate"
    ).innerHTML =
        `日期：${checkIn.value} ~ ${checkOut.value}`;

    document.querySelector(
        "#detailDays"
    ).innerHTML =
        `住宿天數：${days} 晚`;

    document.querySelector(
        "#detailGuest"
    ).innerHTML =
        `入住人數：${guestCount.value} 人`;

    document.querySelector(
        "#detailPrice"
    ).innerHTML =
        `總價：NT$${total.toLocaleString()}`;

    modal.style.display =
        "flex";
}

/* =========================
   關閉視窗
========================= */

document.querySelector(
    "#cancelBtn"
).onclick = () =>
        modal.style.display =
        "none";

/* =========================
   確認預訂
========================= */

document.querySelector(
    "#confirmBtn"
).onclick = () => {

    const days =
        getStayDays();

    const total =
        days *
        currentRoom.price;

    const booking = {
        orderId:
            "OD" +
            Date.now(),

        room: currentRoom.name,
        roomId: currentRoom.id,
        guest: guestCount.value,
        checkIn: checkIn.value,
        checkOut: checkOut.value,
        days, total,
        image: currentRoom.image,
        createdAt: new Date().toLocaleString()
    };

    const bookings =
        JSON.parse(
            localStorage.getItem(
                "bookings"
            )
        ) || [];

    bookings.push(
        booking
    );

    localStorage.setItem(
        "bookings",
        JSON.stringify(
            bookings
        )
    );

    localStorage.setItem(
        "latestBooking",
        JSON.stringify(
            booking
        )
    );

    modal.style.display =
        "none";

    successText.innerHTML = ` 
    訂單編號： ${booking.orderId}<br><br>
    房型： ${booking.room}<br>
    入住日期： ${booking.checkIn}<br>
    退房日期： ${booking.checkOut}<br>
    住宿： ${booking.days} 晚<br>
    總金額： NT$${booking.total.toLocaleString()}
    `;

    successModal.style.display = "flex";
};

/* =========================
   完成
========================= */
document.querySelector(
    "#finishBtn"
).onclick = () => {
    successModal.style.display = "none";

    checkIn.value = "";
    checkOut.value = "";
    guestCount.value = 2;

    renderRooms();
};

/* =========================
   查看最新訂單
========================= */

function viewLatestBooking() {
    const booking =
        JSON.parse(
            localStorage.getItem(
                "latestBooking")
        );

    if (!booking) {
        alert(
            "目前沒有訂單");
        return;
    }

    alert(
        `訂單編號：${booking.orderId}
        房型：${booking.room}
        入住：${booking.checkIn}
        退房：${booking.checkOut}
        總金額：NT$${booking.total.toLocaleString()}`
    );
}

/* =========================
   我的預訂頁面
========================= */

function renderBookings() {

    const container =
        document.querySelector("#bookingList");

    if (!container)
        return;

    const bookings =
        JSON.parse(
            localStorage.getItem(
                "bookings"
            )
        ) || [];

    if (!bookings.length) {
        container.innerHTML = "<p>尚無訂房紀錄</p>";
        return;
    }

    container.innerHTML =
        bookings
            .map(
                booking => `
                <div class="booking-card">
                <img src="${booking.image}">
                <h3>${booking.room}</h3>
                <p>訂單：${booking.orderId}</p>
                <p>${booking.checkIn}~${booking.checkOut}</p>
                <p>${booking.days} 晚</p>
                <p> NT$${booking.total.toLocaleString()}</p>
                <button
                onclick="deleteBooking('${booking.orderId}')">取消訂單</button>
        </div>
        `
            )
            .join("");
}

/* =========================
   刪除訂單
========================= */

function deleteBooking(id) {

    let bookings =
        JSON.parse(
            localStorage.getItem(
                "bookings"
            )
        ) || [];

    bookings =
        bookings.filter(
            booking =>
                booking.orderId !==
                id
        );

    localStorage.setItem(
        "bookings",
        JSON.stringify(
            bookings
        )
    );

    renderBookings();
}

/* =========================
   Header
========================= */

const siteHeader =
    document.querySelector(
        "#siteHeader"
    );

window.addEventListener(
    "scroll",
    () => {

        if (!siteHeader)
            return;

        siteHeader.style.boxShadow =
            window.scrollY > 10
                ? "0 2px 12px rgba(0,0,0,.15)"
                : "none";
    }
);

/* =========================
   頁面載入
========================= */

renderBookings();