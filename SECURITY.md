# Security Policy

## Supported Versions

| Version | Supported |
|---------|-----------|
| main (latest) | ✅ |

## Reporting a Vulnerability

Please report security vulnerabilities privately to **contact@coderooz.in** rather than opening a public issue.

Include in your report:

- The affected endpoint, component, or file
- A description of the vulnerability and its impact
- Steps to reproduce (if known)
- Any suggested remediation

You will receive an acknowledgment within 48 hours and a status update on the fix timeline.

## Security Notes

- Cloudinary credentials (`CLOUDINARY_CLOUD_NAME`, `CLOUDINARY_API_KEY`, `CLOUDINARY_API_SECRET`) are read from environment variables only — never commit them to the repository.
- The `uaif.json` config references credentials via environment variables (`${CLOUDINARY_*}`); replace with real values locally.
- API routes under `/api/private/` are intended to be protected by authentication (NextAuth.js). Ensure auth middleware is enabled before deploying publicly.
- Keep dependencies updated via Dependabot (weekly, minor/patch).