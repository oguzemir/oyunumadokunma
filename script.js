// --- FIREBASE AYARLARI ---
const firebaseConfig = {
    apiKey: "AIzaSyBxuEgFO9pi40pXuzU5xPw7R6jKARO9-28",
    authDomain: "oyunumadokunma-10092.firebaseapp.com",
    databaseURL: "https://oyunumadokunma-10092-default-rtdb.firebaseio.com",
    projectId: "oyunumadokunma-10092",
    storageBucket: "oyunumadokunma-10092.firebasestorage.app",
    messagingSenderId: "540099047387",
    appId: "1:540099047387:web:e55e636ae4b4f9e86e01fe",
    measurementId: "G-PKYXD0NLPY"
};

firebase.initializeApp(firebaseConfig);
const db = firebase.database();

// --- KÖTÜ SÖZ FİLTRESİ ---
// JSON yerine doğrudan array kullanıyoruz ki yerel çalışmada sorun olmasın.
const forbiddenWords = [
    "amk", "rte", "oe", "akp", "chp", "ak parti", "erdoğan", "recep", "tayyip",
    "meclis", "milletvekili", "milletvekilleri", "hdp", "dem", "islam", "sex"
];

function filterText(text) {
    if(!text) return "";
    let filtered = text;
    forbiddenWords.forEach(word => {
        const reg = new RegExp(word, "gi");
        filtered = filtered.replace(reg, "***");
    });
    return filtered;
}

// --- ORTAK SAYAÇLAR (Sadece Ana Sayfada Çalışır) ---
let commentsCount = 0;  
let onlySupportCount = 0;

function updateDisplays() {
    const totalPlayers = commentsCount + onlySupportCount;
    const formattedPlayers = totalPlayers.toLocaleString('tr-TR');
    const formattedComments = commentsCount.toLocaleString('tr-TR');

    document.querySelectorAll('.countDisplay').forEach(el => el.textContent = formattedPlayers);
    document.querySelectorAll('.commentCountDisplay').forEach(el => el.textContent = formattedComments);
    
    const statPlayersEl = document.getElementById('stat-players');
    const statCommentsEl = document.getElementById('stat-comments');
    if(statPlayersEl) statPlayersEl.textContent = formattedPlayers;
    if(statCommentsEl) statCommentsEl.textContent = formattedComments;
}

db.ref('signatureCount').on('value', s => { commentsCount = s.val() || 0; updateDisplays(); });
db.ref('onlySupportCount').on('value', s => { onlySupportCount = s.val() || 0; updateDisplays(); });
db.ref('xShareCount').on('value', s => {
    const val = (s.val() || 0).toLocaleString('tr-TR');
    document.querySelectorAll('.xShareCountDisplay').forEach(el => el.textContent = val);
});

