"use client";

import { type FormEvent, useEffect, useMemo, useState } from "react";

type CurrencyCode = "EUR" | "USD" | "GBP" | "CHF" | "THB";
type Member = { id: string; username: string };
type Expense = {
  id: string;
  title: string;
  amount: number;
  currency: CurrencyCode;
  amountBase: number;
  exchangeRate: number;
  exchangeRateDate: string;
  paidBy: string;
  participants: string[];
  createdAt: string;
};
type Repayment = { id: string; from: string; to: string; amount: number; createdAt: string };
type TrialState = { members: Member[]; expenses: Expense[]; repayments: Repayment[]; displayCurrency: CurrencyCode };
type Settlement = Omit<Repayment, "id" | "createdAt">;

const CURRENCIES: Array<{ code: CurrencyCode; symbol: string; label: string }> = [
  { code: "EUR", symbol: "€", label: "Euro" },
  { code: "USD", symbol: "$", label: "Dollar US" },
  { code: "GBP", symbol: "£", label: "Livre" },
  { code: "CHF", symbol: "CHF", label: "Franc suisse" },
  { code: "THB", symbol: "฿", label: "Baht thaï" },
];
const CURRENCY_CODES = new Set(CURRENCIES.map((currency) => currency.code));
const EMPTY_STATE: TrialState = { members: [], expenses: [], repayments: [], displayCurrency: "EUR" };
const VISITOR_KEY = "nearly-expense-trial-visitor-v1";
const MAX_TRIAL_EXPENSES = 3;

function money(amount: number, currency: CurrencyCode) {
  return new Intl.NumberFormat("fr-FR", { style: "currency", currency, minimumFractionDigits: 2 }).format(amount / 100);
}

function parseAmount(raw: string) {
  const normalized = raw.trim().replace(/\s/g, "").replace(",", ".");
  if (!/^\d+(?:\.\d{0,2})?$/.test(normalized)) return null;
  const value = Math.round(Number(normalized) * 100);
  return Number.isSafeInteger(value) && value > 0 && value <= 100_000_000 ? value : null;
}

function normalizeState(value: unknown): TrialState {
  if (!value || typeof value !== "object" || Array.isArray(value)) return { ...EMPTY_STATE };
  const candidate = value as Partial<TrialState>;
  const members = Array.isArray(candidate.members)
    ? candidate.members.filter((member): member is Member => Boolean(member && typeof member.id === "string" && typeof member.username === "string")).slice(0, 12)
    : [];
  const memberIds = new Set(members.map((member) => member.id));
  const expenses = Array.isArray(candidate.expenses)
    ? candidate.expenses.filter((expense): expense is Expense => Boolean(
      expense && typeof expense.id === "string" && typeof expense.title === "string"
      && Number.isInteger(expense.amount) && Number.isInteger(expense.amountBase)
      && CURRENCY_CODES.has(expense.currency) && memberIds.has(expense.paidBy)
      && Array.isArray(expense.participants) && expense.participants.every((id) => memberIds.has(id)),
    )).slice(0, MAX_TRIAL_EXPENSES)
    : [];
  const repayments = Array.isArray(candidate.repayments)
    ? candidate.repayments.filter((repayment): repayment is Repayment => Boolean(
      repayment && typeof repayment.id === "string" && memberIds.has(repayment.from)
      && memberIds.has(repayment.to) && Number.isInteger(repayment.amount),
    )).slice(0, 100)
    : [];
  const displayCurrency = CURRENCY_CODES.has(candidate.displayCurrency as CurrencyCode)
    ? candidate.displayCurrency as CurrencyCode
    : "EUR";
  return { members, expenses, repayments, displayCurrency };
}

function calculateBalances(state: TrialState) {
  const balances: Record<string, number> = Object.fromEntries(state.members.map((member) => [member.id, 0]));
  state.expenses.forEach((expense) => {
    balances[expense.paidBy] += expense.amountBase;
    const participantIds = [...new Set(expense.participants)].sort();
    const base = Math.floor(expense.amountBase / participantIds.length);
    const remainder = expense.amountBase % participantIds.length;
    participantIds.forEach((id, index) => { balances[id] -= base + (index < remainder ? 1 : 0); });
  });
  state.repayments.forEach((repayment) => {
    balances[repayment.from] += repayment.amount;
    balances[repayment.to] -= repayment.amount;
  });
  return balances;
}

