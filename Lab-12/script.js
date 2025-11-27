const API_URL = "https://mocki.io/v1/1cd2bc4b-cf6f-4b68-96d9-afc1c79298c0";

let revenueChartInstance = null;

// Name: Ahmed Yar
// CMS-ID: 480756
// Course: Web Engineering

async function fetchAndVisualizeData() {
    const status = document.getElementById("statusMessage");
    status.textContent = "Loading revenue data...";

    try {
        // Fetch the mock API
        const response = await fetch(API_URL);
        const data = await response.json();

        // Extract raw revenue data array
        const rawData = data.record.monthly_revenue;

        console.log("Raw data fetched:", rawData);

        // Process for Chart.js
        const processed = processData(rawData);

        // Render the chart
        renderChart(processed);

        status.textContent = "Revenue data successfully loaded!";
    } catch (error) {
        console.error("FETCH ERROR:", error);
        status.textContent = "ERROR: Failed to load data. Check console.";
    }
}

function processData(rawData) {
    const labels = rawData.map((item) => item.month);
    const dataPoints = rawData.map((item) => item.amount);

    return { labels, dataPoints };
}

function renderChart({ labels, dataPoints }) {
    const ctx = document.getElementById("revenueChart").getContext("2d");

    // Destroy old chart to prevent duplication
    if (revenueChartInstance) {
        revenueChartInstance.destroy();
    }

    revenueChartInstance = new Chart(ctx, {
        type: "line",
        data: {
            labels: labels,
            datasets: [
                {
                    label: "Monthly Revenue",
                    data: dataPoints,
                    borderColor: "#4f46e5",
                    backgroundColor: "rgba(79, 70, 229, 0.2)",
                    borderWidth: 2,
                    fill: true,
                    tension: 0.4,
                },
            ],
        },

        // Name: Ahmed Yar
        // CMS-ID: 480756
        // Course: Web Engineering

        options: {
            responsive: true,
            scales: {
                y: {
                    beginAtZero: false,
                    ticks: { color: "#333" },
                },
                x: {
                    ticks: { color: "#333" },
                },
            },
        },
    });
}

fetchAndVisualizeData();