// --- DESTEKÇİLER ---
// JSON dosyasından çekmek yerine doğrudan buraya ekledik ki her ortamda sorunsuz çalışsın.
const supportersTrack = document.getElementById('supportersTrack');
if (supportersTrack) {
    const supportersData = [
        { 
            file: "1_talentnode.png", 
            title: "Talent Node", 
            desc: "TalentNode, oyun sektöründeki yetenekleri keşfeden ve doğru projelerle buluşturan bir girişimdir.",
            link: "https://discord.com/invite/wsRBYk9qQX/" 
        },
        { 
            file: "2_3dakademi.png", 
            title: "3D Akademi", 
            desc: "3D Akademi, geleceğin 3D sanatçılarına ve oyun geliştiricilerine destek olan bir topluluktur.",
            link: "https://discord.com/invite/7VhvB3aPMk" 
        },
        { 
            file: "3_dottopus.png", 
            title: "Dottopus", 
            desc: "Dottopus, oyun geliştiricileri, tasarımcılar ve oyun meraklılarını bir araya getiren bir topluluktur. Amaçları yerel oyun geliştirme ekosistemini güçlendirmek.",
            link: "https://www.instagram.com/dottopus" 
        },
        { 
            file: "4_ggog.png", 
            title: "GGOG Derneği", 
            desc: "Genç Girişimciler ve Oyun Geliştiricileri Derneği (GGOG), genç yetenekleri ve girişimcileri bir araya getirerek eğitim, mentorluk ve bağlantı fırsatları sunmayı amaçlayan bir oluşumdur. Türkiye’yi oyun geliştirme ve teknoloji girişimciliğinde güçlü bir merkez haline getirmeyi hedefler.",
            link: "https://ggogd.org/" 
        }
    ];

    supportersData.sort((a, b) => a.file.localeCompare(b.file));
    let imagesHTML = "";
    
    supportersData.forEach((data, index) => {
        imagesHTML += `<img src="supporter/${data.file}" alt="${data.title}" class="supporter-img" data-index="${index}">`;
    });
    
    supportersTrack.innerHTML = imagesHTML.repeat(6);

    document.querySelectorAll('.supporter-img').forEach(img => {
        img.addEventListener('click', (e) => {
            const index = e.target.getAttribute('data-index');
            const supportItem = supportersData[index];
            
            document.getElementById('supporterPopupTitle').innerText = supportItem.title;
            document.getElementById('supporterPopupDesc').innerText = supportItem.desc;
            document.getElementById('supporterPopupImg').src = `supporter/${supportItem.file}`;
            document.getElementById('supporterPopupLink').href = supportItem.link;
            
            document.getElementById('supporterDetailOverlay').style.display = 'flex';
        });
    });
}

// --- YORUMLARI OLUŞTURMA FONKSİYONU ---
function createCommentElement(data, key) {
    const userName = data.name || "Bir Destekçi";
    const likesCount = data.likes || 0;
    
    const div = document.createElement('div');
    div.className = 'comment-item';
    div.innerHTML = `
        <div class="quote-mark">“</div>
        <div class="comment-msg">${data.msg}</div>
        <div class="comment-author"><strong>${userName}</strong></div>
        <div class="comment-footer">
            <div class="like-btn like-btn-${key}" data-key="${key}">
                <svg viewBox="0 0 24 24"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path></svg>
                <span class="like-count-${key}">${likesCount}</span>
            </div>
            <div class="dots-menu">•••</div>
        </div>
    `;

    const likeBtn = div.querySelector(`.like-btn-${key}`);
    likeBtn.addEventListener('click', function() {
        if(this.classList.contains('liked')) return;
        document.querySelectorAll(`.like-btn-${key}`).forEach(b => b.classList.add('liked'));
        db.ref('comments/' + key + '/likes').transaction(currentLikes => (currentLikes || 0) + 1);
    });

    return div;
}

db.ref('comments').on('child_changed', s => {
    const data = s.val();
    const countSpans = document.querySelectorAll(`.like-count-${s.key}`);
    countSpans.forEach(span => { span.innerText = data.likes || 0; });
});

// --- SAYFAYA GÖRE YORUM ÇEKME ---
const mainPageCommentList = document.getElementById('commentList');
const allCommentsList = document.getElementById('allCommentsList');

// --- ANA SAYFA 3x3 ÖNE ÇIKANLAR IZGARASI ---
if (mainPageCommentList) {
    // Sadece isFeatured: true olanları dinle
    db.ref('comments').orderByChild('isFeatured').equalTo(true).on('value', snapshot => {
        mainPageCommentList.innerHTML = ""; // Mevcut listeyi temizle
        
        let count = 0;
        const featuredComments = [];

        snapshot.forEach(child => {
            featuredComments.push({ data: child.val(), key: child.key });
        });

        // En yeni öne çıkarılanları üstte göstermek için ters çeviriyoruz
        featuredComments.reverse().forEach(item => {
            if (count < 9) { // 3x3 kuralı: Maksimum 9 yorum
                const commentEl = createCommentElement(item.data, item.key);
                mainPageCommentList.appendChild(commentEl);
                count++;
            }
        });

        // EĞER 9'DAN AZ ÖNE ÇIKARILAN VARSA:
        // Boşluk kalmaması için kalan slotları son gelen normal yorumlarla doldur
        if (count < 9) {
            db.ref('comments').limitToLast(20).once('value', latestSnapshot => {
                latestSnapshot.forEach(c => {
                    const cData = c.val();
                    // Eğer bu yorum zaten öne çıkarılanlarda yoksa ekle
                    if (count < 9 && !cData.isFeatured) {
                        mainPageCommentList.appendChild(createCommentElement(cData, c.key));
                        count++;
                    }
                });
            });
        }
    });
}

