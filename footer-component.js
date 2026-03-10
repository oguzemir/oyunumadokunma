// footer-component.js
class SiteFooter extends HTMLElement {
    connectedCallback() {
        this.innerHTML = `
        <style>
            footer { 
                background: #ffffff; padding: 40px 5%; display: flex; 
                justify-content: space-between; align-items: flex-start; 
                color: #65676b; font-size: 0.9rem; border-top: 1px solid #eee;
                font-family: 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
            }
            .footer-left { text-align: left; }
            .footer-right { text-align: right; }
            .footer-desc { margin-top: 10px; max-width: 400px; margin-left: auto; line-height: 1.6; }
            @media (max-width: 768px) {
                footer { flex-direction: column; text-align: center; align-items: center; gap: 20px; }
                .footer-left, .footer-right { text-align: center; }
            }
        </style>
        <footer>
            <div class="footer-left">
                <a href="https://x.com/oyunumad0kunma" target="_blank" style="text-decoration:none; color:inherit; font-weight:bold; display: inline-block; padding: 10px 20px; background-color: #f4f7fb; border-radius: 20px;">
                    Bize Ulaş
                </a>
            </div>
            <div class="footer-right">
                <div style="font-weight: bold; color: #2d2d3a;">© 2026, OYUNUMADOKUNMA</div>
                <div class="footer-desc">Bu web sitesi yeni yasalara tepki çekmek için oyun dünyasından insanlar tarafından oluşturulmuştur.</div>
            </div>
        </footer>
        `;
    }
}

customElements.define('main-footer', SiteFooter);