function calculateSettlements(balances: Record<string, number>): Settlement[] {
  const debtors = Object.entries(balances).filter(([, amount]) => amount < 0).map(([id, amount]) => ({ id, amount: -amount })).sort((a, b) => b.amount - a.amount);
  const creditors = Object.entries(balances).filter(([, amount]) => amount > 0).map(([id, amount]) => ({ id, amount })).sort((a, b) => b.amount - a.amount);
  const settlements: Settlement[] = [];
  let debtorIndex = 0;
  let creditorIndex = 0;
  while (debtorIndex < debtors.length && creditorIndex < creditors.length) {
    const amount = Math.min(debtors[debtorIndex].amount, creditors[creditorIndex].amount);
    settlements.push({ from: debtors[debtorIndex].id, to: creditors[creditorIndex].id, amount });
    debtors[debtorIndex].amount -= amount;
    creditors[creditorIndex].amount -= amount;
    if (!debtors[debtorIndex].amount) debtorIndex++;
    if (!creditors[creditorIndex].amount) creditorIndex++;
  }
  return settlements;
}

async function fetchRate(base: CurrencyCode, quote: CurrencyCode) {
  const response = await fetch(`/api/exchange-rate?base=${base}&quote=${quote}`);
  const payload = await response.json() as { rate?: number; date?: string; error?: string };
  if (!response.ok || !payload.rate) throw new Error(payload.error || "Taux indisponible.");
  return { rate: payload.rate, date: payload.date || new Date().toISOString().slice(0, 10) };
}

