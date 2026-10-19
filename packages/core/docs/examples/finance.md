# Financial Calculations Examples

FixedPrecision is ideal for financial calculations where decimal precision is critical.

## Basic Financial Operations

### Currency Calculations

```typescript
import FixedPrecision from "fixed-precision";

// Create currency values (2 decimal places for most currencies)
const USD = FixedPrecision.create({ places: 2 });

const price = USD("19.99");
const quantity = 3;
const taxRate = USD("0.08"); // 8%

// Calculate total with tax
const subtotal = price.mul(quantity); // $59.97
const tax = subtotal.mul(taxRate);    // $4.7976 → $4.80 (rounded)
const total = subtotal.add(tax);      // $64.77

console.log(`Subtotal: $${subtotal.toString()}`);
console.log(`Tax: $${tax.round(2).toString()}`);
console.log(`Total: $${total.round(2).toString()}`);
```

### Interest Calculations

```typescript
function calculateCompoundInterest(
  principal: FixedPrecision,
  annualRate: FixedPrecision,
  years: number,
  compoundsPerYear: number = 1
): FixedPrecision {
  const ratePerPeriod = annualRate.div(compoundsPerYear);
  const periods = years * compoundsPerYear;
  
  // A = P(1 + r/n)^(nt)
  const base = new FixedPrecision(1).add(ratePerPeriod);
  const exponent = base.pow(periods);
  return principal.mul(exponent);
}

// Example: $1,000 at 5% annual interest, compounded monthly for 10 years
const principal = new FixedPrecision("1000.00");
const annualRate = new FixedPrecision("0.05"); // 5%

const futureValue = calculateCompoundInterest(principal, annualRate, 10, 12);
console.log(`Future value: $${futureValue.round(2).toString()}`); // $1,647.01
```

### Loan Amortization

```typescript
function calculateMonthlyPayment(
  principal: FixedPrecision,
  annualRate: FixedPrecision,
  years: number
): FixedPrecision {
  const monthlyRate = annualRate.div(12);
  const months = years * 12;
  
  // P = [r * PV] / [1 - (1 + r)^-n]
  const numerator = monthlyRate.mul(principal);
  const denominator = new FixedPrecision(1).sub(
    new FixedPrecision(1).add(monthlyRate).pow(-months)
  );
  
  return numerator.div(denominator);
}

function generateAmortizationSchedule(
  principal: FixedPrecision,
  annualRate: FixedPrecision,
  years: number
) {
  const monthlyPayment = calculateMonthlyPayment(principal, annualRate, years);
  let remainingBalance = principal;
  const monthlyRate = annualRate.div(12);
  
  console.log("Month | Payment | Interest | Principal | Balance");
  console.log("------|---------|----------|-----------|--------");
  
  for (let month = 1; month <= years * 12; month++) {
    const interest = remainingBalance.mul(monthlyRate);
    const principalPaid = monthlyPayment.sub(interest);
    remainingBalance = remainingBalance.sub(principalPaid);
    
    if (remainingBalance.lt(0)) {
      remainingBalance = new FixedPrecision(0);
    }
    
    console.log(
      `${month.toString().padStart(4)} | ` +
      `$${monthlyPayment.round(2).toString().padStart(7)} | ` +
      `$${interest.round(2).toString().padStart(8)} | ` +
      `$${principalPaid.round(2).toString().padStart(9)} | ` +
      `$${remainingBalance.round(2).toString()}`
    );
  }
}

// Example: $200,000 mortgage at 4% for 30 years
const mortgage = new FixedPrecision("200000.00");
const mortgageRate = new FixedPrecision("0.04");

generateAmortizationSchedule(mortgage, mortgageRate, 30);
```

## Investment Calculations

### Portfolio Returns

