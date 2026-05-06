import { GoogleGenAI } from 'https://esm.sh/@google/genai';

const ai = new GoogleGenAI({ apiKey: window.GEMINI_API_KEY });

document.getElementById('ai-form').addEventListener('submit', async function (e) {
    e.preventDefault();

    const age  = document.getElementById('age').value;
    const mood = document.getElementById('mood').value;

    if (!age || !mood) {
        alert('Please fill in your age and how you feel today.');
        return;
    }

    const prompt = `
You are a music expert. A person who is ${age} years old is feeling "${mood}" today.

Based on their age and current mood, recommend:
1. The best music genres for them right now (2 or 3 genres)
2. A list of 5 specific song recommendations (include artist name and song title)
3. One short sentence explaining why this music fits how they feel

Keep the response friendly, short, and easy to read.
`;

    document.getElementById('result-section').style.display = 'none';
    document.getElementById('loading-section').style.display = 'block';
    document.getElementById('submit-btn').disabled = true;
    document.getElementById('submit-btn').textContent = 'Generating...';

    try {
        const response = await ai.models.generateContent({
            model: 'gemini-3.1-flash-lite-preview',
            contents: prompt,
        });

        const text = response.text;

        if (!text) throw new Error('No response received from AI.');

        document.getElementById('loading-section').style.display = 'none';
        document.getElementById('result-section').style.display = 'block';
        document.getElementById('result-content').innerHTML = formatResponse(text);

        document.getElementById('result-section').scrollIntoView({ behavior: 'smooth' });

    } catch (error) {
        document.getElementById('loading-section').style.display = 'none';
        document.getElementById('result-section').style.display = 'block';
        document.getElementById('result-content').innerHTML =
            `<p style="color:#f2a93b;">Error: ${error.message}</p><p>Please check your connection and try again.</p>`;
    } finally {
        document.getElementById('submit-btn').disabled = false;
        document.getElementById('submit-btn').textContent = 'Get Music Recommendations';
    }
});

function formatResponse(text) {
    return text
        .replace(/^### (.+)$/gm, '<h3 style="color:#1a3a5c; margin-top:20px; margin-bottom:6px;">$1</h3>')
        .replace(/^## (.+)$/gm,  '<h2 style="color:#1a3a5c; margin-top:22px; margin-bottom:8px;">$1</h2>')
        .replace(/^# (.+)$/gm,   '<h1 style="color:#1a3a5c; margin-top:22px; margin-bottom:8px;">$1</h1>')
        .replace(/\*\*(.+?)\*\*/g, '<strong style="color:#1a3a5c;">$1</strong>')
        .replace(/^\* (.+)$/gm, '<li style="margin-left:18px; color:#111;">$1</li>')
        .replace(/^- (.+)$/gm,  '<li style="margin-left:18px; color:#111;">$1</li>')
        .replace(/\n{2,}/g, '</p><p style="margin-top:10px; color:#111;">')
        .replace(/^(?!<[hlp]|<li)(.+)$/gm, '$1')
        .replace(/^(<li.+<\/li>\n?)+/gm, (match) => `<ul style="margin:8px 0;">${match}</ul>`);
}
