import UnkadMark from './UnkadMark';

export default function Footer() {
  return (
    <footer className="site-footer">
      <div className="container">
        <div className="footer-top">
          <span className="footer-brand">
            <UnkadMark size={15} />
            Unkad Labs
          </span>
          <ul className="footer-nav">
            <li>
              <a href="/research">Research</a>
            </li>
            <li>
              <a href="/platform">Qor</a>
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
            <li>
              <a href="https://github.com/Unkadlabs">GitHub</a>
            </li>
            <li>
              <a href="https://huggingface.co/unkadlabs">Hugging Face</a>
            </li>
          </ul>
        </div>
        <div className="footer-base">
          <span>© 2026 Unkad Labs · independent research lab · data CC BY-SA 4.0</span>
          <a href="mailto:info@unkad.com">info@unkad.com</a>
        </div>
      </div>
    </footer>
  );
}
