import { describe, it, expect } from "vitest";
import { executeCommand } from "../services/terminal";

describe("executeCommand", () => {
  it("should handle empty commands", () => {
    const result = executeCommand("   ", "/");
    expect(result).toEqual({ output: "" });
  });

  it("should handle basic commands", () => {
    let result = executeCommand("echo Hello World", "/");
    expect(result).toEqual({ output: "Hello World" });

    result = executeCommand("whoami", "/");
    expect(result.output).toBe("pravin-prajapati");

    result = executeCommand("pwd", "/home/user");
    expect(result.output).toBe("/home/user");
  });

  it("should return permission denied for blocked commands", () => {
    const blockedCommands = ["sudo", "nano", "vim", "upload", "su"];
    blockedCommands.forEach((cmd) => {
      const result = executeCommand(`${cmd} args`, "/");
      expect(result.output).toContain(
        `Permission denied: '${cmd}' is not available`,
      );
    });
  });

  it("should return help text", () => {
    const result = executeCommand("help", "/");
    expect(result.output).toContain("Research Station — Command Help");
  });

  it("should handle filesystem read commands", () => {
    let result = executeCommand("ls", "/");
    expect(typeof result.output).toBe("string");

    result = executeCommand("cd unknown_folder", "/");
    expect(result.output).toContain("cd: no such directory: unknown_folder");

    result = executeCommand("cat non_existent_file.txt", "/");
    expect(result.output).toContain("No such file");
  });

  it("should handle filesystem write commands", () => {
    let result = executeCommand("mkdir testdir", "/");
    expect(typeof result.output).toBe("string");

    result = executeCommand("touch newfile.txt", "/");
    expect(typeof result.output).toBe("string");

    result = executeCommand("write newfile.txt content", "/");
    expect(typeof result.output).toBe("string");

    result = executeCommand("rm newfile.txt", "/");
    expect(typeof result.output).toBe("string");

    result = executeCommand("cp file1 file2", "/");
    expect(typeof result.output).toBe("string");

    result = executeCommand("mv file1 file2", "/");
    expect(typeof result.output).toBe("string");
  });

  it("should handle utility commands", () => {
    let result = executeCommand("clear", "/");
    expect(result.output).toBe("__CLEAR__");

    result = executeCommand("date", "/");
    expect(typeof result.output).toBe("string");
    expect(result.output.length).toBeGreaterThan(0);

    result = executeCommand("uname", "/");
    expect(result.output).toContain("ResearchOS 2.0.0");

    result = executeCommand("neofetch", "/");
    expect(result.output).toContain("OS: ResearchOS 2.0.0");
  });

  it("should handle AI commands", () => {
    let result = executeCommand("model info", "/");
    expect(result.output).toContain("MODEL: InvoiceExtractor-v3");

    result = executeCommand("train model", "/");
    expect(result.output).toContain("Loading dataset...");
    expect(result.output).toContain("Training complete!");

    result = executeCommand("predict sample", "/");
    expect(result.output).toContain("Running inference...");

    result = executeCommand("scan invoice", "/");
    expect(result.output).toContain("INVOICE EXTRACTION RESULT");

    result = executeCommand("analyze dataset", "/");
    expect(result.output).toContain("Dataset: invoices_dataset.csv");
  });

  it("should handle unknown commands", () => {
    const result = executeCommand("unknowncmd123", "/");
    expect(result.output).toContain("Command not found: unknowncmd123");
  });
});
