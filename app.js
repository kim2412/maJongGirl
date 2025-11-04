// 데이터 저장소 - LocalStorage 사용
const STORAGE_KEYS = {
    LESSON_PRICE: 'tennis_lesson_price',
    COUPON_DEFAULT_PRICE: 'tennis_coupon_default_price', // 쿠폰 기본 가격
    MEMBERS: 'tennis_members', // 이름을 키로 하는 객체 구조
    COUPONS: 'tennis_coupons',
    SALARY_RECORDS: 'tennis_salary_records', // 정산 기록 배열
    CANCEL_MAKEUP_LESSONS: 'tennis_cancel_makeup_lessons', // 취소/보강 레슨 기록
    SAME_DAY_CANCELS: 'tennis_same_day_cancels', // 당일취소 기록
    IS_LOGGED_IN: 'tennis_is_logged_in' // 로그인 상태
};

// 비밀번호
const PASSWORD = '01089707825';

// 페이지 로드 시 데이터 불러오기
document.addEventListener('DOMContentLoaded', function() {
    checkInAppBrowser();
    checkLoginStatus();
});

// ==================== 인앱 브라우저 감지 ====================
function checkInAppBrowser() {
    const userAgent = navigator.userAgent || navigator.vendor || window.opera;
    const isInApp = /KAKAOTALK|FB_IAB|FBAN|FBAV|Instagram|Line|LinkedInApp|Naver|Snapchat|Twitter|WhatsApp|wv|WebView/i.test(userAgent);
    
    // 카카오톡 인앱 브라우저인 경우
    if (isInApp && /KAKAOTALK/i.test(userAgent)) {
        showInAppBrowserWarning();
    }
}

function showInAppBrowserWarning() {
    const warningDiv = document.createElement('div');
    warningDiv.id = 'inAppBrowserWarning';
    warningDiv.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        right: 0;
        background: linear-gradient(135deg, #ff6b6b 0%, #ee5a6f 100%);
        color: white;
        padding: 20px;
        text-align: center;
        z-index: 100001;
        box-shadow: 0 4px 12px rgba(0,0,0,0.2);
        animation: slideDown 0.3s ease;
    `;
    
    const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent);
    const isAndroid = /Android/.test(navigator.userAgent);
    
    let openButton = '';
    if (isIOS) {
        openButton = `
            <button onclick="openInSafari()" style="
                background: white;
                color: #ff6b6b;
                border: none;
                padding: 12px 24px;
                border-radius: 8px;
                font-weight: 600;
                font-size: 1rem;
                margin-top: 15px;
                cursor: pointer;
                box-shadow: 0 2px 8px rgba(0,0,0,0.2);
            ">
                🍎 사파리에서 열기
            </button>
        `;
    } else if (isAndroid) {
        openButton = `
            <button onclick="openInChrome()" style="
                background: white;
                color: #ff6b6b;
                border: none;
                padding: 12px 24px;
                border-radius: 8px;
                font-weight: 600;
                font-size: 1rem;
                margin-top: 15px;
                cursor: pointer;
                box-shadow: 0 2px 8px rgba(0,0,0,0.2);
            ">
                🌐 크롬에서 열기
            </button>
        `;
    }
    
    warningDiv.innerHTML = `
        <div style="max-width: 600px; margin: 0 auto;">
            <h3 style="margin: 0 0 10px 0; font-size: 1.2rem;">⚠️ 카카오톡 브라우저에서 열렸습니다</h3>
            <p style="margin: 0 0 15px 0; font-size: 0.95rem; line-height: 1.5;">
                데이터가 제대로 저장되지 않을 수 있습니다.<br>
                외부 브라우저(사파리/크롬)에서 열어주세요.
            </p>
            ${openButton}
            <button onclick="closeInAppWarning()" style="
                background: transparent;
                color: white;
                border: 2px solid white;
                padding: 12px 24px;
                border-radius: 8px;
                font-weight: 600;
                font-size: 1rem;
                margin-top: 15px;
                margin-left: 10px;
                cursor: pointer;
            ">
                닫기
            </button>
        </div>
    `;
    
    document.body.insertBefore(warningDiv, document.body.firstChild);
    
    // CSS 애니메이션 추가
    if (!document.getElementById('inAppBrowserStyles')) {
        const style = document.createElement('style');
        style.id = 'inAppBrowserStyles';
        style.textContent = `
            @keyframes slideDown {
                from {
                    transform: translateY(-100%);
                    opacity: 0;
                }
                to {
                    transform: translateY(0);
                    opacity: 1;
                }
            }
        `;
        document.head.appendChild(style);
    }
}

function openInSafari() {
    const currentUrl = window.location.href;
    
    // iOS에서 사파리로 열기 시도
    // 방법 1: URL 복사 후 안내
    if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(currentUrl).then(() => {
            alert('✅ URL이 복사되었습니다!\n\n사파리 앱을 열고 주소창에 붙여넣기(Cmd+V) 하세요.');
            // 사파리 앱 열기 시도 (선택적)
            try {
                window.location.href = currentUrl;
            } catch(e) {
                // 무시
            }
        }).catch(() => {
            // 클립보드 복사 실패 시 prompt 사용
            prompt('📋 아래 URL을 복사하세요:\n\n사파리 앱을 열고 주소창에 붙여넣기 하세요:', currentUrl);
        });
    } else {
        // 클립보드 API가 없는 경우
        prompt('📋 아래 URL을 복사하세요:\n\n사파리 앱을 열고 주소창에 붙여넣기 하세요:', currentUrl);
    }
}

function openInChrome() {
    const currentUrl = window.location.href;
    
    // Android에서 Chrome으로 열기 시도
    // Intent URI 사용 (Chrome이 설치되어 있으면 자동으로 열림)
    try {
        const urlWithoutProtocol = currentUrl.replace(/^https?:\/\//, '');
        const intentUrl = `intent://${urlWithoutProtocol}#Intent;scheme=https;action=android.intent.action.VIEW;category=android.intent.category.BROWSABLE;package=com.android.chrome;end`;
        
        // 먼저 Intent URI 시도
        window.location.href = intentUrl;
        
        // 2초 후에도 페이지가 그대로면 URL 복사 안내
        setTimeout(() => {
            if (navigator.clipboard && navigator.clipboard.writeText) {
                navigator.clipboard.writeText(currentUrl).then(() => {
                    alert('✅ URL이 복사되었습니다!\n\n크롬 앱을 열고 주소창에 붙여넣기 하세요.');
                });
            } else {
                prompt('📋 아래 URL을 복사하세요:\n\n크롬 앱을 열고 주소창에 붙여넣기 하세요:', currentUrl);
            }
        }, 2000);
    } catch(e) {
        // Intent URI 실패 시 URL 복사
        if (navigator.clipboard && navigator.clipboard.writeText) {
            navigator.clipboard.writeText(currentUrl).then(() => {
                alert('✅ URL이 복사되었습니다!\n\n크롬 앱을 열고 주소창에 붙여넣기 하세요.');
            });
        } else {
            prompt('📋 아래 URL을 복사하세요:\n\n크롬 앱을 열고 주소창에 붙여넣기 하세요:', currentUrl);
        }
    }
}

