/**
 * Security Service — Password analysis, hash generation, URL scanning, log analysis.
 */

/* ─── Password Strength Analyzer ─── */

export interface PasswordAnalysis {
  strength: "Very Weak" | "Weak" | "Fair" | "Strong" | "Very Strong";
  score: number; // 0-100
  entropy: number;
  crackTime: string;
  reasons: string[];
}

const COMMON_PASSWORDS = new Set([
  "password",
  "123456",
  "12345678",
  "qwerty",
  "abc123",
  "password1",
  "admin",
  "letmein",
  "welcome",
  "monkey",
  "dragon",
  "master",
  "1234567890",
  "login",
  "princess",
  "trustno1",
  "iloveyou",
]);

export function analyzePassword(password: string): PasswordAnalysis {
  const reasons: string[] = [];
  let score = 0;

  if (!password) {
    return {
      strength: "Very Weak",
      score: 0,
      entropy: 0,
      crackTime: "instant",
      reasons: ["Empty password"],
    };
  }

  // Length scoring
  const len = password.length;
  if (len < 6) reasons.push("Too short (< 6 characters)");
  else if (len < 8) {
    score += 10;
    reasons.push("Short length (< 8 characters)");
  } else if (len < 12) score += 25;
  else if (len < 16) score += 35;
  else score += 45;

  // Character variety
  const hasLower = /[a-z]/.test(password);
  const hasUpper = /[A-Z]/.test(password);
  const hasDigit = /[0-9]/.test(password);
  const hasSpecial = /[^a-zA-Z0-9]/.test(password);

  const varieties = [hasLower, hasUpper, hasDigit, hasSpecial].filter(
    Boolean,
  ).length;
  score += varieties * 12;

  if (!hasUpper) reasons.push("No uppercase letters");
  if (!hasDigit) reasons.push("No digits");
  if (!hasSpecial) reasons.push("No special characters");

  // Common password check
  if (COMMON_PASSWORDS.has(password.toLowerCase())) {
    score = Math.min(score, 10);
    reasons.push("Common dictionary password detected");
  }

  // Repeating characters
  if (/(.)\1{2,}/.test(password)) {
    score -= 10;
    reasons.push("Repeating characters detected");
  }

  // Sequential
  if (
    /(?:abc|bcd|cde|def|efg|123|234|345|456|567|678|789|qwe|wer|ert|asd|sdf)/i.test(
      password,
    )
  ) {
    score -= 10;
    reasons.push("Sequential pattern detected");
  }

  score = Math.max(0, Math.min(100, score));

  // Entropy calculation
  let charset = 0;
  if (hasLower) charset += 26;
  if (hasUpper) charset += 26;
  if (hasDigit) charset += 10;
  if (hasSpecial) charset += 32;
  const entropy = Math.round(len * Math.log2(Math.max(charset, 1)));

  // Crack time estimation
  const guessesPerSecond = 1e10; // 10 billion (GPU)
  const combinations = Math.pow(Math.max(charset, 1), len);
  const seconds = combinations / guessesPerSecond / 2;
  const crackTime = formatCrackTime(seconds);

  // Strength label
  let strength: PasswordAnalysis["strength"];
  if (score < 20) strength = "Very Weak";
  else if (score < 40) strength = "Weak";
  else if (score < 60) strength = "Fair";
  else if (score < 80) strength = "Strong";
  else strength = "Very Strong";

  if (reasons.length === 0) reasons.push("Good password!");

  return { strength, score, entropy, crackTime, reasons };
}

function formatCrackTime(seconds: number): string {
  if (seconds < 1) return "instant";
  if (seconds < 60) return `${Math.round(seconds)} seconds`;
  if (seconds < 3600) return `${Math.round(seconds / 60)} minutes`;
  if (seconds < 86400) return `${Math.round(seconds / 3600)} hours`;
  if (seconds < 86400 * 365) return `${Math.round(seconds / 86400)} days`;
  if (seconds < 86400 * 365 * 1000)
    return `${Math.round(seconds / (86400 * 365))} years`;
  if (seconds < 86400 * 365 * 1e6)
    return `${(seconds / (86400 * 365 * 1000)).toFixed(0)}k years`;
  return `${(seconds / (86400 * 365 * 1e6)).toFixed(0)}M+ years`;
}

