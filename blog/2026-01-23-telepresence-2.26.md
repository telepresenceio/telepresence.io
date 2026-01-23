---
title: Telepresence 2.26
description: What's new in Telepresence 2.26.
slug: telepresence-2.26
authors: thallgren
---

# Telepresence 2.26.0: Better Admin Controls, Safer Intercepts, and a More Resilient Core

We’re excited to announce **Telepresence 2.26.0**, a release focused on **stronger cluster administration controls**, **improved intercept management in shared environments**, and **significant reliability and performance improvements** across the Traffic Manager and Traffic Agent.

This release continues our work to make Telepresence easier to operate at scale—especially in teams where many developers share the same cluster—while also improving the day-to-day developer experience.

<!-- truncate -->

---

## 🔐 Stronger Admin Control Over Intercepts

### Revoke intercepts as a cluster administrator

Telepresence now introduces the ability for **cluster administrators to revoke intercepts owned by other users**.

Administrators with permission to update the Traffic Manager ConfigMap can now issue CLI commands that the Traffic Manager executes directly. This lays the groundwork for clearer separation between **administrators and regular users** using Kubernetes RBAC.

The first command built on this mechanism is:

```bash
telepresence revoke <intercept-id>
```

This is especially useful when:

* A developer leaves an intercept active unintentionally
* A client becomes unreachable
* A shared service is blocked during active development

📚 Docs: *[Engagements and intercept conflicts](/docs/reference/engagements/conflicts)*

---

### Automatically override intercepts from inactive clients

We’ve added a new Helm chart setting:

```yaml
intercept:
  inactiveBlockTimeout: 10m
```

This controls how long an intercept owned by an **inactive or unreachable client** can continue blocking other intercepts. Once the timeout is exceeded:

* Conflicting intercepts are no longer blocked
* The inactive intercept may be automatically removed

This makes Telepresence more forgiving in real-world scenarios where laptops sleep, networks change, or clients crash.

---

## 🤝 Safer Intercepts in Shared Clusters

### Disable global intercepts (when you need to)

A new Helm chart option gives platform teams more control over how intercepts are used:

```yaml
intercept:
  allowGlobalIntercepts: false
```

When disabled:

* Global TCP/UDP intercepts are blocked
* Only HTTP intercepts with header and/or path filters are allowed

This prevents a single developer from accidentally blocking an entire service port for everyone else—while still allowing filtered HTTP workflows.

The default remains `true` for backward compatibility, and Telepresence now provides **clear, actionable error messages** guiding users toward HTTP-filtered intercepts when global intercepts are disallowed.

📚 Docs: *[Restricting global intercepts](/docs/reference/cluster-config#restricting-global-intercepts)*

---

## 🚀 Improved Reliability and Performance

### More reliable Traffic Manager startup

The Traffic Manager deployment now includes a `startupProbe` that ensures it only reports readiness **after full initialization**.

Benefits include:

* Preventing premature traffic routing
* Smoother installs, upgrades, and rollouts
* Better behavior in large or complex clusters

---

### More efficient map updates at scale

We’ve significantly improved the efficiency of how the Traffic Manager updates the connected workstations and traffic-agents by introducing **delta-based client/server synchronization**.

Where supported:

* gRPC now sends **incremental changes** instead of full snapshots
* Payload sizes are dramatically reduced
* Large clusters see meaningful performance gains

Full snapshots are still available as a backward-compatible fallback.

---


## 🔄 Local Daemon Improvements

### Support for `sudo-rs`

Telepresence now supports running the root daemon with **`sudo-rs`**, which is now the default `sudo` implementation on Ubuntu.

---

### ⚙️ More Configuration Flexibility

This release adds several long-requested configuration improvements that lay the groundwork for future improvements to run the Telepresence daemon as a system service:

* **Custom daemon config files** via `--config`

    * Renamed `telepresence genyaml --config` → `--agent` for clarity
* **Custom daemon log file paths** via `--logfile`

    * New log levels for `cli` and `kubeAuthDaemon`
* **Optional traffic-agent consumption metrics**

    * Log output can be sent to stdout/stderr instead of a file.
---

### Support for `sudo-rs`

Telepresence now supports running the root daemon with **`sudo-rs`**, which is now the default `sudo` implementation on Ubuntu.

---

### TCP/IP replaces Unix sockets

All local Telepresence components now communicate using **TCP/IP instead of Unix sockets**. This:

* Eliminates issues caused by lingering sockets
* Improves Windows compatibility
* Reduces hard-to-debug local connection errors

---

### Clearer daemon names

We’ve renamed the local daemons to be more intuitive:

| Old Name             | New Name    |
| -------------------- | ----------- |
| connector-foreground | `userd`     |
| daemon-foreground    | `rootd`     |
| kubeauth-foreground  | `kubeauthd` |

Hidden CLI commands have been updated accordingly.

---

## 🐛 Bug Fixes and Stability Improvements

Telepresence 2.26.0 also includes several important fixes:

* Backoff-based retry logic for tunnel connections (TCP and UDP)
* Improved retry handling for client tunnel creation
* and much more!

---

## 🚢 Get Started with Telepresence 2.26.0

Telepresence 2.26.0 is a big step forward for teams running Telepresence in shared or production-like development clusters. With better admin controls, safer intercept behavior, and a more resilient core, it’s easier than ever to scale local-to-cluster development.

👉 Upgrade today and let us know what you think!

If you want, I can:

* Shorten this for a **release announcement email**
* Rewrite it for a **GitHub release post**
* Add **quotes**, **CTAs**, or a more **marketing-heavy tone**