function closeInAppWarning() {
    const warning = document.getElementById('inAppBrowserWarning');
    if (warning) {
        warning.style.animation = 'slideDown 0.3s ease reverse';
        setTimeout(() => {
            warning.remove();
        }, 300);
    }
}

// ==================== 로그인 관리 ====================
function checkLoginStatus() {
    const isLoggedIn = localStorage.getItem(STORAGE_KEYS.IS_LOGGED_IN) === 'true';
    
    if (isLoggedIn) {
        showMainContent();
        loadAllData();
    } else {
        showLoginScreen();
        // 로그인 화면에 포커스
        setTimeout(() => {
            const passwordInput = document.getElementById('passwordInput');
            if (passwordInput) passwordInput.focus();
        }, 100);
    }
}

function showLoginScreen() {
    document.getElementById('loginScreen').style.display = 'flex';
    document.getElementById('mainContent').style.display = 'none';
}

function showMainContent() {
    document.getElementById('loginScreen').style.display = 'none';
    document.getElementById('mainContent').style.display = 'block';
    loadAllData();
}

function loadAllData() {
    loadLessonPrice();
    loadCouponDefaultPrice();
    loadMembers();
    loadCoupons();
    loadMemberSelect();
    loadCancelMakeupMemberSelect();
    loadSameDayCancelMemberSelect();
    updateSettlementMonth();
    loadSalaryRecords();
    loadCancelMakeupLessons();
    loadSameDayCancels();
}

function checkPassword() {
    const passwordInput = document.getElementById('passwordInput');
    const passwordError = document.getElementById('passwordError');
    const enteredPassword = passwordInput.value;
    
    if (enteredPassword === PASSWORD) {
        // 로그인 성공
        localStorage.setItem(STORAGE_KEYS.IS_LOGGED_IN, 'true');
        passwordError.textContent = '';
        passwordInput.value = '';
        showMainContent();
    } else {
        // 로그인 실패
        passwordError.textContent = '비밀번호가 틀렸습니다. 다시 입력해주세요.';
        passwordError.style.color = '#dc3545';
        passwordInput.value = '';
        passwordInput.focus();
        // 에러 메시지 3초 후 사라지게
        setTimeout(() => {
            passwordError.textContent = '';
        }, 3000);
    }
}

function handlePasswordEnter(event) {
    if (event.key === 'Enter') {
        checkPassword();
    }
}

function verifyPasswordForAction() {
    const password = prompt('비밀번호를 입력해주세요:');
    if (password === PASSWORD) {
        return true;
    } else if (password !== null) { // 취소 버튼이 아닌 경우만
        alert('비밀번호가 틀렸습니다.');
    }
    return false;
}

// ==================== 탭 전환 ====================
function switchTab(tabName) {
    // 모든 탭 버튼과 콘텐츠 비활성화
    document.querySelectorAll('.tab-btn').forEach(btn => btn.classList.remove('active'));
    document.querySelectorAll('.tab-content').forEach(content => content.classList.remove('active'));
    
    // 선택한 탭 버튼 활성화
    const activeBtn = document.querySelector(`.tab-btn[onclick*="'${tabName}'"]`);
    if (activeBtn) {
        activeBtn.classList.add('active');
    }
    
    // 선택한 탭 콘텐츠 활성화
    document.getElementById(tabName + '-tab').classList.add('active');
    
    // 탭별 데이터 로드
    if (tabName === 'members') {
        loadMembers();
        loadMemberSelect();
    } else if (tabName === 'salary') {
        loadMemberSelect();
        loadSalaryRecords();
    } else if (tabName === 'lessons') {
        loadMemberSelect();
        loadCancelMakeupMemberSelect();
        loadSameDayCancelMemberSelect();
        updateSameDayCancelDate();
        loadMemberLessonHistory();
        loadCancelMakeupLessons();
        loadSameDayCancels();
    }
}

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
    
    if (display) {
        if (price) {
            display.innerHTML = `<strong>현재 레슨비:</strong> ${parseInt(price).toLocaleString()}원 / 타임당`;
        } else {
            display.innerHTML = '<em>레슨비가 설정되지 않았습니다.</em>';
        }
    }
}

// ==================== 쿠폰 기본 가격 설정 ====================
function saveCouponDefaultPrice() {
    const price = document.getElementById('couponDefaultPrice').value;
    if (!price || price <= 0) {
        alert('올바른 쿠폰 기본 가격을 입력해주세요.');
        return;
    }
    
    localStorage.setItem(STORAGE_KEYS.COUPON_DEFAULT_PRICE, price);
    loadCouponDefaultPrice();
    document.getElementById('couponDefaultPrice').value = '';
    showNotification('쿠폰 기본 가격이 저장되었습니다.');
}

function loadCouponDefaultPrice() {
    const price = localStorage.getItem(STORAGE_KEYS.COUPON_DEFAULT_PRICE);
    const display = document.getElementById('couponPriceDisplay');
    
    if (display) {
        if (price) {
            display.innerHTML = `<strong>현재 쿠폰 기본 가격:</strong> ${parseInt(price).toLocaleString()}원`;
        } else {
            display.innerHTML = '<em>쿠폰 기본 가격이 설정되지 않았습니다.</em>';
        }
    }
}

function getCouponDefaultPrice() {
    const price = localStorage.getItem(STORAGE_KEYS.COUPON_DEFAULT_PRICE);
    return price ? parseInt(price) : 0;
}

// ==================== 회원 관리 ====================
// 회원 데이터 구조: { "회원이름": [{ startDate, endDate, lessonsPerWeek, timesPerLesson, month, year, registeredAt }] }

function addOrRenewMember() {
    const name = document.getElementById('memberName').value.trim();
    const startDate = document.getElementById('startDate').value;
    const endDate = document.getElementById('endDate').value;
    const lessonsPerWeek = parseInt(document.getElementById('lessonsPerWeek').value);
    const timesPerLesson = parseInt(document.getElementById('timesPerLesson').value);
    
    // 유효성 검사
    if (!validateMemberName()) {
        document.getElementById('memberName').focus();
        return;
    }
    
    if (!validateDates()) {
        if (!startDate) {
            document.getElementById('startDate').focus();
        } else if (!endDate) {
            document.getElementById('endDate').focus();
        }
        return;
    }
    
    if (!validateNumber(document.getElementById('lessonsPerWeek'), 1, 7)) {
        document.getElementById('lessonsPerWeek').focus();
        return;
    }
    
    if (!validateNumber(document.getElementById('timesPerLesson'), 1, null)) {
        document.getElementById('timesPerLesson').focus();
        return;
    }
    
    const members = getMembers();
    const startDateObj = new Date(startDate);
    const month = startDateObj.getMonth() + 1;
    const year = startDateObj.getFullYear();
    
    // 새 레슨 기록
    const newRecord = {
        startDate: startDate,
        endDate: endDate,
        lessonsPerWeek: lessonsPerWeek,
        timesPerLesson: timesPerLesson,
        month: month,
        year: year,
        registeredAt: new Date().toISOString()
    };
    
    // 회원이 이미 존재하는지 확인
    if (members[name]) {
        members[name].push(newRecord);
        showNotification(`${name} 회원의 새로운 레슨 기록이 추가되었습니다.`);
    } else {
        members[name] = [newRecord];
        showNotification(`${name} 회원이 등록되었습니다.`);
    }
    
    saveMembers(members);
    loadMembers();
    loadMemberSelect();
    clearMemberForm();
}

