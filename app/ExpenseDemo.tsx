"use client";

import { type FormEvent, useMemo, useState } from "react";

type Member = { id: string; username: string; initial: string };
type Expense = { id: number; title: string; amount: number; paidBy: string; participants: string[] };
type Repayment = { from: string; to: string; amount: number };

const members: Member[] = [
  { id: "camille", username: "camille", initial: "C" },
  { id: "lou", username: "lou", initial: "L" },
  { id: "noa", username: "noa", initial: "N" },
];

const initialExpenses: Expense[] = [
  { id: 1, title: "Dîner", amount: 8400, paidBy: "camille", participants: members.map((member) => member.id) },
  { id: 2, title: "Taxi", amount: 3300, paidBy: "lou", participants: members.map((member) => member.id) },
];

function money(amount: number) {
  return new Intl.NumberFormat("fr-FR", { style: "currency", currency: "EUR" }).format(amount / 100);
}

function parseAmount(raw: string) {
  const normalized = raw.trim().replace(/\s/g, "").replace(",", ".");
  if (!/^\d+(?:\.\d{0,2})?$/.test(normalized)) return null;
  const value = Math.round(Number(normalized) * 100);
  return Number.isSafeInteger(value) && value > 0 ? value : null;
}

function calculateSettlements(balances: Record<string, number>) {
  const debtors = Object.entries(balances)
    .filter(([, amount]) => amount < 0)
    .map(([id, amount]) => ({ id, amount: -amount }))
    .sort((a, b) => b.amount - a.amount);
  const creditors = Object.entries(balances)
    .filter(([, amount]) => amount > 0)
    .map(([id, amount]) => ({ id, amount }))
    .sort((a, b) => b.amount - a.amount);
  const settlements: Repayment[] = [];
  let debtorIndex = 0;
  let creditorIndex = 0;

  while (debtorIndex < debtors.length && creditorIndex < creditors.length) {
    const amount = Math.min(debtors[debtorIndex].amount, creditors[creditorIndex].amount);
    settlements.push({ from: debtors[debtorIndex].id, to: creditors[creditorIndex].id, amount });
    debtors[debtorIndex].amount -= amount;
    creditors[creditorIndex].amount -= amount;
    if (debtors[debtorIndex].amount === 0) debtorIndex++;
    if (creditors[creditorIndex].amount === 0) creditorIndex++;
  }

  return settlements;
}

