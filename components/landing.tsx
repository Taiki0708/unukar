import Image from "next/image";
import { SignupForm } from "./signup-form";
const Arrow = () => <span aria-hidden="true">↗</span>;
function Label({
  number,
  children,
}: {
  number: string;
  children: React.ReactNode;
}) {
  return (
    <p className="eyebrow">
      <span>{number} /</span> {children}
    </p>
  );
}
function CTA({ light = false }: { light?: boolean }) {
  return (
    <a className={`button ${light ? "button-light" : ""}`} href="#founding">
      BECOME A FOUNDING TRAVELER <Arrow />
    </a>
  );
}
export function Landing() {
  return (
    <>
      <a className="skip-link" href="#main">
        Skip to content
      </a>
      <header className="header wrap">
        <a href="#" className="wordmark" aria-label="UNUKAR home">
          UNUKAR
        </a>
        <nav aria-label="Main navigation">
          <a href="#how-it-works">The idea</a>
          <a href="#journey-book">The Journey Book</a>
          <a href="#founding" className="nav-cta">
            Join the journey <Arrow />
          </a>
        </nav>
      </header>
      <main id="main">
        <section className="hero wrap">
          <div className="hero-top">
            <p className="eyebrow">FOR THE JOURNEY THAT CHANGES YOU</p>
            <p className="hero-edition">A memory project by UNUKAR · No. 001</p>
          </div>
          <div className="hero-copy">
            <h1>
              YOUR YEAR ABROAD
              <br />
              DESERVES MORE THAN
              <br />A <em>CAMERA ROLL.</em>
            </h1>
            <div className="hero-aside">
              <p>
                One photo. Thirty seconds of your voice. Keep the people, places
                and context that shaped where your journey went next.
              </p>
              <CTA />
              <a
                className="text-link"
                href="/demo"
                style={{ display: "flex", width: "fit-content", marginTop: 16 }}
              >
                Try UNUKAR <Arrow />
              </a>
              <p className="small-note">Less documenting. More living.</p>
            </div>
          </div>
          <figure className="hero-photo">
            <Image
              src="/images/hero.jpg"
              alt="A river winding between lush mountains in Laos"
              fill
              priority
              sizes="(max-width: 800px) 100vw, 90vw"
            />
            <div className="photo-overlay">
              <span>THE PLACES STAY WITH YOU.</span>
              <span>So should the people.</span>
            </div>
            <figcaption>
              <span>FIELD NOTES — LAOS</span>
              <span>A detour can change everything.</span>
            </figcaption>
          </figure>
          <div className="hero-bottom">
            <span>COLLECT MOMENTS. KEEP THE CONNECTIONS.</span>
            <a href="#the-problem">
              A little further down <span aria-hidden="true">↓</span>
            </a>
          </div>
        </section>
        <section id="the-problem" className="problem wrap section">
          <Label number="01">THE THINGS A PHOTO CAN’T HOLD</Label>
          <div className="problem-grid">
            <h2>
              You have the photo.
              <br />
              But do you remember
              <br />
              <em>the story?</em>
            </h2>
            <div className="prose">
              <p>
                The name of the person beside you. The conversation that lasted
                until sunrise. The recommendation that changed your route.
              </p>
              <p>
                A camera roll keeps what it looked like. The little things that
                made it matter are easier to lose.
              </p>
              <p className="underlined">
                Keep the part that doesn’t fit in the frame.
              </p>
            </div>
          </div>
        </section>
        <section id="how-it-works" className="how section">
          <div className="wrap">
            <div className="section-heading">
              <div>
                <Label number="02">
                  A LITTLE MEMORY. A WHOLE LOT OF MEANING.
                </Label>
                <h2>
                  Less documenting.
                  <br />
                  <em>More living.</em>
                </h2>
              </div>
              <p>
                Under a minute to keep a moment.
                <br />
                Then get back to being in it.
              </p>
            </div>
            <div className="steps">
              {[
                {
                  n: "01",
                  title: "Photo",
                  icon: "◩",
                  text: "One photo. The person, the place, or the small thing you want to remember.",
                },
                {
                  n: "02",
                  title: "Voice",
                  icon: "≋",
                  text: "Thirty seconds in your own words. Who was there? What happened? Why did it matter?",
                },
                {
                  n: "03",
                  title: "People",
                  icon: "◎",
                  text: "Keep names with faces, and the connections that made your trip yours.",
                },
                {
                  n: "04",
                  title: "Place",
                  icon: "⌖",
                  text: "Give the moment a home. See where it happened and where it led next.",
                },
              ].map((step) => (
                <article className="step" key={step.n}>
                  <div className="step-top">
                    <span>{step.n}</span>
                    <span aria-hidden="true">{step.icon}</span>
                  </div>
                  <h3>{step.title}</h3>
                  <p>{step.text}</p>
                </article>
              ))}
            </div>
            <p className="how-foot">
              YOU CAPTURE THE MOMENT. UNUKAR CONNECTS THE PEOPLE, PLACE, AND
              CONTEXT.
            </p>
          </div>
        </section>
        <section className="connections wrap section">
          <Label number="03">THE JOURNEY BETWEEN THE PLACES</Label>
          <div className="section-heading">
            <h2>
              Places show where you went.
              <br />
              People explain <em>how you got there.</em>
            </h2>
            <p>
              Sometimes, your next destination
              <br />
              starts with someone else’s story.
            </p>
          </div>
          <div className="story">
            <div className="story-photo">
              <Image
                src="/images/people.jpg"
                alt="Travelers sharing a moment along the journey"
                fill
                sizes="(max-width: 800px) 100vw, 38vw"
              />
              <span className="paper-caption">
                The best part wasn’t on the itinerary.
              </span>
            </div>
            <div className="story-route">
              <p className="eyebrow">ONE JOURNEY. A FEW CHANCE ENCOUNTERS.</p>
              <ol>
                <li>
                  <span className="route-dot" />
                  <div>
                    <span className="route-place">BANGKOK, THAILAND</span>
                    <h3>You met Emma.</h3>
                    <p>
                      Over a conversation, she told you about Laos.
                      <br />
                      You changed your plans.
                    </p>
                  </div>
                </li>
                <li>
                  <span className="route-dot" />
                  <div>
                    <span className="route-place">LUANG PRABANG, LAOS</span>
                    <h3>Then you met Luca.</h3>
                    <p>
                      He talked about the mountains in Georgia.
                      <br />
                      The idea stayed with you.
                    </p>
                  </div>
                </li>
                <li>
                  <span className="route-dot" />
                  <div>
                    <span className="route-place">
                      SOME MONTHS LATER · GEORGIA
                    </span>
                    <h3>And there you were.</h3>
                    <p>A new place. A connection all the way back to Emma.</p>
                  </div>
                </li>
              </ol>
              <p className="example-note">
                An illustrative journey. Yours will have its own turns.
              </p>
            </div>
          </div>
        </section>
        <section id="journey-book" className="book-section section">
          <div className="wrap book-grid">
            <div className="book-preview">
              <div className="book-spread">
                <div className="book-page book-left">
                  <p>UNUKAR / JOURNEY NO. 001</p>
                  <h3>
                    A year
                    <br />
                    of becoming.
                  </h3>
                  <span>
                    THE PEOPLE.
                    <br />
                    THE PLACES.
                    <br />
                    EVERYTHING IN BETWEEN.
                  </span>
                  <div className="book-rule" />
                  <small>YOUR JOURNEY, IN YOUR WORDS.</small>
                </div>
                <div className="book-page book-right">
                  <div className="book-image">
                    <Image
                      src="/images/hero.jpg"
                      alt="Sample Journey Book photograph of Laos"
                      fill
                      sizes="30vw"
                    />
                  </div>
                  <p>03 — THE DETOUR</p>
                  <h4>All because of Emma.</h4>
                  <span>Bangkok → Laos → Georgia</span>
                </div>
              </div>
              <p className="preview-note">THE JOURNEY BOOK · CONCEPT PREVIEW</p>
            </div>
            <div className="book-copy">
              <Label number="04">SOMETHING YOU CAN HOLD</Label>
              <h2>
                A chapter of your life.
                <br />
                <em>Not just a folder.</em>
              </h2>
              <p>
                When the backpacks are unpacked, the journey deserves a place on
                your bookshelf.
              </p>
              <p>
                Your memories can become a premium physical Journey Book.
                Photos, your words, and the people who connected one place to
                the next — brought together in a book that feels like you.
              </p>
              <a href="#founding" className="text-link">
                Be part of its first chapter <Arrow />
              </a>
            </div>
          </div>
        </section>
        <section className="audience section wrap">
          <Label number="05">FOR THE LONG WAY ROUND</Label>
          <div className="audience-grid">
            <h2>
              For a few months away.
              <br />
              And a lifetime <em>after.</em>
            </h2>
            <div>
              <p>
                For anyone making a life somewhere else, even just for a while.
              </p>
              <ul>
                {[
                  "Long-term travelers",
                  "Backpackers",
                  "Gap-year travelers",
                  "Working holiday travelers",
                  "Study-abroad students",
                  "Your 3–12 month journey",
                ].map((t) => (
                  <li key={t}>{t}</li>
                ))}
              </ul>
            </div>
          </div>
        </section>
        <section id="founding" className="founding section">
          <div className="wrap founding-grid">
            <div>
              <Label number="06">THE FIRST CHAPTER STARTS WITH YOU</Label>
              <h2>
                Your journey.
                <br />
                Our beginning.
              </h2>
              <p>
                We’re building UNUKAR for people who travel a little longer and
                want to remember a little deeper.
              </p>
              <p>
                Become a founding traveler to hear about early access and help
                shape what comes next.
              </p>
            </div>
            <div className="signup-panel">
              <span className="eyebrow">BECOME A FOUNDING TRAVELER</span>
              <h3>
                Take the memories
                <br />
                home with you.
              </h3>
              <SignupForm />
              <p className="founding-note">
                Currently in the making. Built around real journeys.
              </p>
            </div>
          </div>
        </section>
      </main>
      <footer className="footer wrap">
        <div>
          <a href="#" className="wordmark">
            UNUKAR
          </a>
          <p>Keep what made the journey.</p>
        </div>
        <p>© {new Date().getFullYear()} UNUKAR</p>
        <a href="#main">Back to the beginning ↑</a>
      </footer>
    </>
  );
}
