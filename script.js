// ===== Selectors =====
const balanceEl = document.getElementById('balance');
const incomeEl = document.getElementById('money-plus');
const expenseEl = document.getElementById('money-minus');
const listEl = document.querySelector('.list');
const formEl = document.getElementById('form');
const textInput = document.getElementById('text');
const amountInput = document.getElementById('amount');

// ===== State =====
let transactions = [];

// ===== Utility Functions =====

// Generate a unique transaction ID
const generateID = () => Date.now() + Math.floor(Math.random() * 1000);

// Format number with currency sign
const formatCurrency = num => {
  const sign = num < 0 ? '-' : '+';
  return `${sign}$${Math.abs(num).toFixed(2)}`;
};

// ===== DOM Manipulation =====

// Render a single transaction item
function renderTransaction({ id, text, amount }) {
  const li = document.createElement('li');
  li.className = amount < 0 ? 'minus' : 'plus';
  li.innerHTML = `
    ${text}
    <span>${formatCurrency(amount)}</span>
    <button class="delete-btn" data-id="${id}">x</button>
  `;
  listEl.appendChild(li);
}

// Update all balance info
function updateSummary() {
  const amounts = transactions.map(tx => tx.amount);
  const total = amounts.reduce((acc, val) => acc + val, 0);
  const income = amounts.filter(val => val > 0).reduce((acc, val) => acc + val, 0);
  const expense = amounts.filter(val => val < 0).reduce((acc, val) => acc + val, 0);

  balanceEl.textContent = `$${total.toFixed(2)}`;
  incomeEl.textContent = `+$${income.toFixed(2)}`;
  expenseEl.textContent = `-$${Math.abs(expense).toFixed(2)}`;
}

// Re-render all transactions
function renderTransactions() {
  listEl.innerHTML = '';
  transactions.forEach(renderTransaction);
}

// ===== Event Handlers =====

function handleFormSubmit(e) {
  e.preventDefault();

  const text = textInput.value.trim();
  const amount = +amountInput.value.trim();

  if (!text || isNaN(amount)) {
    alert('Please enter a valid description and amount');
    return;
  }

  const newTransaction = {
    id: generateID(),
    text,
    amount
  };

  transactions.push(newTransaction);
  renderTransaction(newTransaction);
  updateSummary();

  textInput.value = '';
  amountInput.value = '';
}

function handleDeleteClick(e) {
  if (!e.target.classList.contains('delete-btn')) return;

  const id = +e.target.getAttribute('data-id');
  transactions = transactions.filter(tx => tx.id !== id);
  renderTransactions();
  updateSummary();
}

// ===== Initialization =====

function init() {
  formEl.addEventListener('submit', handleFormSubmit);
  listEl.addEventListener('click', handleDeleteClick);

  // For future: Load from localStorage here
  renderTransactions();
  updateSummary();
}

init();
