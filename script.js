document.addEventListener('DOMContentLoaded', function() {
  const profitForm = document.getElementById('profit-form');
  const partsContainer = document.getElementById('parts-container');
  const addPartButton = document.getElementById('add-part');
  const calculateButton = document.getElementById('calculate');
  const resultsDiv = document.getElementById('results');
  const totalCostsSpan = document.getElementById('total-costs');
  const enteredSubtotalSpan = document.getElementById('entered-subtotal');
  const profitMarginSpan = document.getElementById('profit-margin');
  const partsTotalSpan = document.getElementById('parts-total');
  const recalibrationTotalSpan = document.getElementById('recalibration-total');
  const moldingTotalSpan = document.getElementById('molding-total');
  const minimumCostSpan = document.getElementById('minimum-cost');
  const alertDiv = document.getElementById('alert');
  const mobileModeToggle = document.getElementById('mobile-mode');
  let partCounter = 0;

  // Function to add a new part input
  function addPartInput() {
    partCounter++;
    const partDiv = document.createElement('div');
    partDiv.classList.add('part');
    partDiv.innerHTML = `
      <label for="part-cost-${partCounter}">Part Cost ${partCounter}:</label>
      <div class="part-input-container">
        <input type="number" id="part-cost-${partCounter}" name="part-cost" class="part-cost" value="0">
        <button type="button" class="remove-part" data-part-id="${partCounter}">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
            <path d="M6 19c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7H6v12zM19 4h-3.5l-1-1h-5l-1 1H5v2h14V4z"/>
          </svg>
        </button>
      </div>
    `;
    partsContainer.appendChild(partDiv);

    // Add event listener to the new remove button
    const removeButton = partDiv.querySelector('.remove-part');
    removeButton.addEventListener('click', function(event) {
      const partId = event.target.dataset.partId;
      const partDiv = event.target.closest('.part');
      partDiv.remove();
    });
  }

  // Event listener for adding a part
  addPartButton.addEventListener('click', addPartInput);

  // Event listener for removing a part (using event delegation)
  partsContainer.addEventListener('click', function(event) {
    if (event.target.classList.contains('remove-part')) {
      const partId = event.target.dataset.partId;
      const partDiv = event.target.closest('.part');
      partDiv.remove();
    }
  });

  // Function to calculate the profit margin
  function calculateProfit() {
    const partCostInputs = document.querySelectorAll('.part-cost');
    let partsTotal = 0;
    partCostInputs.forEach(input => {
      partsTotal += parseFloat(input.value) || 0;
    });

    const recalibrationCost = parseFloat(document.getElementById('recalibration-cost').value) || 0;
    let moldingCost = parseFloat(document.getElementById('molding-cost').value) || 0;
    if(moldingCost > 0){
      moldingCost += 20;
    }
    const subtotal = parseFloat(document.getElementById('subtotal').value);

    // Determine minimum cost based on mobile mode toggle
    const minimumCostPerPart = mobileModeToggle.checked ? 275 : 225;
    const minimumCost = minimumCostPerPart * partCounter;

    const totalCosts = partsTotal + recalibrationCost + moldingCost + minimumCost;
    const profitMargin = subtotal - totalCosts;

    totalCostsSpan.textContent = totalCosts.toFixed(2);
    enteredSubtotalSpan.textContent = subtotal.toFixed(2);
    profitMarginSpan.textContent = profitMargin.toFixed(2);
    partsTotalSpan.textContent = partsTotal.toFixed(2);
    recalibrationTotalSpan.textContent = recalibrationCost.toFixed(2);
    moldingTotalSpan.textContent = moldingCost.toFixed(2);
    minimumCostSpan.textContent = minimumCost.toFixed(2);

    // Color-code the profit margin
    if (profitMargin >= 0) {
      profitMarginSpan.style.color = '#22c55e'; 
    } else {
      profitMarginSpan.style.color = '#ef4444'; 
    }

    resultsDiv.style.display = 'block'; // Show results
  }

  // Event listener for calculating the profit
  calculateButton.addEventListener('click', function() {
    const subtotal = parseFloat(document.getElementById('subtotal').value);
    if (isNaN(subtotal)) {
      alertDiv.style.display = 'block'; // Show alert if subtotal is invalid
      resultsDiv.style.display = 'none'; // Ensure results are hidden if subtotal is invalid
    } else {
      alertDiv.style.display = 'none'; // Hide alert if subtotal is valid
      calculateProfit();
    }
  });

  // Initial part input
  addPartInput();
});