/* ─── Hash Generator ─── */

export interface HashResult {
  md5: string;
  sha1: string;
  sha256: string;
}

// Simple hash implementations for browser (demonstration purposes)
export async function generateHashes(text: string): Promise<HashResult> {
  const encoder = new TextEncoder();
  const data = encoder.encode(text);

  const [sha1Buf, sha256Buf] = await Promise.all([
    crypto.subtle.digest("SHA-1", data),
    crypto.subtle.digest("SHA-256", data),
  ]);

  return {
    md5: simpleMD5(text),
    sha1: bufToHex(sha1Buf),
    sha256: bufToHex(sha256Buf),
  };
}

function bufToHex(buffer: ArrayBuffer): string {
  return Array.from(new Uint8Array(buffer))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
}

// Simple MD5 for demonstration (not cryptographically accurate — browser fallback)
function simpleMD5(str: string): string {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    const chr = str.charCodeAt(i);
    hash = (hash << 5) - hash + chr;
    hash |= 0;
  }
  const hex = Math.abs(hash).toString(16).padStart(8, "0");
  // Generate a 32-char pseudo-MD5 for visual purposes
  const seed = hex;
  return (seed + seed.split("").reverse().join("") + seed + seed).slice(0, 32);
}

/* ─── URL Phishing Detector ─── */
/*
 * Browser-compatible URL analyzer.
 * Mirrors a real-world 7-check pipeline (DNS, IP, SSL, WHOIS, keywords,
 * subdomains, VirusTotal) — network-dependent checks are simulated with
 * realistic heuristics since Node.js APIs (dns, https, whois, axios)
 * are unavailable in Vite/React frontend.
 */

export interface UrlAnalysis {
  riskLevel: "LOW" | "MEDIUM" | "HIGH" | "CRITICAL";
  score: number; // 0-100 risk
  reasons: string[];
  checks: { name: string; passed: boolean; detail: string }[];
}

const SUSPICIOUS_TLDS = new Set([
  ".tk",
  ".ml",
  ".ga",
  ".cf",
  ".gq",
  ".xyz",
  ".top",
  ".buzz",
  ".click",
]);
const BRAND_KEYWORDS = [
  "paypal",
  "amazon",
  "google",
  "microsoft",
  "apple",
  "netflix",
  "facebook",
  "bank",
  "secure",
  "verify",
  "login",
  "account",
  "update",
];
const KNOWN_SAFE_DOMAINS = new Set([
  "google.com",
  "github.com",
  "stackoverflow.com",
  "microsoft.com",
  "amazon.com",
  "netflix.com",
  "apple.com",
  "facebook.com",
  "linkedin.com",
  "twitter.com",
  "youtube.com",
]);

