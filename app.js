// 데이터 저장소 - LocalStorage 사용
const STORAGE_KEYS = {
    LESSON_PRICE: 'tennis_lesson_price',
    MEMBERS: 'tennis_members',
    COUPONS: 'tennis_coupons'
};

// 페이지 로드 시 데이터 불러오기
document.addEventListener('DOMContentLoaded', function() {
    loadLessonPrice();
    loadMembers();
    loadCoupons();
});

// ==================== 레슨비 설정 ====================
function saveLessonPrice() {
    const price = document.getElementById('lessonPrice').value;
    if (!price || price <= 0) {
        alert('올바른 레슨비를 입력해주세요.');
        return;
    }
    
    localStorage.setItem(STORAGE_KEYS.LESSON_PRICE, price);
    loadLessonPrice();
    document.getElementById('lessonPrice').value = '';
    showNotification('레슨비가 저장되었습니다.');
}

function loadLessonPrice() {
    const price = localStorage.getItem(STORAGE_KEYS.LESSON_PRICE);
    const display = document.getElementById('priceDisplay');
    
    if (price) {
        display.innerHTML = `<strong>현재 레슨비:</strong> ${parseInt(price).toLocaleString()}원 / 회당`;
    } else {
        display.innerHTML = '<em>레슨비가 설정되지 않았습니다.</em>';
    }
}

// ==================== 회원 관리 ====================
function addMember() {
    const name = document.getElementById('memberName').value.trim();
    const startDate = document.getElementById('startDate').value;
    const endDate = document.getElementById('endDate').value;
    
    if (!name) {
        alert('회원 이름을 입력해주세요.');
        return;
    }
    
    if (!startDate || !endDate) {
        alert('시작 일자와 종료 일자를 모두 입력해주세요.');
        return;
    }
    
    if (new Date(startDate) > new Date(endDate)) {
        alert('시작 일자는 종료 일자보다 빨라야 합니다.');
        return;
    }
    
    const members = getMembers();
    const newMember = {
        id: Date.now(),
        name: name,
        startDate: startDate,
        endDate: endDate,
        createdAt: new Date().toISOString()
    };
    
    members.push(newMember);
    saveMembers(members);
    loadMembers();
    
    // 입력 필드 초기화
    document.getElementById('memberName').value = '';
    document.getElementById('startDate').value = '';
    document.getElementById('endDate').value = '';
    
    showNotification('회원이 추가되었습니다.');
}

function getMembers() {
    const membersJson = localStorage.getItem(STORAGE_KEYS.MEMBERS);
    return membersJson ? JSON.parse(membersJson) : [];
}

function saveMembers(members) {
    localStorage.setItem(STORAGE_KEYS.MEMBERS, JSON.stringify(members));
}

function loadMembers() {
    const members = getMembers();
    const container = document.getElementById('membersList');
    
    if (members.length === 0) {
        container.innerHTML = '<div class="empty-message">등록된 회원이 없습니다.</div>';
        return;
    }
    
    container.innerHTML = members.map(member => `
        <div class="member-item">
            <div class="member-info">
                <h3>${member.name}</h3>
                <p>📅 시작일: ${formatDate(member.startDate)}</p>
                <p>📅 종료일: ${formatDate(member.endDate)}</p>
                <p>⏱️ 기간: ${calculateDays(member.startDate, member.endDate)}일</p>
            </div>
            <button class="delete-btn" onclick="deleteMember(${member.id})">삭제</button>
        </div>
    `).join('');
}

function deleteMember(id) {
    if (!confirm('정말 삭제하시겠습니까?')) return;
    
    const members = getMembers();
    const filtered = members.filter(m => m.id !== id);
    saveMembers(filtered);
    loadMembers();
    showNotification('회원이 삭제되었습니다.');
}

