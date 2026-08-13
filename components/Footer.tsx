import Link from 'next/link';
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
          <nav aria-label="Footer">
            <ul className="footer-nav">
              <li>
                <Link href="/research">Research</Link>
              </li>
              <li>
                <Link href="/platform">Qor</Link>
              </li>
              <li>
                <Link href="/articles">Articles</Link>
              </li>
              <li>
                <Link href="/about">About</Link>
              </li>
              <li>
                <Link href="/contact">Contact</Link>
              </li>
              <li>
                <a href="https://github.com/Unkadlabs">GitHub</a>
              </li>
              <li>
                <a href="https://huggingface.co/unkadlabs">Hugging Face</a>
              </li>
            </ul>
          </nav>
        </div>
        <div className="footer-base">
          <span>© 2026 Unkad Labs · independent research lab · data CC BY-SA 4.0</span>
          <a href="mailto:info@unkad.com">info@unkad.com</a>
        </div>
      </div>
    </footer>
  );
}
