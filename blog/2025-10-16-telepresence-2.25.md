---
title: Telepresence 2.25
description: What's new in Telepresence 2.25.
slug: telepresence-2.25
authors:
  - thallgren
  - njayp
---

## Unlocking Precision Debugging

In the fast-paced world of Kubernetes development, efficiency and collaboration are key. That's why we're thrilled about the latest enhancements in Telepresence 2.25.0, particularly the introduction of HTTP-filtered intercepts. This powerful feature allows developers to intercept specific HTTP traffic based on headers and paths, enabling targeted debugging without hijacking an entire service. Even better, it now seamlessly integrates with TLS and mTLS-encrypted applications, making it easier to work with secure environments. In this post, we'll dive into how these features work, why they're game-changers, and how you can get started.

<!-- truncate -->

## The Power of HTTP-Filtered Intercepts

Gone are the days of intercepting *all* traffic to a service, which could disrupt team workflows or overload your local setup. With HTTP-filtered intercepts, Telepresence lets you fine-tune exactly which requests get routed to your local machine. This is achieved through the Traffic Agent, which is injected into your workload's pods. The original containers keep running in the cluster, handling non-matching traffic and background tasks, while only the filtered requests come your way.

### Key New Flags for Granular Control

Telepresence 2.25.0 introduces several new flags to the `telepresence intercept` command (and `wiretap` for observation-only mode):

- **`--http-header`**: Filter based on specific HTTP headers in the format `'header-name=value'`. For example, `'x-user=alice'` ensures only requests with that header are intercepted. You can specify multiple headers by repeating the flag.

- **`--http-path-prefix`**: Match requests starting with a given path prefix, like `/api`. Repeat for multiple prefixes.

- **`--http-path-equal`**: For exact path matches, such as `--http-path-equal /users/profile`, perfect for pinpointing a single endpoint.

- **`--http-path-regex`**: Use regular expressions for complex patterns, e.g., `--http-path-regex '^/api/v[1-2]/.*'`, to capture versioned APIs.

These flags can be combined for even more precision. If no filters are set, Telepresence falls back to intercepting all traffic on the specified port—maintaining backward compatibility with TCP intercepts.

### Routing Precedence and Conflict Detection

When multiple developers are working on the same service, conflicts could arise—but Telepresence has you covered with a smart routing model:

- **Header-based intercepts** take priority over path-only ones. Requests are checked against headers first, then paths.
- This allows scenarios like one developer using a personal header (e.g., `x-user=alice`) for their intercepts, while another uses a path-based filter (e.g., `/admin/*`) without stepping on each other's toes.

Conflict detection kicks in only when filters would route the *same* traffic to different destinations:
- Different header values (e.g., `X-User=adam` vs. `X-User=bertil`) don't conflict.
- Same headers but different paths (e.g., `X-User=adam + /api/*` vs. `X-User=adam + /admin/*`) are fine.
- Path-only intercepts sit at a lower priority tier.
- If a true overlap is detected, Telepresence prevents the intercept and alerts you via the CLI.

### Real-World Example

Imagine you're debugging an API service. Run this command to intercept only requests for your user on the `/api` path:

```
telepresence intercept example-app --http-header 'x-user=alice' --http-path-prefix '/api' --port 8080:http
```

Output might look like:

```
Using Deployment example-app
intercepted
  Intercept name: example-app
  State         : ACTIVE
  Workload kind : Deployment
  Destination   : 127.0.0.1:8080
  Intercepting  : HTTP requests with path-prefix /api and header 'X-User: alice'
```

Now, only matching traffic hits your local app, while the cluster handles everything else. End it with `telepresence leave example-app` when done.

This feature shines in collaborative environments, letting multiple devs work simultaneously on the same service by carving out their own traffic slices.

## AI-Powered Development: MCP Integration