function getMembers() {
    const membersJson = localStorage.getItem(STORAGE_KEYS.MEMBERS);
    if (!membersJson) return {};
    try {
        return JSON.parse(membersJson);
    } catch (e) {
        // 기존 배열 형식 데이터 마이그레이션
        const oldMembers = JSON.parse(membersJson);
        if (Array.isArray(oldMembers)) {
            const newMembers = {};
            oldMembers.forEach(m => {
                if (!newMembers[m.name]) {
                    newMembers[m.name] = [];
                }
                newMembers[m.name].push({
                    startDate: m.startDate,
                    endDate: m.endDate,
                    lessonsPerWeek: 1,
                    timesPerLesson: 1,
                    month: new Date(m.startDate).getMonth() + 1,
                    year: new Date(m.startDate).getFullYear(),
                    registeredAt: m.createdAt || new Date().toISOString()
                });
            });
            saveMembers(newMembers);
            return newMembers;
        }
        return {};
    }
}

function saveMembers(members) {
    localStorage.setItem(STORAGE_KEYS.MEMBERS, JSON.stringify(members));
}

function loadMembers() {
    applyMemberFilter();
}

function applyMemberFilter() {
    const members = getMembers();
    const container = document.getElementById('membersList');
    const filter = document.getElementById('memberFilter')?.value || 'all';
    
    if (!container) return;
    
    const memberNames = Object.keys(members);
    if (memberNames.length === 0) {
        container.innerHTML = '<div class="empty-message">등록된 회원이 없습니다.</div>';
        return;
    }
    
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    let filteredMembers = memberNames;
    
    if (filter === 'active') {
        // 현재 레슨 진행중인 회원만
        filteredMembers = memberNames.filter(name => {
            const records = members[name];
            if (records.length === 0) return false;
            const latestRecord = records[records.length - 1];
            const endDate = new Date(latestRecord.endDate);
            endDate.setHours(0, 0, 0, 0);
            return endDate >= today;
        });
    } else if (filter === 'inactive') {
        // 레슨 종료된 회원만 (재등록 필요)
        filteredMembers = memberNames.filter(name => {
            const records = members[name];
            if (records.length === 0) return false;
            const latestRecord = records[records.length - 1];
            const endDate = new Date(latestRecord.endDate);
            endDate.setHours(0, 0, 0, 0);
            return endDate < today;
        });
    }
    
    if (filteredMembers.length === 0) {
        container.innerHTML = '<div class="empty-message">해당 조건의 회원이 없습니다.</div>';
        return;
    }
    
    container.innerHTML = filteredMembers.map(name => {
        const records = members[name];
        const latestRecord = records[records.length - 1];
        const totalRecords = records.length;
        const totalLessons = records.reduce((sum, record) => {
            const weeks = calculateWeeks(record.startDate, record.endDate);
            return sum + (weeks * record.lessonsPerWeek * record.timesPerLesson);
        }, 0);
        
        const endDate = new Date(latestRecord.endDate);
        endDate.setHours(0, 0, 0, 0);
        const isActive = endDate >= today;
        const statusBadge = isActive ? '<span class="status-badge active">진행중</span>' : '<span class="status-badge inactive">종료</span>';
        
        return `
            <div class="member-item">
                <div class="member-info">
                    <h3>${name} ${statusBadge}</h3>
                    <p><strong>총 레슨 기록:</strong> ${totalRecords}개월</p>
                    <p><strong>현재 레슨:</strong> ${formatDate(latestRecord.startDate)} ~ ${formatDate(latestRecord.endDate)}</p>
                    <p><strong>주 ${latestRecord.lessonsPerWeek}회, 회당 ${latestRecord.timesPerLesson}타임</p>
                    <p><strong>총 레슨 횟수:</strong> ${totalLessons}타임</p>
                </div>
                <div>
                    <button class="renew-btn" onclick="renewMember('${name}')">재등록</button>
                    <button class="delete-btn" onclick="deleteMember('${name}')">삭제</button>
                </div>
            </div>
        `;
    }).join('');
}

function renewMember(name) {
    const members = getMembers();
    if (!members[name]) return;
    
    const latestRecord = members[name][members[name].length - 1];
    
    // 폼에 최신 정보 자동 입력
    document.getElementById('memberName').value = name;
    document.getElementById('startDate').value = '';
    document.getElementById('endDate').value = '';
    document.getElementById('lessonsPerWeek').value = latestRecord.lessonsPerWeek || '';
    document.getElementById('timesPerLesson').value = latestRecord.timesPerLesson || '';
    
    // 회원관리 탭으로 이동
    switchTab('members');
    
    showNotification(`${name} 회원 재등록을 위해 정보를 불러왔습니다. 날짜를 새로 입력해주세요.`);
}

function deleteMember(name) {
    if (!confirm(`${name} 회원의 모든 기록을 삭제하시겠습니까?`)) return;
    
    const members = getMembers();
    delete members[name];
    saveMembers(members);
    loadMembers();
    loadMemberSelect();
    showNotification(`${name} 회원이 삭제되었습니다.`);
}

function searchMember() {
    const searchTerm = document.getElementById('searchMemberName').value.trim().toLowerCase();
    const members = getMembers();
    const container = document.getElementById('memberSearchResults');
    
    if (!searchTerm) {
        container.innerHTML = '';
        return;
    }
    
    const matchingMembers = Object.keys(members).filter(name => 
        name.toLowerCase().includes(searchTerm)
    );
    
    if (matchingMembers.length === 0) {
        container.innerHTML = '<div class="empty-message">검색 결과가 없습니다.</div>';
        return;
    }
    
    container.innerHTML = matchingMembers.map(name => {
        const records = members[name];
        const totalRecords = records.length;
        
        return `
            <div class="member-history-item">
                <h4>${name}</h4>
                <p><strong>총 등록 기록:</strong> ${totalRecords}개월</p>
                <div class="history-period">
                    ${records.map((record, index) => `
                        <div>
                            <p><strong>${record.year}년 ${record.month}월</strong></p>
                            <p>${formatDate(record.startDate)} ~ ${formatDate(record.endDate)}</p>
                            <p>주 ${record.lessonsPerWeek}회, 회당 ${record.timesPerLesson}타임</p>
                            <p>예상 레슨: ${calculateWeeks(record.startDate, record.endDate) * record.lessonsPerWeek * record.timesPerLesson}타임</p>
                        </div>
                    `).join('')}
                </div>
            </div>
        `;
    }).join('');
}

