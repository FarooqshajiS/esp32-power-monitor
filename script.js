const voltageEl = document.getElementById('voltage');
const currentEl = document.getElementById('current');
const powerEl = document.getElementById('power');
const resistanceEl = document.getElementById('resistance');

let chart = new Chart(document.getElementById('powerChart'), {
    type: 'line',
    data: {
        labels: [],
        datasets: [{
            label: 'Power vs Resistance',
            data: [],
            borderColor: 'rgba(75, 192, 192, 1)',
            tension: 0.3,
            fill: false
        }]
    },
    options: {
        responsive: true,
        scales: {
            x: {
                title: {
                    display: true,
                    text: 'Resistance (Ω)'
                }
            },
            y: {
                title: {
                    display: true,
                    text: 'Power (W)'
                }
            }
        }
    }
});

async function fetchData() {
    try {
        const res = await fetch('/data'); // Replace with ESP32 IP if needed
        const data = await res.json();
        voltageEl.textContent = data.voltage.toFixed(2);
        currentEl.textContent = data.current.toFixed(2);
        powerEl.textContent = data.power.toFixed(2);
        resistanceEl.textContent = data.resistance.toFixed(2);

        chart.data.labels.push(data.resistance.toFixed(2));
        chart.data.datasets[0].data.push(data.power.toFixed(2));
        chart.update();
    } catch (e) {
        console.error("Error fetching data", e);
    }
}

setInterval(fetchData, 2000);