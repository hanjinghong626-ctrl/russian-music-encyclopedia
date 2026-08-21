'use client';

export default function Footer() {
  return (
    <footer className="site-footer">
      <div className="footer-inner">
        <div className="footer-brand">
          <span className="footer-logo">Энциклопедия</span>
          <p className="footer-desc">俄罗斯音乐百科知识库 · 一部听得见的音乐俄罗斯</p>
        </div>
        <div className="footer-meta">
          <span>1665 词条</span><span className="footer-dot">·</span>
          <span>双语中俄对照</span><span className="footer-dot">·</span>
          <span>4333 交叉引用</span>
        </div>
        <div className="footer-line" />
        <p className="footer-copy">© {new Date().getFullYear()} Russian Music Encyclopedia · Built with Next.js</p>
      </div>
    </footer>
  );
}
