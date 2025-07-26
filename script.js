const socket = new WebSocket('ws://192.168.4.1:81');

socket.onopen = () => {
  document.getElementById("status").textContent = "Status: Connected ✅";
};

socket.onclose = () => {
  document.getElementById("status").textContent = "Status: Disconnected ❌";
};

socket.onerror = () => {
  document.getElementById("status").textContent = "Status: Connection Failed ❌";
};

socket.onmessage = (event) => {
  const data = JSON.parse(event.data);

  document.getElementById("voltage").textContent = data.voltage.toFixed(2);
  document.getElementById("current").textContent = data.current.toFixed(3);
  document.getElementById("power").textContent = data.power.toFixed(3);
  document.getElementById("resistance").textContent = data.resistance.toFixed(2);

  updateChart(data.resistance, data.power);
};

const ctx = document.getElementById('resistancePowerChart').getContext('2d');
const resistancePowerChart = new Chart(ctx, {
  type: 'line',
  data: {
    labels: [],
    datasets: [{
      label: 'Power vs Resistance',
      data: [],
      borderColor: '#018e98',
      borderWidth: 2,
      fill: false,
      pointRadius: 4,
      pointHoverRadius: 6
    }]
  },
  options: {
    responsive: true,
    scales: {
      x: {
        title: { display: true, text: 'Resistance (Ω)' }
      },
      y: {
        title: { display: true, text: 'Power (W)' }
      }
    }
  }
});

let peakPower = 0;
let peakResistance = 0;

function updateChart(resistance, power) {
  const chartData = resistancePowerChart.data;
  chartData.labels.push(resistance.toFixed(2));
  chartData.datasets[0].data.push(power.toFixed(3));

  if (power > peakPower) {
    peakPower = power;
    peakResistance = resistance;
  }

  resistancePowerChart.update();
}

function nextResistance() {
  if (socket && socket.readyState === WebSocket.OPEN) {
    socket.send("next");
  }
}

function startExperiment() {
  document.getElementById("nextBtn").disabled = false;
}