```typescript
interface Investment {
  amount: FixedPrecision;
  returnRate: FixedPrecision;
  years: number;
}

function calculatePortfolioValue(investments: Investment[]): FixedPrecision {
  return investments.reduce((total, investment) => {
    const futureValue = investment.amount.mul(
      new FixedPrecision(1).add(investment.returnRate).pow(investment.years)
    );
    return total.add(futureValue);
  }, new FixedPrecision(0));
}

const portfolio: Investment[] = [
  { amount: new FixedPrecision("10000.00"), returnRate: new FixedPrecision("0.07"), years: 10 },
  { amount: new FixedPrecision("5000.00"), returnRate: new FixedPrecision("0.05"), years: 5 },
  { amount: new FixedPrecision("2000.00"), returnRate: new FixedPrecision("0.03"), years: 3 },
];

const portfolioValue = calculatePortfolioValue(portfolio);
console.log(`Portfolio value: $${portfolioValue.round(2).toString()}`);
```

### Dollar-Cost Averaging

```typescript
function calculateDollarCostAverage(
  investments: FixedPrecision[],
  amounts: FixedPrecision[]
): FixedPrecision {
  const totalInvested = amounts.reduce((sum, amount) => sum.add(amount), new FixedPrecision(0));
  const totalShares = investments.reduce((sum, investment) => sum.add(investment), new FixedPrecision(0));
  
  return totalInvested.div(totalShares);
}

// Monthly investments at different prices
const monthlyInvestments = [
  new FixedPrecision("100.00"), // Invest $100 each month
  new FixedPrecision("100.00"),
  new FixedPrecision("100.00"),
];

const sharePrices = [
  new FixedPrecision("50.00"),  // Month 1: $50/share
  new FixedPrecision("55.00"),  // Month 2: $55/share  
  new FixedPrecision("45.00"),  // Month 3: $45/share
];

const averageCost = calculateDollarCostAverage(sharePrices, monthlyInvestments);
console.log(`Average cost per share: $${averageCost.round(2).toString()}`);
```

## Tax Calculations

```typescript
interface TaxBracket {
  min: FixedPrecision;
  max: FixedPrecision | null; // null for infinite
  rate: FixedPrecision;
}

function calculateIncomeTax(income: FixedPrecision, brackets: TaxBracket[]): FixedPrecision {
  let tax = new FixedPrecision(0);
  let remainingIncome = income;
  
  for (const bracket of brackets) {
    if (remainingIncome.lte(0)) break;
    
    const bracketRange = bracket.max 
      ? bracket.max.sub(bracket.min)
      : remainingIncome;
    
    const taxableInBracket = remainingIncome.min(bracketRange);
    const taxInBracket = taxableInBracket.mul(bracket.rate);
    
    tax = tax.add(taxInBracket);
    remainingIncome = remainingIncome.sub(taxableInBracket);
  }
  
  return tax;
}

// Example tax brackets (simplified)
const taxBrackets: TaxBracket[] = [
  { min: new FixedPrecision("0"), max: new FixedPrecision("10000"), rate: new FixedPrecision("0.10") },
  { min: new FixedPrecision("10000"), max: new FixedPrecision("40000"), rate: new FixedPrecision("0.20") },
  { min: new FixedPrecision("40000"), max: null, rate: new FixedPrecision("0.30") },
];

const income = new FixedPrecision("75000.00");
const tax = calculateIncomeTax(income, taxBrackets);
console.log(`Income: $${income.toString()}`);
console.log(`Tax: $${tax.round(2).toString()}`);
console.log(`After-tax: $${income.sub(tax).round(2).toString()}`);
```

## Currency Conversion

