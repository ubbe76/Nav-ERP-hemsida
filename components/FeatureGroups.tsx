import type { FeatureArea } from "@/content/areas";
import styles from "./FeatureGroups.module.css";

export function FeatureGroups({ area }: { area: FeatureArea }) {
  return (
    <div className={styles.groups}>
      {area.groups.map((group) => (
        <section key={group.id} id={group.id} className={styles.group}>
          <h2 className={styles.title}>{group.title}</h2>
          <ul className={styles.points}>
            {group.points.map((point) => (
              <li key={point}>{point}</li>
            ))}
          </ul>
        </section>
      ))}
    </div>
  );
}