function clearMemberForm() {
    document.getElementById('memberName').value = '';
    document.getElementById('startDate').value = '';
    document.getElementById('endDate').value = '';
    document.getElementById('lessonsPerWeek').value = '';
    document.getElementById('timesPerLesson').value = '';
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
    
    if (!container) return;
    
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

// ==================== 월급 정산 ====================
function updateSettlementMonth() {
    const monthInput = document.getElementById('settlementMonth');
    if (monthInput) {
        const now = new Date();
        const year = now.getFullYear();
        const month = String(now.getMonth() + 1).padStart(2, '0');
        monthInput.value = `${year}-${month}`;
        updateSettlementDates();
    }
}

function updateSettlementDates() {
    const monthInput = document.getElementById('settlementMonth');
    if (!monthInput || !monthInput.value) return;
    
    const [year, month] = monthInput.value.split('-').map(Number);
    const startDate = `${year}-${String(month).padStart(2, '0')}-01`;
    const lastDay = new Date(year, month, 0).getDate();
    const endDate = `${year}-${String(month).padStart(2, '0')}-${String(lastDay).padStart(2, '0')}`;
    
    document.getElementById('settlementStartDate').value = startDate;
    document.getElementById('settlementEndDate').value = endDate;
}

// 현재 계산된 정산 데이터 저장용
let currentSettlementData = null;

function calculateMonthlySalary() {
    const lessonPrice = parseInt(localStorage.getItem(STORAGE_KEYS.LESSON_PRICE)) || 0;
    const monthInput = document.getElementById('settlementMonth').value;
    const startDate = document.getElementById('settlementStartDate').value;
    const endDate = document.getElementById('settlementEndDate').value;
    
    if (!monthInput) {
        alert('정산할 월을 선택해주세요.');
        return;
    }
    
    if (lessonPrice === 0) {
        alert('먼저 레슨비를 설정해주세요.');
        return;
    }
    
    const [year, month] = monthInput.split('-').map(Number);
    const members = getMembers();
    const coupons = getCoupons();
    
    // 정산 기간 설정
    let calculationStartDate = startDate;
    let calculationEndDate = endDate;
    
    if (!calculationStartDate || !calculationEndDate) {
        // 월의 첫날과 마지막날로 자동 설정
        calculationStartDate = `${year}-${String(month).padStart(2, '0')}-01`;
        const lastDay = new Date(year, month, 0).getDate();
        calculationEndDate = `${year}-${String(month).padStart(2, '0')}-${String(lastDay).padStart(2, '0')}`;
        
        // 입력 필드에 자동 설정
        document.getElementById('settlementStartDate').value = calculationStartDate;
        document.getElementById('settlementEndDate').value = calculationEndDate;
    }
    
    let totalLessonAmount = 0;
    let totalCouponAmount = 0;
    let totalTimes = 0;
    let memberDetails = [];
    
    const calcStart = new Date(calculationStartDate + 'T00:00:00');
    const calcEnd = new Date(calculationEndDate + 'T23:59:59');
    calcStart.setHours(0, 0, 0, 0);
    calcEnd.setHours(23, 59, 59, 999);
    
    // 해당 기간의 회원 레슨비 계산
    Object.keys(members).forEach(name => {
        const records = members[name].filter(record => {
            const recordStart = new Date(record.startDate);
            const recordEnd = new Date(record.endDate);
            // 정산 기간과 레슨 기간이 겹치는지 확인
            return !(recordEnd < calcStart || recordStart > calcEnd);
        });
        
        records.forEach(record => {
            const recordStart = new Date(record.startDate + 'T00:00:00');
            const recordEnd = new Date(record.endDate + 'T23:59:59');
            recordStart.setHours(0, 0, 0, 0);
            recordEnd.setHours(23, 59, 59, 999);
            
            // 겹치는 기간 계산
            const overlapStart = recordStart > calcStart ? recordStart : calcStart;
            const overlapEnd = recordEnd < calcEnd ? recordEnd : calcEnd;
            
            // 겹치는 기간이 없으면 건너뛰기
            if (overlapStart > overlapEnd) {
                return;
            }
            
            const weeks = calculateWeeks(overlapStart.toISOString().split('T')[0], overlapEnd.toISOString().split('T')[0]);
            const totalLessons = weeks * record.lessonsPerWeek;
            const times = totalLessons * record.timesPerLesson;
            const amount = times * lessonPrice;
            
            totalLessonAmount += amount;
            totalTimes += times;
            
            memberDetails.push({
                name: name,
                weeks: weeks,
                lessonsPerWeek: record.lessonsPerWeek,
                timesPerLesson: record.timesPerLesson,
                totalLessons: totalLessons,
                totalTimes: times,
                amount: amount
            });
        });
    });
    
    // 해당 기간의 쿠폰 금액 계산
    coupons.forEach(coupon => {
        const couponDateObj = new Date(coupon.date + 'T00:00:00');
        couponDateObj.setHours(0, 0, 0, 0);
        if (couponDateObj >= calcStart && couponDateObj <= calcEnd) {
            totalCouponAmount += coupon.totalAmount;
        }
    });
    
    // 해당 기간의 취소/보강 레슨 계산
    const cancelMakeupLessons = getCancelMakeupLessons();
    let cancelTimes = 0;
    let makeupTimes = 0;
    
    cancelMakeupLessons.forEach(lesson => {
        const lessonDateObj = new Date(lesson.date + 'T00:00:00');
        lessonDateObj.setHours(0, 0, 0, 0);
        if (lessonDateObj >= calcStart && lessonDateObj <= calcEnd) {
            if (lesson.type === 'cancel') {
                cancelTimes += lesson.count;
            } else if (lesson.type === 'makeup') {
                makeupTimes += lesson.count;
            }
        }
    });
    
    // 해당 기간의 당일취소 계산
    const sameDayCancels = getSameDayCancels();
    let sameDayCancelTimes = 0;
    let sameDayMakeupTimes = 0;
    let sameDayCouponAmount = 0;
    
    sameDayCancels.forEach(cancel => {
        const cancelDateObj = new Date(cancel.date + 'T00:00:00');
        cancelDateObj.setHours(0, 0, 0, 0);
        if (cancelDateObj >= calcStart && cancelDateObj <= calcEnd) {
            if (cancel.type === 'deduct') {
                // 차감: 레슨 타임 1개 차감
                sameDayCancelTimes += 1;
            } else if (cancel.type === 'makeup') {
                // 보강: 보강 타임 1개 추가
                sameDayMakeupTimes += 1;
            } else if (cancel.type === 'coupon') {
                // 쿠폰: 쿠폰 기본 가격을 월급에 추가 (쿠폰 금액 차감은 안 함)
                const couponPrice = getCouponDefaultPrice();
                if (couponPrice > 0) {
                    sameDayCouponAmount += couponPrice;
                }
            }
        }
    });
    
    // 취소 타임 차감, 보강 타임 추가
    const adjustedTimes = totalTimes - cancelTimes - sameDayCancelTimes + makeupTimes + sameDayMakeupTimes;
    const adjustedAmount = adjustedTimes * lessonPrice;
    const finalLessonAmount = adjustedAmount > 0 ? adjustedAmount : totalLessonAmount;
    
    // 쿠폰 당일취소 금액은 월급에 추가 (쿠폰 차감 금액에는 포함 안 함)
    const finalLessonAmountWithCoupon = finalLessonAmount + sameDayCouponAmount;
    
    const finalAmount = finalLessonAmountWithCoupon - totalCouponAmount;
    
    // 현재 계산된 데이터 저장
    currentSettlementData = {
        year: year,
        month: month,
        startDate: calculationStartDate,
        endDate: calculationEndDate,
        totalLessonAmount: finalLessonAmountWithCoupon,
        totalCouponAmount: totalCouponAmount,
        finalAmount: finalAmount,
        totalTimes: adjustedTimes,
        cancelTimes: cancelTimes + sameDayCancelTimes,
        makeupTimes: makeupTimes + sameDayMakeupTimes,
        sameDayCouponAmount: sameDayCouponAmount,
        memberDetails: memberDetails,
        note: document.getElementById('settlementNote').value || ''
    };
    
    displaySummary(memberDetails, finalLessonAmountWithCoupon, totalCouponAmount, finalAmount, year, month, adjustedTimes, cancelTimes + sameDayCancelTimes, makeupTimes + sameDayMakeupTimes, sameDayCouponAmount);
    
    // 저장 버튼 표시
    document.getElementById('saveSettlementBtn').style.display = 'inline-block';
}

function displaySummary(memberDetails, totalLessonAmount, totalCouponAmount, finalAmount, year, month, totalTimes, cancelTimes = 0, makeupTimes = 0, sameDayCouponAmount = 0) {
    const container = document.getElementById('summaryResults');
    
    if (!container) return;
    
    let html = `<div class="summary-item"><span class="summary-label">${year}년 ${month}월 정산</span></div>`;
    
    if (memberDetails.length === 0) {
        html += '<div class="empty-message">해당 기간에 등록된 레슨이 없습니다.</div>';
    } else {
        memberDetails.forEach(member => {
            html += `
                <div class="summary-item">
                    <div>
                        <strong>${member.name}</strong><br>
                        <small>${member.weeks}주 × 주${member.lessonsPerWeek}회 × ${member.timesPerLesson}타임 = ${member.totalTimes}타임</small>
                    </div>
                    <span class="summary-value">${member.amount.toLocaleString()}원</span>
                </div>
            `;
        });
    }
    
    html += `
        <div class="summary-item">
            <span class="summary-label">총 레슨 타임</span>
            <span class="summary-value">${totalTimes}회</span>
        </div>
    `;
    
    if (cancelTimes > 0 || makeupTimes > 0) {
        html += `
            <div class="summary-item">
                <span class="summary-label">취소 타임</span>
                <span class="summary-value" style="color: #dc3545;">- ${cancelTimes}회</span>
            </div>
            <div class="summary-item">
                <span class="summary-label">보강 타임</span>
                <span class="summary-value" style="color: #28a745;">+ ${makeupTimes}회</span>
            </div>
        `;
    }
    
    if (sameDayCouponAmount > 0) {
        html += `
            <div class="summary-item">
                <span class="summary-label">당일취소(쿠폰) 금액</span>
                <span class="summary-value" style="color: #17a2b8;">+ ${sameDayCouponAmount.toLocaleString()}원</span>
            </div>
        `;
    }
    
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

// ==================== 정산 기록 저장 ====================
function saveSettlement() {
    if (!currentSettlementData) {
        alert('먼저 정산을 계산해주세요.');
        return;
    }
    
    const salaryRecords = getSalaryRecords();
    const monthInput = document.getElementById('settlementMonth').value;
    const [year, month] = monthInput.split('-').map(Number);
    
    // 해당 월의 기존 기록이 있는지 확인
    const existingIndex = salaryRecords.findIndex(record => 
        record.year === year && record.month === month
    );
    
    const newRecord = {
        id: existingIndex >= 0 ? salaryRecords[existingIndex].id : Date.now(),
        year: year,
        month: month,
        startDate: currentSettlementData.startDate,
        endDate: currentSettlementData.endDate,
        totalAmount: currentSettlementData.finalAmount,
        totalTimes: currentSettlementData.totalTimes,
        note: document.getElementById('settlementNote').value || '',
        memberDetails: currentSettlementData.memberDetails,
        createdAt: existingIndex >= 0 ? salaryRecords[existingIndex].createdAt : new Date().toISOString(),
        updatedAt: new Date().toISOString()
    };
    
    if (existingIndex >= 0) {
        salaryRecords[existingIndex] = newRecord;
        showNotification(`${year}년 ${month}월 정산 기록이 수정되었습니다.`);
    } else {
        salaryRecords.push(newRecord);
        showNotification(`${year}년 ${month}월 정산 기록이 저장되었습니다.`);
    }
    
    // 날짜순으로 정렬 (최신순)
    salaryRecords.sort((a, b) => {
        if (a.year !== b.year) return b.year - a.year;
        return b.month - a.month;
    });
    
    saveSalaryRecords(salaryRecords);
    loadSalaryRecords();
    
    // 저장 후 초기화
    document.getElementById('settlementNote').value = '';
    document.getElementById('saveSettlementBtn').style.display = 'none';
}

function getSalaryRecords() {
    const recordsJson = localStorage.getItem(STORAGE_KEYS.SALARY_RECORDS);
    return recordsJson ? JSON.parse(recordsJson) : [];
}

function saveSalaryRecords(records) {
    localStorage.setItem(STORAGE_KEYS.SALARY_RECORDS, JSON.stringify(records));
}

function loadSalaryRecords() {
    const records = getSalaryRecords();
    const container = document.getElementById('salaryRecordsList');
    
    if (!container) return;
    
    if (records.length === 0) {
        container.innerHTML = '<div class="empty-message">저장된 정산 기록이 없습니다.</div>';
        return;
    }
    
    container.innerHTML = records.map(record => `
        <div class="salary-record-item">
            <div class="salary-record-info">
                <div class="salary-record-header">
                    <h4>${record.year}년 ${record.month}월</h4>
                    <span class="salary-record-amount">${record.totalAmount.toLocaleString()}원</span>
                </div>
                <div class="salary-record-details">
                    <p><strong>총 횟수:</strong> ${record.totalTimes}회</p>
                    <p><strong>기간:</strong> ${formatDate(record.startDate)} ~ ${formatDate(record.endDate)}</p>
                    ${record.note ? `<p><strong>특이사항:</strong> ${record.note}</p>` : ''}
                </div>
            </div>
            <button class="btn btn-secondary" onclick="editSalaryRecord(${record.id})">수정</button>
        </div>
    `).join('');
}

function editSalaryRecord(id) {
    const records = getSalaryRecords();
    const record = records.find(r => r.id === id);
    
    if (!record) return;
    
    // 폼에 데이터 입력
    document.getElementById('settlementMonth').value = `${record.year}-${String(record.month).padStart(2, '0')}`;
    document.getElementById('settlementStartDate').value = record.startDate;
    document.getElementById('settlementEndDate').value = record.endDate;
    document.getElementById('settlementNote').value = record.note || '';
    
    // 정산 재계산
    calculateMonthlySalary();
    
    // 월급정산 탭으로 이동
    switchTab('salary');
    
    showNotification(`${record.year}년 ${record.month}월 정산 기록을 수정 모드로 불러왔습니다. 수정 후 저장해주세요.`);
}

// ==================== 레슨 기록 조회 ====================
function loadMemberSelect() {
    const select = document.getElementById('lessonSearchMember');
    if (!select) return;
    
    const members = getMembers();
    const memberNames = Object.keys(members);
    
    select.innerHTML = '<option value="">전체 회원</option>' + 
        memberNames.map(name => `<option value="${name}">${name}</option>`).join('');
}

function loadCancelMakeupMemberSelect() {
    const select = document.getElementById('cancelLessonMember');
    if (!select) return;
    
    const members = getMembers();
    const memberNames = Object.keys(members);
    
    select.innerHTML = '<option value="">회원을 선택하세요</option>' + 
        memberNames.map(name => `<option value="${name}">${name}</option>`).join('');
}

function loadSameDayCancelMemberSelect() {
    const select = document.getElementById('sameDayCancelMember');
    if (!select) return;
    
    const members = getMembers();
    const memberNames = Object.keys(members);
    
    select.innerHTML = '<option value="">회원을 선택하세요</option>' + 
        memberNames.map(name => `<option value="${name}">${name}</option>`).join('');
}

function updateSameDayCancelDate() {
    const dateInput = document.getElementById('sameDayCancelDate');
    if (!dateInput) return;
    
    const today = new Date();
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, '0');
    const day = String(today.getDate()).padStart(2, '0');
    const todayStr = `${year}-${month}-${day}`;
    dateInput.value = todayStr;
    
    // 보강일자 최소값도 오늘로 설정
    const makeupDateInput = document.getElementById('makeupDate');
    if (makeupDateInput) {
        makeupDateInput.min = todayStr;
    }
    
    // 시간 옵션 미리 생성
    generateHourOptions();
}

function toggleSameDayCancelOptions() {
    const type = document.getElementById('sameDayCancelType').value;
    const makeupOptions = document.getElementById('makeupOptions');
    
    if (!makeupOptions) return;
    
    if (type === 'makeup') {
        makeupOptions.style.display = 'block';
        // 시간 옵션 생성
        generateHourOptions();
    } else {
        makeupOptions.style.display = 'none';
    }
}

function generateHourOptions() {
    const hourSelect = document.getElementById('makeupHour');
    if (!hourSelect) return;
    
    let options = '<option value="">시간 선택</option>';
    for (let i = 0; i < 24; i++) {
        const hour = String(i).padStart(2, '0');
        options += `<option value="${hour}">${hour}시</option>`;
    }
    hourSelect.innerHTML = options;
}

function loadMemberLessonHistory() {
    const select = document.getElementById('lessonSearchMember');
    const selectedName = select ? select.value : '';
    const members = getMembers();
    const container = document.getElementById('lessonHistory');
    
    if (!container) return;
    
    let displayMembers = selectedName ? { [selectedName]: members[selectedName] } : members;
    
    if (Object.keys(displayMembers).length === 0) {
        container.innerHTML = '<div class="empty-message">등록된 회원이 없습니다.</div>';
        return;
    }
    
    container.innerHTML = Object.keys(displayMembers).map(name => {
        const records = displayMembers[name];
        const totalLessons = records.reduce((sum, record) => {
            const weeks = calculateWeeks(record.startDate, record.endDate);
            return sum + (weeks * record.lessonsPerWeek * record.timesPerLesson);
        }, 0);
        
        return `
            <div class="lesson-history-item">
                <h4>${name}</h4>
                <div class="lesson-stats">
                    <div class="stat-item">
                        <div class="stat-label">총 등록 개월</div>
                        <div class="stat-value">${records.length}개월</div>
                    </div>
                    <div class="stat-item">
                        <div class="stat-label">총 레슨 타임</div>
                        <div class="stat-value">${totalLessons}타임</div>
                    </div>
                </div>
                <div style="margin-top: 15px;">
                    ${records.map((record, index) => `
                        <div style="padding: 10px; margin-bottom: 10px; background: white; border-radius: 5px; border-left: 3px solid #28a745;">
                            <strong>${record.year}년 ${record.month}월</strong><br>
                            ${formatDate(record.startDate)} ~ ${formatDate(record.endDate)}<br>
                            주 ${record.lessonsPerWeek}회 × ${record.timesPerLesson}타임 = 
                            ${calculateWeeks(record.startDate, record.endDate) * record.lessonsPerWeek * record.timesPerLesson}타임
                        </div>
                    `).join('')}
                </div>
            </div>
        `;
    }).join('');
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
    return diffDays + 1;
}

function calculateWeeks(startDate, endDate) {
    const days = calculateDays(startDate, endDate);
    return Math.ceil(days / 7);
}

function showNotification(message) {
    const notification = document.createElement('div');
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: #2c3e50;
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
    localStorage.removeItem(STORAGE_KEYS.COUPON_DEFAULT_PRICE);
    localStorage.removeItem(STORAGE_KEYS.MEMBERS);
    localStorage.removeItem(STORAGE_KEYS.COUPONS);
    localStorage.removeItem(STORAGE_KEYS.SALARY_RECORDS);
    localStorage.removeItem(STORAGE_KEYS.CANCEL_MAKEUP_LESSONS);
    localStorage.removeItem(STORAGE_KEYS.SAME_DAY_CANCELS);
    
    loadLessonPrice();
    loadCouponDefaultPrice();
    loadMembers();
    loadCoupons();
    loadMemberSelect();
    loadCancelMakeupMemberSelect();
    loadSameDayCancelMemberSelect();
    loadMemberLessonHistory();
    loadSalaryRecords();
    loadCancelMakeupLessons();
    loadSameDayCancels();
    const summaryContainer = document.getElementById('summaryResults');
    if (summaryContainer) summaryContainer.innerHTML = '';
    
    showNotification('모든 데이터가 삭제되었습니다.');
}

function exportData() {
    // 비밀번호 확인
    if (!verifyPasswordForAction()) {
        return;
    }
    
    const data = {
        lessonPrice: localStorage.getItem(STORAGE_KEYS.LESSON_PRICE),
        couponDefaultPrice: localStorage.getItem(STORAGE_KEYS.COUPON_DEFAULT_PRICE),
        members: getMembers(),
        coupons: getCoupons(),
        salaryRecords: getSalaryRecords(),
        cancelMakeupLessons: getCancelMakeupLessons(),
        sameDayCancels: getSameDayCancels(),
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
    // 비밀번호 확인
    if (!verifyPasswordForAction()) {
        return;
    }
    
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
            
            if (data.members) {
                if (typeof data.members === 'object' && !Array.isArray(data.members)) {
                    saveMembers(data.members);
                } else if (Array.isArray(data.members)) {
                    // 기존 배열 형식 마이그레이션
                    const newMembers = {};
                    data.members.forEach(m => {
                        if (!newMembers[m.name]) {
                            newMembers[m.name] = [];
                        }
                        newMembers[m.name].push({
                            startDate: m.startDate,
                            endDate: m.endDate,
                            lessonsPerWeek: m.lessonsPerWeek || 1,
                            timesPerLesson: m.timesPerLesson || 1,
                            month: new Date(m.startDate).getMonth() + 1,
                            year: new Date(m.startDate).getFullYear(),
                            registeredAt: m.createdAt || new Date().toISOString()
                        });
                    });
                    saveMembers(newMembers);
                }
            }
            
            if (data.coupons && Array.isArray(data.coupons)) {
                saveCoupons(data.coupons);
            }
            
            if (data.salaryRecords && Array.isArray(data.salaryRecords)) {
                saveSalaryRecords(data.salaryRecords);
            }
            
            if (data.cancelMakeupLessons && Array.isArray(data.cancelMakeupLessons)) {
                saveCancelMakeupLessons(data.cancelMakeupLessons);
            }
            
            if (data.sameDayCancels && Array.isArray(data.sameDayCancels)) {
                saveSameDayCancels(data.sameDayCancels);
            }
            
            if (data.couponDefaultPrice) {
                localStorage.setItem(STORAGE_KEYS.COUPON_DEFAULT_PRICE, data.couponDefaultPrice);
            }
            
            loadLessonPrice();
            loadCouponDefaultPrice();
            loadMembers();
            loadCoupons();
            loadMemberSelect();
            loadCancelMakeupMemberSelect();
            loadSameDayCancelMemberSelect();
            loadMemberLessonHistory();
            loadSalaryRecords();
            loadCancelMakeupLessons();
            loadSameDayCancels();
            
            showNotification('데이터가 가져와졌습니다.');
        } catch (error) {
            alert('파일을 읽는 중 오류가 발생했습니다. 올바른 JSON 파일인지 확인해주세요.');
            console.error(error);
        }
    };
    
    reader.readAsText(file);
    event.target.value = '';
}

