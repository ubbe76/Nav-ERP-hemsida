import Link from "next/link";

export default function NotFound() {
  return (
    <div className="container section stack">
      <p className="eyebrow">404</p>
      <h1>Sidan finns inte</h1>
      <p className="lead">Länken kan vara gammal, eller så har sidan flyttat.</p>
      <div className="btnRow">
        <Link href="/" className="btn btnPrimary">
          Till startsidan
        </Link>
        <Link href="/hjalp/" className="btn btnSecondary">
          Till manualen
        </Link>
      </div>
    </div>
  );
}
