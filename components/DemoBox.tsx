import { MonitorPlay } from "lucide-react";
import { SITE } from "@/lib/site";
import styles from "./DemoBox.module.css";

// The way in without installing anything: the demo with its shared,
// read-only visitor login.
export function DemoBox() {
  return (
    <aside id="demo" className={styles.box} aria-labelledby="demo-rubrik">
      <MonitorPlay size={22} aria-hidden className={styles.icon} />
      <div>
        <h2 id="demo-rubrik" className={styles.title}>
          Prova direkt i webbläsaren
        </h2>
        <p>
          Demon är ett påhittat företag som tillverkar storköksinredning, med ordrar, planering, stämplingar och
          bokföring. Kontot kan bara läsa, så ni kan öppna allt utan att något ändras.
        </p>
        <dl className={styles.login}>
          <div>
            <dt>Adress</dt>
            <dd>
              <a href={SITE.demo.url}>{SITE.demo.url.replace("https://", "")}</a>
            </dd>
          </div>
          <div>
            <dt>E-post</dt>
            <dd>
              <code>{SITE.demo.user}</code>
            </dd>
          </div>
          <div>
            <dt>Lösenord</dt>
            <dd>
              <code>{SITE.demo.password}</code>
            </dd>
          </div>
        </dl>
      </div>
    </aside>
  );
}