```typescript
class CurrencyConverter {
  private rates: Map<string, FixedPrecision>;
  
  constructor() {
    this.rates = new Map();
  }
  
  setRate(from: string, to: string, rate: FixedPrecision) {
    this.rates.set(`${from}_${to}`, rate);
    this.rates.set(`${to}_${from}`, new FixedPrecision(1).div(rate));
  }
  
  convert(amount: FixedPrecision, from: string, to: string): FixedPrecision {
    if (from === to) return amount;
    
    const rate = this.rates.get(`${from}_${to}`);
    if (!rate) {
      throw new Error(`No conversion rate from ${from} to ${to}`);
    }
    
    return amount.mul(rate);
  }
}

// Usage
const converter = new CurrencyConverter();
converter.setRate("USD", "EUR", new FixedPrecision("0.85"));
converter.setRate("USD", "JPY", new FixedPrecision("110.50"));

const usdAmount = new FixedPrecision("100.00");
const eurAmount = converter.convert(usdAmount, "USD", "EUR");
const jpyAmount = converter.convert(usdAmount, "USD", "JPY");

console.log(`$${usdAmount.toString()} USD = €${eurAmount.round(2).toString()} EUR`);
console.log(`$${usdAmount.toString()} USD = ¥${jpyAmount.round(0).toString()} JPY`);
```

## Budgeting and Expense Tracking

```typescript
class BudgetTracker {
  private categories: Map<string, FixedPrecision>;
  private transactions: Array<{
    category: string;
    amount: FixedPrecision;
    description: string;
  }>;
  
  constructor() {
    this.categories = new Map();
    this.transactions = [];
  }
  
  setBudget(category: string, amount: FixedPrecision) {
    this.categories.set(category, amount);
  }
  
  addExpense(category: string, amount: FixedPrecision, description: string) {
    this.transactions.push({ category, amount, description });
  }
  
  getCategorySpending(category: string): FixedPrecision {
    return this.transactions
      .filter(t => t.category === category)
      .reduce((sum, t) => sum.add(t.amount), new FixedPrecision(0));
  }
  
  getRemainingBudget(category: string): FixedPrecision {
    const budget = this.categories.get(category) || new FixedPrecision(0);
    const spent = this.getCategorySpending(category);
    return budget.sub(spent);
  }
  
  generateReport() {
    console.log("Budget Report");
    console.log("=============");
    
    for (const [category, budget] of this.categories) {
      const spent = this.getCategorySpending(category);
      const remaining = this.getRemainingBudget(category);
      const percentage = spent.div(budget).mul(100);
      
      console.log(`${category}:`);
      console.log(`  Budget: $${budget.toString()}`);
      console.log(`  Spent: $${spent.toString()} (${percentage.round(1).toString()}%)`);
      console.log(`  Remaining: $${remaining.toString()}`);
      console.log();
    }
  }
}

// Usage
const tracker = new BudgetTracker();
tracker.setBudget("Groceries", new FixedPrecision("500.00"));
tracker.setBudget("Entertainment", new FixedPrecision("200.00"));
tracker.setBudget("Transportation", new FixedPrecision("150.00"));

tracker.addExpense("Groceries", new FixedPrecision("75.50"), "Weekly grocery shopping");
tracker.addExpense("Entertainment", new FixedPrecision("25.00"), "Movie tickets");
tracker.addExpense("Transportation", new FixedPrecision("40.00"), "Gas");
tracker.addExpense("Groceries", new FixedPrecision("32.75"), "Farmer's market");

tracker.generateReport();
```

## Invoice Generation