// ==================== 레슨 취소/보강 관리 ====================
function addCancelMakeupLesson() {
    const memberName = document.getElementById('cancelLessonMember').value;
    const date = document.getElementById('cancelLessonDate').value;
    const type = document.getElementById('cancelLessonType').value;
    const count = parseInt(document.getElementById('cancelLessonCount').value);
    const note = document.getElementById('cancelLessonNote').value.trim();
    
    if (!memberName) {
        alert('회원을 선택해주세요.');
        return;
    }
    
    if (!date) {
        alert('일자를 선택해주세요.');
        return;
    }
    
    if (!count || count <= 0) {
        alert('타임 수를 입력해주세요.');
        return;
    }
    
    const cancelMakeupLessons = getCancelMakeupLessons();
    const newRecord = {
        id: Date.now(),
        memberName: memberName,
        date: date,
        type: type, // 'cancel' or 'makeup'
        count: count,
        note: note,
        createdAt: new Date().toISOString()
    };
    
    cancelMakeupLessons.push(newRecord);
    saveCancelMakeupLessons(cancelMakeupLessons);
    loadCancelMakeupLessons();
    
    // 입력 필드 초기화
    document.getElementById('cancelLessonDate').value = '';
    document.getElementById('cancelLessonCount').value = '1';
    document.getElementById('cancelLessonNote').value = '';
    
    showNotification(`${memberName} 회원의 레슨 ${type === 'cancel' ? '취소' : '보강'}가 추가되었습니다.`);
}

