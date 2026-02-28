---
title: Telepresence 2.27
description: What's new in Telepresence 2.27.
slug: telepresence-2.27
authors: thallgren
---

# Telepresence 2.27.0: No More sudo

Telepresence 2.27.0 eliminates the need for elevated privileges during everyday use. The root daemon -- responsible for managing virtual network interfaces and DNS on your workstation -- now runs as a **system service** that starts automatically at boot. Once installed, `telepresence connect` just works, no `sudo`, no password prompts, no UAC dialogs.

<!-- truncate -->

---

## The Root Daemon as a System Service

Telepresence has always needed root-level access to create virtual network interfaces and configure DNS. Until now, that meant granting elevated privileges every time you connected to a cluster -- `sudo` on macOS and Linux, or an administrator terminal on Windows. This was a common source of friction, especially in corporate environments with strict security policies.

In 2.27, the root daemon runs as a **managed system service**:

- **macOS**: A launchd service (`io.telepresence.rootd`) that starts at boot
- **Linux**: A systemd service (`telepresence-rootd.service`) with security hardening
- **Windows**: A Windows service (`TelepresenceDaemon`) running as LocalSystem

The service handles all privileged operations in the background. When you run `telepresence connect`, the CLI communicates with the already-running service over a local TCP port -- no privilege escalation needed.

This also makes Telepresence more resilient. The daemon persists across terminal sessions, survives shell crashes, and restarts automatically if it stops unexpectedly.

---

## Native Installers for Every Platform

To make the system service setup seamless, Telepresence 2.27 introduces native platform installers that handle everything: placing binaries, registering the service, and configuring log rotation.

### macOS (.pkg)

Signed and notarized `.pkg` installers are available for both Intel and Apple Silicon. After installation, macOS requires you to approve the system extension:

1. Open **System Settings**
2. Go to **General > Login Items & Extensions**
3. Find **Tada AB** and enable it

The installer is signed by Tada AB, a Swedish company founded by the lead maintainer of the Telepresence open source project. This one-time approval is needed because the root daemon manages network interfaces and DNS, which macOS treats as a privileged operation.

Download for your architecture:
- [Intel (.pkg)](https://github.com/telepresenceio/telepresence/releases/latest/download/telepresence-darwin-amd64.pkg)
- [Apple Silicon (.pkg)](https://github.com/telepresenceio/telepresence/releases/latest/download/telepresence-darwin-arm64.pkg)

Homebrew and standalone binary downloads remain available as alternatives, though they do not install the system service.

### Linux (.deb / .rpm)

`.deb` and `.rpm` packages are available for amd64 and arm64. The systemd service is enabled and started automatically during installation, with security hardening applied out of the box.

```bash
# Debian/Ubuntu
sudo apt install ./telepresence-linux-amd64.deb

# Fedora/RHEL
sudo dnf install ./telepresence-linux-amd64.rpm
```

Service logs are available via `journalctl -u telepresence-rootd`.

### Windows (.exe)

A WiX-based setup installer is available for AMD64. It bundles WinFSP and SSHFS-Win for volume mount support, adds Telepresence to the system PATH, and registers the root daemon as a Windows service.

- [Download installer](https://github.com/telepresenceio/telepresence/releases/latest/download/telepresence-windows-amd64-setup.exe)

Manual installation via PowerShell remains available for ARM64 and other use cases.

---

## Automatic Cache Cleanup on Version Change

Upgrading across minor versions could previously leave stale cache files that caused subtle issues. Telepresence now tracks its version in the cache directory and automatically cleans up when it detects a major or minor version change. Running daemons are stopped and stale cache entries are cleared, while logs are preserved. Patch and pre-release version changes do not trigger cleanup.

---

## Bug Fix: Cluster DNS in Compose Containers

When using `telepresence compose up`, cluster hostnames were not resolving inside compose containers because the daemon DNS IP and search domain were not being injected into the generated compose spec. This is now fixed -- DNS and dns_search are correctly set for all engaged compose services.

---

## Get Started

Upgrade to Telepresence 2.27.0 and leave `sudo` behind. If you're coming from a manual binary install, the new packages handle daemon lifecycle for you automatically.

Check out the [install guide](/docs/install/client) for platform-specific instructions and the full [release notes](/docs/release-notes) for details.

We'd love your feedback -- open an issue on [GitHub](https://github.com/telepresenceio/telepresence/issues) or join the conversation in the community.
