
let messages = [];

const botResponses = [
    "Anlıyorum. Bu konuda ne düşünüyorsun?",
    "İlginç bir bakış açısı. Daha detaylı anlatır mısın?",
    "Bu durum seni nasıl etkiliyor?",
    "Anladım. Bunun hakkında konuşmak istiyor musun?",
    "Hmm, zor bir durum gibi görünüyor. Ne hissediyorsun?",
    "Bu durumla nasıl başa çıkıyorsun?",
    "Anlıyorum. Sana destek olabilecek ne var?",
    "Bu konuda daha önce böyle hissettin mi?",
    "Anlaşılabilir bir durum. Ne yapmanın yardımcı olacağını düşünüyorsun?",
    "Bu seni nasıl hissettiriyor şu anda?",
    "Zor bir zaman geçiriyorsun galiba. Ne konuşmak istersin?",
    "Bu durumda kendini nasıl daha iyi hissettirebiliriz?",
    "Anladım seni. Başka neler var aklında?",
    "Bu durum ne kadar süredir böyle?"
];

const specialResponses = {
    'merhaba': 'Merhaba! Bugün nasılsın?',
    'selam': 'Selam! Ne var ne yok?',
    'nasılsın': 'Ben iyiyim, teşekkürler. Sen nasılsın?',
    'kötüyüm': 'Üzgünüm bunu duyduğuma. Ne oldu, anlatmak ister misin?',
    'üzgünüm': 'Anlıyorum. Bu konuda konuşmak ister misin?',
    'mutsuzum': 'Bu durumu anlıyorum. Seni neyin mutlu ettiğini düşünelim.',
    'yalnızım': 'Yalnızlık zor bir his. Ben buradayım, konuşalım.',
    'depresyondayım': 'Bu ciddi bir durum. Profesyonel yardım aldın mı? Ben de dinliyorum.',
    'stresim': 'Stres çok yorucu. Nefes al, biraz rahatlayalım. Ne seni strese sokuyor?',
    'endişeliyim': 'Endişen ne hakkında? Bazen konuşmak rahatlatır.',
    'korkuluyum': 'Korkularını paylaşmak ister misin? Birlikte bakabiliriz.',
    'sinirliydim': 'Sinirlenmen normal. Bu duyguyu neyin tetiklediğini düşün.',
    'motivasyonum yok': 'Anladım. Küçük adımlarla başlayabilirsin. Ne yapmayı seversin?',
    'yorgunum': 'Dinlenmeye ihtiyacın var. Kendine biraz mola ver.',
    'sıkıldım': 'Canın sıkılmış. Eğlenceli bir şeyler yapalım, ne dersin?',
    'mutluyum': 'Harika! Bu güzel hissi paylaştığın için teşekkürler. Ne seni bu kadar mutlu etti?',
    'heyecanlıyım': 'Vay! Bu heyecan nereden geliyor? Anlat bakalım.',
    'aktivite': 'Müzik dinle, yürüyüş yap, çay iç, arkadaşına yaz, derin nefes al. Hangisi cazip geliyor?',
    'ne yapmalıyım': 'Bu durumda hangi seçeneklerin var? Beraber düşünelim.',
    'yardım': 'Tabii ki! Nasıl yardımcı olabilirim?',
    'teşekkürler': 'Rica ederim! Her zaman buradayım.',
    'bye': 'Görüşürüz! Kendine iyi bak.',
    'güle güle': 'Güle güle! Umarım daha iyi hissedersin.'
};


document.addEventListener('DOMContentLoaded', function() {
    loadMessages();
    setupEventListeners();
    

    if (messages.length === 0) {
        addWelcomeMessage();
    }
});

function setupEventListeners() {
    const messageInput = document.getElementById('messageInput');
    const sendButton = document.getElementById('sendButton');
    
   
    messageInput.addEventListener('keypress', function(e) {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            sendMessage();
        }
    });
  
    messageInput.addEventListener('input', function() {
        sendButton.disabled = this.value.trim() === '';
    });
    sendButton.disabled = true;
}

function addWelcomeMessage() {
    const welcomeMsg = {
        text: 'Merhaba, sizi burada görmek çok güzel. Ben sizin kişisel destek asistanınızım. Bugün kendinizi nasıl hissediyorsunuz? Belki biraz konuşmak istersiniz?',
        sender: 'bot',
        timestamp: new Date().toISOString()
    };
    messages.push(welcomeMsg);
    saveMessages();
}

