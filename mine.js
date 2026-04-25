let data = JSON.parse(localStorage.getItem("labData")) || [];

function addData() {
    let lab = document.getElementById("lab").value;
    let device = document.getElementById("device").value;
    let performance = parseInt(document.getElementById("performance").value);

    if (!lab || !device || !performance) {
        alert("Fill all fields!");
        return;
    }

    let item = { lab, device, performance };
    data.push(item);

    localStorage.setItem("labData", JSON.stringify(data));

    displayData();
    clearInputs();
}

function displayData() {
    let table = document.getElementById("tableBody");
    table.innerHTML = "";

    data.forEach((item) => {
        let row = table.insertRow();

        let cls = item.performance >= 70 ? "good" :
                  item.performance >= 40 ? "medium" : "bad";

        row.className = cls;

        row.insertCell(0).innerText = item.lab;
        row.insertCell(1).innerText = item.device;
        row.insertCell(2).innerText = item.performance;

        let status = predictDevice(item.device);
        row.insertCell(3).innerText = status;
    });

    analyze();
    drawChart();
}

function analyze() {
    if (data.length === 0) return;

    let best = data.reduce((a, b) => a.performance > b.performance ? a : b);
    let worst = data.reduce((a, b) => a.performance < b.performance ? a : b);

    document.getElementById("best").innerText =
        "🔥 Best Device: " + best.device + " (" + best.performance + ")";

    document.getElementById("worst").innerText =
        "⚠️ Worst Device: " + worst.device + " (" + worst.performance + ")";
}

function predictDevice(deviceName) {
    let history = data.filter(d => d.device === deviceName);

    if (history.length < 2) return "Normal";

    let last = history[history.length - 1].performance;
    let prev = history[history.length - 2].performance;

    if (last < prev) {
        return "⚠️ Performance Dropping";
    } else if (last < 40) {
        return "❌ High Risk";
    } else {
        return "✅ Stable";
    }
}

let chart;

function drawChart() {
    let ctx = document.getElementById("chart");

    if (chart) chart.destroy();

    chart = new Chart(ctx, {
        type: "bar",
        data: {
            labels: data.map(d => d.device),
            datasets: [{
                label: "Performance",
                data: data.map(d => d.performance)
            }]
        }
    });
}

function clearInputs() {
    document.getElementById("lab").value = "";
    document.getElementById("device").value = "";
    document.getElementById("performance").value = "";
}

window.onload = displayData;

/* 🤖 Chat */

function sendMessage() {
    let input = document.getElementById("userInput");
    let msg = input.value.toLowerCase();

    addChat("You: " + msg);

    let reply = "I don't understand.";

    if (msg.includes("slow") || msg.includes("بطئ")) {
        reply = "Try restarting device or closing apps.";
    } 
    else if (msg.includes("internet") || msg.includes("نت")) {
        reply = "Check router or cable.";
    } 
    else if (msg.includes("not working") || msg.includes("مش شغال")) {
        reply = "Check power and restart.";
    }

    addChat("Bot: " + reply);

    input.value = "";
}

function addChat(text) {
    let box = document.getElementById("chatBox");
    box.innerHTML += "<p>" + text + "</p>";
    box.scrollTop = box.scrollHeight;
}

/* PWA */
if ("serviceWorker" in navigator) {
    navigator.serviceWorker.register("service-worker.js");
}




















