// ==================== 쿠폰 관리 ====================
function addCoupon() {
    const date = document.getElementById('couponDate').value;
    const count = parseInt(document.getElementById('couponCount').value);
    const price = parseInt(document.getElementById('couponPrice').value);
    
    if (!date) {
        alert('쿠폰 사용 일자를 입력해주세요.');
        return;
    }
    
    if (!count || count <= 0) {
        alert('올바른 쿠폰 개수를 입력해주세요.');
        return;
    }
    
    if (!price || price <= 0) {
        alert('올바른 쿠폰 금액을 입력해주세요.');
        return;
    }
    
    const coupons = getCoupons();
    const newCoupon = {
        id: Date.now(),
        date: date,
        count: count,
        price: price,
        totalAmount: count * price,
        createdAt: new Date().toISOString()
    };
    
    coupons.push(newCoupon);
    saveCoupons(coupons);
    loadCoupons();
    
    // 입력 필드 초기화
    document.getElementById('couponDate').value = '';
    document.getElementById('couponCount').value = '';
    document.getElementById('couponPrice').value = '';
    
    showNotification('쿠폰이 추가되었습니다.');
}

function getCoupons() {
    const couponsJson = localStorage.getItem(STORAGE_KEYS.COUPONS);
    return couponsJson ? JSON.parse(couponsJson) : [];
}

function saveCoupons(coupons) {
    localStorage.setItem(STORAGE_KEYS.COUPONS, JSON.stringify(coupons));
}

function loadCoupons() {
    const coupons = getCoupons();
    const container = document.getElementById('couponsList');
    
    if (coupons.length === 0) {
        container.innerHTML = '<div class="empty-message">등록된 쿠폰이 없습니다.</div>';
        return;
    }
    
    container.innerHTML = coupons.map(coupon => `
        <div class="coupon-item">
            <div class="coupon-info">
                <h3>🎫 ${formatDate(coupon.date)}</h3>
                <p>개수: ${coupon.count}회</p>
                <p>쿠폰 금액: ${coupon.price.toLocaleString()}원 / 회</p>
                <p><strong>총액: ${coupon.totalAmount.toLocaleString()}원</strong></p>
            </div>
            <button class="delete-btn" onclick="deleteCoupon(${coupon.id})">삭제</button>
        </div>
    `).join('');
}

function deleteCoupon(id) {
    if (!confirm('정말 삭제하시겠습니까?')) return;
    
    const coupons = getCoupons();
    const filtered = coupons.filter(c => c.id !== id);
    saveCoupons(filtered);
    loadCoupons();
    showNotification('쿠폰이 삭제되었습니다.');
}

// ==================== 정산 계산 ====================
function calculateTotal() {
    const lessonPrice = parseInt(localStorage.getItem(STORAGE_KEYS.LESSON_PRICE)) || 0;
    const members = getMembers();
    const coupons = getCoupons();
    
    if (lessonPrice === 0) {
        alert('먼저 레슨비를 설정해주세요.');
        return;
    }
    
    if (members.length === 0) {
        alert('회원이 등록되지 않았습니다.');
        return;
    }
    
    let totalLessonAmount = 0;
    let totalCouponAmount = 0;
    let memberDetails = [];
    
    // 회원별 레슨비 계산
    members.forEach(member => {
        const days = calculateDays(member.startDate, member.endDate);
        // 간단하게 일수로 계산 (실제로는 요일별로 계산할 수 있음)
        const lessonCount = days; // 예시: 매일 레슨이라고 가정
        const amount = lessonCount * lessonPrice;
        totalLessonAmount += amount;
        
        memberDetails.push({
            name: member.name,
            days: days,
            lessonCount: lessonCount,
            amount: amount
        });
    });
    
    // 쿠폰 총액 계산
    coupons.forEach(coupon => {
        totalCouponAmount += coupon.totalAmount;
    });
    
    // 최종 정산
    const finalAmount = totalLessonAmount - totalCouponAmount;
    
    // 결과 표시
    displaySummary(memberDetails, totalLessonAmount, totalCouponAmount, finalAmount);
}

function displaySummary(memberDetails, totalLessonAmount, totalCouponAmount, finalAmount) {
    const container = document.getElementById('summaryResults');
    
    let html = '<div class="summary-item"><span class="summary-label">회원별 상세</span></div>';
    
    memberDetails.forEach(member => {
        html += `
            <div class="summary-item">
                <div>
                    <strong>${member.name}</strong><br>
                    <small>기간: ${member.days}일 | 레슨: ${member.lessonCount}회</small>
                </div>
                <span class="summary-value">${member.amount.toLocaleString()}원</span>
            </div>
        `;
    });
    
    html += `
        <div class="summary-item">
            <span class="summary-label">총 레슨비</span>
            <span class="summary-value">${totalLessonAmount.toLocaleString()}원</span>
        </div>
        <div class="summary-item">
            <span class="summary-label">총 쿠폰 금액</span>
            <span class="summary-value">- ${totalCouponAmount.toLocaleString()}원</span>
        </div>
        <div class="total-summary">
            <h3>최종 정산 금액</h3>
            <div class="total-amount">${finalAmount.toLocaleString()}원</div>
        </div>
    `;
    
    container.innerHTML = html;
}

