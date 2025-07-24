
const voltageDisplay = document.getElementById('voltage');
const currentDisplay = document.getElementById('current');
const powerDisplay = document.getElementById('power');
const resistanceDisplay = document.getElementById('resistance');
const statusText = document.getElementById('status');

const resistanceData = [];
const powerData = [];

const chart = new Chart(document.getElementById('resistancePowerChart'), {
  type: 'line',
  data: {
    labels: resistanceData,
    datasets: [{
      label: 'Power (W) vs Resistance (Ω)',
      data: powerData,
      borderColor: '#ff6f61',
      backgroundColor: 'rgba(255, 111, 97, 0.2)',
      fill: true,
      tension: 0.4
    }]
  },
  options: {
    animation: false,
    responsive: true,
    scales: {
      x: { title: { display: true, text: 'Resistance (Ω)' } },
      y: { title: { display: true, text: 'Power (W)' } }
    }
  }
});

const socket = new WebSocket('ws://192.168.4.2'); // replace with ESP32 IP

socket.onopen = () => {
  statusText.textContent = 'Status: Connected ✅';
};

socket.onclose = () => {
  statusText.textContent = 'Status: Disconnected ❌';
};

socket.onmessage = (event) => {
  const data = JSON.parse(event.data);
  const voltage = parseFloat(data.voltage);
  const current = parseFloat(data.current);
  const resistance = parseFloat(data.resistance);
  const power = +(voltage * current).toFixed(2);

  voltageDisplay.textContent = voltage.toFixed(2);
  currentDisplay.textContent = current.toFixed(2);
  powerDisplay.textContent = power;
  resistanceDisplay.textContent = resistance.toFixed(2);

  resistanceData.push(resistance.toFixed(2));
  powerData.push(power);

  if (resistanceData.length > 30) {
    resistanceData.shift();
    powerData.shift();
  }

  chart.update();
};