function getCancelMakeupLessons() {
    const lessonsJson = localStorage.getItem(STORAGE_KEYS.CANCEL_MAKEUP_LESSONS);
    return lessonsJson ? JSON.parse(lessonsJson) : [];
}

function saveCancelMakeupLessons(lessons) {
    localStorage.setItem(STORAGE_KEYS.CANCEL_MAKEUP_LESSONS, JSON.stringify(lessons));
}

function loadCancelMakeupLessons() {
    const lessons = getCancelMakeupLessons();
    const container = document.getElementById('cancelMakeupLessonsList');
    
    if (!container) return;
    
    if (lessons.length === 0) {
        container.innerHTML = '<div class="empty-message">등록된 취소/보강 기록이 없습니다.</div>';
        return;
    }
    
    // 최신순으로 정렬
    const sortedLessons = [...lessons].sort((a, b) => new Date(b.date) - new Date(a.date));
    
    container.innerHTML = sortedLessons.map(lesson => `
        <div class="cancel-makeup-item">
            <div class="cancel-makeup-info">
                <h4>${lesson.memberName} - ${formatDate(lesson.date)}</h4>
                <p><strong>유형:</strong> <span class="${lesson.type === 'cancel' ? 'cancel-type' : 'makeup-type'}">${lesson.type === 'cancel' ? '❌ 취소' : '✅ 보강'}</span></p>
                <p><strong>타임 수:</strong> ${lesson.count}타임</p>
                ${lesson.note ? `<p><strong>메모:</strong> ${lesson.note}</p>` : ''}
            </div>
            <button class="delete-btn" onclick="deleteCancelMakeupLesson(${lesson.id})">삭제</button>
        </div>
    `).join('');
}

