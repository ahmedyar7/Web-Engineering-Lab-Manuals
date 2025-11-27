// Ahmed Yar 480756

// Global variables for Firebase access (required by the environment)
const appId = typeof __app_id !== "undefined" ? __app_id : "default-app-id";
const firebaseConfig =
  typeof __firebase_config !== "undefined"
    ? JSON.parse(__firebase_config)
    : null;
const initialAuthToken =
  typeof __initial_auth_token !== "undefined" ? __initial_auth_token : null;

// Configuration for the Gemini API call (model and API key placeholder)
const MODEL_NAME = "gemini-2.5-flash-preview-09-2025";
const apiKey = "";

// --- Calculator State & DOM Elements ---
// Ahmed Yar 480756
let state = {
  currentMode: "basic", // 'basic', 'scientific', 'unit', 'currency'
  displayValue: "0",
  operator: null,
  firstOperand: null,
  waitingForSecondOperand: false,
  isError: false,
};

const displayOutput = document.getElementById("display-output");
const displayHistory = document.getElementById("display-history");
const mainContent = document.getElementById("main-content");
const menuButton = document.getElementById("menu-button");
const subMenu = document.getElementById("sub-menu");
const modeTitle = document.getElementById("mode-title");
const conversionStatus = document.getElementById("conversion-status");

// --- Utility Functions ---
// Ahmed Yar 480756
const showModal = (title, message) => {
  document.getElementById("modal-title").textContent = title;
  document.getElementById("modal-message").textContent = message;
  document.getElementById("custom-modal").classList.remove("hidden");
};

const closeModal = () => {
  document.getElementById("custom-modal").classList.add("hidden");
};

const updateDisplay = () => {
  displayOutput.textContent = state.displayValue;
  if (state.isError) {
    displayHistory.textContent = "Error";
    displayOutput.classList.add("text-red-500");
  } else {
    displayOutput.classList.remove("text-red-500");
  }
};

// --- Core Calculator Logic ---
// Ahmed Yar 480756
const resetCalculator = () => {
  state.displayValue = "0";
  state.operator = null;
  state.firstOperand = null;
  state.waitingForSecondOperand = false;
  state.isError = false;
  displayHistory.textContent = "";
};

const inputDigit = (digit) => {
  if (state.isError) return;

  if (state.waitingForSecondOperand === true) {
    state.displayValue = digit;
    state.waitingForSecondOperand = false;
  } else {
    state.displayValue =
      state.displayValue === "0" ? digit : state.displayValue + digit;
  }
  updateDisplay();
};

const inputDecimal = () => {
  if (state.waitingForSecondOperand === true) {
    state.displayValue = "0.";
    state.waitingForSecondOperand = false;
    updateDisplay();
    return;
  }
  if (!state.displayValue.includes(".")) {
    state.displayValue += ".";
    updateDisplay();
  }
};

const performCalculation = {
  "/": (firstOperand, secondOperand) =>
    secondOperand === 0 ? "Division by zero" : firstOperand / secondOperand,
  "*": (firstOperand, secondOperand) => firstOperand * secondOperand,
  "+": (firstOperand, secondOperand) => firstOperand + secondOperand,
  "-": (firstOperand, secondOperand) => firstOperand - secondOperand,
  "=": (firstOperand, secondOperand) => secondOperand,
};

const handleOperator = (nextOperator) => {
  if (state.isError) return;

  const inputValue = parseFloat(state.displayValue);

  if (state.firstOperand === null) {
    state.firstOperand = inputValue;
  } else if (state.operator) {
    const result = performCalculation[state.operator](
      state.firstOperand,
      inputValue
    );

    if (result === "Division by zero") {
      state.displayValue = "Error: Div by 0";
      state.isError = true;
      updateDisplay();
      return;
    }

    state.displayValue = String(result);
    state.firstOperand = result;
  }

  state.waitingForSecondOperand = true;
  state.operator = nextOperator;
  displayHistory.textContent =
    state.firstOperand + " " + (nextOperator === "=" ? "" : nextOperator);
  updateDisplay();
};

