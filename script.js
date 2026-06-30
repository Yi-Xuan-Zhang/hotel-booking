/* =========================
   房型資料
========================= */
const rooms = [
    {
        id: 1,
        name: "豪華雙人房",
        price: 3200,
        maxGuest: 2,
        image: "https://picsum.photos/500/300?1"
    },
    {
        id: 2,
        name: "家庭四人房",
        price: 5200,
        maxGuest: 4,
        image: "https://picsum.photos/500/300?2"
    },
    {
        id: 3,
        name: "商務套房",
        price: 4500,
        maxGuest: 3,
        image: "https://picsum.photos/500/300?3"
    },
    {
        id: 4,
        name: "總統套房",
        price: 9800,
        maxGuest: 6,
        image: "https://picsum.photos/500/300?4"
    }
];

const roomList = document.querySelector("#roomList");
const guestCount = document.querySelector("#guestCount");

const checkIn = document.querySelector("#checkIn");
const checkOut = document.querySelector("#checkOut");

const modal = document.querySelector("#modal");
const successModal = document.querySelector("#successModal");
const successText = document.querySelector("#successText");

let currentRoom = null;

/* =========================
   房型渲染
========================= */

function renderRooms() {

    roomList.innerHTML = "";
    const guests = Number(guestCount.value);
    const filteredRooms = rooms.filter(room =>
        room.maxGuest >= guests
    );

    if (filteredRooms.length === 0) {
        roomList.innerHTML =
            `<div class="empty-msg">
                        找不到符合條件的房型
                    </div>`;
        return;
    }

    filteredRooms.forEach(room => {

        roomList.innerHTML += `
                <div class="room-card">
                    <img src="${room.image}">
                    <div class="room-info">
                        <h3>${room.name}</h3>
                        <p>💰 每晚 NT$${room.price}</p>
                        <p>👤 人數上限 ${room.maxGuest} 人</p>
                        <button
                            class="book-btn"
                            onclick="openModal(${room.id})">立即預訂
                        </button>
                    </div>
                </div>
                `;
    });
}
renderRooms();

/* =========================
   即時篩選
========================= */
guestCount.addEventListener("change", renderRooms);
/* =========================
   日期驗證
========================= */
function validateDate() {

    if (
        checkIn.value && checkOut.value && checkOut.value < checkIn.value
    ) {
        alert("退房日期不可早於入住日期");

        checkOut.value = "";
        return false;
    }

    return true;
}

checkIn.addEventListener("change", validateDate);

checkOut.addEventListener("change", validateDate);

/* =========================
   開啟預訂視窗
========================= */
function openModal(roomId) {

    if (!checkIn.value || !checkOut.value) {
        alert("請先選擇入住與退房日期");
        return;
    }

    if (!validateDate()) return;
    currentRoom =
        rooms.find(
            room => room.id === roomId
        );

    const start = new Date(checkIn.value);
    const end = new Date(checkOut.value);
    const days = (end - start) / (1000 * 60 * 60 * 24);
    const total = days * currentRoom.price;

    document.querySelector("#detailRoom").innerHTML = `房型：${currentRoom.name}`;
    document.querySelector("#detailDate").innerHTML = `日期：${checkIn.value}  ~ ${checkOut.value}`;
    document.querySelector("#detailDays").innerHTML = `住宿天數：${days} 晚`;
    document.querySelector("#detailGuest").innerHTML = `入住人數：${guestCount.value} 人`;
    document.querySelector("#detailPrice").innerHTML = `總價：NT$${total}`;

    modal.style.display = "flex";
}

/* =========================
   關閉視窗
========================= */
document.querySelector("#cancelBtn").addEventListener("click", () => {
    modal.style.display = "none";
}
);

/* =========================
   確認預訂
========================= */
document.querySelector("#confirmBtn").addEventListener("click", () => {

    const start = new Date(checkIn.value);
    const end = new Date(checkOut.value);
    const days = (end - start) / (1000 * 60 * 60 * 24);
    const total = days * currentRoom.price;

    modal.style.display = "none";
    successText.innerHTML = `
            房型：${currentRoom.name}<br>
            入住人數：${guestCount.value} 人<br>
            住宿天數：${days} 晚<br>
            總金額：NT$${total}
        `;
    successModal.style.display = "flex";
}
);
document.querySelector("#finishBtn").addEventListener("click", () => {

    successModal.style.display = "none";
    checkIn.value = "";
    checkOut.value = "";

    renderRooms();
}
);
