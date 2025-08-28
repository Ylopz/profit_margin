function addPart() {
    const partsContainer = document.getElementById('partsContainer');
    const partNumber = partsContainer.children.length + 1;
    
    const formRow = document.createElement('div');
    formRow.className = 'form-row';
    formRow.innerHTML = `
        <input type="number" class="part-cost" placeholder="Part ${partNumber} cost" min="0" step="0.01">
        <button type="button" class="remove-part" onclick="removePart(this)">
            <i class="bi bi-trash"></i>
        </button>
    `;
    
    partsContainer.appendChild(formRow);
}

// Remove part function
function removePart(button) {
    if (document.querySelectorAll('.form-row').length > 1) {
        button.parentElement.remove();
        // Renumber remaining parts
        const parts = document.querySelectorAll('.part-cost');
        parts.forEach((part, index) => {
            part.placeholder = `Part ${index + 1} cost`;
        });
    }
}

// Reset form function
function resetForm() {
    // Clear all numeric inputs
    document.querySelectorAll('input[type="number"]').forEach(input => {
        input.value = '';
    });
    
    // Reset to only one part
    const partsContainer = document.getElementById('partsContainer');
    partsContainer.innerHTML = `
        <div class="form-row">
            <input type="number" class="part-cost" placeholder="Part 1 cost" min="0" step="0.01">
            <button type="button" class="remove-part" onclick="removePart(this)">
                <i class="bi bi-trash"></i>
            </button>
        </div>
    `;
    
    // Hide results
    document.getElementById('results').classList.add('hidden');
}

// Calculate margin function
function calculateMargin() {
    const subtotal = parseFloat(document.getElementById('subtotal').value);
    if (isNaN(subtotal)) {
        alert('Please enter a valid subtotal amount');
        return;
    }
    
    const parts = document.querySelectorAll('.part-cost');
    const recalibration = parseFloat(document.getElementById('recalibration').value) || 0;
    const moulding = parseFloat(document.getElementById('moulding').value) || 0;
    
    const resultsBody = document.getElementById('resultsBody');
    resultsBody.innerHTML = '';
    
    let totalCost = 0;
    
    // Calculate part costs (always add $150 per part as if it were Indiana)
    parts.forEach((partInput, index) => {
        const baseCost = parseFloat(partInput.value) || 0;
        const adjustment = 150; // Always $150 per part
        
        const total = baseCost + adjustment;
        totalCost += total;
        
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>Part ${index + 1}</td>
            <td>$${baseCost.toFixed(2)}</td>
            <td>$${adjustment.toFixed(2)}</td>
            <td>$${total.toFixed(2)}</td>
        `;
        resultsBody.appendChild(row);
    });
    
    // Add recalibration
    totalCost += recalibration;
    if (recalibration > 0) {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>Recal</td>
            <td>$${recalibration.toFixed(2)}</td>
            <td>$0.00</td>
            <td>$${recalibration.toFixed(2)}</td>
        `;
        resultsBody.appendChild(row);
    }
    
    // Add moulding cost
    let mouldingTotal = moulding;
    if (moulding > 0) {
        mouldingTotal += 20;
        totalCost += mouldingTotal;
        
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>Mould</td>
            <td>$${moulding.toFixed(2)}</td>
            <td>$20.00</td>
            <td>$${mouldingTotal.toFixed(2)}</td>
        `;
        resultsBody.appendChild(row);
    }
    
    // Add total costs row
    const totalRow = document.createElement('tr');
    totalRow.innerHTML = `
        <td><strong>Total</strong></td>
        <td></td>
        <td></td>
        <td><strong>$${totalCost.toFixed(2)}</strong></td>
    `;
    resultsBody.appendChild(totalRow);
    
    // Add subtotal row
    const subtotalRow = document.createElement('tr');
    subtotalRow.innerHTML = `
        <td><strong>Subtotal</strong></td>
        <td></td>
        <td></td>
        <td><strong>$${subtotal.toFixed(2)}</strong></td>
    `;
    resultsBody.appendChild(subtotalRow);
    
    // Calculate margin
    const margin = subtotal - totalCost;
    const differenceRow = document.createElement('tr');
    differenceRow.innerHTML = `
        <td><strong>Margin</strong></td>
        <td></td>
        <td></td>
        <td><strong>$${margin.toFixed(2)}</strong></td>
    `;
    resultsBody.appendChild(differenceRow);
    
    // Show results
    document.getElementById('results').classList.remove('hidden');
    
    // Display margin message
    const marginMessage = document.getElementById('marginMessage');
    if (margin < 0) {
        marginMessage.textContent = `Negative margin of $${Math.abs(margin).toFixed(2)} – No discount`;
        marginMessage.className = "margin-message error";
    } else {
        marginMessage.textContent = `Positive margin of $${margin.toFixed(2)} – Discount available`;
        marginMessage.className = "margin-message success";
    }
}
