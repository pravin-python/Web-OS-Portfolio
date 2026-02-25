# Legal & Open Source Compliance Guide

This guide explains how to properly use the MIT License for your project.

## 1. What the MIT License Allows (and Doesn't)

The MIT License is a permissive free software license. It is short and to the point.

### ✅ What it Allows:
*   **Commercial Use:** People can use your code in commercial software.
*   **Modification:** People can change your code.
*   **Distribution:** People can share your code (original or modified).
*   **Private Use:** People can use your code privately without sharing changes.
*   **Sublicensing:** People can include your code in other projects with different licenses (even closed source).

### ❌ What it Does Not Allow:
*   **Liability:** You (the author) cannot be held liable for any damages caused by the software.
*   **Warranty:** You provide the software "as is" without any warranty.
*   **Attribution Removal:** Users **must** include the original copyright notice and license text in any copy of the software/source code.

---

## 2. Complete MIT License Template

This is the standard text you should use. I have already created a `LICENSE` file in the root directory with this content.

```text
MIT License

Copyright (c) 2026 [INSERT YOUR NAME]

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
```

**Action Required:** Open the `LICENSE` file and replace `[INSERT YOUR NAME]` with your actual name or organization name.

---

## 3. Where to Place the License File

The license file must be placed in the **root directory** of your project.

*   **File Name:** `LICENSE` (no extension, or `.txt` or `.md`) is the standard convention.
*   **Current Location:** `./LICENSE` (I have already created this for you).

This ensures that anyone cloning the repo sees the license immediately.

---

## 4. How to Add the License on GitHub

Since I have already added the file to your repository locally, you just need to push the changes. GitHub will automatically detect the license.

1.  **Edit the file locally:** Replace the placeholder name.
2.  **Commit and Push:**
    ```bash
    git add LICENSE
    git commit -m "docs: Add MIT License"
    git push origin main
    ```
3.  **Verify on GitHub:**
    *   Go to your repository page.
    *   Look at the "About" section on the right sidebar.
    *   You should see a "License" icon with "MIT License" displayed.

---

## 5. Important Legal Precautions

Before publishing, consider the following:

*   **Third-Party Code:** If you included code, assets, or libraries from other people directly in your source (not via package managers like npm), check *their* licenses. You may need to include their license text or attribution.
*   **Trademarks:** The MIT license does not grant trademark rights. It doesn't give people permission to use your logo or project name to endorse derivative products.
*   **"As Is":** The most important clause is the disclaimer. It protects you from being sued if your code deletes someone's database or causes financial loss. **Do not remove this section.**