```typescript
interface InvoiceItem {
  description: string;
  quantity: FixedPrecision;
  unitPrice: FixedPrecision;
  taxRate: FixedPrecision;
}

class Invoice {
  private items: InvoiceItem[];
  private currency: string;
  
  constructor(currency: string = "USD") {
    this.items = [];
    this.currency = currency;
  }
  
  addItem(description: string, quantity: FixedPrecision, unitPrice: FixedPrecision, taxRate: FixedPrecision = new FixedPrecision("0.00")) {
    this.items.push({ description, quantity, unitPrice, taxRate });
  }
  
  calculateSubtotal(): FixedPrecision {
    return this.items.reduce((total, item) => {
      return total.add(item.unitPrice.mul(item.quantity));
    }, new FixedPrecision(0));
  }
  
  calculateTax(): FixedPrecision {
    return this.items.reduce((total, item) => {
      const itemTotal = item.unitPrice.mul(item.quantity);
      return total.add(itemTotal.mul(item.taxRate));
    }, new FixedPrecision(0));
  }
  
  calculateTotal(): FixedPrecision {
    return this.calculateSubtotal().add(this.calculateTax());
  }
  
  generateInvoice(): string {
    const subtotal = this.calculateSubtotal();
    const tax = this.calculateTax();
    const total = this.calculateTotal();
    
    let invoice = `INVOICE\n`;
    invoice += `=======\n\n`;
    invoice += `Items:\n`;
    invoice += `------\n`;
    
    this.items.forEach((item, index) => {
      const itemTotal = item.unitPrice.mul(item.quantity);
      invoice += `${index + 1}. ${item.description}\n`;
      invoice += `   Quantity: ${item.quantity.toString()}\n`;
      invoice += `   Unit Price: ${this.currency}${item.unitPrice.toString()}\n`;
      invoice += `   Tax Rate: ${item.taxRate.mul(100).toString()}%\n`;
      invoice += `   Total: ${this.currency}${itemTotal.round(2).toString()}\n\n`;
    });
    
    invoice += `Summary:\n`;
    invoice += `--------\n`;
    invoice += `Subtotal: ${this.currency}${subtotal.round(2).toString()}\n`;
    invoice += `Tax: ${this.currency}${tax.round(2).toString()}\n`;
    invoice += `Total: ${this.currency}${total.round(2).toString()}\n`;
    
    return invoice;
  }
}

// Usage
const invoice = new Invoice("USD");
invoice.addItem("Web Development", new FixedPrecision("40"), new FixedPrecision("75.00"), new FixedPrecision("0.10"));
invoice.addItem("Hosting", new FixedPrecision("1"), new FixedPrecision("25.00"), new FixedPrecision("0.08"));
invoice.addItem("Domain Registration", new FixedPrecision("1"), new FixedPrecision("15.00"), new FixedPrecision("0.00"));

console.log(invoice.generateInvoice());
```

## Best Practices for Financial Applications

### 1. Use Appropriate Decimal Places

```typescript
// Different financial instruments use different decimal places
const currencies = FixedPrecision.create({ places: 2 });    // Most currencies
const cryptocurrencies = FixedPrecision.create({ places: 8 }); // Bitcoin, etc.
const interestRates = FixedPrecision.create({ places: 4 });   // 0.0125 = 1.25%
```

### 2. Always Round for Display

```typescript
function formatCurrency(amount: FixedPrecision, currency: string): string {
  return `${currency}${amount.round(2).toString()}`;
}

const price = new FixedPrecision("19.9999");
console.log(formatCurrency(price, "$")); // "$20.00"
```

### 3. Handle Rounding Consistently

```typescript
// Use same rounding mode throughout application
const financialRounding = FixedPrecision.create({ 
  places: 2, 
  roundingMode: 4 // ROUND_HALF_UP (banker's rounding)
});

const amount = financialRounding("123.456");
console.log(amount.toString()); // "123.46"
```

### 4. Validate Financial Data

```typescript
function validateTransaction(amount: FixedPrecision, balance: FixedPrecision): boolean {
  if (amount.lte(0)) {
    throw new Error("Transaction amount must be positive");
  }
  
  if (amount.gt(balance)) {
    throw new Error("Insufficient funds");
  }
  
  if (amount.mod(new FixedPrecision("0.01")).neq(0)) {
    throw new Error("Transaction amount must be in whole cents");
  }
  
  return true;
}
```

### 5. Audit Trail

```typescript
class FinancialTransaction {
  constructor(
    public readonly id: string,
    public readonly amount: FixedPrecision,
    public readonly timestamp: Date,
    public readonly description: string
  ) {}
  
  toString(): string {
    return `[${this.timestamp.toISOString()}] ${this.id}: ${this.description} - $${this.amount.toString()}`;
  }
}

// Create immutable transaction records
const transaction = new FinancialTransaction(
  "TX-001",
  new FixedPrecision("100.00"),
  new Date(),
  "Payment received"
);
```

These examples demonstrate how FixedPrecision can be used for robust, precise financial calculations while avoiding floating-point rounding errors common in JavaScript financial applications.