function sendMessage() {
    const messageInput = document.getElementById('messageInput');
    const messageText = messageInput.value.trim();
    
    if (messageText === '') return;
    
   
    const userMessage = {
        text: messageText,
        sender: 'user',
        timestamp: new Date().toISOString()
    };
    
    messages.push(userMessage);
    displayMessage(userMessage);
    saveMessages();
    
   
    messageInput.value = '';
    document.getElementById('sendButton').disabled = true;
    
   
    setTimeout(() => {
        showTypingIndicator();
        
        setTimeout(() => {
            hideTypingIndicator();
            const botResponse = generateBotResponse(messageText);
            const botMessage = {
                text: botResponse,
                sender: 'bot',
                timestamp: new Date().toISOString()
            };
            
            messages.push(botMessage);
            displayMessage(botMessage);
            saveMessages();
        }, 1000 + Math.random() * 2000); 
    }, 500);
}

function generateBotResponse(userMessage) {
    const lowerMessage = userMessage.toLowerCase();
    
   
    for (const [key, response] of Object.entries(specialResponses)) {
        if (lowerMessage.includes(key)) {
            return response;
        }
    }
    
   
    return botResponses[Math.floor(Math.random() * botResponses.length)];
}

function displayMessage(message) {
    const chatMessages = document.getElementById('chatMessages');
    
    const messageDiv = document.createElement('div');
    messageDiv.className = `message ${message.sender}-message`;
    
    const messageContent = document.createElement('div');
    messageContent.className = 'message-content';
    
    const messageP = document.createElement('p');
    messageP.textContent = message.text;
    
    const messageTime = document.createElement('span');
    messageTime.className = 'message-time';
    messageTime.textContent = formatTime(message.timestamp);
    
    messageContent.appendChild(messageP);
    messageContent.appendChild(messageTime);
    messageDiv.appendChild(messageContent);
    
    chatMessages.appendChild(messageDiv);
    scrollToBottom();
}

function showTypingIndicator() {
    const chatMessages = document.getElementById('chatMessages');
    
    const typingDiv = document.createElement('div');
    typingDiv.className = 'message bot-message';
    typingDiv.id = 'typing-indicator';
    
    typingDiv.innerHTML = `
        <div class="typing-indicator">
            <div class="typing-dots">
                <div class="typing-dot"></div>
                <div class="typing-dot"></div>
                <div class="typing-dot"></div>
            </div>
        </div>
    `;
    
    chatMessages.appendChild(typingDiv);
    scrollToBottom();
}

function hideTypingIndicator() {
    const typingIndicator = document.getElementById('typing-indicator');
    if (typingIndicator) {
        typingIndicator.remove();
    }
}

function formatTime(timestamp) {
    const date = new Date(timestamp);
    const now = new Date();
    
   
    if (date.toDateString() === now.toDateString()) {
        return date.toLocaleTimeString('tr-TR', { 
            hour: '2-digit', 
            minute: '2-digit' 
        });
    } else {
        return date.toLocaleDateString('tr-TR', { 
            day: 'numeric', 
            month: 'short',
            hour: '2-digit', 
            minute: '2-digit'
        });
    }
}

function scrollToBottom() {
    const chatMessages = document.getElementById('chatMessages');
    chatMessages.scrollTop = chatMessages.scrollHeight;
}

function saveMessages() {
    localStorage.setItem('chatMessages', JSON.stringify(messages));
}

function loadMessages() {
    const savedMessages = localStorage.getItem('chatMessages');
    if (savedMessages) {
        messages = JSON.parse(savedMessages);
        displayAllMessages();
    }
}

function displayAllMessages() {
    const chatMessages = document.getElementById('chatMessages');
    chatMessages.innerHTML = ''; 
    
    messages.forEach(message => {
        displayMessage(message);
    });
}

function clearChat() {
    if (confirm('Tüm sohbet geçmişini silmek istediğinize emin misiniz?')) {
        messages = [];
        localStorage.removeItem('chatMessages');
        
        const chatMessages = document.getElementById('chatMessages');
        chatMessages.innerHTML = '';
        
       
        addWelcomeMessage();
        displayAllMessages();
    }
}


function getTimeBasedGreeting() {
    const hour = new Date().getHours();
    
    if (hour < 6) {
        return "Geç saatler!  Uykun gelmiyor mu?";
    } else if (hour < 12) {
        return "Günaydın!  Güzel bir sabah!";
    } else if (hour < 18) {
        return "İyi günler!  Gün nasıl geçiyor?";
    } else {
        return "İyi akşamlar!  Günün nasıldı?";
    }
} 