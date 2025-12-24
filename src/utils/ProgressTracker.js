import AsyncStorage from "@react-native-async-storage/async-storage";

const STORAGE_KEY = "LOCAL_PROGRESS";
const WEEK_KEY = "WEEKLY_PROGRESS";
const HISTORY_KEY = "LEARNING_HISTORY";
const STREAK_KEY = "DAILY_STREAK";

const API_URL = "https://dnyanai-backend-1.onrender.com/api/progress";

const SUBJECTS = [
  "Physics",
  "Chemistry",
  "Biology",
  "Mathematics I",
  "Mathematics II",
];

async function initializeProgress() {
  const obj = {};
  SUBJECTS.forEach((s) => {
    obj[s] = { pdfOpened: 0, aiMentions: 0 };
  });
  await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(obj));
  return obj;
}

async function getAuth() {
  const email = await AsyncStorage.getItem("userEmail");
  const token = await AsyncStorage.getItem("userToken");

  if (!email || email === "null" || email === "undefined") return { email: null, token: null };
  if (!token || token === "null" || token === "undefined") return { email: null, token: null };

  return { email, token };
}

export async function getProgressData() {
  try {
    const auth = await getAuth();

    let local = await AsyncStorage.getItem(STORAGE_KEY);
    local = local ? JSON.parse(local) : await initializeProgress();

    if (!auth.email || !auth.token) return local;

    let res = await fetch(`${API_URL}/get`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + auth.token,
      },
      body: JSON.stringify({ email: auth.email }),
    }).catch(() => null);

    if (!res || !res.ok) return local;

    const json = await res.json().catch(() => null);
    if (!json || !json.success) return local;

    let serverProgress = {};
    try {
      serverProgress = json.progress ? JSON.parse(json.progress) : {};
    } catch {
      serverProgress = {};
    }

    const merged = { ...local, ...serverProgress };

    SUBJECTS.forEach((s) => {
      if (!merged[s]) merged[s] = { pdfOpened: 0, aiMentions: 0 };
    });

    await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(merged));
    return merged;
  } catch (e) {
    console.warn("getProgressData ERROR", e);
    return initializeProgress();
  }
}

export async function getWeeklyData() {
  try {
    const auth = await getAuth();

    if (auth.email && auth.token) {
      let res = await fetch(`${API_URL}/get`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + auth.token,
        },
        body: JSON.stringify({ email: auth.email }),
      }).catch(() => null);

      if (res && res.ok) {
        const json = await res.json().catch(() => null);
        if (json && json.weekly) return JSON.parse(json.weekly);
      }
    }

    const raw = await AsyncStorage.getItem(WEEK_KEY);
    return raw ? JSON.parse(raw) : {};
  } catch (e) {
    console.warn("getWeeklyData ERROR", e);
    return {};
  }
}

async function updateWeekly(type) {
  try {
    const today = new Date().toISOString().slice(0, 10);
    const raw = await AsyncStorage.getItem(WEEK_KEY);
    const week = raw ? JSON.parse(raw) : {};

    if (!week[today]) week[today] = { pdf: 0, ai: 0 };
    if (type === "pdf") week[today].pdf++;
    if (type === "ai") week[today].ai++;

    await AsyncStorage.setItem(WEEK_KEY, JSON.stringify(week));
  } catch (e) {
    console.warn("updateWeekly error", e);
  }
}

export async function getHistory() {
  try {
    const auth = await getAuth();

    if (auth.email && auth.token) {
      let res = await fetch(`${API_URL}/get`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + auth.token,
        },
        body: JSON.stringify({ email: auth.email }),
      }).catch(() => null);

      if (res && res.ok) {
        const json = await res.json().catch(() => null);
        if (json && json.history) return JSON.parse(json.history);
      }
    }

    const raw = await AsyncStorage.getItem(HISTORY_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch (e) {
    console.warn("getHistory ERROR", e);
    return [];
  }
}

async function addHistoryEntry(subject, type) {
  try {
    const raw = await AsyncStorage.getItem(HISTORY_KEY);
    const history = raw ? JSON.parse(raw) : [];

    history.unshift({
      subject,
      type,
      timestamp: new Date().toISOString(),
    });

    await AsyncStorage.setItem(HISTORY_KEY, JSON.stringify(history.slice(0, 300)));
  } catch (e) {
    console.warn("addHistoryEntry error", e);
  }
}

export async function getStreak() {
  const raw = await AsyncStorage.getItem(STREAK_KEY);
  return raw ? JSON.parse(raw) : { lastDate: null, count: 0 };
}

async function updateStreak() {
  const today = new Date().toISOString().slice(0, 10);
  const raw = await AsyncStorage.getItem(STREAK_KEY);
  const streak = raw ? JSON.parse(raw) : { lastDate: null, count: 0 };

  if (streak.lastDate === today) return;

  const yesterday = new Date(Date.now() - 86400000).toISOString().slice(0, 10);
  streak.count = streak.lastDate === yesterday ? streak.count + 1 : 1;
  streak.lastDate = today;

  await AsyncStorage.setItem(STREAK_KEY, JSON.stringify(streak));
}

async function syncToBackend() {
  const auth = await getAuth();
  
  if (!auth.email || !auth.token) return;

  const progress = await AsyncStorage.getItem(STORAGE_KEY);
  const weekly = await AsyncStorage.getItem(WEEK_KEY);
  const history = await AsyncStorage.getItem(HISTORY_KEY);

  try {
    await fetch(`${API_URL}/save`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + auth.token,
      },
      body: JSON.stringify({
        email: auth.email,
        progress,
        history,
        weekly,
      }),
    });
  } catch (e) {
    console.warn("syncToBackend ERROR", e);
  }
}

export async function updateProgress(subjectRaw, type) {
  try {
    if (!subjectRaw) return;

    const subject = SUBJECTS.find(
      (s) => s.toLowerCase() === subjectRaw.toLowerCase()
    ) || subjectRaw;

    let data = await getProgressData();
    if (!data[subject]) data[subject] = { pdfOpened: 0, aiMentions: 0 };

    if (type === "pdf") data[subject].pdfOpened++;
    if (type === "ai") data[subject].aiMentions++;

    await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(data));

    await updateWeekly(type);
    await addHistoryEntry(subject, type);
    await updateStreak();
    await syncToBackend();
  } catch (e) {
    console.warn("updateProgress ERROR", e);
  }
}

export async function resetProgress() {
  const auth = await getAuth();

  await AsyncStorage.multiRemove([STORAGE_KEY, WEEK_KEY, HISTORY_KEY, STREAK_KEY]);
  await initializeProgress();

  if (auth.email && auth.token) {
    try {
      await fetch(`${API_URL}/reset`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + auth.token,
        },
        body: JSON.stringify({ email: auth.email }),
      });
    } catch {}
  }
}