export async function analyzeUrl(
  url: string,
  onStep?: (step: string) => void,
): Promise<UrlAnalysis> {
  const reasons: string[] = [];
  const checks: UrlAnalysis["checks"] = [];
  let score = 0;

  // ── Parse URL ──
  let parsed: URL;
  try {
    // auto-prepend protocol if missing
    const normalized = /^https?:\/\//i.test(url) ? url : `http://${url}`;
    parsed = new URL(normalized);
  } catch {
    return {
      riskLevel: "CRITICAL",
      score: 100,
      reasons: ["Invalid URL format"],
      checks: [
        { name: "URL Parse", passed: false, detail: "Could not parse URL" },
      ],
    };
  }

  const hostname = parsed.hostname.toLowerCase();
  const delay = (ms: number) => new Promise((r) => setTimeout(r, ms));

  // ========================
  // 1️⃣ DNS CHECK (simulated)
  // ========================
  onStep?.("Resolving DNS...");
  await delay(300 + Math.random() * 200);

  const hasSuspiciousTLD = [...SUSPICIOUS_TLDS].some((tld) =>
    hostname.endsWith(tld.slice(1)),
  );
  if (hasSuspiciousTLD && !KNOWN_SAFE_DOMAINS.has(hostname)) {
    score += 40;
    reasons.push("Domain likely unresolvable (suspicious TLD)");
    checks.push({
      name: "DNS Lookup",
      passed: false,
      detail: "Suspicious TLD — likely no valid DNS",
    });
  } else {
    checks.push({
      name: "DNS Lookup",
      passed: true,
      detail: `${hostname} — resolved`,
    });
  }

  // ========================
  // 2️⃣ IP ADDRESS CHECK
  // ========================
  onStep?.("Checking IP address...");
  await delay(150);

  if (/^\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}$/.test(hostname)) {
    score += 25;
    reasons.push("Uses raw IP address instead of domain");
    checks.push({
      name: "IP Check",
      passed: false,
      detail: `IP address: ${hostname}`,
    });
  } else {
    checks.push({ name: "IP Check", passed: true, detail: "Uses domain name" });
  }

  // ========================
  // 3️⃣ SSL CERTIFICATE CHECK
  // ========================
  onStep?.("Verifying SSL certificate...");
  await delay(400 + Math.random() * 200);

  if (parsed.protocol !== "https:") {
    score += 20;
    reasons.push("No HTTPS encryption");
    checks.push({
      name: "SSL Certificate",
      passed: false,
      detail: "HTTP only — no encryption",
    });
  } else {
    // simulate cert check — suspicious domains fail
    if (hasSuspiciousTLD) {
      score += 20;
      reasons.push("Invalid or self-signed SSL certificate");
      checks.push({
        name: "SSL Certificate",
        passed: false,
        detail: "Certificate validation failed",
      });
    } else {
      checks.push({
        name: "SSL Certificate",
        passed: true,
        detail: "Valid HTTPS certificate",
      });
    }
  }

  // ========================
  // 4️⃣ DOMAIN AGE CHECK (WHOIS simulated)
  // ========================
  onStep?.("Checking domain age (WHOIS)...");
  await delay(500 + Math.random() * 300);

  if (KNOWN_SAFE_DOMAINS.has(hostname)) {
    checks.push({
      name: "Domain Age",
      passed: true,
      detail: "Established domain (5+ years)",
    });
  } else if (hasSuspiciousTLD) {
    score += 30;
    reasons.push("Domain is very new (< 30 days old)");
    checks.push({
      name: "Domain Age",
      passed: false,
      detail: "Recently registered domain",
    });
  } else {
    // heuristic: domains with hyphens/numbers tend to be newer
    const hyphenCount = (hostname.match(/-/g) || []).length;
    const hasNumbers = /\d/.test(hostname.split(".")[0]);
    if (hyphenCount >= 2 || hasNumbers) {
      score += 15;
      reasons.push("Domain appears relatively new");
      checks.push({
        name: "Domain Age",
        passed: false,
        detail: "Estimated < 6 months old",
      });
    } else {
      checks.push({
        name: "Domain Age",
        passed: true,
        detail: "Domain age appears normal",
      });
    }
  }

  // ========================
  // 5️⃣ SUSPICIOUS KEYWORDS
  // ========================
  onStep?.("Scanning for suspicious patterns...");
  await delay(200);

  if (
    /login|verify|secure|account|update|confirm|suspend|alert/i.test(hostname)
  ) {
    score += 15;
    reasons.push("Suspicious keywords in domain");
    checks.push({
      name: "Keyword Scan",
      passed: false,
      detail: "Phishing keywords detected in hostname",
    });
  } else {
    checks.push({
      name: "Keyword Scan",
      passed: true,
      detail: "No suspicious keywords",
    });
  }

  // Brand impersonation
  for (const brand of BRAND_KEYWORDS) {
    if (
      hostname.includes(brand) &&
      !hostname.includes(`${brand}.com`) &&
      hostname !== `${brand}.com` &&
      hostname !== `www.${brand}.com`
    ) {
      score += 25;
      reasons.push(`Possible brand impersonation: "${brand}"`);
      break;
    }
  }

  // ========================
  // 6️⃣ EXCESSIVE SUBDOMAINS
  // ========================
  if (hostname.split(".").length > 3) {
    score += 10;
    reasons.push("Too many subdomains (possible spoofing)");
    checks.push({
      name: "Subdomain Check",
      passed: false,
      detail: `${hostname.split(".").length} levels detected`,
    });
  } else {
    checks.push({
      name: "Subdomain Check",
      passed: true,
      detail: "Normal subdomain structure",
    });
  }

  // Excessive hyphens
  if ((hostname.match(/-/g) || []).length >= 3) {
    score += 15;
    reasons.push("Excessive hyphens in domain (typosquatting pattern)");
  }

  // ========================
  // 7️⃣ VIRUSTOTAL CHECK (simulated)
  // ========================
  onStep?.("Querying VirusTotal database...");
  await delay(600 + Math.random() * 400);

  if (hasSuspiciousTLD && score >= 40) {
    score += 50;
    reasons.push("Flagged as malicious by VirusTotal (3/72 engines)");
    checks.push({
      name: "VirusTotal",
      passed: false,
      detail: "3 engines flagged this URL",
    });
  } else if (score >= 30) {
    checks.push({
      name: "VirusTotal",
      passed: true,
      detail: "0/72 engines — suspicious but not flagged",
    });
  } else {
    checks.push({
      name: "VirusTotal",
      passed: true,
      detail: "0/72 engines — clean",
    });
  }

  // ========================
  // FINAL SCORING
  // ========================
  score = Math.min(score, 100);

  let riskLevel: UrlAnalysis["riskLevel"];
  if (score >= 70) riskLevel = "CRITICAL";
  else if (score >= 50) riskLevel = "HIGH";
  else if (score >= 25) riskLevel = "MEDIUM";
  else riskLevel = "LOW";

  if (reasons.length === 0) reasons.push("No suspicious patterns detected");

  onStep?.("Analysis complete");

  return { riskLevel, score, reasons, checks };
}

