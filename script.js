let expenses = JSON.parse(localStorage.getItem("expenses")) || [];
let budget = localStorage.getItem("budget") || 0;

let expenseChartInstance;  // Variable to store chart instance

document.getElementById('expense-form').addEventListener('submit', addExpense);
document.getElementById('budget').value = budget;
updateExpenseList();
updateTotalAmount();
updateRemainingBudget();
updateChart();

// Show/Hide chart button functionality
document.getElementById('show-chart-btn').addEventListener('click', showChart);

function addExpense(event) {
    event.preventDefault();
    
    const name = document.getElementById('expense-name').value;
    const amount = parseFloat(document.getElementById('expense-amount').value);
    const category = document.getElementById('expense-category').value;

    if (name && amount > 0) {
        const expense = { name, amount, category, date: new Date().toLocaleDateString() };
        expenses.push(expense);
        localStorage.setItem("expenses", JSON.stringify(expenses));
        updateExpenseList();
        updateTotalAmount();
        updateRemainingBudget();
        updateChart();
    }
}

function updateExpenseList() {
    const expenseList = document.getElementById('expense-list');
    expenseList.innerHTML = '';

    expenses.forEach((expense, index) => {
        const expenseItem = document.createElement('div');
        expenseItem.classList.add('expense-item');
        expenseItem.innerHTML = `
            <span>${expense.name} - $${expense.amount} (${expense.category})</span>
            <button onclick="deleteExpense(${index})">Delete</button>
        `;
        expenseList.appendChild(expenseItem);
    });
}

function deleteExpense(index) {
    expenses.splice(index, 1);
    localStorage.setItem("expenses", JSON.stringify(expenses));
    updateExpenseList();
    updateTotalAmount();
    updateRemainingBudget();
    updateChart();
}

function updateTotalAmount() {
    const totalAmount = expenses.reduce((total, expense) => total + expense.amount, 0);
    document.getElementById('total-amount').textContent = totalAmount.toFixed(2);
}

function updateRemainingBudget() {
    const totalAmount = expenses.reduce((total, expense) => total + expense.amount, 0);
    const remainingBudget = budget - totalAmount;
    document.getElementById('remaining-budget').textContent = remainingBudget.toFixed(2);
}

function updateBudget() {
    budget = parseFloat(document.getElementById('budget').value) || 0;
    localStorage.setItem("budget", budget);
    updateRemainingBudget();
}

// Function to update the chart based on the current expenses
function updateChart() {
    
    const expenseCategories = {};
    
    // Calculate total amount for each category
    expenses.forEach(expense => {
        if (expenseCategories[expense.category]) {
            expenseCategories[expense.category] += expense.amount;
        } else {
            expenseCategories[expense.category] = expense.amount;
        }
    });

    // Prepare data for the chart
    const labels = Object.keys(expenseCategories);
    const data = Object.values(expenseCategories);

    const ctx = document.getElementById('expense-chart').getContext('2d');

    // Destroy the old chart if it exists
    // if (expenseChartInstance) {
    //     expenseChartInstance.destroy();
    // }
    // Create the new chart
    expenseChartInstance = new Chart(ctx, {
        type: 'pie', // 'pie', 'bar', 'doughnut' - You can change the chart type
        data: {
            labels: labels,
            datasets: [{
                data: data,
                backgroundColor: ['#ff5733', '#33ff57', '#3357ff', '#f0e130'],
                hoverOffset: 4
            }]
        },
        options: {
            responsive: true,
            plugins: {
                legend: {
                    position: 'top',
                },
                tooltip: {
                    callbacks: {
                        label: function(tooltipItem) {
                            return `${tooltipItem.label}: \$${tooltipItem.raw.toFixed(2)}`;
                        }
                    }
                }
            }
        }
    });
}

// Function to show or hide the chart when the button is clicked
function showChart() {
    const chartElement = document.getElementById('expense-chart');
    // Toggle visibility of the chart
    if (chartElement.style.display === 'none') {
        chartElement.style.display = 'block';
        updateChart();  // Ensure the chart is drawn when shown
    } else {
        chartElement.style.display = 'none';  // Hide the chart
    }
}
