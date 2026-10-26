# Security and privacy

This public repository contains application source code only.

## Never commit

- OpenAI API keys or encrypted key material
- Cloud provider credentials or deployment tokens
- Production project IDs and private bucket names
- User identifiers, research history, prompts, notes, reports, or exports
- Logs copied from a production environment

## Runtime boundaries

- API keys are read only from server-side environment bindings.
- Research records are namespaced by the authenticated user ID.
- Cross-site research requests are rejected.
- The browser never receives the API key.
- The included test suite uses mock model and search responses.

If you discover a security issue, do not open a public issue containing secrets or user data.
