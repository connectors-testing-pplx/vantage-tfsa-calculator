import { useMemo, useState } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import {
  estimateRoom,
  projectGrowth,
  formatCurrency,
  TFSA_LIMITS,
  LIMIT_YEARS,
  CURRENT_YEAR,
} from "./tfsaData";

const BOOKING_LINK =
  "https://bookings.cloud.microsoft/book/WebsiteBookingsPage@vantagewealth.ca/?ismsaljsauthenabled";

export default function App() {
  // Contribution room inputs
  const [birthYear, setBirthYear] = useState(1990);
  const [contributions, setContributions] = useState(0);
  const [withdrawals, setWithdrawals] = useState(0);

  // Growth calculator inputs
  const [startingBalance, setStartingBalance] = useState(10000);
  const [monthlyContribution, setMonthlyContribution] = useState(500);
  const [annualReturn, setAnnualReturn] = useState(6);
  const [years, setYears] = useState(25);
  const [taxRate, setTaxRate] = useState(30);

  const room = useMemo(
    () => estimateRoom({ birthYear, contributions, withdrawals }),
    [birthYear, contributions, withdrawals]
  );

  const growth = useMemo(
    () =>
      projectGrowth({
        startingBalance,
        monthlyContribution,
        annualReturn,
        years,
        taxRate,
      }),
    [startingBalance, monthlyContribution, annualReturn, years, taxRate]
  );

  return (
    <div className="page">
      <Header />
      <main>
        <Hero />

        <section className="section" id="calculator">
          <div className="container">
            <h2 className="section-title">TFSA Contribution Room Estimator</h2>
            <p className="section-lead">
              See how much TFSA contribution room you may have accumulated. Your
              room grows every year you are 18 or older, is reduced by what you
              contribute, and is restored by withdrawals in the following
              calendar year.
            </p>

            <div className="calc-grid">
              <div className="panel">
                <h3 className="panel-title">Your Details</h3>
                <Field
                  label="Birth year"
                  hint={`You turned 18 in ${Math.max(birthYear + 18, 2009)}${
                    birthYear + 18 < 2009 ? " — TFSA began in 2009, so room starts then" : ""
                  }`}
                >
                  <input
                    type="number"
                    value={birthYear}
                    min={1930}
                    max={CURRENT_YEAR}
                    onChange={(e) => setBirthYear(Number(e.target.value) || 0)}
                  />
                </Field>
                <Field
                  label="Total contributions made so far"
                  hint="Lifetime total you have put in and not withdrawn."
                >
                  <input
                    type="number"
                    value={contributions}
                    min={0}
                    step={500}
                    onChange={(e) => setContributions(Number(e.target.value) || 0)}
                  />
                </Field>
                <Field
                  label="Total past withdrawals"
                  hint="Added back to your room on January 1 of the following year."
                >
                  <input
                    type="number"
                    value={withdrawals}
                    min={0}
                    step={500}
                    onChange={(e) => setWithdrawals(Number(e.target.value) || 0)}
                  />
                </Field>

                <div className="room-result">
                  <div className="room-row">
                    <span>Maximum room accumulated</span>
                    <strong>{formatCurrency(room.maxPossible)}</strong>
                  </div>
                  <div className="room-row highlight">
                    <span>Estimated available room</span>
                    <strong className="gold">
                      {formatCurrency(room.unusedRoom)}
                    </strong>
                  </div>
                  <div className="room-row">
                    <span>Room accrues from</span>
                    <strong>{room.startYear}</strong>
                  </div>
                </div>
              </div>

              <div className="panel">
                <h3 className="panel-title">Annual Limit History</h3>
                <p className="muted small">
                  Official CRA annual TFSA dollar limits. The 2026 limit is
                  $7,000 (cumulative $109,000 since 2009).
                </p>
                <div className="limit-table-wrap">
                  <table className="limit-table">
                    <thead>
                      <tr>
                        <th>Year</th>
                        <th>Limit</th>
                        <th>Cumulative</th>
                      </tr>
                    </thead>
                    <tbody>
                      {(() => {
                        let cum = 0;
                        return [...LIMIT_YEARS].reverse().map((y) => {
                          cum += TFSA_LIMITS[y];
                          const displayCum =
                            LIMIT_YEARS.filter((yy) => yy <= y).reduce(
                              (s, yy) => s + TFSA_LIMITS[yy],
                              0
                            );
                          return (
                            <tr key={y} className={y === CURRENT_YEAR ? "current" : ""}>
                              <td>{y}</td>
                              <td>{formatCurrency(TFSA_LIMITS[y])}</td>
                              <td>{formatCurrency(displayCum)}</td>
                            </tr>
                          );
                        });
                      })()}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="section section-alt" id="growth">
          <div className="container">
            <h2 className="section-title">Investment Growth Comparison</h2>
            <p className="section-lead">
              Compare how the same savings could grow inside a TFSA versus a
              non-registered account, where investment income is taxed each year.
            </p>

            <div className="calc-grid">
              <div className="panel">
                <h3 className="panel-title">Growth Assumptions</h3>
                <Field label="Starting balance ($)">
                  <input
                    type="number"
                    value={startingBalance}
                    min={0}
                    step={1000}
                    onChange={(e) => setStartingBalance(Number(e.target.value) || 0)}
                  />
                </Field>
                <Field label="Monthly contribution ($)">
                  <input
                    type="number"
                    value={monthlyContribution}
                    min={0}
                    step={50}
                    onChange={(e) => setMonthlyContribution(Number(e.target.value) || 0)}
                  />
                </Field>
                <Field label={`Expected annual return — ${annualReturn}%`}>
                  <input
                    type="range"
                    min={0}
                    max={12}
                    step={0.5}
                    value={annualReturn}
                    onChange={(e) => setAnnualReturn(Number(e.target.value))}
                  />
                </Field>
                <Field label={`Number of years — ${years}`}>
                  <input
                    type="range"
                    min={1}
                    max={45}
                    step={1}
                    value={years}
                    onChange={(e) => setYears(Number(e.target.value))}
                  />
                </Field>
                <Field
                  label={`Estimated tax rate (non-registered) — ${taxRate}%`}
                  hint="Your combined marginal rate on investment income."
                >
                  <input
                    type="range"
                    min={0}
                    max={53}
                    step={1}
                    value={taxRate}
                    onChange={(e) => setTaxRate(Number(e.target.value))}
                  />
                </Field>
              </div>

              <div className="panel">
                <h3 className="panel-title">Projected Outcome</h3>
                <div className="results-grid">
                  <ResultCard
                    label="Estimated TFSA value"
                    value={formatCurrency(growth.tfsaFinal)}
                    accent="navy"
                  />
                  <ResultCard
                    label="Estimated non-registered value"
                    value={formatCurrency(growth.nonRegFinal)}
                    accent="slate"
                  />
                  <ResultCard
                    label="Total contributions"
                    value={formatCurrency(growth.totalContrib)}
                    accent="cream"
                  />
                  <ResultCard
                    label="Estimated tax savings"
                    value={formatCurrency(growth.taxSavings)}
                    accent="gold"
                  />
                </div>

                <div className="chart-wrap">
                  <ResponsiveContainer width="100%" height={300}>
                    <LineChart
                      data={growth.series}
                      margin={{ top: 10, right: 15, bottom: 5, left: 0 }}
                    >
                      <CartesianGrid strokeDasharray="3 3" stroke="#e2e2e2" />
                      <XAxis
                        dataKey="year"
                        tick={{ fontSize: 12, fill: "#5a6b7a" }}
                        label={{
                          value: "Years",
                          position: "insideBottom",
                          offset: -2,
                          fontSize: 12,
                          fill: "#5a6b7a",
                        }}
                      />
                      <YAxis
                        tick={{ fontSize: 12, fill: "#5a6b7a" }}
                        tickFormatter={(v) =>
                          v >= 1000 ? `${Math.round(v / 1000)}k` : v
                        }
                        width={48}
                      />
                      <Tooltip
                        formatter={(v) => formatCurrency(v)}
                        contentStyle={{
                          borderRadius: 10,
                          border: "1px solid #e2e2e2",
                          fontFamily: "inherit",
                          fontSize: 13,
                        }}
                      />
                      <Legend wrapperStyle={{ fontSize: 13 }} />
                      <Line
                        type="monotone"
                        dataKey="tfsa"
                        name="TFSA"
                        stroke="#0e3d76"
                        strokeWidth={3}
                        dot={false}
                      />
                      <Line
                        type="monotone"
                        dataKey="nonReg"
                        name="Non-registered"
                        stroke="#c59b4e"
                        strokeWidth={3}
                        dot={false}
                      />
                      <Line
                        type="monotone"
                        dataKey="contributions"
                        name="Contributions"
                        stroke="#7ebec5"
                        strokeWidth={2}
                        strokeDasharray="5 4"
                        dot={false}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="section" id="learn">
          <div className="container">
            <h2 className="section-title">Understanding Your TFSA</h2>
            <div className="edu-grid">
              <article className="edu-card">
                <h3>What is a TFSA?</h3>
                <p>
                  The Tax-Free Savings Account (TFSA) is a registered account that
                  lets Canadians earn investment income — interest, dividends, and
                  capital gains — completely tax-free. Unlike an RRSP, TFSA
                  contributions are not tax-deductible, but all growth and
                  withdrawals are never taxed.
                </p>
              </article>
              <article className="edu-card">
                <h3>How contribution room works</h3>
                <p>
                  Every year you are 18 or older, you accumulate TFSA contribution
                  room — even if you never opened an account. Room you don't use
                  carries forward indefinitely. The annual limit is indexed to
                  inflation and rounded to the nearest $500; it is $7,000 for
                  2026, giving a cumulative $109,000 since the program began in
                  2009.
                </p>
              </article>
              <article className="edu-card">
                <h3>Withdrawals restore room</h3>
                <p>
                  Money you withdraw from a TFSA is added back to your
                  contribution room — but only on January 1 of the following
                  calendar year. This makes the TFSA a flexible tool for mid- and
                  long-term goals, since you can re-contribute later without
                  permanently losing room.
                </p>
              </article>
              <article className="edu-card">
                <h3>Over-contributions carry a penalty</h3>
                <p>
                  Contributing more than your available room triggers a 1% per
                  month tax on the excess amount until it is withdrawn. Tracking
                  your room matters — confirming it through CRA My Account helps
                  you avoid surprises.
                </p>
              </article>
            </div>
          </div>
        </section>

        <section className="section disclaimer" id="disclaimer">
          <div className="container narrow">
            <h2 className="section-title">Disclaimer</h2>
            <p>
              This calculator is for educational purposes only. The results are
              estimates based on simplified assumptions and the information you
              provide — they are not financial advice, a guarantee of future
              returns, or a substitute for professional planning. Investment
              growth is not guaranteed, and the non-registered tax comparison is
              an approximation that may differ from your actual tax situation.
              Always confirm your official TFSA contribution room through{" "}
              <a
                href="https://www.canada.ca/en/revenue-agency/services/e-services/e-services-individuals/account-individuals.html"
                target="_blank"
                rel="noopener noreferrer"
              >
                CRA My Account
              </a>{" "}
              before contributing, and consult a qualified advisor for advice
              tailored to your circumstances.
            </p>
          </div>
        </section>

        <section className="section cta-section" id="book">
          <div className="container narrow center">
            <h2 className="cta-title">Ready to put your TFSA to work?</h2>
            <p className="cta-text">
              A clear strategy turns contribution room into long-term confidence.
              Book a complimentary meeting with Vantage Wealth Management and
              we'll help you map out a plan that fits your goals.
            </p>
            <a className="btn-cta" href={BOOKING_LINK} target="_blank" rel="noopener noreferrer">
              Book a Meeting
            </a>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}

function Header() {
  return (
    <header className="site-header">
      <div className="container header-inner">
        <a className="logo-link" href="#top">
          <img src="/vantage-logo-white.png" alt="Vantage Wealth Management" className="logo" />
        </a>
        <nav className="nav">
          <a href="#calculator">Contribution Room</a>
          <a href="#growth">Growth Calculator</a>
          <a href="#learn">Learn</a>
          <a className="nav-cta" href={BOOKING_LINK} target="_blank" rel="noopener noreferrer">
            Book a Meeting
          </a>
        </nav>
      </div>
    </header>
  );
}

function Hero() {
  return (
    <section className="hero" id="top">
      <div className="container">
        <h1 className="hero-title">TFSA Calculator</h1>
        <p className="hero-sub">
          Estimate your TFSA contribution room and see how tax-free growth could
          compare to a non-registered account — a clear, interactive look at what
          your savings could become.
        </p>
      </div>
    </section>
  );
}

function Field({ label, hint, children }) {
  return (
    <div className="field">
      <label>{label}</label>
      {children}
      {hint && <span className="hint">{hint}</span>}
    </div>
  );
}

function ResultCard({ label, value, accent }) {
  return (
    <div className={`result-card ${accent}`}>
      <span className="result-label">{label}</span>
      <span className="result-value">{value}</span>
    </div>
  );
}

function Footer() {
  return (
    <footer className="site-footer">
      <div className="container footer-inner">
        <div className="footer-brand">
          <img src="/vantage-logo-light.png" alt="Vantage Wealth Management" className="logo footer-logo" />
          <p className="muted small">
            Suite 500, 151 Frederick St., Kitchener, ON N2H 2M2
            <br />
            519-886-1353 &nbsp;|&nbsp; info@vantagewealth.ca
          </p>
        </div>
        <p className="muted small footer-note">
          Mutual funds provided through Worldsource Financial Management Inc.
          This calculator is for educational purposes only and does not
          constitute financial advice.
        </p>
        <p className="muted small">
          &copy; {CURRENT_YEAR} Vantage Wealth Management. All rights reserved.
        </p>
      </div>
    </footer>
  );
}
