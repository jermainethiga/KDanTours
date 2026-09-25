# Development setup

This project uses Node.js for the React/Vite application and a local Python virtual environment named `code-env` for Python tooling.

## Node.js

Node.js LTS and npm are installed with the project. From the project directory:

```powershell
npm.cmd ci
npm.cmd run dev
```

The production build can be checked with:

```powershell
npm.cmd run build
```

## Python

The virtual environment is stored in `.venv` and is intentionally ignored by Git. Activate it in PowerShell with:

```powershell
.\.venv\Scripts\Activate.ps1
```

When activated, the prompt will identify the environment as `code-env`. The current project does not contain Python code or a Python dependency manifest, so no application-specific Python packages are installed yet.

To leave the environment:

```powershell
deactivate
```