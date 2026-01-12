/**
 * BLL SNIPER - CLIENT SIDE INJECTOR
 * Designed to run in the browser console context.
 * Bypasses server-side rendering obfuscation by fetching dynamic DOM elements.
 */

const TEMPO_ENTRE_CLIQUES = 2000; // Safety delay to avoid rate-limiting
let resultados = [];

// Helper function to export data to CSV
function baixarCSV(dados) {
    let csvContent = "data:text/csv;charset=utf-8,\uFEFF"; 
    csvContent += "Link;Objeto_Extraido;Status\n";
    
    dados.forEach(row => {
        let objLimpo = row.objeto ? row.objeto.replace(/"/g, '""').replace(/(\r\n|\n|\r)/gm, " ") : "ERRO";
        csvContent += `"${row.link}";"${objLimpo}";"${row.status}"\n`;
    });

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "EXTRACTED_DATASET.csv");
    document.body.appendChild(link);
    link.click();
}

async function processarFila(alvos) {
    console.log(`%c🚀 STARTING EXTRACTION ENGINE`, "color: lime; font-size: 20px;");
    
    for (const linkFull of alvos) {
        let url = linkFull.startsWith('http') ? linkFull : window.location.origin + linkFull;

        try {
            let response = await fetch(url);
            if (!response.ok) throw new Error(`HTTP ${response.status}`);
            
            let textoHtml = await response.text();
            let parser = new DOMParser();
            let doc = parser.parseFromString(textoHtml, 'text/html');
            
            // DOM Traversal Strategy
            let objeto = "NOT_FOUND";
            
            // Strategy A: Label Proximity
            let labels = Array.from(doc.querySelectorAll('label, span, b, strong'));
            let labelObjeto = labels.find(el => el.innerText && el.innerText.toUpperCase().includes("OBJETO"));
            
            if (labelObjeto) {
                objeto = labelObjeto.parentElement.innerText.replace(/Objeto\s*:?/i, "").trim();
            }
            
            // Strategy B: Textarea scanning
            if (!objeto || objeto.length < 5) {
                let textAreas = doc.querySelectorAll('textarea');
                for (let t of textAreas) {
                    if (t.value && t.value.length > 10) {
                        objeto = t.value;
                        break;
                    }
                }
            }

            resultados.push({ link: linkFull, objeto: objeto, status: "OK" });

        } catch (erro) {
            console.error(`Connection Error:`, erro);
            resultados.push({ link: linkFull, objeto: "ERROR", status: "FAIL" });
        }

        // Human-like delay
        let delay = TEMPO_ENTRE_CLIQUES + Math.random() * 1000;
        await new Promise(r => setTimeout(r, delay));
    }

    console.log(`🏁 JOB COMPLETE.`);
    baixarCSV(resultados);
}
