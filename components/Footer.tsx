import UnkadMark from './UnkadMark';

export default function Footer() {
  return (
    <footer className="site-footer">
      <div className="container">
        <div className="footer-grid">
          <div>
            <span className="footer-brand">
              <UnkadMark size={15} />
              Unkad Labs
            </span>
            <p className="footer-blurb">
              A non-profit AI research laboratory in Mogadishu, Somalia, measuring whether AI
              systems behave safely in Somali and building the open data that answering
              that question requires.
            </p>
          </div>
          <div className="footer-col">
            <p className="footer-head">Lab</p>
            <ul>
              <li>
                <a href="/research">Research</a>
              </li>
              <li>
                <a href="/platform">Platform</a>
              </li>
              <li>
                <a href="/articles">Articles</a>
              </li>
              <li>
                <a href="/about">About</a>
              </li>
              <li>
                <a href="/contact">Contact</a>
              </li>
            </ul>
          </div>
          <div className="footer-col">
            <p className="footer-head">Connect</p>
            <ul>
              <li>
                <a href="https://qor.unkad.com">Qor Af-Soomaali</a>
              </li>
              <li>
                <a href="https://huggingface.co/unkadlabs">Hugging Face</a>
              </li>
              <li>
                <a href="https://github.com/unkadlabs">GitHub</a>
              </li>
              <li>
                <a href="https://x.com/unkadlabs">X</a>
              </li>
              <li>
                <a href="https://www.linkedin.com/company/unkadlabs">LinkedIn</a>
              </li>
              <li>
                <a href="mailto:info@unkad.com">info@unkad.com</a>
              </li>
            </ul>
          </div>
        </div>
        <div className="footer-base">
          <span style={{ fontFamily: 'var(--mono)', fontSize: '0.74rem' }}>
            © 2026 Unkad Labs · Mogadishu, Somalia · CC BY-SA 4.0 data
          </span>
          {/* VERIFY SOMALI: "words are wealth", confirm with founders before launch */}
          <span className="flourish" lang="so" style={{ margin: 0 }}>
            Ereyada waa hanti.
          </span>
        </div>
      </div>
    </footer>
  );
}
