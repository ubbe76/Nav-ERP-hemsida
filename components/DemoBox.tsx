import { MonitorPlay } from "lucide-react";
import { SITE } from "@/lib/site";
import styles from "./DemoBox.module.css";

const DEFAULT_TEXT =
  "Demon är ett påhittat företag som tillverkar storköksinredning, med ordrar, planering, stämplingar och bokföring. Kontot kan bara läsa, så ni kan öppna allt utan att något ändras.";

// The way in without installing anything: the demo with its shared,
// read-only visitor login. `where` points a feature page's visitor to the
// view that shows that area — the demo has no deep links past its login.
export function DemoBox({ where }: { where?: string }) {
  return (
    <aside id="demo" className={styles.box} aria-labelledby="demo-rubrik">
      <MonitorPlay size={22} aria-hidden className={styles.icon} />
      <div>
        <h2 id="demo-rubrik" className={styles.title}>
          {where ? "Se det i demon" : "Prova direkt i webbläsaren"}
        </h2>
        <p>
          {where
            ? `Logga in och öppna ${where}. Demon är ett påhittat företag, och kontot kan bara läsa, så ni kan klicka runt utan att något ändras.`
            : DEFAULT_TEXT}
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