function deleteCancelMakeupLesson(id) {
    if (!confirm('정말 삭제하시겠습니까?')) return;
    
    const lessons = getCancelMakeupLessons();
    const filtered = lessons.filter(l => l.id !== id);
    saveCancelMakeupLessons(filtered);
    loadCancelMakeupLessons();
    showNotification('취소/보강 기록이 삭제되었습니다.');
}

// ==================== 당일취소 관리 ====================
function addSameDayCancel() {
    const memberName = document.getElementById('sameDayCancelMember').value;
    const date = document.getElementById('sameDayCancelDate').value;
    const type = document.getElementById('sameDayCancelType').value;
    const note = document.getElementById('sameDayCancelNote').value.trim();
    
    if (!memberName) {
        alert('회원을 선택해주세요.');
        return;
    }
    
    if (!date) {
        alert('취소 일자를 확인해주세요.');
        return;
    }
    
    // 오늘 날짜인지 확인
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const cancelDate = new Date(date + 'T00:00:00');
    cancelDate.setHours(0, 0, 0, 0);
    
    if (cancelDate.getTime() !== today.getTime()) {
        alert('당일취소는 오늘 날짜만 가능합니다.');
        return;
    }
    
    let makeupDate = null;
    let makeupTime = null;
    
    if (type === 'makeup') {
        const makeupDateInput = document.getElementById('makeupDate').value;
        const makeupHour = document.getElementById('makeupHour').value;
        const makeupMinute = document.getElementById('makeupMinute').value;
        
        if (!makeupDateInput) {
            alert('보강 일자를 선택해주세요.');
            return;
        }
        
        if (!makeupHour || makeupMinute === '') {
            alert('보강 시간을 선택해주세요.');
            return;
        }
        
        makeupDate = makeupDateInput;
        makeupTime = `${makeupHour}:${makeupMinute}`;
    }
    
    const sameDayCancels = getSameDayCancels();
    const newRecord = {
        id: Date.now(),
        memberName: memberName,
        date: date,
        type: type, // 'deduct', 'makeup', 'coupon'
        makeupDate: makeupDate,
        makeupTime: makeupTime,
        note: note,
        createdAt: new Date().toISOString()
    };
    
    sameDayCancels.push(newRecord);
    saveSameDayCancels(sameDayCancels);
    loadSameDayCancels();
    
    // 입력 필드 초기화
    document.getElementById('sameDayCancelMember').value = '';
    document.getElementById('sameDayCancelNote').value = '';
    document.getElementById('makeupDate').value = '';
    document.getElementById('makeupHour').value = '';
    document.getElementById('makeupMinute').value = '00';
    document.getElementById('makeupOptions').style.display = 'none';
    document.getElementById('sameDayCancelType').value = 'deduct';
    
    const typeText = type === 'deduct' ? '차감' : type === 'makeup' ? '보강' : '쿠폰';
    showNotification(`${memberName} 회원의 당일취소(${typeText})가 등록되었습니다.`);
}

