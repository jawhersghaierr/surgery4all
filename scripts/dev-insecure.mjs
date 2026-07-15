// DEV-ONLY launcher: disables Node TLS certificate verification, then starts
// `next dev`. Needed on machines behind a MITM corporate proxy (e.g. viamedis)
// whose root CA is not in Node's trust store, which otherwise breaks outbound
// HTTPS (Cloudinary upload, etc.) with "unable to get local issuer certificate".
//
// WARNING: NODE_TLS_REJECT_UNAUTHORIZED=0 turns off ALL TLS verification for
// this process. Use only for local development. NEVER in production — prefer
// NODE_EXTRA_CA_CERTS pointing at the corporate CA bundle.
import { spawn } from 'node:child_process'

const env = { ...process.env, NODE_TLS_REJECT_UNAUTHORIZED: '0' }

console.warn('\x1b[33m[dev:insecure] TLS verification DISABLED for this process — dev only.\x1b[0m')

const child = spawn('next', ['dev'], { stdio: 'inherit', shell: true, env })
child.on('exit', (code) => process.exit(code ?? 0))