const handleScientific = (func) => {
  if (state.isError) return;

  const value = parseFloat(state.displayValue);
  let result;

  switch (func) {
    case "sqrt":
      result = Math.sqrt(value);
      displayHistory.textContent = `sqrt(${value})`;
      break;
    case "pow2":
      result = Math.pow(value, 2);
      displayHistory.textContent = `(${value})^2`;
      break;
    case "sin":
      result = Math.sin(value * (Math.PI / 180)); // Assume degrees
      displayHistory.textContent = `sin(${value}°)`;
      break;
    case "cos":
      result = Math.cos(value * (Math.PI / 180)); // Assume degrees
      displayHistory.textContent = `cos(${value}°)`;
      break;
    case "tan":
      result = Math.tan(value * (Math.PI / 180)); // Assume degrees
      displayHistory.textContent = `tan(${value}°)`;
      break;
    case "log":
      result = Math.log10(value);
      displayHistory.textContent = `log10(${value})`;
      break;
    case "pi":
      result = Math.PI;
      displayHistory.textContent = "π";
      break;
    default:
      return;
  }

  if (isNaN(result) || !isFinite(result)) {
    state.displayValue = "Error";
    state.isError = true;
  } else {
    state.displayValue = String(result.toFixed(6));
  }

  state.firstOperand = null;
  state.operator = null;
  state.waitingForSecondOperand = true;
  updateDisplay();
};

// Main event dispatcher for calculator buttons
const handleCalcButton = (value, type) => {
  if (type === "digit") {
    inputDigit(value);
  } else if (type === "operator") {
    handleOperator(value);
  } else if (type === "clear") {
    resetCalculator();
    updateDisplay();
  } else if (type === "decimal") {
    inputDecimal();
  } else if (type === "scientific") {
    handleScientific(value);
  }
};

// --- Mode & UI Management ---
// Ahmed Yar 480756

const toggleMenu = () => {
  const isVisible = subMenu.classList.toggle("opacity-0");
  subMenu.classList.toggle("pointer-events-none", isVisible);
  subMenu.classList.toggle("opacity-100", !isVisible);
  subMenu.classList.toggle("pointer-events-auto", !isVisible);
};

const setMode = (newMode) => {
  state.currentMode = newMode;
  modeTitle.textContent =
    newMode.charAt(0).toUpperCase() +
    newMode.slice(1) +
    (newMode.includes("calc") || newMode.includes("Mode") ? "" : " Mode");
  toggleMenu(); // Close menu after selection
  updateUI();
  resetCalculator();
  conversionStatus.classList.add("hidden");
};

// Button definitions for different modes
const basicButtons = [
  { type: "clear", value: "C", class: "btn-clear col-span-2" },
  {
    type: "scientific",
    value: "pow2",
    symbol: "x²",
    class: "btn-operator",
  },
  { type: "operator", value: "/", class: "btn-operator" },
  { type: "digit", value: "7", class: "btn-number" },
  { type: "digit", value: "8", class: "btn-number" },
  { type: "digit", value: "9", class: "btn-number" },
  { type: "operator", value: "*", class: "btn-operator" },
  { type: "digit", value: "4", class: "btn-number" },
  { type: "digit", value: "5", class: "btn-number" },
  { type: "digit", value: "6", class: "btn-number" },
  { type: "operator", value: "-", class: "btn-operator" },
  { type: "digit", value: "1", class: "btn-number" },
  { type: "digit", value: "2", class: "btn-number" },
  { type: "digit", value: "3", class: "btn-number" },
  { type: "operator", value: "+", class: "btn-operator" },
  { type: "digit", value: "0", class: "btn-number col-span-2" },
  { type: "decimal", value: ".", class: "btn-number" },
  { type: "operator", value: "=", class: "btn-equals" },
];

const scientificButtons = [
  { type: "scientific", value: "pi", symbol: "π", class: "btn-clear" },
  {
    type: "scientific",
    value: "sqrt",
    symbol: "√",
    class: "btn-operator",
  },
  {
    type: "scientific",
    value: "log",
    symbol: "log",
    class: "btn-operator",
  },
  {
    type: "scientific",
    value: "sin",
    symbol: "sin",
    class: "btn-operator",
  },
  {
    type: "scientific",
    value: "cos",
    symbol: "cos",
    class: "btn-operator",
  },
  {
    type: "scientific",
    value: "tan",
    symbol: "tan",
    class: "btn-operator",
  },
  ...basicButtons.slice(0, 1),
  ...basicButtons.slice(3),
];

