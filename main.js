const input = document.querySelector('.input input');
const output = document.querySelector('.output h3');
const selectFrom = document.querySelector('select[name="cur1"]');
const selectTo = document.querySelector('select[name="cur2"]');
const dateElement = document.querySelector('div.date p#date');
const btn = document.querySelector('.output button');

const dateToDisplay = new Date().toLocaleDateString('en-GB', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit'
});

// Display the date
dateElement.innerText = dateToDisplay;

let rates;
let currenciesArray;

// Fetch currency data from the JSON file
async function fetchData() {
    try {
        const response = await fetch('CurJson.json');
        const data = await response.json();
        currenciesArray = data;
        for (let i = 0; i < currenciesArray.length; i++) {
            const option = document.createElement('option');
            option.value = currenciesArray[i].code;
            option.text = currenciesArray[i].code;
            selectFrom.add(option);
            selectTo.add(option.cloneNode(true));
        }
    } catch (error) {
        console.error('Error fetching currency data:', error);
    }
}

// Fetch exchange rates when the "From" currency changes
selectFrom.addEventListener('change', async () => {
    const from = selectFrom.value.toLowerCase();
    let d = dateToDisplay.split("/");
    let dateToShow = d[2] + "-" + d[1] + "-" + d[0];  // Format the date as YYYY-MM-DD

    const url = `https://cdn.jsdelivr.net/npm/@fawazahmed0/currency-api@${dateToShow}/v1/currencies/${from}.json`;

    try {
        const response = await fetch(url);
        const data = await response.json();
        rates = data[from];  // Store the rates for the selected "from" currency
    } catch (error) {
        console.error('Error fetching exchange rates:', error);
    }
});

// Convert the currency when the input value is provided
btn.addEventListener('click', () => {
    const value = parseFloat(input.value);
    const to = selectTo.value.toLowerCase();

    if (!rates) {
        output.innerText = 'Please select a currency from the "From" dropdown';
        return;
    }

    const rate = rates[to];  // Access the correct rate using the selected "to" currency code
    if (!rate || value ==="" || to ==="") {
        output.innerText = `No rate available for this Choice ${to}`;
        return;
    }
    const result = (value * rate).toFixed(2);
    output.innerText = `${value} ${selectFrom.value} = ${result} ${selectTo.value}`;
});
// Call fetchData to populate the dropdowns on page load
fetchData();