const STORAGE_KEY = "course_student_session";

export type StudentSession = {
  id: string;
  email: string;
  fullName: string;
};

export function readStudentSession(): StudentSession | null {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as StudentSession;
    if (!parsed?.id || !parsed?.email) return null;
    return {
      id: parsed.id,
      email: parsed.email,
      fullName: parsed.fullName || "",
    };
  } catch {
    return null;
  }
}

export function writeStudentSession(session: StudentSession) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(session));
}

export function clearStudentSession() {
  localStorage.removeItem(STORAGE_KEY);
}

export function makeCertificateCode() {
  const part = () => Math.random().toString(36).slice(2, 6).toUpperCase();
  return `KN-${part()}-${part()}`;
}