function getSameDayCancels() {
    const cancelsJson = localStorage.getItem(STORAGE_KEYS.SAME_DAY_CANCELS);
    return cancelsJson ? JSON.parse(cancelsJson) : [];
}

function saveSameDayCancels(cancels) {
    localStorage.setItem(STORAGE_KEYS.SAME_DAY_CANCELS, JSON.stringify(cancels));
}

function loadSameDayCancels() {
    const cancels = getSameDayCancels();
    const container = document.getElementById('sameDayCancelsList');
    
    if (!container) return;
    
    if (cancels.length === 0) {
        container.innerHTML = '<div class="empty-message">등록된 당일취소 기록이 없습니다.</div>';
        return;
    }
    
    // 최신순으로 정렬
    const sortedCancels = [...cancels].sort((a, b) => new Date(b.date) - new Date(a.date));
    
    container.innerHTML = sortedCancels.map(cancel => {
        let typeText = '';
        let typeClass = '';
        let details = '';
        
        if (cancel.type === 'deduct') {
            typeText = '❌ 당일취소(차감)';
            typeClass = 'cancel-type';
            details = '레슨 차감 처리';
        } else if (cancel.type === 'makeup') {
            typeText = '✅ 당일취소(보강)';
            typeClass = 'makeup-type';
            details = `보강일: ${formatDate(cancel.makeupDate)} ${cancel.makeupTime}`;
        } else if (cancel.type === 'coupon') {
            typeText = '🎫 당일취소(쿠폰)';
            typeClass = 'coupon-type';
            const couponPrice = getCouponDefaultPrice();
            if (couponPrice > 0) {
                details = `쿠폰 가격: ${couponPrice.toLocaleString()}원`;
            } else {
                details = '쿠폰 기본 가격이 설정되지 않았습니다.';
            }
        }
        
        return `
            <div class="same-day-cancel-item">
                <div class="same-day-cancel-info">
                    <h4>${cancel.memberName} - ${formatDate(cancel.date)}</h4>
                    <p><strong>유형:</strong> <span class="${typeClass}">${typeText}</span></p>
                    <p><strong>${details}</strong></p>
                    ${cancel.note ? `<p><strong>메모:</strong> ${cancel.note}</p>` : ''}
                </div>
                <button class="delete-btn" onclick="deleteSameDayCancel(${cancel.id})">삭제</button>
            </div>
        `;
    }).join('');
}

function deleteSameDayCancel(id) {
    if (!confirm('정말 삭제하시겠습니까?')) return;
    
    const cancels = getSameDayCancels();
    const filtered = cancels.filter(c => c.id !== id);
    saveSameDayCancels(filtered);
    loadSameDayCancels();
    showNotification('당일취소 기록이 삭제되었습니다.');
}

// ==================== 도움말 팝업 ====================
function showHelp() {
    const popup = document.getElementById('helpPopup');
    if (popup) {
        popup.style.display = 'flex';
        document.body.style.overflow = 'hidden';
    }
}

function closeHelp() {
    const popup = document.getElementById('helpPopup');
    if (popup) {
        popup.style.display = 'none';
        document.body.style.overflow = 'auto';
    }
}

function closeHelpOnBackdrop(event) {
    if (event.target.id === 'helpPopup') {
        closeHelp();
    }
}

// ==================== 유효성 검사 함수 ====================
function validateMemberName() {
    const input = document.getElementById('memberName');
    const errorDiv = document.getElementById('memberNameError');
    const value = input.value.trim();
    
    if (!value) {
        input.classList.add('error');
        input.classList.remove('success');
        errorDiv.textContent = '회원 이름을 입력해주세요.';
        errorDiv.classList.add('show');
        return false;
    } else {
        input.classList.remove('error');
        input.classList.add('success');
        errorDiv.classList.remove('show');
        return true;
    }
}

function validateDates() {
    const startDate = document.getElementById('startDate').value;
    const endDate = document.getElementById('endDate').value;
    const startError = document.getElementById('startDateError');
    const endError = document.getElementById('endDateError');
    const startInput = document.getElementById('startDate');
    const endInput = document.getElementById('endDate');
    
    let isValid = true;
    
    if (!startDate) {
        startInput.classList.add('error');
        startInput.classList.remove('success');
        startError.textContent = '시작 일자를 선택해주세요.';
        startError.classList.add('show');
        isValid = false;
    } else {
        startInput.classList.remove('error');
        startInput.classList.add('success');
        startError.classList.remove('show');
    }
    
    if (!endDate) {
        endInput.classList.add('error');
        endInput.classList.remove('success');
        endError.textContent = '종료 일자를 선택해주세요.';
        endError.classList.add('show');
        isValid = false;
    } else {
        endInput.classList.remove('error');
        endInput.classList.add('success');
        endError.classList.remove('show');
    }
    
    if (startDate && endDate && new Date(startDate) > new Date(endDate)) {
        endInput.classList.add('error');
        endInput.classList.remove('success');
        endError.textContent = '종료 일자는 시작 일자보다 늦어야 합니다.';
        endError.classList.add('show');
        isValid = false;
    } else if (startDate && endDate) {
        endInput.classList.remove('error');
        endInput.classList.add('success');
        endError.classList.remove('show');
    }
    
    return isValid;
}

function validateNumber(input, min, max) {
    const value = parseInt(input.value);
    const errorId = input.id + 'Error';
    const errorDiv = document.getElementById(errorId);
    
    if (!input.value || isNaN(value) || value < min || (max && value > max)) {
        input.classList.add('error');
        input.classList.remove('success');
        if (errorDiv) {
            let errorMsg = '';
            if (max) {
                errorMsg = `${min}부터 ${max}까지의 숫자를 입력해주세요.`;
            } else {
                errorMsg = `${min} 이상의 숫자를 입력해주세요.`;
            }
            errorDiv.textContent = errorMsg;
            errorDiv.classList.add('show');
        }
        return false;
    } else {
        input.classList.remove('error');
        input.classList.add('success');
        if (errorDiv) {
            errorDiv.classList.remove('show');
        }
        return true;
    }
}

function validatePrice(input) {
    const value = parseInt(input.value);
    
    if (!input.value || isNaN(value) || value < 0) {
        input.classList.add('error');
        input.classList.remove('success');
        return false;
    } else {
        input.classList.remove('error');
        input.classList.add('success');
        return true;
    }
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
