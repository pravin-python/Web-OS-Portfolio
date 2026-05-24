import { describe, it, expect } from 'vitest';
import { analyzeAuthLog } from '../services/securityService';

describe('analyzeAuthLog', () => {
  it('should handle empty or whitespace-only logs', () => {
    const log = `

    `;
    const result = analyzeAuthLog(log);
    expect(result).toEqual({
      totalEntries: 0,
      failedAttempts: 0,
      successfulLogins: 0,
      flaggedIPs: [],
      alerts: [],
    });
  });

  it('should count successful logins', () => {
    const log = `
      Accepted password for root from 192.168.1.100 port 22 ssh2
      Accepted publickey for admin from 10.0.0.5 port 2222 ssh2
    `;
    const result = analyzeAuthLog(log);
    expect(result.successfulLogins).toBe(2);
    expect(result.failedAttempts).toBe(0);
    expect(result.totalEntries).toBe(2);
  });

  it('should count failed attempts without IPs', () => {
    const log = `
      Failed password for invalid user admin
      Invalid user test from unknown
    `;
    const result = analyzeAuthLog(log);
    expect(result.failedAttempts).toBe(2);
    expect(result.flaggedIPs).toEqual([]);
    expect(result.successfulLogins).toBe(0);
  });

  it('should track and flag IPs with multiple failed attempts (>= 3)', () => {
    const log = `
      Failed password for invalid user admin from 10.0.0.1 port 22 ssh2
      Failed password for root from 10.0.0.1 port 22 ssh2
      Failed password for test from 10.0.0.1 port 22 ssh2
    `;
    const result = analyzeAuthLog(log);
    expect(result.failedAttempts).toBe(3);
    expect(result.flaggedIPs).toHaveLength(1);
    expect(result.flaggedIPs[0]).toEqual({
      ip: '10.0.0.1',
      attempts: 3,
      reason: 'Multiple failed attempts',
    });
    expect(result.alerts).toContain('🚨 1 IP(s) flagged for suspicious activity');
    expect(result.alerts).toContain('  IP 10.0.0.1: 3 failed attempts — Multiple failed attempts');
  });

  it('should flag brute-force attacks and overall thresholds (>= 5)', () => {
    const log = `
      Failed password for root from 192.168.1.50 port 22 ssh2
      Failed password for root from 192.168.1.50 port 22 ssh2
      Failed password for root from 192.168.1.50 port 22 ssh2
      Failed password for root from 192.168.1.50 port 22 ssh2
      Failed password for root from 192.168.1.50 port 22 ssh2
      Failed password for test from 192.168.1.51 port 22 ssh2
    `;
    const result = analyzeAuthLog(log);
    expect(result.failedAttempts).toBe(6);
    expect(result.flaggedIPs).toHaveLength(1);
    expect(result.flaggedIPs[0]).toEqual({
      ip: '192.168.1.50',
      attempts: 5,
      reason: 'Brute-force attack detected',
    });
    expect(result.alerts).toContain('⚠ 6 failed login attempts detected');
    expect(result.alerts).toContain('🚨 1 IP(s) flagged for suspicious activity');
    expect(result.alerts).toContain('  IP 192.168.1.50: 5 failed attempts — Brute-force attack detected');
  });
});
