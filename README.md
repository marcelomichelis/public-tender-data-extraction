# Public Tender Data Extraction Suite 🚜

Automated tool designed to extract, process, and analyze public tender descriptions from government portals that use complex server-side rendering and obfuscation.

## 🛠 Tech Stack
* **Python**: Data processing (Pandas), HAR file parsing.
* **JavaScript**: DOM manipulation, Client-side injection (Console), Async/Await fetch requests.
* **Data Engineering**: ETL pipeline (Extract, Transform, Load) from raw HTML to structured CSV.

## 🚀 Key Features
* **Hybrid Extraction Strategy**: Combines Python for static analysis and JavaScript for dynamic content fetching.
* **HAR Analysis**: Reverse engineering of network logs to identify hidden API endpoints.
* **DOM Traversal**: Intelligent traversing of HTML structure to locate target data fields (Labels/Textareas).
* **Anti-Blocking**: Implements randomized delays and human-like interaction patterns.
