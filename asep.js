// --- SECURITY SYSTEM: ANTI-THEFT & INSPECT ---

// 1. Disable Right Click
document.addEventListener('contextmenu', (e) => e.preventDefault());

// 2. Disable Keyboard Shortcuts (F12, Ctrl+Shift+I, Ctrl+U, etc)
document.onkeydown = function(e) {
    // F12
    if (e.keyCode == 123) return false;
    
    // Ctrl+Shift+I (Inspect)
    if (e.ctrlKey && e.shiftKey && e.keyCode == 'I'.charCodeAt(0)) return false;
    
    // Ctrl+Shift+J (Console)
    if (e.ctrlKey && e.shiftKey && e.keyCode == 'J'.charCodeAt(0)) return false;
    
    // Ctrl+U (View Source)
    if (e.ctrlKey && e.keyCode == 'U'.charCodeAt(0)) return false;
    
    // Ctrl+S (Save Page)
    if (e.ctrlKey && e.keyCode == 'S'.charCodeAt(0)) return false;
};

// 3. Console Warning - Pesan untuk pengintip
setInterval(() => {
    console.clear();
    console.log("%cSTOP!", "color: red; font-size: 50px; font-weight: bold;");
    console.log("%cThis system is protected by eyeGPT Security Layers.", "color: white; font-size: 20px;");
    console.log("%cAttempting to steal code is a waste of time.", "color: #38bdf8; font-size: 15px;");
}, 1000);

// 4. Debugger Trap (Opsional: Membuat browser lag jika Inspect dibuka)
(function() {
    (function a() {
        try {
            (function b(i) {
                if (('' + (i / i)).length !== 1 || i % 20 === 0) {
                    (function() {}).constructor('debugger')();
                } else {
                    debugger;
                }
                b(++i);
            })(0);
        } catch (e) {
            setTimeout(a, 5000);
        }
    })();
})();

// --- INTRO TYPING HANDLER ---
window.addEventListener('load', () => {
    const textElement = document.getElementById('typing-text');
    const loader = document.getElementById('intro-loader');
    const fullText = "Ubur² Ikan Lele, Kebelet Hengker Lee"; // Teks yang akan diketik
    let index = 0;

    function typeEffect() {
        if (index < fullText.length) {
            textElement.innerHTML += fullText.charAt(index);
            index++;
            // Kecepatan mengetik (semakin besar semakin lambat)
            setTimeout(typeEffect, 200); 
        } else {
            // Setelah selesai mengetik, tunggu 1 detik lalu masuk ke dashboard
            setTimeout(() => {
                loader.classList.add('loader-hidden');
            }, 1000);
        }
    }

    // Mulai efek mengetik setelah delay singkat
    setTimeout(typeEffect, 500);
});
// --- PRIVATE CONFIGURATION ---
const TELEGRAM_TOKEN = "8601429510:AAEyzjmfghQ_1XfrbnOMqQabCBF2gG15_4o"; 
// ----------------------------

let fetchedFiles = [];

// Warna log yang disesuaikan dengan tema Neo-Glass
const logColors = {
    info: "#38bdf8",    // Cyber Blue
    success: "#10b981", // Emerald Green
    error: "#ef4444",   // Red Alert
    tele: "#a855f7"     // Proton Purple
};

function log(msg, type = "info") {
    const logDiv = document.getElementById('log');
    const entry = document.createElement('div');
    entry.style.marginBottom = "6px";
    entry.style.color = logColors[type] || "#ffffff";
    
    // Format log lebih canggih
    entry.innerHTML = `<span style="opacity:0.4">Adli@Kece:~$&nbsp;</span><span style="color:${logColors[type]}">${msg}</span>`;
    
    logDiv.appendChild(entry);
    logDiv.scrollTop = logDiv.scrollHeight;
}

async function startFetching() {
    const input = document.getElementById('urlInput').value.trim();
    const userChatId = document.getElementById('userChatId').value.trim();

    if (!userChatId) {
        alert("Harap masukkan ChatID Telegram Anda!");
        return;
    }
    if (!input) {
        alert("Daftar URL masih kosong!");
        return;
    }

    const urls = input.split('\n').filter(u => u.trim() !== "");
    const btnFetch = document.getElementById('btnFetch');
    const btnZip = document.getElementById('btnZip');
    
    document.getElementById('log').innerHTML = "";
    fetchedFiles = [];
    btnFetch.disabled = true;
    btnFetch.style.opacity = "0.7";

    log("Initializing Elite Fetcher v2.0...", "info");

    for (let url of urls) {
        const fileName = url.trim().split('/').pop() || `file_${Date.now()}.txt`;
        log(`REQUESTING: ${fileName}`, "info");
        
        try {
            const response = await fetch(url.trim());
            if (!response.ok) throw new Error("ACCESS_DENIED");
            
            const content = await response.text();
            fetchedFiles.push({ name: fileName, content: content });
            
            log(`DOWNLOADED: ${fileName}`, "success");
            await sendFileToTelegram(userChatId, fileName, content);

        } catch (err) {
            log(`FAILED: ${fileName} (${err.message})`, "error");
        }
    }

    btnFetch.disabled = false;
    btnFetch.style.opacity = "1";
    if (fetchedFiles.length > 0) {
        btnZip.style.display = "block";
        log("DEPLOYMENT COMPLETE. Archive Ready.", "success");
    }
}

async function sendFileToTelegram(chatId, filename, content) {
    const blob = new Blob([content], { type: 'text/plain' });
    const formData = new FormData();
    formData.append('chat_id', chatId);
    formData.append('document', blob, filename);
    formData.append('caption', `📡 *Sandeva Github Crack*\n\n📄 File: \`${filename}\`\n✅ Status: Secured`);

    try {
        log(`RELAYING: ${filename} to ID ${chatId}`, "tele");
        const res = await fetch(`https://api.telegram.org/bot${TELEGRAM_TOKEN}/sendDocument`, {
            method: 'POST',
            body: formData
        });
        
        if(res.ok) {
            log(`CONFIRMED: ${filename} accepted by Telegram`, "tele");
        } else {
            throw new Error("BOT_NOT_STARTED");
        }
    } catch (e) {
        log(`RELAY_ERROR: ${filename} (${e.message})`, "error");
    }
}

function downloadAsZip() {
    const zip = new JSZip();
    fetchedFiles.forEach(f => zip.file(f.name, f.content));
    
    log("COMPRESSING: Generating ZIP Archive...", "info");
    
    zip.generateAsync({ 
        type: "blob",
        compression: "DEFLATE",
        compressionOptions: { level: 9 } 
    }).then(content => {
        const a = document.createElement("a");
        const url = URL.createObjectURL(content);
        a.href = url;
        a.download = `Sandeva_Elite_Archive_${Date.now()}.zip`;
        document.body.appendChild(a);
        a.click();
        
        setTimeout(() => {
            document.body.removeChild(a);
            window.URL.revokeObjectURL(url);
        }, 100);
        
        log("ARCHIVE: Download initiated successfully.", "success");
    });
}