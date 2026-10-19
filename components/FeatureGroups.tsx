import type { FeatureArea } from "@/content/areas";
import styles from "./FeatureGroups.module.css";

// The body of a feature page: what the area does, one case walked through,
// what is missing, and the questions people ask. Each is a row with its title
// to the left, like the groups.
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
      <section id="exempel" className={styles.group}>
        <h2 className={styles.title}>{area.example.title}</h2>
        <div className={styles.text}>
          {area.example.intro && <p>{area.example.intro}</p>}
          <ol className={styles.steps}>
            {area.example.steps.map((step) => (
              <li key={step}>{step}</li>
            ))}
          </ol>
        </div>
      </section>
      <section id="saknas" className={styles.group}>
        <h2 className={styles.title}>Det här saknas i dag</h2>
        <ul className={styles.points}>
          {area.limits.map((limit) => (
            <li key={limit}>{limit}</li>
          ))}
        </ul>
      </section>
      <section id="fragor" className={styles.group}>
        <h2 className={styles.title}>Vanliga frågor</h2>
        <div className={styles.faq}>
          {area.faq.map(({ question, answer }) => (
            <div key={question}>
              <h3 className={styles.question}>{question}</h3>
              <p>{answer}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
