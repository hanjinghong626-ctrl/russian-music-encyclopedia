'use client';

export default function Footer() {
  return (
    <footer className="site-footer">
      <div className="footer-inner">
        <div className="footer-title">
          俄罗斯音乐百科
          <span className="footer-cyr"> · Энциклопедия</span>
        </div>
        <div className="footer-rule" />
        <p className="footer-desc">
          «Музыка — это разум, воплощённый в прекрасной форме.»<br/>
          Иван Тургенев
        </p>
        <div className="footer-copy">
          © 2026 Russian Music Encyclopedia · All Rights Reserved
        </div>
      </div>
    </footer>
  );
}
