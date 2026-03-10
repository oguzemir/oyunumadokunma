// header-component.js
class SiteHeader extends HTMLElement {
    connectedCallback() {
        this.innerHTML = `
        <style>
            header { 
                padding: 20px 5%; display: flex; justify-content: space-between; 
                align-items: center; background: white; border-bottom: 1px solid #eee;
                position: sticky; top: 0; z-index: 50;
                font-family: 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
            }
            
            .hashtag { 
                font-weight: 800; 
                color: #2d2d3a; 
                font-size: 1rem;
                padding: 10px 20px;
                background-color: #f4f7fb;
                border-radius: 30px;
                border: 1px solid #e2e8f0;
                transition: all 0.3s ease;
                cursor: default;
                user-select: none;
                text-decoration: none;
            }
            
            .nav-menu { display: flex; gap: 25px; align-items: center; }
            .nav-menu a { 
                text-decoration: none; 
                color: #65676b; 
                font-weight: 600; 
                font-size: 0.95rem; 
                transition: color 0.2s; 
            }
            .nav-menu a:hover { color: #2f00ff; }

            .nav-menu .back-link {
                color: #2f00ff;
                border: 2px solid #2f00ff;
                padding: 8px 20px;
                border-radius: 20px;
                transition: 0.2s;
            }
            .nav-menu .back-link:hover {
                background: #2f00ff;
                color: white;
            }

            @media (max-width: 768px) {
                header { flex-direction: column; gap: 15px; text-align: center; }
                .nav-menu { flex-wrap: wrap; justify-content: center; gap: 12px; }
            }
        </style>
        <header>
            <a href="index.html" class="hashtag">oyuncularadokunma.com | #OYUNUMADOKUNMA</a>
            <nav class="nav-menu">
                ${this.getAttribute('page') === 'comments' 
                    ? '<a href="index.html" class="back-link">← Ana Sayfaya Dön</a>' 
                    : `
                    <a href="index.html#anasayfa">Anasayfa</a>
                    <a href="index.html#manifesto">İlkelerimiz ve Yaklaşımımız</a>
                    <a href="index.html#acik-cagri">Sayın Yetkililere Açık Çağrı</a>
                    <a href="index.html#commentsArea">Oyuncu Yorumları</a>
                    `
                }
            </nav>
        </header>
        `;
    }
}

customElements.define('main-header', SiteHeader);