if (allCommentsList) {
    db.ref('comments').limitToLast(150).on('child_added', s => {
        const commentEl = createCommentElement(s.val(), s.key);
        allCommentsList.prepend(commentEl);
    });
}

// --- FORM, İMZA VE PAYLAŞIM ---
const mainSignBtn = document.getElementById('mainSignBtn');
if (mainSignBtn) {
    const input = document.getElementById('userInput');
    const formOverlay = document.getElementById('formOverlay');
    const confirmBtn = document.getElementById('confirmSignBtn');
    const onlySupportBtn = document.getElementById('onlySupportBtn');

    mainSignBtn.onclick = () => {
        if(input.value.trim().length < 5) { alert("Lütfen biraz daha detaylı bir görüş yazın."); return; }
        formOverlay.style.display = 'flex';
    };

    confirmBtn.onclick = () => {
        const msg = input.value.trim();
        let nickname = document.getElementById('nameInput').value.trim();
        if (!nickname) nickname = "Bir Destekçi";

        db.ref('signatureCount').transaction(c => (c || 0) + 1);
        db.ref('comments').push({
            name: filterText(nickname), msg: filterText(msg),
            likes: 0, timestamp: Date.now()
        });

        setupShareLinks();
        input.value = "";
        formOverlay.style.display = 'none';
        document.getElementById('successOverlay').style.display = 'flex';
    };

    onlySupportBtn.onclick = () => {
        db.ref('onlySupportCount').transaction(c => (c || 0) + 1);
        setupShareLinks();
        document.getElementById('successOverlay').style.display = 'flex';
    };

    function setupShareLinks() {
        const twUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent("Ben de #OYUNUMADOKUNMA hashtag'ine imza verdim. Sen de ses ver. https://oyuncularadokunma.com")}`;
        const twShareBtn = document.getElementById('twShare');
        if(twShareBtn) {
            twShareBtn.href = twUrl;
            twShareBtn.onclick = () => { db.ref('xShareCount').transaction(c => (c || 0) + 1); };
        }
    }

    const downloadTrigger = document.getElementById('downloadTrigger');
    if (downloadTrigger) {
        downloadTrigger.onclick = function(e) {
            e.preventDefault();
            const imageUrl = this.getAttribute('href');
            fetch(imageUrl)
                .then(res => { if(!res.ok) throw new Error(); return res.blob(); })
                .then(blob => {
                    const url = window.URL.createObjectURL(blob);
                    const a = document.createElement('a');
                    a.style.display = 'none'; a.href = url; a.download = 'OYUNUMADOKUNMA.png';
                    document.body.appendChild(a); a.click();
                    setTimeout(() => { window.URL.revokeObjectURL(url); document.body.removeChild(a); }, 100);
                })
                .catch(() => window.open(imageUrl, '_blank'));
        };
    }
}

// script.js içine ekle ve konsolu kontrol et (F12)
function loadFooter() {
    const footerContainer = document.getElementById('footer-placeholder');
    if (!footerContainer) return;

    fetch('footer.html')
        .then(response => {
            if (!response.ok) throw new Error("Footer dosyası bulunamadı!");
            return response.text();
        })
        .then(data => {
            footerContainer.innerHTML = data;
            console.log("Footer başarıyla yüklendi.");
        })
        .catch(error => {
            console.error("Hata:", error);
            // Hata durumunda kullanıcıya bir şey göstermek istersen:
            footerContainer.innerHTML = "<p style='text-align:center; padding:20px;'>Footer yüklenemedi.</p>";
        });
}

document.addEventListener('DOMContentLoaded', loadFooter);