const renderCalculatorGrid = (buttons) => {
  mainContent.innerHTML = "";
  const grid = document.createElement("div");
  grid.className = "calculator-grid";

  buttons.forEach((btn) => {
    const button = document.createElement("button");
    button.className = `calc-button ${btn.class}`;
    button.textContent = btn.symbol || btn.value;

    // Attach event listener using a closure to preserve scope
    button.addEventListener("click", () =>
      handleCalcButton(btn.value, btn.type)
    );

    grid.appendChild(button);
  });
  mainContent.appendChild(grid);
};

// --- Conversion Mode Logic (Simulated API Call) ---
// Ahmed Yar 480756

// Simple exponential backoff retry mechanism
async function fetchWithRetry(url, options, retries = 3) {
  for (let i = 0; i < retries; i++) {
    try {
      const response = await fetch(url, options);
      if (!response.ok)
        throw new Error(`HTTP error! status: ${response.status}`);
      return response;
    } catch (error) {
      if (i === retries - 1) throw error;
      const delay = Math.pow(2, i) * 1000;
      console.warn(`Request failed, retrying in ${delay / 1000}s...`);
      await new Promise((resolve) => setTimeout(resolve, delay));
    }
  }
}

async function handleConversion(type, amount, from, to) {
  conversionStatus.textContent = `Converting ${amount} ${from} to ${to}...`;
  conversionStatus.classList.remove("hidden", "bg-red-900", "bg-green-900");
  conversionStatus.classList.add("bg-blue-900");

  const queryType = type === "unit" ? "unit conversion" : "currency conversion";
  const userQuery = `Perform ${queryType} of ${amount} ${from} to ${to}. Provide a single, clear, numerical answer followed by the unit/currency code, and include a brief explanation.`;
  const systemPrompt =
    "You are a specialized conversion bot. Respond only with the calculated conversion result and its sources, focusing on accuracy.";

  const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/${MODEL_NAME}:generateContent?key=${apiKey}`;

  const payload = {
    contents: [{ parts: [{ text: userQuery }] }],
    // Use Google Search grounding for real-time conversion rates/formulas
    tools: [{ google_search: {} }],
    systemInstruction: { parts: [{ text: systemPrompt }] },
  };

  try {
    const response = await fetchWithRetry(apiUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    const result = await response.json();
    const candidate = result.candidates?.[0];

    if (!candidate || !candidate.content?.parts?.[0]?.text) {
      throw new Error("Invalid response structure from conversion service.");
    }

    const text = candidate.content.parts[0].text;
    let sourcesHtml = "";

    // Extract and format grounding sources
    const groundingMetadata = candidate.groundingMetadata;
    if (groundingMetadata && groundingMetadata.groundingAttributions) {
      const sources = groundingMetadata.groundingAttributions
        .map((attribution) => ({
          uri: attribution.web?.uri,
          title: attribution.web?.title,
        }))
        .filter((source) => source.uri && source.title);

      if (sources.length > 0) {
        sourcesHtml = `<div class="mt-2 pt-2 border-t border-blue-800"><p class="font-bold">Sources:</p>${sources
          .map(
            (s) =>
              `<a href="${s.uri}" target="_blank" class="text-xs underline hover:text-blue-300 block">${s.title}</a>`
          )
          .join("")}</div>`;
      }
    }

    conversionStatus.classList.replace("bg-blue-900", "bg-green-900");
    conversionStatus.innerHTML = `<p class="text-lg font-bold">Conversion Result:</p> ${text} ${sourcesHtml}`;
  } catch (error) {
    console.error("Conversion API Error:", error);
    conversionStatus.classList.replace("bg-blue-900", "bg-red-900");
    conversionStatus.textContent = `Error performing conversion. Details: ${error.message}. Please check console for full error.`;
  }
}

const renderConversionView = (type) => {
  // Placeholder options for Unit and Currency conversion
  const optionsMap = {
    unit: {
      title: "Unit Conversion (e.g., Temperature)",
      fromLabel: "From Unit:",
      toLabel: "To Unit:",
      fromOptions: ["Fahrenheit", "Celsius", "Kilometers", "Miles"],
      toOptions: ["Celsius", "Fahrenheit", "Miles", "Kilometers"],
      defaultFrom: "Fahrenheit",
      defaultTo: "Celsius",
    },
    currency: {
      title: "Currency Conversion",
      fromLabel: "From Currency:",
      toLabel: "To Currency:",
      fromOptions: ["USD", "EUR", "GBP", "JPY", "CAD"],
      toOptions: ["EUR", "USD", "GBP", "JPY", "CAD"],
      defaultFrom: "USD",
      defaultTo: "EUR",
    },
  };

  const config = optionsMap[type];

  const html = `
                <div class="conversion-view space-y-4">
                    <h2 class="text-2xl font-semibold mb-4">${config.title}</h2>
                    <div class="space-y-3">
                        <label class="block">Amount:</label>
                        <input id="conversion-amount" type="number" value="100" class="w-full p-3 rounded-lg bg-gray-700 text-white focus:ring-yellow-500 focus:border-yellow-500 transition-colors">
                    </div>
                    <div class="flex space-x-4">
                        <div class="flex-1 space-y-3">
                            <label class="block">${config.fromLabel}</label>
                            <select id="conversion-from" class="w-full p-3 rounded-lg bg-gray-700 text-white appearance-none focus:ring-yellow-500 focus:border-yellow-500 transition-colors">
                                ${config.fromOptions
                                  .map(
                                    (opt) =>
                                      `<option value="${opt}" ${
                                        opt === config.defaultFrom
                                          ? "selected"
                                          : ""
                                      }>${opt}</option>`
                                  )
                                  .join("")}
                            </select>
                        </div>
                        <div class="flex-1 space-y-3">
                            <label class="block">${config.toLabel}</label>
                            <select id="conversion-to" class="w-full p-3 rounded-lg bg-gray-700 text-white appearance-none focus:ring-yellow-500 focus:border-yellow-500 transition-colors">
                                ${config.toOptions
                                  .map(
                                    (opt) =>
                                      `<option value="${opt}" ${
                                        opt === config.defaultTo
                                          ? "selected"
                                          : ""
                                      }>${opt}</option>`
                                  )
                                  .join("")}
                            </select>
                        </div>
                    </div>
                    <button id="convert-button" class="btn-equals calc-button mt-4 w-full py-3">Convert</button>
                    <p class="text-sm text-gray-400 mt-2">Note: Conversion is simulated using a call to the Gemini API with Google Search grounding.</p>
                </div>
            `;
  mainContent.innerHTML = html;

  document.getElementById("convert-button").addEventListener("click", () => {
    const amount = document.getElementById("conversion-amount").value;
    const from = document.getElementById("conversion-from").value;
    const to = document.getElementById("conversion-to").value;

    if (amount <= 0) {
      showModal(
        "Invalid Amount",
        "Please enter a positive value for conversion."
      );
      return;
    }

    handleConversion(type, amount, from, to);
  });
};

const updateUI = () => {
  // Hide/clear standard calculator elements
  displayHistory.style.display = "block";
  displayOutput.style.display = "block";
  conversionStatus.classList.add("hidden");

  // Render content based on mode
  switch (state.currentMode) {
    case "basic":
      renderCalculatorGrid(basicButtons);
      break;
    case "scientific":
      renderCalculatorGrid(scientificButtons);
      break;
    case "unit":
      displayHistory.style.display = "none";
      displayOutput.style.display = "none";
      renderConversionView("unit");
      break;
    case "currency":
      displayHistory.style.display = "none";
      displayOutput.style.display = "none";
      renderConversionView("currency");
      break;
  }
};

// --- Initialization ---
// Ahmed Yar 480756
document.addEventListener("DOMContentLoaded", () => {
  menuButton.addEventListener("click", toggleMenu);
  // Close menu if clicking outside (optional, but good UX)
  document.addEventListener("click", (e) => {
    if (
      !subMenu.contains(e.target) &&
      !menuButton.contains(e.target) &&
      subMenu.classList.contains("opacity-100")
    ) {
      toggleMenu();
    }
  });

  // Start the application in Basic mode
  updateUI();
});
// Ahmed Yar 480756
