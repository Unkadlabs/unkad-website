export default function Footer() {
  return (
    <footer className="site-footer">
      <div className="container">
        <p>© 2026 Unkad Labs · Mogadishu, Somalia</p>
        <p>
          <a href="https://github.com/unkadlabs">GitHub</a> ·{' '}
          <a href="https://huggingface.co/unkadlabs">Hugging Face</a> ·{' '}
          <a href="https://x.com/unkadlabs">X</a> ·{' '}
          <a href="mailto:info@unkad.com">Email</a>
        </p>
        {/* VERIFY SOMALI: "words are wealth" — confirm with founders before launch */}
        <p className="flourish" lang="so">
          Ereyada waa hanti.
        </p>
      </div>
    </footer>
  );
}
