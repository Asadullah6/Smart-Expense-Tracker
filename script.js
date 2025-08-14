 let expenses = [];
        let filteredExpenses = [];

        // Initialize date field with today's date
        document.getElementById('expenseDate').value = new Date().toISOString().split('T')[0];

        function addExpense() {
            const title = document.getElementById('expenseTitle').value;
            const amount = parseFloat(document.getElementById('expenseAmount').value);
            const category = document.getElementById('expenseCategory').value;
            const date = document.getElementById('expenseDate').value;

            if (!title || !amount || !category || !date) {
                alert('Please fill in all fields!');
                return;
            }

            const expense = {
                id: Date.now(),
                title,
                amount,
                category,
                date,
                timestamp: new Date().toLocaleDateString()
            };

            expenses.unshift(expense);
            
            // Clear form
            document.getElementById('expenseTitle').value = '';
            document.getElementById('expenseAmount').value = '';
            document.getElementById('expenseCategory').value = '';
            document.getElementById('expenseDate').value = new Date().toISOString().split('T')[0];

            updateDisplay();
        }

        function deleteExpense(id) {
            expenses = expenses.filter(expense => expense.id !== id);
            updateDisplay();
        }

        function filterExpenses() {
            const category = document.getElementById('filterCategory').value;
            
            if (category === '') {
                filteredExpenses = [...expenses];
            } else {
                filteredExpenses = expenses.filter(expense => expense.category === category);
            }
            
            displayExpenses();
        }

        function clearAll() {
            if (expenses.length === 0) return;
            
            if (confirm('Are you sure you want to clear all expenses?')) {
                expenses = [];
                filteredExpenses = [];
                updateDisplay();
            }
        }

        function updateDisplay() {
            filteredExpenses = [...expenses];
            updateStats();
            displayExpenses();
            updateChart();
        }

        function updateStats() {
            const total = expenses.reduce((sum, expense) => sum + expense.amount, 0);
            const count = expenses.length;
            const monthlyAvg = count > 0 ? total / Math.max(1, getMonthsSpan()) : 0;

            document.getElementById('totalExpenses').textContent = `$${total.toFixed(2)}`;
            document.getElementById('monthlyAvg').textContent = `$${monthlyAvg.toFixed(2)}`;
            document.getElementById('expenseCount').textContent = count;
        }

        function getMonthsSpan() {
            if (expenses.length === 0) return 1;
            
            const dates = expenses.map(e => new Date(e.date));
            const minDate = new Date(Math.min(...dates));
            const maxDate = new Date(Math.max(...dates));
            
            const months = (maxDate.getFullYear() - minDate.getFullYear()) * 12 + 
                          (maxDate.getMonth() - minDate.getMonth()) + 1;
            
            return Math.max(1, months);
        }

        function displayExpenses() {
            const container = document.getElementById('expensesList');
            
            if (filteredExpenses.length === 0) {
                container.innerHTML = `
                    <div class="empty-state">
                        <div class="empty-state-icon">📝</div>
                        <p>${expenses.length === 0 ? 'No expenses yet. Add your first expense above!' : 'No expenses match the current filter.'}</p>
                    </div>
                `;
                return;
            }

            container.innerHTML = filteredExpenses.map(expense => `
                <div class="expense-item fade-in">
                    <div class="expense-details">
                        <div class="expense-title">${expense.title}</div>
                        <div class="expense-meta">${expense.date} • Added ${expense.timestamp}</div>
                    </div>
                    <div style="display: flex; align-items: center;">
                        <div class="expense-amount">$${expense.amount.toFixed(2)}</div>
                        <div class="expense-category">${expense.category}</div>
                        <button class="delete-btn" onclick="deleteExpense(${expense.id})">🗑️</button>
                    </div>
                </div>
            `).join('');
        }

        function updateChart() {
            const categoryTotals = {};
            
            expenses.forEach(expense => {
                categoryTotals[expense.category] = (categoryTotals[expense.category] || 0) + expense.amount;
            });

            const maxAmount = Math.max(...Object.values(categoryTotals), 1);
            const chartContainer = document.getElementById('categoryChart');

            if (Object.keys(categoryTotals).length === 0) {
                chartContainer.innerHTML = '<p style="text-align: center; color: #666; padding: 20px;">No data to display</p>';
                return;
            }

            chartContainer.innerHTML = Object.entries(categoryTotals)
                .sort(([,a], [,b]) => b - a)
                .map(([category, amount]) => `
                    <div class="chart-bar">
                        <div class="chart-label">${category}</div>
                        <div class="chart-progress">
                            <div class="chart-fill" style="width: ${(amount / maxAmount) * 100}%"></div>
                        </div>
                        <div class="chart-amount">$${amount.toFixed(2)}</div>
                    </div>
                `).join('');
        }

        // Add sample data for demo
        function addSampleData() {
            const sampleExpenses = [
                { title: "Lunch at Cafe", amount: 15.50, category: "Food", date: "2025-08-13" },
                { title: "Gas Station", amount: 45.00, category: "Transportation", date: "2025-08-12" },
                { title: "Movie Tickets", amount: 28.00, category: "Entertainment", date: "2025-08-10" },
                { title: "Grocery Shopping", amount: 85.75, category: "Food", date: "2025-08-09" },
                { title: "Electricity Bill", amount: 120.00, category: "Bills", date: "2025-08-08" }
            ];

            sampleExpenses.forEach((expense, index) => {
                expenses.push({
                    ...expense,
                    id: Date.now() + index,
                    timestamp: new Date().toLocaleDateString()
                });
            });

            updateDisplay();
        }

        // Initialize with sample data
        addSampleData();