export default function ExpenseDemo() {
  const [expenses, setExpenses] = useState(initialExpenses);
  const [repayments, setRepayments] = useState<Repayment[]>([]);
  const [title, setTitle] = useState("");
  const [amount, setAmount] = useState("");
  const [paidBy, setPaidBy] = useState("camille");
  const [participants, setParticipants] = useState(members.map((member) => member.id));
  const [notice, setNotice] = useState("Deux dépenses sont déjà ajoutées. À vous de jouer.");

  const balances = useMemo(() => {
    const next: Record<string, number> = Object.fromEntries(members.map((member) => [member.id, 0]));

    expenses.forEach((expense) => {
      next[expense.paidBy] += expense.amount;
      const sortedParticipants = [...expense.participants].sort();
      const base = Math.floor(expense.amount / sortedParticipants.length);
      const remainder = expense.amount % sortedParticipants.length;
      sortedParticipants.forEach((id, index) => {
        next[id] -= base + (index < remainder ? 1 : 0);
      });
    });

    repayments.forEach((repayment) => {
      next[repayment.from] += repayment.amount;
      next[repayment.to] -= repayment.amount;
    });

    return next;
  }, [expenses, repayments]);

  const settlements = useMemo(() => calculateSettlements(balances), [balances]);
  const total = expenses.reduce((sum, expense) => sum + expense.amount, 0);
  const parsedAmount = parseAmount(amount);

  function username(id: string) {
    return members.find((member) => member.id === id)?.username ?? id;
  }

  function addExpense(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!title.trim() || !parsedAmount || participants.length === 0) return;
    setExpenses((current) => [
      ...current,
      { id: Date.now(), title: title.trim(), amount: parsedAmount, paidBy, participants: [...participants] },
    ]);
    setTitle("");
    setAmount("");
    setNotice("Dépense ajoutée : Nearly a recalculé tous les soldes.");
  }

  function toggleParticipant(id: string) {
    setParticipants((current) => current.includes(id) ? current.filter((memberId) => memberId !== id) : [...current, id]);
  }

  function markRepaid(repayment: Repayment) {
    setRepayments((current) => [...current, repayment]);
    setNotice(`Remboursement de ${money(repayment.amount)} enregistré.`);
  }

  function reset() {
    setExpenses(initialExpenses);
    setRepayments([]);
    setTitle("");
    setAmount("");
    setPaidBy("camille");
    setParticipants(members.map((member) => member.id));
    setNotice("Démo réinitialisée.");
  }

  return (
    <div className="expense-demo">
      <form className="expense-form" onSubmit={addExpense}>
        <div className="expense-demo__bar">
          <div><span className="expense-demo__dot" /> Démo interactive</div>
          <button type="button" onClick={reset}>Réinitialiser</button>
        </div>
        <p className="expense-step">01 · Nouvelle dépense</p>
        <h3>Ajoutez la vôtre.</h3>

        <label className="expense-label" htmlFor="expense-title">Quoi ?</label>
        <input id="expense-title" value={title} onChange={(event) => setTitle(event.target.value)} placeholder="Ex. Courses du week-end" maxLength={60} />

        <label className="expense-label" htmlFor="expense-amount">Combien ?</label>
        <div className="expense-amount-input">
          <input id="expense-amount" value={amount} onChange={(event) => setAmount(event.target.value)} placeholder="0,00" inputMode="decimal" aria-describedby="expense-currency" />
          <span id="expense-currency">EUR</span>
        </div>

        <fieldset>
          <legend className="expense-label">Qui a payé ?</legend>
          <div className="expense-people">
            {members.map((member) => (
              <button className={paidBy === member.id ? "is-selected" : ""} type="button" onClick={() => setPaidBy(member.id)} key={member.id} aria-pressed={paidBy === member.id}>
                <i>{member.initial}</i>@{member.username}<span>✓</span>
              </button>
            ))}
          </div>
        </fieldset>

        <fieldset>
          <legend className="expense-label">Pour qui ?</legend>
          <button className="expense-select-all" type="button" onClick={() => setParticipants(members.map((member) => member.id))}>Tout le monde</button>
          <div className="expense-people expense-people--participants">
            {members.map((member) => (
              <button className={participants.includes(member.id) ? "is-selected" : ""} type="button" onClick={() => toggleParticipant(member.id)} key={member.id} aria-pressed={participants.includes(member.id)}>
                <i>{participants.includes(member.id) ? "✓" : ""}</i>@{member.username}
              </button>
            ))}
          </div>
        </fieldset>

        <p className="expense-split-hint">Répartition équitable, au centime près.</p>
        <button className="expense-submit" type="submit" disabled={!title.trim() || !parsedAmount || participants.length === 0}>Ajouter et recalculer <span aria-hidden="true">→</span></button>
      </form>

      <div className="expense-ledger">
        <div className="expense-total">
          <span aria-hidden="true">◎</span>
          <div><small>Total du groupe</small><strong>{money(total)}</strong><p>{expenses.length} dépenses · EUR</p></div>
        </div>

        <div className="expense-ledger__heading">
          <p className="expense-step">02 · Soldes</p>
          <span>positif = à recevoir</span>
        </div>
        <div className="expense-balances">
          {members.map((member) => {
            const balance = balances[member.id];
            return (
              <div key={member.id}>
                <span>@{member.username}</span>
                <strong className={balance > 0 ? "is-positive" : balance < 0 ? "is-negative" : ""}>{balance > 0 ? "+" : ""}{money(balance)}</strong>
                <small>{balance > 0 ? "à recevoir" : balance < 0 ? "à rembourser" : "à jour"}</small>
              </div>
            );
          })}
        </div>

        <p className="expense-step expense-step--settle">03 · Pour équilibrer</p>
        <div className="expense-settlements" aria-live="polite">
          {settlements.length ? settlements.map((settlement) => (
            <div className="expense-settlement" key={`${settlement.from}-${settlement.to}`}>
              <div>
                <span><strong>@{username(settlement.from)}</strong> rembourse <strong>@{username(settlement.to)}</strong></span>
                <b>{money(settlement.amount)}</b>
              </div>
              <button type="button" onClick={() => markRepaid(settlement)}>J’ai remboursé <span aria-hidden="true">›</span></button>
            </div>
          )) : (
            <div className="expense-all-set"><span>✓</span><div><strong>Tout est réglé !</strong><small>La bande est parfaitement à jour.</small></div></div>
          )}
        </div>

        <p className="expense-notice" aria-live="polite">{notice}</p>
        <div className="expense-list">
          {expenses.slice().reverse().map((expense) => (
            <div key={expense.id}><span>▤</span><div><strong>{expense.title}</strong><small>Payé par @{username(expense.paidBy)} · {expense.participants.length} participants</small></div><b>{money(expense.amount)}</b></div>
          ))}
        </div>
      </div>
    </div>
  );
}
