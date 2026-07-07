export default function Footer() {
  return (
    <footer className="site-footer">
      <div className="container">
        <p>© 2026 Dhig Labs · Mogadishu, Somalia</p>
        <p>
          {/* PLACEHOLDER: confirm GitHub / Hugging Face org URLs */}
          <a href="https://github.com/dhiglabs">GitHub</a> ·{' '}
          <a href="https://huggingface.co/dhiglabs">Hugging Face</a> ·{' '}
          <a href="mailto:info@dhiglabs.org">Email</a>
        </p>
        {/* VERIFY SOMALI: "words are wealth" — confirm with founders before launch */}
        <p className="flourish" lang="so">
          Ereyada waa hanti.
        </p>
      </div>
    </footer>
  );
}