Telepresence 2.25 also brings an exciting new capability: integration with the Model Context Protocol (MCP). Through the [ophis](https://github.com/njayp/ophis) library, the Telepresence CLI is now available as an MCP server, enabling AI assistants to directly interact with your Kubernetes development workflow.

### Available Commands

The MCP server exposes these Telepresence commands:

- `telepresence connect`
- `telepresence status`
- `telepresence list`
- `telepresence intercept`
- `telepresence leave`
- `telepresence wiretap`
- `telepresence replace`
- `telepresence ingest`
- `telepresence quit`

For security, the MCP server runs without root permissions and cannot start the root daemon.

### Getting Started

Enable Telepresence as an MCP server in Claude Desktop or VSCode:

```bash
# Claude Desktop
telepresence mcp claude enable

# VSCode (requires Copilot in Agent Mode)
telepresence mcp vscode enable
```

Once enabled, you can interact with Telepresence through your AI assistant. For example, ask Claude to "intercept my-service on port 8080" or "check the status of my intercepts," and it will execute the appropriate Telepresence commands for you.

## Extending to Secure Environments: TLS/mTLS Support

Security is non-negotiable in modern apps, but debugging encrypted traffic has historically been a pain. Telepresence 2.25.0 changes that by adding full support for HTTP-filtered intercepts on TLS/mTLS-encrypted applications. By decrypting traffic, inspecting headers/paths, and re-encrypting as needed, you can apply the same fine-grained filters to secure services.

### How It Works

To handle encryption, Telepresence needs access to your app's TLS certificates. You provide this via Kubernetes annotations on your workload:

- **Downstream Decryption**: For incoming traffic.
    - **`telepresence.io/downstream-cert-path.<port>`**: Path to a mounted certificate (e.g., `/etc/certs` for port 8443: `telepresence.io/downstream-cert-path.8443: /etc/certs`).
    - **`telepresence.io/downstream-cert-secret.<port>`**: Reference a Kubernetes secret in the same namespace (e.g., `telepresence.io/downstream-cert-secret.8443: secret-name`). The Traffic Agent auto-mounts it.

- **Upstream Re-Encryption (for mTLS)**: For traffic to the app.
    - Use the `telepresence.io/upstream-cert-` prefix, like `telepresence.io/upstream-cert-path.<port>` or `telepresence.io/upstream-cert-secret.<port>`.

- **Self-Signed Certificates**: Common in dev setups—bypass verification with `telepresence.io/upstream-insecure-skip-verify.<port>: enabled`.

- **`--plaintext` Option**: Disable encryption for traffic to your local client during intercepts (e.g., `telepresence intercept my-service --port 8080:8443 --plaintext`).

Telepresence auto-detects protocols (HTTP/1.x, HTTP/2, TLS) via the service's `appProtocol`, port name/number, or probing.

### Setup Example

Add this to your Deployment's template for downstream TLS via a secret:

```
template:
  metadata:
    annotations:
      telepresence.io/downstream-cert-secret.8443: tls-secret
```

For upstream mTLS with skip-verify:

```
telepresence.io/upstream-cert-secret.8443: client-secret
telepresence.io/upstream-insecure-skip-verify.8443: enabled
```

Then intercept as usual. This decrypts traffic for filtering, applies your HTTP rules, and re-encrypts upstream— all transparently.

## Why This Matters: Seamless Integration for Real-World Workflows

Combining HTTP-filtered intercepts with TLS/mTLS support means you can debug secure, production-like environments locally without compromises. Whether you're testing APIs behind mTLS or collaborating on encrypted microservices, these features reduce friction and boost productivity. It's fully backward-compatible, so your existing setups keep working.

For more details, check out our docs on [intercepting applications](https://telepresence.io/docs/howtos/engage#intercept-your-application) and [TLS/mTLS handling](https://telepresence.io/docs/howtos/mtls).

Ready to try it? Upgrade to Telepresence 2.25.0 today and intercept smarter. We'd love to hear your feedback—drop us a line or join the community discussions!

*This is a draft blog post based on Telepresence 2.25.0 release notes and documentation.*