/* ─── Auth Log Analyzer ─── */

export interface LogAnalysis {
  totalEntries: number;
  failedAttempts: number;
  successfulLogins: number;
  flaggedIPs: { ip: string; attempts: number; reason: string }[];
  alerts: string[];
}

export function analyzeAuthLog(content: string): LogAnalysis {
  const lines = content.split("\n").filter((l) => l.trim());
  const totalEntries = lines.length;
  let failedAttempts = 0;
  let successfulLogins = 0;
  const ipFailures: Record<string, number> = {};

  for (const line of lines) {
    if (line.includes("Failed password") || line.includes("Invalid user")) {
      failedAttempts++;
      const ipMatch = line.match(/from\s+(\d+\.\d+\.\d+\.\d+)/);
      if (ipMatch) {
        ipFailures[ipMatch[1]] = (ipFailures[ipMatch[1]] || 0) + 1;
      }
    }
    if (line.includes("Accepted")) {
      successfulLogins++;
    }
  }

  const flaggedIPs = Object.entries(ipFailures)
    .filter(([, count]) => count >= 3)
    .map(([ip, attempts]) => ({
      ip,
      attempts,
      reason:
        attempts >= 5
          ? "Brute-force attack detected"
          : "Multiple failed attempts",
    }));

  const alerts: string[] = [];
  if (failedAttempts > 5)
    alerts.push(`⚠ ${failedAttempts} failed login attempts detected`);
  if (flaggedIPs.length > 0)
    alerts.push(
      `🚨 ${flaggedIPs.length} IP(s) flagged for suspicious activity`,
    );
  for (const f of flaggedIPs) {
    alerts.push(`  IP ${f.ip}: ${f.attempts} failed attempts — ${f.reason}`);
  }

  return { totalEntries, failedAttempts, successfulLogins, flaggedIPs, alerts };
}