export default function ExpenseDemo() {
  const [trialStatus, setTrialStatus] = useState<"starting" | "active" | "blocked" | "error">("starting");
  const [trialId, setTrialId] = useState("");
  const [state, setState] = useState<TrialState>(EMPTY_STATE);
  const [saveStatus, setSaveStatus] = useState<"saved" | "saving" | "error">("saved");
  const [newPerson, setNewPerson] = useState("");
  const [title, setTitle] = useState("");
  const [amount, setAmount] = useState("");
  const [currency, setCurrency] = useState<CurrencyCode>("EUR");
  const [paidBy, setPaidBy] = useState("");
  const [participants, setParticipants] = useState<string[]>([]);
  const [displayRate, setDisplayRate] = useState(1);
  const [displayRateDate, setDisplayRateDate] = useState("");
  const [rateLoading, setRateLoading] = useState(false);
  const [adding, setAdding] = useState(false);
  const [notice, setNotice] = useState("Créez au moins deux personnes pour commencer.");
  const [formError, setFormError] = useState("");

  async function claimTrial(visitorId: string) {
    setTrialStatus("starting");
    try {
      const response = await fetch("/api/expense-trial", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ visitorId }),
      });
      const payload = await response.json() as { allowed?: boolean; resumed?: boolean; state?: unknown };
      if (response.status === 409 || !payload.allowed) {
        setTrialStatus("blocked");
        return;
      }
      const next = normalizeState(payload.state);
      setState(next);
      setPaidBy(next.members[0]?.id || "");
      setParticipants(next.members.map((member) => member.id));
      setTrialId(visitorId);
      localStorage.setItem(VISITOR_KEY, visitorId);
      setNotice(payload.resumed ? "Votre essai a été repris là où vous l’aviez laissé." : "Ajoutez les personnes qui participent aux dépenses.");
      setTrialStatus("active");
    } catch {
      setTrialStatus("error");
    }
  }

  useEffect(() => {
    const visitorId = localStorage.getItem(VISITOR_KEY) || crypto.randomUUID();
    void claimTrial(visitorId);
  }, []);

  useEffect(() => {
    if (trialStatus !== "active" || !trialId) return;
    setSaveStatus("saving");
    const timeout = window.setTimeout(async () => {
      try {
        const response = await fetch("/api/expense-trial", {
          method: "PUT",
          headers: { "content-type": "application/json" },
          body: JSON.stringify({ visitorId: trialId, state }),
        });
        setSaveStatus(response.ok ? "saved" : "error");
      } catch {
        setSaveStatus("error");
      }
    }, 500);
    return () => window.clearTimeout(timeout);
  }, [state, trialId, trialStatus]);

  useEffect(() => {
    if (trialStatus !== "active") return;
    let cancelled = false;
    setRateLoading(true);
    fetchRate("EUR", state.displayCurrency)
      .then(({ rate, date }) => { if (!cancelled) { setDisplayRate(rate); setDisplayRateDate(date); } })
      .catch(() => { if (!cancelled) { setDisplayRate(1); setFormError("Le taux d’affichage est temporairement indisponible."); } })
      .finally(() => { if (!cancelled) setRateLoading(false); });
    return () => { cancelled = true; };
  }, [state.displayCurrency, trialStatus]);

  const balances = useMemo(() => calculateBalances(state), [state]);
  const settlements = useMemo(() => calculateSettlements(balances), [balances]);
  const totalBase = state.expenses.reduce((sum, expense) => sum + expense.amountBase, 0);
  const parsedAmount = parseAmount(amount);
  const displayMinor = (baseMinor: number) => Math.round(baseMinor * displayRate);
  const displayMoney = (baseMinor: number) => money(displayMinor(baseMinor), state.displayCurrency);

  function username(id: string) {
    return state.members.find((member) => member.id === id)?.username ?? "inconnu";
  }

  function addPerson(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const username = newPerson.trim().replace(/^@/, "");
    if (username.length < 2 || username.length > 24) {
      setFormError("Le prénom doit contenir entre 2 et 24 caractères.");
      return;
    }
    if (state.members.some((member) => member.username.toLocaleLowerCase("fr") === username.toLocaleLowerCase("fr"))) {
      setFormError("Cette personne existe déjà.");
      return;
    }
    if (state.members.length >= 12) {
      setFormError("La démo accepte jusqu’à 12 personnes.");
      return;
    }
    const member = { id: crypto.randomUUID(), username };
    setState((current) => ({ ...current, members: [...current.members, member] }));
    setParticipants((current) => [...current, member.id]);
    if (!paidBy) setPaidBy(member.id);
    setNewPerson("");
    setFormError("");
    setNotice(`${username} a rejoint l’essai.`);
  }

  function removePerson(id: string) {
    const used = state.expenses.some((expense) => expense.paidBy === id || expense.participants.includes(id))
      || state.repayments.some((repayment) => repayment.from === id || repayment.to === id);
    if (used) {
      setFormError("Cette personne participe déjà à l’historique et ne peut plus être supprimée.");
      return;
    }
    setState((current) => ({ ...current, members: current.members.filter((member) => member.id !== id) }));
    setParticipants((current) => current.filter((memberId) => memberId !== id));
    if (paidBy === id) setPaidBy(state.members.find((member) => member.id !== id)?.id || "");
  }

  function toggleParticipant(id: string) {
    setParticipants((current) => current.includes(id) ? current.filter((memberId) => memberId !== id) : [...current, id]);
  }

  async function addExpense(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!title.trim() || !parsedAmount || !paidBy || !participants.length || adding) return;
    if (state.expenses.length >= MAX_TRIAL_EXPENSES) {
      setFormError("La limite de 3 frais pour cet essai est atteinte. Supprimez-en un pour continuer à tester.");
      return;
    }
    setAdding(true);
    setFormError("");
    try {
      const conversion = await fetchRate(currency, "EUR");
      const expense: Expense = {
        id: crypto.randomUUID(),
        title: title.trim(),
        amount: parsedAmount,
        currency,
        amountBase: Math.round(parsedAmount * conversion.rate),
        exchangeRate: conversion.rate,
        exchangeRateDate: conversion.date,
        paidBy,
        participants: [...participants],
        createdAt: new Date().toISOString(),
      };
      setState((current) => ({ ...current, expenses: [...current.expenses, expense] }));
      setTitle("");
      setAmount("");
      setNotice("Dépense ajoutée : tous les soldes ont été recalculés.");
    } catch (error) {
      setFormError(error instanceof Error ? error.message : "Impossible d’ajouter la dépense.");
    } finally {
      setAdding(false);
    }
  }

  function deleteExpense(id: string) {
    setState((current) => ({ ...current, expenses: current.expenses.filter((expense) => expense.id !== id) }));
    setNotice("Dépense supprimée et soldes recalculés.");
  }

  function markRepaid(settlement: Settlement) {
    setState((current) => ({ ...current, repayments: [...current.repayments, { ...settlement, id: crypto.randomUUID(), createdAt: new Date().toISOString() }] }));
    setNotice(`Remboursement de ${displayMoney(settlement.amount)} enregistré.`);
  }

  function undoRepayment(id: string) {
    setState((current) => ({ ...current, repayments: current.repayments.filter((repayment) => repayment.id !== id) }));
    setNotice("Remboursement annulé et soldes recalculés.");
  }

  if (trialStatus !== "active") {
    return (
      <div className="expense-trial-gate">
        <div className="expense-trial-gate__icon" aria-hidden="true">◎</div>
        <p className="expense-step">Essai automatique · Une fois par visiteur</p>
        <h3>{trialStatus === "blocked" ? "Votre essai a déjà été utilisé." : "Votre espace se prépare."}</h3>
        <p>{trialStatus === "blocked"
          ? "Un essai a déjà été démarré depuis cette connexion. Retrouvez l’expérience complète dans l’application Nearly."
          : "L’interface s’ouvre automatiquement, sans compte et sans bouton intermédiaire."}</p>
        {trialStatus === "starting" && <div className="expense-trial-loading"><span /><span /><span /><small>Préparation automatique…</small></div>}
        {trialStatus === "error" && <button type="button" onClick={() => void claimTrial(localStorage.getItem(VISITOR_KEY) || crypto.randomUUID())}>Réessayer</button>}
        {trialStatus === "blocked" && <a className="button button--primary" href="#telecharger">Télécharger Nearly <span aria-hidden="true">↗</span></a>}
        <small>Votre IP est transformée en empreinte irréversible et n’est jamais stockée en clair.</small>
      </div>
    );
  }

  return (
    <div className="expense-demo expense-demo--complete">
      <div className="expense-form">
        <div className="expense-demo__bar">
          <div><span className="expense-demo__dot" /> Essai actif · {state.expenses.length}/{MAX_TRIAL_EXPENSES} frais</div>
          <span className={`expense-save-state expense-save-state--${saveStatus}`}>{saveStatus === "saving" ? "Sauvegarde…" : saveStatus === "error" ? "Non sauvegardé" : "Sauvegardé"}</span>
        </div>

        <form className="expense-member-form" onSubmit={addPerson}>
          <div><p className="expense-step">01 · Participants web</p><h3>Créez votre groupe.</h3></div>
          <div className="expense-member-input"><input value={newPerson} onChange={(event) => setNewPerson(event.target.value)} placeholder="Prénom ou pseudo" maxLength={24} /><button type="submit" aria-label="Ajouter cette personne">+</button></div>
        </form>
        <div className="expense-members-created">
          {state.members.map((member) => <span key={member.id}><i>{member.username.slice(0, 1).toUpperCase()}</i>@{member.username}<button type="button" onClick={() => removePerson(member.id)} aria-label={`Supprimer ${member.username}`}>×</button></span>)}
          {!state.members.length && <small>Ajoutez la première personne — aucun compte Nearly requis.</small>}
        </div>

        <form onSubmit={addExpense}>
          <p className="expense-step expense-step--new">02 · Nouvelle dépense</p>
          <label className="expense-label" htmlFor="expense-title">Quoi ?</label>
          <input id="expense-title" value={title} onChange={(event) => setTitle(event.target.value)} placeholder="Ex. Courses du week-end" maxLength={60} />

          <label className="expense-label" htmlFor="expense-amount">Combien ?</label>
          <div className="expense-amount-input">
            <input id="expense-amount" value={amount} onChange={(event) => setAmount(event.target.value)} placeholder="0,00" inputMode="decimal" />
            <span>{CURRENCIES.find((item) => item.code === currency)?.symbol}</span>
          </div>
          <div className="expense-currencies" aria-label="Devise de la dépense">
            {CURRENCIES.map((item) => <button className={currency === item.code ? "is-selected" : ""} type="button" onClick={() => setCurrency(item.code)} key={item.code} aria-pressed={currency === item.code}><strong>{item.code}</strong><small>{item.symbol}</small></button>)}
          </div>
          {currency !== "EUR" && <p className="expense-rate-hint">Le taux vers l’euro sera récupéré puis figé à l’ajout.</p>}

          <fieldset>
            <legend className="expense-label">Qui a payé ?</legend>
            <div className="expense-people">
              {state.members.map((member) => <button className={paidBy === member.id ? "is-selected" : ""} type="button" onClick={() => setPaidBy(member.id)} key={member.id} aria-pressed={paidBy === member.id}><i>{member.username.slice(0, 1).toUpperCase()}</i>@{member.username}<span>✓</span></button>)}
            </div>
          </fieldset>

          <fieldset>
            <legend className="expense-label">Pour qui ?</legend>
            <button className="expense-select-all" type="button" onClick={() => setParticipants(state.members.map((member) => member.id))}>Tout le monde</button>
            <div className="expense-people expense-people--participants">
              {state.members.map((member) => <button className={participants.includes(member.id) ? "is-selected" : ""} type="button" onClick={() => toggleParticipant(member.id)} key={member.id} aria-pressed={participants.includes(member.id)}><i>{participants.includes(member.id) ? "✓" : ""}</i>@{member.username}</button>)}
            </div>
          </fieldset>
          <p className="expense-split-hint">Répartition équitable, au centime près.</p>
          {state.expenses.length >= MAX_TRIAL_EXPENSES && <p className="expense-limit-note"><span>✓</span> Les 3 frais de l’essai ont été utilisés. Supprimez un frais dans l’historique pour en tester un autre.</p>}
          {formError && <p className="expense-form-error" role="alert">{formError}</p>}
          <button className="expense-submit" type="submit" disabled={state.expenses.length >= MAX_TRIAL_EXPENSES || state.members.length < 2 || !title.trim() || !parsedAmount || !paidBy || !participants.length || adding}>{state.expenses.length >= MAX_TRIAL_EXPENSES ? "Limite de 3 frais atteinte" : adding ? "Conversion en cours…" : "Ajouter et recalculer"}<span aria-hidden="true">→</span></button>
        </form>
      </div>

      <div className="expense-ledger">
        <div className="expense-ledger-toolbar">
          <div><p className="expense-step">03 · Tableau partagé</p><strong>Frais partagés</strong></div>
          <label>Afficher en <select value={state.displayCurrency} onChange={(event) => setState((current) => ({ ...current, displayCurrency: event.target.value as CurrencyCode }))}>{CURRENCIES.map((item) => <option value={item.code} key={item.code}>{item.code}</option>)}</select></label>
        </div>
        <div className="expense-total">
          <span aria-hidden="true">◎</span>
          <div><small>Total du groupe</small><strong>{rateLoading ? "…" : displayMoney(totalBase)}</strong><p>{state.expenses.length}/{MAX_TRIAL_EXPENSES} frais · {state.displayCurrency}{displayRateDate ? ` · taux du ${new Date(displayRateDate).toLocaleDateString("fr-FR", { day: "numeric", month: "short" })}` : ""}</p></div>
        </div>

        <div className="expense-ledger__heading"><p className="expense-step">Soldes</p><span>positif = à recevoir</span></div>
        <div className="expense-balances">
          {state.members.length ? state.members.map((member) => {
            const balance = balances[member.id] || 0;
            return <div key={member.id}><span>@{member.username}</span><strong className={balance > 0 ? "is-positive" : balance < 0 ? "is-negative" : ""}>{balance > 0 ? "+" : ""}{displayMoney(balance)}</strong><small>{balance > 0 ? "à recevoir" : balance < 0 ? "à rembourser" : "à jour"}</small></div>;
          }) : <p className="expense-empty-ledger">Les soldes apparaîtront après la création du groupe.</p>}
        </div>

        <p className="expense-step expense-step--settle">Pour équilibrer</p>
        <div className="expense-settlements" aria-live="polite">
          {settlements.length ? settlements.map((settlement) => <div className="expense-settlement" key={`${settlement.from}-${settlement.to}`}><div><span><strong>@{username(settlement.from)}</strong> rembourse <strong>@{username(settlement.to)}</strong></span><b>{displayMoney(settlement.amount)}</b></div><button type="button" onClick={() => markRepaid(settlement)}>J’ai remboursé <span aria-hidden="true">›</span></button></div>)
            : <div className="expense-all-set"><span>✓</span><div><strong>{state.expenses.length ? "Tout est réglé !" : "Aucun remboursement"}</strong><small>{state.expenses.length ? "Le groupe est parfaitement à jour." : "Ajoutez une dépense pour lancer le calcul."}</small></div></div>}
        </div>

        {state.repayments.length > 0 && <div className="expense-repayments"><p className="expense-step">Remboursements enregistrés</p>{state.repayments.slice().reverse().map((repayment) => <div key={repayment.id}><span>✓</span><p><strong>@{username(repayment.from)}</strong> a remboursé <strong>@{username(repayment.to)}</strong><small>{new Date(repayment.createdAt).toLocaleDateString("fr-FR", { day: "numeric", month: "short" })}</small></p><b>{displayMoney(repayment.amount)}</b><button type="button" onClick={() => undoRepayment(repayment.id)} aria-label="Annuler ce remboursement">×</button></div>)}</div>}

        <p className="expense-notice" aria-live="polite">{notice}</p>
        <div className="expense-list">
          {state.expenses.slice().reverse().map((expense) => <div key={expense.id}><span>▤</span><div><strong>{expense.title}</strong><small>Payé par @{username(expense.paidBy)} · {expense.participants.length} participants</small>{expense.currency !== state.displayCurrency && <small>≈ {displayMoney(expense.amountBase)} · taux figé le {new Date(expense.exchangeRateDate).toLocaleDateString("fr-FR")}</small>}</div><b>{money(expense.amount, expense.currency)}</b><button type="button" onClick={() => deleteExpense(expense.id)} aria-label={`Supprimer ${expense.title}`}>×</button></div>)}
        </div>
      </div>
    </div>
  );
}
