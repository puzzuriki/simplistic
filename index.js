const { eventSource, event_types } = SillyTavern.getContext();

let thinkingIndicator = null;

function showThinking() {
    if (thinkingIndicator) return;
    
    const chatDom = document.getElementById('chat');
    if (!chatDom) return;

    const context = SillyTavern.getContext();
    const character = context.characters[context.characterId];
    const avatarSrc = character ? `/characters/${character.avatar}` : 'default.png';
    const charName = character ? character.name : 'AI';

    thinkingIndicator = document.createElement('div');
    thinkingIndicator.id = 'modern-thinking-indicator';
    thinkingIndicator.className = 'mes';

    thinkingIndicator.innerHTML = `
        <div class="avatar-container">
            <img class="avatar" src="${avatarSrc}" alt="avatar">
        </div>
        <div class="mes_block">
            <div class="ch_name">
                <span class="ch_name_text">${charName}</span>
            </div>
            <div class="mes_text" style="display: flex; flex-direction: column; gap: 0.5rem; background: transparent !important; border: none !important; padding: 0 !important; max-width: 100%; box-shadow: none !important;">
                <div style="border-radius: 0.75rem; border: 1px solid rgba(59, 130, 246, 0.2); background-color: rgba(59, 130, 246, 0.05); padding: 0.5rem 0.75rem; width: 100%; box-sizing: border-box;">
                    <p style="margin: 0 0 0.25rem 0; font-size: 0.625rem; font-weight: 600; letter-spacing: 0.025em; color: rgba(59, 130, 246, 0.7); text-transform: uppercase;">
                        Inside thought
                    </p>
                    <div class="modern-thinking-bubble">
                        <div class="typing-indicator">
                            <span class="dot"></span>
                            <span class="dot"></span>
                            <span class="dot"></span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    `;
    
    chatDom.appendChild(thinkingIndicator);
    chatDom.scrollTo({ top: chatDom.scrollHeight, behavior: 'smooth' });
}

function hideThinking() {
    if (thinkingIndicator) {
        thinkingIndicator.classList.add('fade-out');
        setTimeout(() => {
            if (thinkingIndicator) {
                thinkingIndicator.remove();
                thinkingIndicator = null;
            }
        }, 200);
    }
}

export async function onActivate() {
    console.log('[Modern React UI] Extension Activated');
    eventSource.on(event_types.GENERATION_STARTED, showThinking);
    eventSource.on(event_types.STREAM_TOKEN_RECEIVED, hideThinking);
    eventSource.on(event_types.GENERATION_ENDED, hideThinking);
    eventSource.on(event_types.GENERATION_STOPPED, hideThinking);
}