// ==================== 유틸리티 함수 ====================
function formatDate(dateString) {
    const date = new Date(dateString);
    return date.toLocaleDateString('ko-KR', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    });
}

function calculateDays(startDate, endDate) {
    const start = new Date(startDate);
    const end = new Date(endDate);
    const diffTime = Math.abs(end - start);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays + 1; // 시작일과 종료일 포함
}

function showNotification(message) {
    // 간단한 알림 (추후 개선 가능)
    const notification = document.createElement('div');
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: #667eea;
        color: white;
        padding: 15px 25px;
        border-radius: 8px;
        box-shadow: 0 5px 15px rgba(0,0,0,0.3);
        z-index: 1000;
        animation: slideIn 0.3s ease;
    `;
    notification.textContent = message;
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.style.animation = 'slideOut 0.3s ease';
        setTimeout(() => notification.remove(), 300);
    }, 2000);
}

// ==================== 데이터 관리 ====================
function clearAllData() {
    if (!confirm('정말 모든 데이터를 삭제하시겠습니까? 이 작업은 되돌릴 수 없습니다.')) {
        return;
    }
    
    localStorage.removeItem(STORAGE_KEYS.LESSON_PRICE);
    localStorage.removeItem(STORAGE_KEYS.MEMBERS);
    localStorage.removeItem(STORAGE_KEYS.COUPONS);
    
    loadLessonPrice();
    loadMembers();
    loadCoupons();
    document.getElementById('summaryResults').innerHTML = '';
    
    showNotification('모든 데이터가 삭제되었습니다.');
}

function exportData() {
    const data = {
        lessonPrice: localStorage.getItem(STORAGE_KEYS.LESSON_PRICE),
        members: getMembers(),
        coupons: getCoupons(),
        exportedAt: new Date().toISOString()
    };
    
    const dataStr = JSON.stringify(data, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    
    const link = document.createElement('a');
    link.href = url;
    link.download = `tennis_lesson_data_${new Date().toISOString().split('T')[0]}.json`;
    link.click();
    
    URL.revokeObjectURL(url);
    showNotification('데이터가 내보내졌습니다.');
}

function importData() {
    document.getElementById('importFile').click();
}

function handleFileImport(event) {
    const file = event.target.files[0];
    if (!file) return;
    
    const reader = new FileReader();
    reader.onload = function(e) {
        try {
            const data = JSON.parse(e.target.result);
            
            if (data.lessonPrice) {
                localStorage.setItem(STORAGE_KEYS.LESSON_PRICE, data.lessonPrice);
            }
            
            if (data.members && Array.isArray(data.members)) {
                saveMembers(data.members);
            }
            
            if (data.coupons && Array.isArray(data.coupons)) {
                saveCoupons(data.coupons);
            }
            
            loadLessonPrice();
            loadMembers();
            loadCoupons();
            
            showNotification('데이터가 가져와졌습니다.');
        } catch (error) {
            alert('파일을 읽는 중 오류가 발생했습니다. 올바른 JSON 파일인지 확인해주세요.');
            console.error(error);
        }
    };
    
    reader.readAsText(file);
    event.target.value = ''; // 같은 파일을 다시 선택할 수 있도록
}

// CSS 애니메이션 추가 (알림용)
const style = document.createElement('style');
style.textContent = `
    @keyframes slideIn {
        from {
            transform: translateX(100%);
            opacity: 0;
        }
        to {
            transform: translateX(0);
            opacity: 1;
        }
    }
    
    @keyframes slideOut {
        from {
            transform: translateX(0);
            opacity: 1;
        }
        to {
            transform: translateX(100%);
            opacity: 0;
        }
    }
`;
document.head.appendChild(style);

