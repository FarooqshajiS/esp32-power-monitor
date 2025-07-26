
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

const socket = new WebSocket('ws://192.168.4.1:81'); // update to your ESP32's IP

socket.onopen = () => {
  document.getElementById("status").textContent = "Status: Connected ✅";
};

socket.onerror = () => {
  document.getElementById("status").textContent = "Status: Connection Failed ❌";
};

socket.onclose = () => {
  document.getElementById("status").textContent = "Status: Disconnected ❌";
};

socket.onmessage = (event) => {
  const data = JSON.parse(event.data);
  document.getElementById("voltage").textContent = data.voltage.toFixed(2);
  document.getElementById("current").textContent = data.current.toFixed(3);
  document.getElementById("power").textContent = data.power.toFixed(3);
  document.getElementById("resistance").textContent = data.resistance.toFixed(2);
  
  // update chart here if needed
};
