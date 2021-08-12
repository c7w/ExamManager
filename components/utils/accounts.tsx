import stringRandom from 'string-random';
import CryptoJS from 'crypto-js';

interface Session {
	sessionId: String;
	logged_in: Boolean;
	username?: String;
	prompts?: Number;
}

const BASE_URL = 'http://localhost:3001/';

async function checkSessionId(sessionId: String): Promise<Session> {
    // TODO: use env variable
    /// const BASE_URL = process.env.API_BASE_URL;
    const auth = await fetch(BASE_URL + 'accounts/check?sessionId=' + sessionId)
        .then((response) => {
            if (!response.ok) throw 'Err!';
            return response;
        })
        .then((data) => data.json());
    if (auth['status'] == 'failed') {
        return { sessionId: sessionId,
            logged_in: false };
    } else {
        return {
            sessionId: sessionId,
            logged_in: true,
            username: auth['username'],
            prompts: auth['prompts']
        };
    }
}

function generateSessionId(): String {
    return stringRandom(32);
}

function hashPass(raw: string): String {
    return CryptoJS.MD5(raw).toString(CryptoJS.enc.Hex);
}

export { checkSessionId, generateSessionId, BASE_URL, hashPass };
