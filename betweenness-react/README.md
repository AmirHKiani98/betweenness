# Traffic Simulation Platform: React + Java + Simulation Engine

This repository integrates an interactive React-based graph editor with a backend Java simulation engine that models traffic flow using link-based dynamic network loading (DNL) models (CTM, LTM, PQ, etc.).

## ✨ Features
- **Frontend** (React + TypeScript + Redux):
  - Draw, edit, and delete nodes and links
  - Define node metadata, link properties, and demand profiles
  - Export graph data as `.txt` files
  - Send data to backend for simulation
  
- **Backend** (Java):
  - Parses simulation-ready files from the frontend
  - Executes DNL models and simulation logic
  - Sends simulation results back to frontend (to be extended)

---

## 🚀 Getting Started

### ✏️ Prerequisites
- Java JDK 11+
- Node.js (v16+)

---

## 📁 Project Structure

```
Betweenness-react/
├── public/                  # Public assets
├── server/                 # Java backend simulation engine
│   ├── networks/           # Simulation data inputs (generated or predefined)
│   ├── src/dnl/            # Source files for traffic simulation engine
│   ├── out/                # Compiled Java .class files
│   └── Server.java         # HTTP server to accept and run simulations
├── src/                    # React frontend
│   ├── components/         # Sidebar, modals, canvas
│   ├── services/           # Utility logic (CSV conversion, API requests)
│   └── store/              # Redux slices for graph, node, link, flow state
└── index.html / App.tsx    # Entry point
```

---

## 🚀 Run the Project

### ⚡ Backend (Java Server)

```bash
cd server
javac -d out src/dnl/*.java src/dnl/link/*.java src/dnl/node/*.java
java -cp out dnl.Server
```

The server will listen on `http://localhost:9090/upload-and-run` and save uploaded files to `networks/myNetwork/`.

### 🌐 Frontend (React App)

```bash
npm install
npm run dev
```

Open [http://localhost:5173](http://localhost:5173) in your browser.

---

## 📦 API

### `POST /upload-and-run`
Uploads simulation files and runs the simulation.

**Request:**
- `multipart/form-data` with fields:
  - `nodes.txt`
  - `links.txt`
  - `demand.txt`
  - `params.txt`

**Response:**
- `200 OK` with plain text: "Simulation completed"
- `500 Internal Server Error` if any exception is thrown

---

## ⚒️ File Format

### `nodes.txt`
```
id  type    lon     lat     elevation
1   source  0.0     0.0     0.0
2   sink    1.0     0.0     0.0
```

### `links.txt`
```
id  type   from to length speed capacity lanes
1   LTM    1    2  1.0    60    1800     1
```

### `demand.txt`
```
node_id  start  end  rate
1        0      3600 0.3
```

### `params.txt`
```
dt 6
duration 7200
jam_density 264.0
```

---

## 🤝 Troubleshooting

### CORS errors
Make sure your server sets headers:
```java
exchange.getResponseHeaders().add("Access-Control-Allow-Origin", "*");
exchange.getResponseHeaders().add("Access-Control-Allow-Headers", "*");
exchange.getResponseHeaders().add("Access-Control-Allow-Methods", "POST, OPTIONS");
```

### Compilation issues
Ensure the `src/` path is correct when compiling and use:
```bash
javac -d out src/dnl/*.java src/dnl/link/*.java src/dnl/node/*.java
```

---

## 🚀 Future Plans
- Display simulation results visually in frontend
- Support for traffic signal timing and phases
- Integration with CSV download of simulation results
- Dockerized deployment

---

## 🚀 Authors
- Java Simulation: Michael Levin
- Web Interface: Amirhossein Kiani

---

## ✉ Contributing
PRs are welcome. Please lint your code and provide testable examples.

---
## 📄 License
This project is licensed under the MIT License. See the [LICENSE](./LICENSE) file for details.

---

## Author Credits
- Frontend & Integration: **Amirhossein Kiani**
- Backend Traffic Engine: **Michael Levin**

