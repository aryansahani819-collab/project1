
"use strict";

// ---------- METRO STATION DATA ----------
// Ordered sample station list for the demonstration.

const stations = [
    "Aluva",
    "Pulinchodu",
    "Companypady",
    "Ambattukavu",
    "Muttom",
    "Kalamassery",
    "CUSAT",
    "Pathadipalam",
    "Edapally",
    "Changampuzha Park",
    "Palarivattom",
    "JLN Stadium",
    "Kaloor",
    "Town Hall",
    "M.G. Road",
    "Maharaja's College",
    "Ernakulam South",
    "Kadavanthra",
    "Elamkulam",
    "Vyttila",
    "Thaikoodam",
    "Petta",
    "Vadakkekotta",
    "SN Junction",
    "Tripunithura"
];

// ---------- MOBILE NAVIGATION ----------

const menuToggle = document.getElementById("menuToggle");
const navMenu = document.getElementById("navMenu");

menuToggle.addEventListener("click", () => {
    const isOpen = navMenu.classList.toggle("open");

    menuToggle.setAttribute("aria-expanded", String(isOpen));
    menuToggle.textContent = isOpen ? "✕" : "☰";
});

navMenu.querySelectorAll("a").forEach(link => {
    link.addEventListener("click", () => {
        navMenu.classList.remove("open");
        menuToggle.setAttribute("aria-expanded", "false");
        menuToggle.textContent = "☰";
    });
});

// ---------- POPULATE STATION SELECTS ----------

const fromStation = document.getElementById("fromStation");
const toStation = document.getElementById("toStation");

function populateStationSelect(selectElement) {
    stations.forEach((station, index) => {
        const option = document.createElement("option");

        option.value = String(index);
        option.textContent = station;

        selectElement.appendChild(option);
    });
}

populateStationSelect(fromStation);
populateStationSelect(toStation);

// ---------- SWAP STATIONS ----------

document.getElementById("swapStations").addEventListener("click", () => {
    const previousFrom = fromStation.value;

    fromStation.value = toStation.value;
    toStation.value = previousFrom;
});

// ---------- JOURNEY PLANNER ----------

const planBtn = document.getElementById("planBtn");
const journeyResult = document.getElementById("journeyResult");

function showMessage(message) {
    journeyResult.replaceChildren();

    const paragraph = document.createElement("p");
    paragraph.textContent = message;

    journeyResult.appendChild(paragraph);
}

planBtn.addEventListener("click", () => {
    const fromIndex = Number(fromStation.value);
    const toIndex = Number(toStation.value);

    if (fromStation.value === "" || toStation.value === "") {
        showMessage("Please select both your starting and destination stations.");
        return;
    }

    if (fromStation.value === toStation.value) {
        showMessage("Please select two different stations.");
        return;
    }

    const numberOfStops = Math.abs(toIndex - fromIndex);

    // These values are for a student project only.
    // They are not official Kochi Metro fares or schedules.
    const estimatedFare = Math.min(60, 10 + numberOfStops * 2);
    const estimatedMinutes = numberOfStops * 3;

    const routeStations = stations
        .slice(
            Math.min(fromIndex, toIndex),
            Math.max(fromIndex, toIndex) + 1
        );

    if (fromIndex > toIndex) {
        routeStations.reverse();
    }

    journeyResult.replaceChildren();

    const summary = document.createElement("div");
    summary.className = "result-summary";

    const routeHeading = document.createElement("div");

    const heading = document.createElement("h3");
    heading.textContent =
        stations[fromIndex] + " → " + stations[toIndex];

    const description = document.createElement("p");
    description.textContent = "Your sample journey estimate";

    routeHeading.append(heading, description);

    const fareStat = document.createElement("div");
    fareStat.className = "result-stat";

    const fareLabel = document.createElement("span");
    fareLabel.textContent = "Estimated fare";

    const fareValue = document.createElement("strong");
    fareValue.textContent = "₹" + estimatedFare;

    fareStat.append(fareLabel, fareValue);

    const timeStat = document.createElement("div");
    timeStat.className = "result-stat";

    const timeLabel = document.createElement("span");
    timeLabel.textContent = "Estimated time";

    const timeValue = document.createElement("strong");
    timeValue.textContent = estimatedMinutes + " min";

    timeStat.append(timeLabel, timeValue);

    summary.append(routeHeading, fareStat, timeStat);

    const preview = document.createElement("div");
    preview.className = "route-preview";

    const routeLabel = document.createElement("strong");
    routeLabel.textContent = "Route: ";

    const routeText = document.createElement("span");
    routeText.textContent = routeStations.join(" → ");

    preview.append(routeLabel, routeText);

    journeyResult.append(summary, preview);
});

// ---------- STATION CARDS ----------

const stationGrid = document.getElementById("stationGrid");
const stationSearch = document.getElementById("stationSearch");
const noStations = document.getElementById("noStations");

function renderStations(searchText = "") {
    stationGrid.replaceChildren();

    const query = searchText.trim().toLowerCase();

    const filteredStations = stations
        .map((station, index) => ({ station, index }))
        .filter(item => item.station.toLowerCase().includes(query));

    noStations.hidden = filteredStations.length !== 0;

    filteredStations.forEach(({ station, index }) => {
        const card = document.createElement("article");
        card.className = "station-card";

        const top = document.createElement("div");
        top.className = "station-top";

        const icon = document.createElement("span");
        icon.className = "station-icon";
        icon.textContent = "🚉";
        icon.setAttribute("aria-hidden", "true");

        const tag = document.createElement("span");
        tag.className = "station-tag";
        tag.textContent = "METRO";

        top.append(icon, tag);

        const heading = document.createElement("h3");
        heading.textContent = station;

        const description = document.createElement("p");
        description.textContent =
            index === 0
                ? "Starting station in this sample route."
                : index === stations.length - 1
                    ? "Ending station in this sample route."
                    : "Explore this station on the metro network.";

        const button = document.createElement("button");
        button.type = "button";
        button.textContent = "Plan from here →";

        button.addEventListener("click", () => {
            fromStation.value = String(index);

            // Choose a different default destination.
            toStation.value = String(
                index === stations.length - 1 ? index - 1 : index + 1
            );

            document.getElementById("journey").scrollIntoView({
                behavior: "smooth",
                block: "start"
            });
        });

        card.append(top, heading, description, button);
        stationGrid.appendChild(card);
    });
}

stationSearch.addEventListener("input", event => {
    renderStations(event.target.value);
});

// ---------- FOOTER YEAR ----------

document.getElementById("year").textContent =
    new Date().getFullYear();

// Display all stations when the website first loads.
renderStations();
