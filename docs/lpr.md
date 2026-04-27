### 1. Authentication & Security
*Establish a secure environment for sensitive financial data.*

**Story 1.1: User Registration**
> **As a** new user,
> **I want to** sign up using my email and a secure password,
> **So that** I can create a private account to store my financial data.

* **Acceptance Criteria:**
    * User can enter email, password, and confirm password.
    * Password strength validation is enforced (e.g., min 8 chars, 1 special char).
    * System checks if the email is already in use and displays an error if true.
    * User receives a verification email upon successful submission.
    * Account status remains "Unverified" until the email link is clicked.

**Story 1.2: User Login**
> **As a** registered user,
> **I want to** log in with my credentials,
> **So that** I can access my dashboard securely.

* **Acceptance Criteria:**
    * User can enter email and password.
    * "Forgot Password" flow is accessible from the login screen.
    * Account is locked after 5 failed attempts (security requirement).
    * Upon success, the user is redirected to the main Dashboard.

**Story 1.3: Biometric Login (Mobile)**
> **As a** mobile app user,
> **I want to** use FaceID or Fingerprint,
> **So that** I can log in quickly without typing my password every time.

* **Acceptance Criteria:**
    * User is prompted to enable biometrics after the first successful password login.
    * User can toggle this feature on/off in Settings.
    * Biometric failure falls back to standard password entry.

---

### 2. Account Management (Banks & Credit Cards)
*The core functionality of connecting and viewing financial sources.*



**Story 2.1: Link Bank Account (via Integration)**
> **As a** user,
> **I want to** connect my bank account securely (e.g., via Plaid/Yodlee),
> **So that** my transactions and balance are automatically updated.

* **Acceptance Criteria:**
    * User can search for and select their financial institution from a list.
    * User is redirected to the provider's secure authentication portal.
    * Upon success, the app imports account name, type (Checking/Savings), and current balance.
    * The account appears in the "Accounts" list immediately.

**Story 2.2: Add Manual Account**
> **As a** user,
> **I want to** manually add an account (e.g., Cash Wallet, unsupported bank),
> **So that** I can track assets that don't have digital integration.

* **Acceptance Criteria:**
    * User can input Account Name, Account Type, and Current Balance.
    * User can assign a custom icon or color to the account.
    * The account appears in the "Accounts" list with a "Manual" indicator.

**Story 2.3: View Account Details**
> **As a** user,
> **I want to** click on a specific credit card or bank account,
> **So that** I can see the balance, credit limit (if applicable), and specific transaction history.

* **Acceptance Criteria:**
    * Clicking an account card opens a detailed view.
    * For Credit Cards: Display Current Balance, Available Credit, and Payment Due Date.
    * For Bank Accounts: Display Current Balance and Available Balance.

---

### 3. Transaction Management
*Handling the data flowing into the accounts.*

**Story 3.1: View Transaction Feed**
> **As a** user,
> **I want to** see a consolidated list of transactions from all accounts,
> **So that** I can review my spending in one place.

* **Acceptance Criteria:**
    * Transactions are listed in reverse chronological order.
    * Each row shows: Date, Merchant Name, Category, Amount, and Account Source.
    * Negative amounts (spending) are red; positive amounts (income) are green.

**Story 3.2: Categorize Transactions**
> **As a** user,
> **I want to** edit the category of a transaction,
> **So that** my spending reports are accurate.

* **Acceptance Criteria:**
    * User can tap a transaction to edit details.
    * User can select a new category from a pre-defined list (e.g., Groceries, Rent).
    * User can create a new custom category.
    * System asks: "Apply this rule to all future transactions from this merchant?"

---

### 4. Recurring Bills & Subscriptions
*Managing future cash outflows.*



**Story 4.1: Add Recurring Bill**
> **As a** user,
> **I want to** manually add a recurring bill with a due date,
> **So that** I can be reminded before the payment is due.

* **Acceptance Criteria:**
    * User inputs: Biller Name, Amount, Frequency (Monthly, Weekly, Yearly), and Next Due Date.
    * User can mark the bill as "Auto-pay" (visual flag only).
    * Bill appears in the "Upcoming Bills" section.

**Story 4.2: Detect Subscriptions**
> **As a** user,
> **I want to** the app to identify potential subscriptions from my transaction history,
> **So that** I don't have to enter them manually.

* **Acceptance Criteria:**
    * System scans transaction history for recurring amounts/merchants (e.g., Netflix, Spotify).
    * User is presented with a "Suggested Subscriptions" list to Confirm or Reject.
    * Confirmed items are added to the Recurring Bills list.

**Story 4.3: Bill Calendar View**
> **As a** user,
> **I want to** view my bills on a calendar interface,
> **So that** I can visualize my cash flow requirements for the month.

* **Acceptance Criteria:**
    * Calendar view displays dots or icons on dates with bills due.
    * Clicking a date shows the list of bills and total amount due that day.
    * Past due bills are highlighted in red.

---

### 5. Dashboard & Overview
*The high-level summary for the user.*

**Story 5.1: Net Worth Snapshot**
> **As a** user,
> **I want to** see a summary of my Net Worth,
> **So that** I know my overall financial health at a glance.

* **Acceptance Criteria:**
    * Calculation: (Sum of Asset Accounts) - (Sum of Liability/Credit Accounts).
    * Displayed prominently at the top of the dashboard.
    * Includes a percentage change indicator (e.g., "+2% vs last month").

**Story 5.2: upcoming Cash Flow**
> **As a** user,
> **I want to** see how much money is leaving my account in the next 7 days,
> **So that** I ensure I have enough liquidity.

* **Acceptance Criteria:**
    * Widget displays "Total Bills Due in Next 7 Days".
    * Widget displays "Safe to Spend" amount (Current Balance - Upcoming Bills).
